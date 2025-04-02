'use client';
import Header from "@/components/header";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';


interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  createdAt: string;
}

export default function ClientsPage() {
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [activeUsers, setActiveUsers] = useState<User[]>([]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users`);
      const all = res.data;
      setPendingUsers(all.filter((u: User) => u.status === 'PENDING' && u.role === 'USER'));
      setActiveUsers(all.filter((u: User) => u.status === 'ACCEPTED' && u.role === 'USER'));
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const updateStatus = async (id: number, status: 'ACCEPTED' | 'REJECTED') => {
    try {
      await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}/status`, { status });
      fetchUsers();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
<div className="pt-24 px-6 pl-8 md:pl-20 max-w-7xl space-y-10">
  <Header />
  <h1 className="text-3xl font-bold text-black">Pending Clients</h1>

  {pendingUsers.length === 0 ? (
    <p className="text-muted-foreground">No pending users.</p>
  ) : (
    <div className="overflow-x-auto rounded-xl shadow-md border border-gray-300 bg-white">
    <table className="min-w-full table-auto text-sm text-left text-gray-700">
      <thead className="bg-[#b12b28] text-white">
        <tr>
          <th className="px-6 py-3 font-semibold">Full Name</th>
          <th className="px-6 py-3 font-semibold">Email</th>
          <th className="px-6 py-3 font-semibold">Phone</th>
          <th className="px-6 py-3 font-semibold">Actions</th>
        </tr>
      </thead>
      <tbody>
        {pendingUsers.map(user => (
          <tr key={user.id} className="border-b text-base">
            <td className="px-6 py-4">{user.fullName}</td>
            <td className="px-6 py-4">{user.email}</td>
            <td className="px-6 py-4">{user.phone || 'N/A'}</td>
            <td className="px-6 py-4 space-x-2">
              <Button
                className="bg-[#4CAF50] text-white hover:bg-[#43a047] px-3"
                onClick={() => updateStatus(user.id, 'ACCEPTED')}
              >
                Approve
              </Button>
              <Button
                variant="destructive"
                className="px-3"
                onClick={() => updateStatus(user.id, 'REJECTED')}
              >
                Reject
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  

  )}


<h1 className="text-3xl font-bold text-black pt-12">Active Clients</h1>

{activeUsers.length === 0 ? (
  <p className="text-muted-foreground">No active users.</p>
) : (
  <div className="overflow-x-auto rounded-xl shadow-md border border-gray-300 bg-white mt-4">
    <table className="min-w-full table-auto text-left text-base text-gray-700">
      <thead className="bg-[#b12b28] text-white">
        <tr>
          <th className="px-6 py-3 font-semibold">Full Name</th>
          <th className="px-6 py-3 font-semibold">Email</th>
          <th className="px-6 py-3 font-semibold">Phone</th>
        </tr>
      </thead>
      <tbody>
        {activeUsers.map(user => (
          <tr key={user.id} className="border-b">
            <td className="px-6 py-4">{user.fullName}</td>
            <td className="px-6 py-4">{user.email}</td>
            <td className="px-6 py-4">{user.phone || 'Not provided'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}
</div>
  );
}
