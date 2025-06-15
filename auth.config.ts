import { NextAuthConfig } from 'next-auth';
import CredentialProvider from 'next-auth/providers/credentials';
import { IAuth } from './types';

const authConfig = {
  trustHost: true,
  providers: [
    CredentialProvider({
      name: 'Credentials',
      credentials: {
        username: {
          type: 'text'
        },
        password: {
          type: 'password'
        }
      },
      async authorize(credentials, req) {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_URL_SIGNIN}`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(credentials)
            }
          );

          if (!res.ok) {
            return null;
          }

          const { data, access_token } = (await res.json()) as IAuth;

          const user = {
            ...data,
            access_token
          };

          if (user) {
            // Any object returned will be saved in `user` property of the JWT
            return user as any;
          } else {
            // If you return null then an error will be displayed advising the user to check their details.
            return null;

            // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
          }
        } catch {
          return null;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 3600 // 1 hours
  },
  pages: {
    signIn: '/' //sigin page
  },
  callbacks: {
    async session({ session, token }) {
      const user = token.user as any;
      if (user.access_token) {
        session.user.access_token = user.access_token;
        session.user.forceReset = user.forceReset;
      }

      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return {
        ...token
      };
    }
  }
} satisfies NextAuthConfig;

export default authConfig;
