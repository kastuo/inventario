'use client';
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password
    });
    if (res?.ok) router.push("/dashboard");
    else alert("Credenciales incorrectas");
  };

  return (
    <form onSubmit={handleLogin} className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-primary">Iniciar sesión</h2>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
        className="block w-full mb-2 p-2 border rounded" required />
      <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)}
        className="block w-full mb-4 p-2 border rounded" required />
      <button type="submit" className="bg-primary text-white w-full py-2 rounded hover:bg-secondary">
        Entrar
      </button>
    </form>
  );
}
