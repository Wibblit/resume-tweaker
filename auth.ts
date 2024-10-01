import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import Apple from "next-auth/providers/apple";
import LinkedIn from "next-auth/providers/linkedin";
import { prisma } from "./prisma";
import type { Provider } from "next-auth/providers";

const providers: Provider[] = [
  Google({
    clientId: process.env.AUTH_GOOGLE_ID,
    clientSecret: process.env.AUTH_GOOGLE_SECRET,
    authorization: { params: { access_type: "offline", prompt: "consent" } },
  }),
  Apple({
    clientId: process.env.AUTH_APPLE_ID,
    clientSecret: process.env.AUTH_APPLE_SECRET,
    authorization: { params: { access_type: "offline", prompt: "consent" } },
  }),
  LinkedIn({
    clientId: process.env.AUTH_LINKEDIN_ID,
    clientSecret: process.env.AUTH_LINKEDIN_SECRET,
    authorization: { params: { access_type: "offline", prompt: "consent" } },
  }),
];

export const providerMap = providers.map((provider) => {
  if (typeof provider === "function") {
    const providerData = provider();
    return { id: providerData.id, name: providerData.name };
  } else {
    return { id: provider.id, name: provider.name };
  }
});

//main
export const { handlers, signIn, signOut, auth } = NextAuth({
  theme: {
    logo: "/wbb.jpg",
  },
  adapter: PrismaAdapter(prisma),
  providers,
  pages: {
    signIn: "/login",
  },
});

