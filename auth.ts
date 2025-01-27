import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import LinkedIn from "next-auth/providers/linkedin";
import { prisma } from "./prisma";
import type { Provider } from "next-auth/providers";

const providers: Provider[] = [
  Google({
    clientId: process.env.AUTH_GOOGLE_ID,
    clientSecret: process.env.AUTH_GOOGLE_SECRET,
    authorization: {
      params: {
        prompt: "consent",
        access_type: "offline",
        response_type: "code",
      },
    },
  }),
  LinkedIn({
    clientId: process.env.AUTH_LINKEDIN_ID,
    clientSecret: process.env.AUTH_LINKEDIN_SECRET,
    authorization: {
      params: {
        prompt: "consent",
        access_type: "offline",
        response_type: "code",
      },
    },
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
  providers,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isNewUser = user.isNewUser;
      }
      return token;
    },
    async session({ session, token }: any) {
      session.user.id = token.id.toString() as string;
      session.user.email = token.email; 
      session.isNewUser = token.isNewUser;
      return session;
    },
    async signIn({ user, account, profile }) {
      let existingUser = await prisma.user.findUnique({
        where: { email: user.email! },
      });
      if (!existingUser) {
        if (user && user.email && profile && account && account.provider) {
          existingUser = await prisma.user.create({
            data: {
              name: user.name || profile?.name || null,
              email: user.email,
              image: user.image || profile?.picture || null,
              provider: account.provider,
            },
          });
          await prisma.userAssets.create({
            data: {
              userId: existingUser?.id,
            },
          });
        }
      }
      user.id = existingUser?.id;
      return true;
    },
    async authorized({ auth, request: { nextUrl } }) {
      console.log("auth from authorized", auth);
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
      // if (isLoggedIn) {
      //   return Response.redirect(new URL("/home", nextUrl));
      // }

      return true; // Allow access to non-protected routes
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 30,
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
