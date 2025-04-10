// auth options for NextAuth.js
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const apiBaseUrl = process.env.API_BASE_URL;
          const res = await fetch(`${apiBaseUrl}/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.message || "Authentication failed");
          }

          if (data.status === "success" && data.data.user) {
            // Return user data and token
            return {
              id: data.data.user.id || data.data.user._id,
              name: data.data.user.name,
              email: data.data.user.email,
              isAdmin: data.data.user.isAdmin,
              token: data.token, // Save the token for API calls
            };
          }

          return null;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.isAdmin = user.isAdmin;
        token.id = user.id;
        token.token = user.token; // Save the token to JWT
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.isAdmin = token.isAdmin;
        session.user.id = token.id;
        session.user.token = token.token; // Make token available in session
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt", // No need for type casting in JavaScript
  },
  secret: process.env.NEXTAUTH_SECRET,
};
