import type { AuthConfig } from "@auth/core"
import Google from "@auth/core/providers/google"

export const authOptions: AuthConfig = {
  providers: [
    Google({
      clientId: process.env.VITE_GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login",
  },
}
