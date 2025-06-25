// src/types/next-auth.d.ts
import { DefaultSession } from 'next-auth';
import { JWT as DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  // Extiende la sesión para incluir `user.id`
  interface Session extends DefaultSession {
    user: {
      /** El id lo añade tu callback de NextAuth */
      id: string;
    } & DefaultSession['user'];
  }

  // Podrías necesitar también extender User si lo usas en algún callback
  interface User {
    id: string;
  }
}

declare module 'next-auth/jwt' {
  // Extiende el JWT para incluir `id`
  interface JWT extends DefaultJWT {
    id?: string;
  }
}
