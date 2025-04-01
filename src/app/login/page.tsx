'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('role', user.role);
      localStorage.setItem('status', user.status);

      if (user.status === 'pending') {
        setError('Tu cuenta aún está pendiente de aprobación.');
        return;
      }
      if (user.status === 'rejected') {
        setError('Tu cuenta fue rechazada. Contactá al soporte.');
        return;
      }

      if (user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <form onSubmit={handleLogin} className="bg-zinc-900 p-8 rounded-xl w-full max-w-md shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-3 mb-4 rounded bg-zinc-800 text-white focus:outline-none"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          className="w-full p-3 mb-4 rounded bg-zinc-800 text-white focus:outline-none"
          required
        />
        {error && <p className="text-red-500 mb-4 text-sm text-center">{error}</p>}
        <button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-lg transition"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
