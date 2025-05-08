'use client';

export default function DebugEnvPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-red-600">🔍 Diagnóstico de Variables</h1>

      <p><strong>NEXTAUTH_SECRET:</strong> {process.env.NEXT_PUBLIC_NEXTAUTH_SECRET || '❌ No definida'}</p>
      <p><strong>DATABASE_URL:</strong> {process.env.NEXT_PUBLIC_DATABASE_URL || '❌ No definida'}</p>

      <p className="mt-4 text-sm text-gray-600">
        Nota: Solo se muestran variables públicas (prefijo <code>NEXT_PUBLIC_</code>).
      </p>
    </div>
  );
}
