import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const adminUsername = process.env.ADMIN_USERNAME
        const adminPassword = process.env.ADMIN_PASSWORD

        if (!adminUsername || !adminPassword) {
          console.warn('[auth] ADMIN_USERNAME or ADMIN_PASSWORD not configured')
          return null
        }

        const username = credentials?.username as string | undefined
        const password = credentials?.password as string | undefined

        if (username === adminUsername && password === adminPassword) {
          return { id: 'admin', name: adminUsername }
        }

        return null
      },
    }),
  ],
  pages: { signIn: '/admin/login' },
  session: { strategy: 'jwt' },
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.sub = user.id
      }
      return token
    },
    session({ session, token }) {
      if (session.user && token.sub) {
        session.user.name = token.name ?? token.sub
      }
      return session
    },
  },
})
