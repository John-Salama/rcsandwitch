import { DefaultSession } from "next-auth";
import "next-auth/jwt";

// Extend the existing Session interface
declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      isAdmin?: boolean;
      token?: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    isAdmin: boolean;
    token?: string;
  }
}

// Extend the JWT interface
declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    isAdmin?: boolean;
    token?: string;
  }
}
