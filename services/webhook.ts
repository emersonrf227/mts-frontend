'use client';

import { httpClient } from '@/lib/http-client';

export interface IWebhookResponse {
  statusCode: number;
  data: IWebhookData[];
}

export interface IWebhookData {
  id: number;
  uuid: string;
  callbackUrl: string;
  username: string;
  password: string;
  apiKey: any;
  type: string;
  active: boolean;
  accountId: number;
  createdAt: string;
  updateAt: string;
  deleteAt: any;
}

export interface ICreatePayload {
  callbackUrl: string;
  username: string;
  password: string;
  type: string;
  active: boolean;
}

async function getWebhooks() {
  return httpClient.get<IWebhookResponse>('/v1/customers/webhook-manager');
}

async function createWebhook(data: ICreatePayload) {
  return httpClient.post<any>('/v1/customers/webhook-manager', data);
}

async function updateWebhook(id: string, data: ICreatePayload) {
  return httpClient.patch<any>(`/v1/customers/webhook-manager/${id}`, data);
}

async function deleteWebhook(id: string) {
  return httpClient.delete<any>(`/v1/customers/webhook-manager/${id}`);
}

const exportedObject = {
  getWebhooks,
  createWebhook,
  updateWebhook,
  deleteWebhook
};

export default exportedObject;
