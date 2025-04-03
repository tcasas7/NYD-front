"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import Header from "@/components/header";
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"

interface Product {
  title: string;
  price: number;
  description: string;
}

interface OrderItem {
  id: number;
  quantity: number;
  product: Product;
}

interface User {
  fullName: string;
  email: string;
  phone: string;
}

interface Order {
  id: number;
  createdAt: string;
  status: string;
  total: number;
  user: User;
  items: OrderItem[];
}

export default function ClientOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  
  const { loading, isAuthenticated, role } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated || role !== "ADMIN") {
        router.push("/products") 
      } else {
        const fetchOrders = async () => {
          try {
            const token = localStorage.getItem("token")
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
              headers: { Authorization: `Bearer ${token}` },
            })
            setOrders(res.data)
          } catch (err) {
            console.error("Error fetching orders:", err)
          }
        }
        fetchOrders()
      }
    }
  }, [loading, isAuthenticated, role, router])

  

  const updateStatus = async (id: number, status: string) => {
    const token = localStorage.getItem("token");
    await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/orders/${id}/status`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setOrders((prev) =>
      prev.map((order) => (order.id === id ? { ...order, status } : order))
    );
  };

  const pendingOrders = orders.filter((o) => o.status === "PENDING");
  const acceptedOrders = orders.filter((o) => o.status === "ACCEPTED");

  return (
    <div className="pt-24 px-6 max-w-7xl mx-auto space-y-12">
      <Header />
      <div>
        <h1 className="text-3xl font-bold text-black mb-4">Pending Orders</h1>
        {pendingOrders.length === 0 ? (
          <p className="text-muted-foreground">No pending orders.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border rounded-xl overflow-hidden">
              <thead className="bg-[#922B0D] text-white">
                <tr>
                  <th className="text-left px-4 py-2">Client</th>
                  <th className="text-left px-4 py-2">Email</th>
                  <th className="text-left px-4 py-2">Phone</th>
                  <th className="text-left px-4 py-2">Total</th>
                  <th className="text-left px-4 py-2">Date</th>
                  <th className="text-left px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {pendingOrders.map((order) => (
                  <tr key={order.id} className="border-t">
                    <td className="px-4 py-2 text-[15px]">{order.user.fullName}</td>
                    <td className="px-4 py-2 text-[15px]">{order.user.email}</td>
                    <td className="px-4 py-2 text-[15px]">{order.user.phone}</td>
                    <td className="px-4 py-2 text-green-600 font-semibold text-[15px]">
                      ${order.total}
                    </td>
                    <td className="px-4 py-2 text-[15px]">
                      {format(new Date(order.createdAt), "MM/dd/yyyy, h:mm a")}
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex gap-2">
                        <Button
                          className="bg-[#4CAF50] text-white hover:bg-[#43a047]"
                          onClick={() => updateStatus(order.id, "ACCEPTED")}
                        >
                          Accept
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => updateStatus(order.id, "REJECTED")}
                        >
                          Reject
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div>
        <h1 className="text-3xl font-bold text-black">Accepted Orders</h1>
        {acceptedOrders.length === 0 ? (
          <p className="text-muted-foreground">No accepted orders yet.</p>
        ) : (
          <div className="overflow-x-auto mt-4">
            <table className="w-full border rounded-xl overflow-hidden">
              <thead className="bg-[#922B0D] text-white">
                <tr>
                  <th className="text-left px-4 py-2">Client</th>
                  <th className="text-left px-4 py-2">Email</th>
                  <th className="text-left px-4 py-2">Phone</th>
                  <th className="text-left px-4 py-2">Total</th>
                  <th className="text-left px-4 py-2">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {acceptedOrders.map((order) => (
                  <tr key={order.id} className="border-t">
                    <td className="px-4 py-2 text-[15px]">{order.user.fullName}</td>
                    <td className="px-4 py-2 text-[15px]">{order.user.email}</td>
                    <td className="px-4 py-2 text-[15px]">{order.user.phone}</td>
                    <td className="px-4 py-2 text-green-600 font-semibold text-[15px]">
                      ${order.total}
                    </td>
                    <td className="px-4 py-2 text-[15px]">
                      {format(new Date(order.createdAt), "dd/MM/yyyy, h:mm a")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
