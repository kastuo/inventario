'use client';
import { signIn } from 'next-auth/react';
import { FormEvent, useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Llamada a la API de NextAuth Credentials sin redirección automática:
    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
      callbackUrl: '/dashboard'
    });
    if (res?.error) {
      console.error('Login failed:', res.error);
    } else if (res?.url) {
      window.location.href = res.url;
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow w-full max-w-sm">
        <h2 className="text-xl font-semibold mb-4 text-center text-gray-800">Iniciar sesión</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full border p-2 rounded text-gray-800"
          />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Contraseña"
            required
            className="w-full border p-2 rounded text-gray-800"
          />
          <button
            type="submit"
            className="w-full bg-primary text-white p-2 rounded hover:bg-primary/90 transition"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}