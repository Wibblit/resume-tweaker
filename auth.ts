import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import Apple from "next-auth/providers/apple";
import LinkedIn from "next-auth/providers/linkedin";
import { prisma } from "./prisma";
import type { Provider } from "next-auth/providers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const providers: Provider[] = [
  Google({
    clientId: process.env.AUTH_GOOGLE_ID,
    clientSecret: process.env.AUTH_GOOGLE_SECRET,
  }),
  Apple({
    clientId: process.env.AUTH_APPLE_ID,
    clientSecret: process.env.AUTH_APPLE_SECRET,
  }),
  LinkedIn({
    clientId: process.env.AUTH_LINKEDIN_ID,
    clientSecret: process.env.AUTH_LINKEDIN_SECRET,
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
    logo: "/rt-light-bg.svg",
  },
  adapter: PrismaAdapter(prisma),
  providers,
  pages: {
    signIn: "/login",
    newUser: "/onboarding",
  },
  callbacks: {
    async session({ session, user }) {
      session.user = user;
      return session;
    },
    async signIn({ user, account, profile }) {
      return true;
    },
    async authorized({ auth, request: { nextUrl } }) {
      console.log("nextUrl from authorized callback", nextUrl);
      const isLoggedIn = !!auth?.user;
      const protectedRoutes = [
        "/home",
        "/ai-interview",
        "/ai-review",
        "/profile",
        "/editor",
      ];
      const isProtectedRoute = protectedRoutes.some((route) =>
        nextUrl.pathname.startsWith(route)
      );

      if (isProtectedRoute) {
        if (isLoggedIn) return true; // Allow access if logged in
        return false; // Redirect unauthenticated users to the login page
      }

      // Redirect logged-in users away from public routes (e.g., /login) to /home
      if (isLoggedIn) {
        return Response.redirect(new URL("/home", nextUrl));
      }

      return true; // Allow access to non-protected routes
    },
  },
  trustHost: true,
  cookies: {
    pkceCodeVerifier: {
      name: "next-auth.pkce.code_verifier",
      options: {
        httpOnly: true,
        sameSite: "none",
        path: "/",
        secure: true,
      },
    },
  },
});
