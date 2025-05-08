'use client';
import React from 'react';

export default function DebugEnvPage() {
  return (
    <div className="p-6">
      <h1>Variables de entorno</h1>
      <p>
        <strong>DATABASE_URL:</strong> {process.env.NEXT_PUBLIC_DATABASE_URL || 'No definida'}
      </p>
    </div>
  );
}
