import React, { ReactElement, useEffect } from 'react';
import Head from 'next/head';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { fetch } from '../../stores/billers/billersSlice';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from '../../components/ImageField';
import LayoutAuthenticated from '../../layouts/Authenticated';
import { getPageTitle } from '../../config';
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton';
import SectionMain from '../../components/SectionMain';
import CardBox from '../../components/CardBox';
import BaseButton from '../../components/BaseButton';
import BaseDivider from '../../components/BaseDivider';
import { mdiChartTimelineVariant } from '@mdi/js';
import { SwitchField } from '../../components/SwitchField';
import FormField from '../../components/FormField';

const BillersView = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { billers } = useAppSelector((state) => state.billers);

  const { id } = router.query;

  function removeLastCharacter(str) {
    console.log(str, `str`);
    return str.slice(0, -1);
  }

  useEffect(() => {
    dispatch(fetch({ id }));
  }, [dispatch, id]);

  return (
    <>
      <Head>
        <title>{getPageTitle('View billers')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={removeLastCharacter('View billers')}
          main
        >
          <BaseButton
            color='info'
            label='Edit'
            href={`/billers/billers-edit/?id=${id}`}
          />
        </SectionTitleLineWithButton>
        <CardBox>
          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>Name</p>
            <p>{billers?.name}</p>
          </div>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>ServiceType</p>
            <p>{billers?.service_type}</p>
          </div>

          <>
            <p className={'block font-bold mb-2'}>Transactions</p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>Amount</th>

                      <th>TransactionDate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {billers.transactions &&
                      Array.isArray(billers.transactions) &&
                      billers.transactions.map((item: any) => (
                        <tr
                          key={item.id}
                          onClick={() =>
                            router.push(
                              `/transactions/transactions-view/?id=${item.id}`,
                            )
                          }
                        >
                          <td data-label='amount'>{item.amount}</td>

                          <td data-label='transaction_date'>
                            {dataFormatter.dateTimeFormatter(
                              item.transaction_date,
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!billers?.transactions?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <>
            <p className={'block font-bold mb-2'}>Transactions Biller</p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>Amount</th>

                      <th>TransactionDate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {billers.transactions_biller &&
                      Array.isArray(billers.transactions_biller) &&
                      billers.transactions_biller.map((item: any) => (
                        <tr
                          key={item.id}
                          onClick={() =>
                            router.push(
                              `/transactions/transactions-view/?id=${item.id}`,
                            )
                          }
                        >
                          <td data-label='amount'>{item.amount}</td>

                          <td data-label='transaction_date'>
                            {dataFormatter.dateTimeFormatter(
                              item.transaction_date,
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!billers?.transactions_biller?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <BaseDivider />

          <BaseButton
            color='info'
            label='Back'
            onClick={() => router.push('/billers/billers-list')}
          />
        </CardBox>
      </SectionMain>
    </>
  );
};

BillersView.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'READ_BILLERS'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default BillersView;
