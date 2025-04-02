'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Header from "@/components/header";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, { email, password });;
      const { token, user } = response.data;
  
      localStorage.setItem('token', token);
      localStorage.setItem('role', user.role);
      localStorage.setItem('status', user.status);
  
      if (user.status === 'PENDING') {
        toast.error('Your account is still pending approval.');
        return;
      }
  
      if (user.status === 'REJECTED') {
        toast.error('Your account has been rejected. Please contact support.');
        return;
      }
  
      toast.success('Login successful!');
        router.push('/');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const msg = err.response?.data?.error || err.response?.data?.message || "Login failed.";
        toast.error(msg);
      } else {
        toast.error("Unexpected error.");
      }
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <Header />
      <form onSubmit={handleLogin} className="bg-zinc-900 p-8 rounded-xl w-full max-w-md shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-3 mb-4 rounded bg-zinc-800 text-white focus:outline-none"
          
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          className="w-full p-3 mb-4 rounded bg-zinc-800 text-white focus:outline-none"
         
        />
        <button
          type="submit"
          className="w-full bg-[#FFA500] py-3 rounded-lg transition"
        >
          Enter
        </button>
      </form>
    </div>
  );
}