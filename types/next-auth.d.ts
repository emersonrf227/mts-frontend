import NextAuth, { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  type UserSession = DefaultSession['user'];
  interface Session {
    user: {
      id: number
      uuid: string
      name: string
      username: string
      type: string
      active: boolean
      forceReset: boolean
      access_token: string
    };
  }

  interface CredentialsInputs {
    email: string;
    password: string;
  }
}
