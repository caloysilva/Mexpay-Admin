import React, { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import { mdiChatProcessing, mdiImagePlus } from '@mdi/js';
import { ToastContainer, toast } from 'react-toastify';
import { Formik, Form, Field } from 'formik';

import CardBox from '../components/CardBox';
import LayoutAuthenticated from '../layouts/Authenticated';
import SectionMain from '../components/SectionMain';
import SectionTitleLineWithButton from '../components/SectionTitleLineWithButton';
import { getPageTitle } from '../config';
import FormField from '../components/FormField';
import BaseButton from '../components/BaseButton';
import BaseDivider from '../components/BaseDivider';

// Interface for chat messages
interface Message {
  role: 'user' | 'assistant';
  content: string;
  image?: string;
}

// Available GPT models
const GPT_MODELS = [
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini' },
  { id: 'gpt-4o', name: 'GPT-4o' },
  { id: 'gpt-o3', name: 'GPT-o3' },
];

// Image validation constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_IMAGE_DIMENSION = 2048; // Maximum width or height in pixels

const ChatGpt = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Function to scroll chat to the bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Function to validate image dimensions
  const validateImageDimensions = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(img.src);
        const isValid =
          img.width <= MAX_IMAGE_DIMENSION && img.height <= MAX_IMAGE_DIMENSION;
        if (!isValid) {
          toast.error(
            `Image dimensions should not exceed ${MAX_IMAGE_DIMENSION}x${MAX_IMAGE_DIMENSION} pixels`,
          );
        }
        resolve(isValid);
      };

      img.onerror = () => {
        URL.revokeObjectURL(img.src);
        toast.error('Failed to load image');
        resolve(false);
      };
    });
  };

  // Handle image selection
  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      toast.error('Only JPEG, PNG and WebP images are allowed');
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast.error(
        `Image size should be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
      );
      return;
    }

    // Validate image dimensions
    const isValidDimensions = await validateImageDimensions(file);
    if (!isValidDimensions) return;

    // If all validations pass, read and set the image
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Handle form submission and API call
  const handleSubmit = async (
    values: { apiKey: string; model: string; message: string },
    { setFieldValue }: { setFieldValue: (field: string, value: any) => void },
  ) => {
    if ((!values.message.trim() && !selectedImage) || !values.apiKey) return;

    // Add user message to chat
    const userMessage: Message = {
      role: 'user',
      content: values.message,
      image: selectedImage,
    };
    setMessages((prev) => [...prev, userMessage]);
    setSelectedImage(null);
    setIsLoading(true);

    try {
      // Prepare messages for API
      const apiMessages = [...messages, userMessage].map((msg) => {
        if (msg.image) {
          return {
            role: msg.role,
            content: [
              { type: 'text', text: msg.content || 'Describe this image' },
              {
                type: 'image_url',
                image_url: {
                  url: msg.image,
                },
              },
            ],
          };
        }
        return {
          role: msg.role,
          content: msg.content,
        };
      });

      // Make API call to OpenAI
      const response = await fetch(
        'https://api.openai.com/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${values.apiKey}`,
          },
          body: JSON.stringify({
            model: values.model,
            messages: apiMessages,
          }),
        },
      );

      // Process API response
      const data = await response.json();
      if (data.choices && data.choices[0]) {
        const assistantMessage: Message = {
          role: 'assistant',
          content: data.choices[0].message.content,
        };
        setMessages((prev) => [...prev, assistantMessage]);
        // Clear the message field after successful response
        setFieldValue('message', '');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(
        'An error occurred while sending the message. Please check your API key and try again.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>{getPageTitle('OpenAI Chat')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChatProcessing}
          title='OpenAI Chat'
          main
        >
          {''}
        </SectionTitleLineWithButton>

        <CardBox>
          <Formik
            initialValues={{
              apiKey: '',
              model: 'gpt-4o',
              message: '',
            }}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue }) => (
              <Form>
                {/* API Key and Model Selection Section */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <FormField label='OpenAI API Key' labelFor='apiKey'>
                    <Field
                      name='apiKey'
                      id='apiKey'
                      type='password'
                      placeholder='Enter your OpenAI API key'
                    />
                  </FormField>

                  <FormField label='GPT Model' labelFor='model'>
                    <Field name='model' id='model' as='select'>
                      {GPT_MODELS.map((model) => (
                        <option key={model.id} value={model.id}>
                          {model.name}
                        </option>
                      ))}
                    </Field>
                  </FormField>
                </div>

                <BaseDivider />

                {/* Chat Messages Section */}
                <div className='bg-white rounded-lg p-4 mb-4 h-[500px] overflow-y-auto'>
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`mb-4 ${
                        message.role === 'user' ? 'text-right' : 'text-left'
                      }`}
                    >
                      {message.image && (
                        <div className='mb-2'>
                          <img
                            src={message.image}
                            alt='Uploaded content'
                            className='max-w-xs rounded-lg inline-block'
                          />
                        </div>
                      )}
                      <div
                        className={`inline-block p-3 rounded-lg ${
                          message.role === 'user'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className='text-center text-gray-500'>
                      Sending message...
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input Form */}
                <div className='flex flex-col gap-2'>
                  {selectedImage && (
                    <div className='relative inline-block'>
                      <img
                        src={selectedImage}
                        alt='Selected'
                        className='max-h-32 rounded-lg'
                      />
                      <button
                        type='button'
                        onClick={() => setSelectedImage(null)}
                        className='absolute top-0 right-0 bg-red-500 text-white rounded-full p-1'
                      >
                        ×
                      </button>
                    </div>
                  )}
                  <div className='flex items-end gap-2'>
                    <div className='flex-1'>
                      <FormField label='Message' labelFor='message'>
                        <Field
                          name='message'
                          id='message'
                          as='textarea'
                          placeholder='Type your message...'
                          disabled={!values.apiKey || isLoading}
                          className='input w-full'
                          rows={4}
                          style={{ minHeight: '100px', resize: 'vertical' }}
                        />
                      </FormField>
                    </div>
                    <div className='flex gap-2 mb-4'>
                      <input
                        type='file'
                        ref={fileInputRef}
                        onChange={handleImageSelect}
                        accept={ALLOWED_FILE_TYPES.join(',')}
                        className='hidden'
                      />
                      <BaseButton
                        type='button'
                        color='info'
                        icon={mdiImagePlus}
                        onClick={() => fileInputRef.current?.click()}
                        disabled={!values.apiKey || isLoading}
                      />
                      <BaseButton
                        type='submit'
                        color='info'
                        label='Send'
                        disabled={
                          !values.apiKey ||
                          isLoading ||
                          (!values.message.trim() && !selectedImage)
                        }
                      />
                    </div>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </CardBox>
      </SectionMain>
      <ToastContainer />
    </>
  );
};

ChatGpt.getLayout = function getLayout(page: React.ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>;
};

export default ChatGpt;
