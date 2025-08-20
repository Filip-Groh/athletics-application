import { PrismaAdapter } from "@auth/prisma-adapter";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import type { Adapter, AdapterSession, AdapterUser } from "next-auth/adapters";
import DiscordProvider from "next-auth/providers/discord";
import GoogleProvider from "next-auth/providers/google";

import { env } from "~/env";
import { db } from "~/server/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */

export enum UserRole {
  Admin = 3,
  RaceManager = 2,
  EventManager = 1,
  Racer = 0
}

declare module "next-auth" {
  interface User {
    role: UserRole,
    personalData: {
      id: number;
      createdAt: Date;
      updatedAt: Date;
      name: string;
      surname: string;
      birthDate: Date;
      sex: "man" | "woman";
      club: string;
      userId: string | null;
    } | null
  }

  interface Session extends DefaultSession {
    user: {
      id: string;
      role: UserRole,
      personalData: {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        surname: string;
        birthDate: Date;
        sex: "man" | "woman";
        club: string;
        userId: string | null;
      } | null
    } & DefaultSession["user"];
  }
}

const adapter = PrismaAdapter(db)
adapter.getSessionAndUser = async (sessionToken) => {
  const userAndSession = await db.session.findUnique({
    where: { sessionToken },
    include: { 
      user: {
        include: {
          personalData: true
        }
      } 
    },
  })
  if (!userAndSession) return null
  const { user, ...session } = userAndSession
  return { user, session } as { user: AdapterUser; session: AdapterSession }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
        role: user.role,
        personalData: user.personalData
      },
    }),
  },
  adapter: adapter as Adapter,
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
