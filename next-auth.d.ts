import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    createdAt?: string; // Add the createdAt field
    isNewUser?: boolean;
    connectedEmail?: string | null;
  }

  interface Session {
    isNewUser?: boolean; // Add the isNewUser field
    user: {
      id: string;
      email: string;
      connectedEmail?: string | null;
    };
  }
}
