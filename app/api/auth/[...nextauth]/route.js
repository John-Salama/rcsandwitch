import NextAuth from "next-auth";
import { authOptions } from "@/app/lib/authOptions";

// Create the handler using the authOptions from the separate file
const handler = NextAuth(authOptions);

// Export the handler as GET and POST methods (valid route exports)
export { handler as GET, handler as POST };
