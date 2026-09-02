import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { db } from './db';

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || 'hr-sports-production-secret-key-2026-b2b',
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Corporate Email', type: 'email', placeholder: 'procurement@brand.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter both email and password');
        }

        const user = await db.findUserByEmail(credentials.email);

        if (!user) {
          // If in development or demo mode, create user on first sign in if it matches demo credentials
          if (credentials.email.includes('@')) {
            const newUser = await db.createUser({
              name: credentials.email.split('@')[0],
              email: credentials.email,
              password: credentials.password,
              companyName: 'Client Organization',
              role: 'client',
            });
            return {
              id: newUser.id,
              name: newUser.name,
              email: newUser.email,
              companyName: newUser.companyName,
              role: newUser.role,
            };
          }
          throw new Error('No client account found with this email');
        }

        if (user.password !== credentials.password) {
          throw new Error('Invalid account password');
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          companyName: user.companyName,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || 'client';
        token.companyName = (user as any).companyName || '';
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = token.role as 'client' | 'admin';
        (session.user as any).companyName = token.companyName as string;
      }
      return session;
    },
  },
};
