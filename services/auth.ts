'use client';

import { httpClient } from '@/lib/http-client';
import { IDataUser } from '@/lib/store';

interface IGetDataUserResponse {
  statusCode: number;
  data: IDataUser;
}

interface IResetPasswordPayload {
  currentPassword: string;
  newPassword: string;
}

async function resetPassword(data: IResetPasswordPayload) {
  return httpClient.post(
    process.env.NEXT_PUBLIC_API_URL_RESET_PASSWORD as string,
    data
  );
}

async function getDataUser() {
  return httpClient.get<IGetDataUserResponse>(
    '/v1/customers/auth/get-data-user'
  );
}

const exportedObject = {
  getDataUser,
  resetPassword
};

export default exportedObject;
