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
let callbackUrl = "";
//main
export const { handlers, signIn, signOut, auth } = NextAuth({
  theme: {
    logo: "/rt-light-bg.svg",
  },
  providers,
  pages: {
    signIn: `/login?callbackUrl=${callbackUrl}`,
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.isNewUser = user.isNewUser;
        token.provider = user.provider;
        token.createdAt = user.createdAt;
        token.connectedEmail = user.connectedEmail;
      }

      if (trigger === "update") {
        if (session?.connectedEmail) {
          token.connectedEmail = session.connectedEmail;
        } else if (session.connectedEmail === null) {
          token.connectedEmail = null;
        }
      }

      return token;
    },
    async session({ session, token }: any) {
      session.user.id = token.id.toString() as string;
      session.user.email = token.email;
      session.isNewUser = token.isNewUser;
      session.user.provider = token.provider;
      session.user.createdAt = token.createdAt;
      session.user.connectedEmail = token.connectedEmail;

      return session;
    },
    async signIn({ user, account, profile }) {
      let existingUser = await prisma.user.findUnique({
        where: { email: user.email! },
      });
      if (
        existingUser &&
        account?.provider &&
        existingUser?.provider !== account?.provider
      ) {
        await prisma.user.update({
          where: { id: existingUser.id },
          data: { provider: account.provider },
        });
      }
      let gmailConnectEmail = null;
      if (!existingUser) {
        callbackUrl = "/home";
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

      gmailConnectEmail = await prisma.tokens.findUnique({
        where: { userId: existingUser?.id },
        select: { email: true },
      });

      callbackUrl = "";
      user.id = existingUser?.id;
      user.provider = account?.provider as string;
      user.createdAt = existingUser?.createdAt.toISOString();
      user.connectedEmail = gmailConnectEmail?.email || null;
      console.log("gmail connect email", gmailConnectEmail);
      return true;
    },
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const protectedRoutes = [
        "/home",
        "/home/ai-interview",
        "/home/ai-review",
        "/profile",
        "/home/builder",
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
