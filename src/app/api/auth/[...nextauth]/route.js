import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import User from '@/lib/models/User';
import dbConnect from '@/lib/dbConnect';
import bcrypt from 'bcryptjs';
import { loginSchema } from '@/lib/validations';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        identifier: { label: "Email/Phone", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        await dbConnect();
        
        // Validate with Zod
        const result = loginSchema.safeParse(credentials);
        if (!result.success) throw new Error('Invalid input');
        
        const user = await User.findOne({
          $or: [
            { email: credentials.identifier },
            { phone: credentials.identifier }
          ]
        }).select('+password');

        if (!user || !(await bcrypt.compare(credentials.password, user.password))) {
          throw new Error('Invalid credentials');
        }
        
        return user;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user._id;
        token.avatar = user.avatar;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.avatar = token.avatar;
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt' }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };