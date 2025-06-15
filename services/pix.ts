'use client';

import { httpClient } from '@/lib/http-client';

export interface ICreateRechargePayload {
  externalId: string;
  amount: number;
  document: string;
  name: string;
  identification: string;
  expire: number;
  description: string;
}

export interface IRechargeResponse {
  statusCode: number;
  data: IRechargeData;
}

export interface IRechargeData {
  uuid: string;
  identifier: string;
  key: string;
  keyType: string;
  InvoiceType: string;
  timeout: number;
  expire: number;
  partnersListId: number;
  amount: string;
  status: string;
  externalId: string;
  documentNumber: string;
  name: string;
  accountId: number;
  createdAt: string;
  bankName: string;
  type: string;
  subType: string;
}

export interface ICreateWidrawPayload {
  externalId: string;
  key: string;
  name?: string;
  documentNumber?: string;
  amount: number;
  memo?: string;
}

export interface IBeneficiary {
  name: string;
  document: string;
  email: string;
  phone: string;
}

export interface IStatusInvoiceResponse {
  statusCode: number;
  data: IStatusInvoiceData;
}

export interface IStatusInvoiceData {
  uuid: string;
  uuidForeigner: string;
  identifier: string;
  key: string;
  keyType: string;
  InvoiceType: string;
  timeout: number;
  expire: number;
  partnersListId: number;
  amount: string;
  status: string;
  externalId: string;
  documentNumber: string;
  name: string;
  active: boolean;
  createdAt: string;
  deletedAt: string;
}

export interface IPixReturnPayload {
  externalId: string;
  end2end: string;
  description: string;
  amount: number;
}

export interface IDecodeBarcodeResponse {
  data: IDecodeBarcodeData;
  recipient: IDecodeRecipient;
}

export interface IDecodeBarcodeData {
  type: string;
  merchantCategoryCode: string;
  transactionCurrency: string;
  countryCode: string;
  merchantName: string;
  merchantCity: string;
  pixKey: string;
  transactionAmount: string;
  txid: string;
  status: string;
  url: string;
  createdAt: string;
  expire: number;
}

export interface IDecodeRecipient {}

async function recharge(data: ICreateRechargePayload) {
  return httpClient.post<IRechargeResponse>(
    '/v1/customers/pix/create-immediate-qrcode',
    data
  );
}
async function withdraw(data: ICreateWidrawPayload) {
  return httpClient.post<IRechargeResponse>('/v1/customers/pix/withdraw', data);
}

async function statusPix(identifier: string) {
  return httpClient.get<IStatusInvoiceResponse>(
    '/v1/customers/pix/status-invoice?identifier=' + identifier
  );
}

async function pixSearch(dict: string) {
  return httpClient.get<any>('/v1/customers/pix/pix-search?dict=' + dict);
}

async function getKeys() {
  return httpClient.get<any>('/v1/customers/key-pix');
}

async function pixReturn(data: IPixReturnPayload) {
  return httpClient.post<any>('/v1/customers/pix/reverse-pix-in', data);
}

async function decodeBarcode(data: string) {
  return httpClient.post<IDecodeBarcodeResponse>(
    '/v1/customers/pix/decode-brcode',
    {
      emv: data
    }
  );
}

const exportedObject = {
  recharge,
  withdraw,
  statusPix,
  pixSearch,
  getKeys,
  pixReturn,
  decodeBarcode
};

export default exportedObject;
