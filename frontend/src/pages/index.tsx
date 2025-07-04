import React, { useEffect, useState } from 'react';
import type { ReactElement } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import BaseButton from '../components/BaseButton';
import CardBox from '../components/CardBox';
import SectionFullScreen from '../components/SectionFullScreen';
import LayoutGuest from '../layouts/Guest';
import BaseDivider from '../components/BaseDivider';
import BaseButtons from '../components/BaseButtons';
import { getPageTitle } from '../config';
import { useAppSelector } from '../stores/hooks';
import CardBoxComponentTitle from '../components/CardBoxComponentTitle';
import { getPexelsImage, getPexelsVideo } from '../helpers/pexels';

export default function Starter() {
  const [illustrationImage, setIllustrationImage] = useState({
    src: undefined,
    photographer: undefined,
    photographer_url: undefined,
  });
  const [illustrationVideo, setIllustrationVideo] = useState({
    video_files: [],
  });
  const [contentType, setContentType] = useState('video');
  const [contentPosition, setContentPosition] = useState('right');
  const textColor = useAppSelector((state) => state.style.linkColor);

  const title = 'Mexpay Admin';

  // Fetch Pexels image/video
  useEffect(() => {
    async function fetchData() {
      const image = await getPexelsImage();
      const video = await getPexelsVideo();
      setIllustrationImage(image);
      setIllustrationVideo(video);
    }
    fetchData();
  }, []);

  const imageBlock = (image) => (
    <div
      className='hidden md:flex flex-col justify-end relative flex-grow-0 flex-shrink-0 w-1/3'
      style={{
        backgroundImage: `${
          image
            ? `url(${image?.src?.original})`
            : 'linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5))'
        }`,
        backgroundSize: 'cover',
        backgroundPosition: 'left center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className='flex justify-center w-full bg-blue-300/20'>
        <a
          className='text-[8px]'
          href={image?.photographer_url}
          target='_blank'
          rel='noreferrer'
        >
          Photo by {image?.photographer} on Pexels
        </a>
      </div>
    </div>
  );

  const videoBlock = (video) => {
    if (video?.video_files?.length > 0) {
      return (
        <div className='hidden md:flex flex-col justify-end relative flex-grow-0 flex-shrink-0 w-1/3'>
          <video
            className='absolute top-0 left-0 w-full h-full object-cover'
            autoPlay
            loop
            muted
          >
            <source src={video?.video_files[0]?.link} type='video/mp4' />
            Your browser does not support the video tag.
          </video>
          <div className='flex justify-center w-full bg-blue-300/20 z-10'>
            <a
              className='text-[8px]'
              href={video?.user?.url}
              target='_blank'
              rel='noreferrer'
            >
              Video by {video.user.name} on Pexels
            </a>
          </div>
        </div>
      );
    }
  };

  return (
    <div
      style={
        contentPosition === 'background'
          ? {
              backgroundImage: `${
                illustrationImage
                  ? `url(${illustrationImage.src?.original})`
                  : 'linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5))'
              }`,
              backgroundSize: 'cover',
              backgroundPosition: 'left center',
              backgroundRepeat: 'no-repeat',
            }
          : {}
      }
    >
      <Head>
        <title>{getPageTitle('Starter Page')}</title>
      </Head>

      <SectionFullScreen bg='violet'>
        <div
          className={`flex ${
            contentPosition === 'right' ? 'flex-row-reverse' : 'flex-row'
          } min-h-screen w-full`}
        >
          {contentType === 'image' && contentPosition !== 'background'
            ? imageBlock(illustrationImage)
            : null}
          {contentType === 'video' && contentPosition !== 'background'
            ? videoBlock(illustrationVideo)
            : null}
          <div className='flex items-center justify-center flex-col space-y-4 w-full lg:w-full'>
            <CardBox className='w-full md:w-3/5 lg:w-2/3'>
              <CardBoxComponentTitle title='Welcome to your Mexpay Admin app!' />

              <div className='space-y-3'>
                <p className='text-center text-gray-500'>
                  This is a React.js/Node.js app generated by the{' '}
                  <a
                    className={`${textColor}`}
                    href='https://flatlogic.com/generator'
                  >
                    Flatlogic Web App Generator
                  </a>
                </p>
                <p className='text-center text-gray-500'>
                  For guides and documentation please check your local README.md
                  and the{' '}
                  <a
                    className={`${textColor}`}
                    href='https://flatlogic.com/documentation'
                  >
                    Flatlogic documentation
                  </a>
                </p>
              </div>

              <BaseButtons>
                <BaseButton
                  href='/login'
                  label='Login'
                  color='info'
                  className='w-full'
                />
              </BaseButtons>
              <div className='grid grid-cols-1 gap-2 lg:grid-cols-4 mt-2'>
                <div className='text-center'>
                  <a className={`${textColor}`} href='https://react.dev/'>
                    React.js
                  </a>
                </div>

                <div className='text-center'>
                  <a className={`${textColor}`} href='https://tailwindcss.com/'>
                    Tailwind CSS
                  </a>
                </div>
                <div className='text-center'>
                  <a className={`${textColor}`} href='https://nodejs.org/en'>
                    Node.js
                  </a>
                </div>
                <div className='text-center'>
                  <a
                    className={`${textColor}`}
                    href='https://flatlogic.com/forum'
                  >
                    Flatlogic Forum
                  </a>
                </div>
              </div>
            </CardBox>
          </div>
        </div>
      </SectionFullScreen>
      <div className='bg-black text-white flex flex-col text-center justify-center md:flex-row'>
        <p className='py-6 text-sm'>
          © 2024 <span>{title}</span>. All rights reserved
        </p>
        <Link className='py-6 ml-4 text-sm' href='/privacy-policy/'>
          Privacy Policy
        </Link>
      </div>
    </div>
  );
}

Starter.getLayout = function getLayout(page: ReactElement) {
  return <LayoutGuest>{page}</LayoutGuest>;
};
