import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    createdAt?: string; // Add the createdAt field
    isNewUser?: boolean;
    provider: string;
    connectedEmail?: string | null;
  }

  interface Session {
    isNewUser?: boolean; // Add the isNewUser field
    user: {
      id: string;
      email: string;
      image: string;
      expires: string;
      provider: string;
      name: string;
      createdAt: string;
      connectedEmail?: string | null;
    };
  }
}
