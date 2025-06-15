'use client';

import { httpClient } from '@/lib/http-client';
import { getActualMonthStartAndEnd } from '@/lib/utils';

export interface IGetTotalMED {
  statusCode: number;
  totalMED: number;
}

export interface IValuesByMonthResponse {
  statusCode: number;
  totalBalance: number;
  totalEntries: number;
  totalExits: number;
}

export interface IQtdPixInAndOutResponse {
  statusCode: number;
  count_pix_entries: number;
  count_pix_exits: number;
}

export interface IBalanceResponse {
  statusCode: number;
  balance: number;
  preventiveBlock: number;
}

export interface IExtractResponse {
  statusCode: number;
  extract: IExtract[];
  pagination: IPagination;
}

export interface IExtract {
  transactionId: string;
  parentId?: string;
  data: IExtractData;
}

export interface IExtractData {
  uuid: string;
  invoiceId?: number;
  partnersId: number;
  transactionId?: string;
  chargerBackId: any;
  externalId?: string;
  name: string;
  email?: string;
  documentNumber?: string;
  description?: string;
  phone?: string;
  amount: string;
  isbp?: string;
  bankName: any;
  branch: any;
  account?: string;
  endtoendId: string;
  typeKey: any;
  key?: string;
  type: string;
  subType: string;
  remittanceInformation?: string;
  status: string;
  msgError?: string;
  telegramNotification: boolean;
  tryCount: number;
  createdAt: string;
}

export interface IGetDataTransactionForReceiptResponse {
  statusCode: number;
  data: {
    amount: number;
    amount_for_return?: number;
    type: 'CREDIT' | 'DEBIT';
    subType: 'PIX';
    createdAt: string;
    uuid: string;
    name?: string;
    documentNumber?: string;
    bankName?: string;
    endtoendId: string;
  };
}

export interface IPagination {
  count: number;
  page: number;
  perPage: number;
}

async function getTotalMED() {
  return httpClient.get<IGetTotalMED>('/v1/customers/account/total-med');
}

async function getValuesByMonth() {
  const { start, end } = getActualMonthStartAndEnd();

  return httpClient.post<IValuesByMonthResponse>(
    '/v1/customers/account/get-values',
    {
      from: start,
      to: end
    }
  );
}

async function getQtdPixInAndOut() {
  return httpClient.get<IQtdPixInAndOutResponse>(
    '/v1/customers/account/count-pix-in-out'
  );
}

async function getBalance() {
  return httpClient.get<IBalanceResponse>('/v1/customers/account/balance');
}

async function getExtract(params?: Record<string, any>) {
  return httpClient.post<IExtractResponse>('/v1/customers/account/extract', {
    ...params
  });
}

async function getDataTransactionForReceipt(uuidTransaction: string) {
  return httpClient.get<IGetDataTransactionForReceiptResponse>(
    `/v1/customers/account/transaction-for-receipt/${uuidTransaction}`
  );
}

const exportedObject = {
  getTotalMED,
  getValuesByMonth,
  getQtdPixInAndOut,
  getBalance,
  getExtract,
  getDataTransactionForReceipt
};

export default exportedObject;
