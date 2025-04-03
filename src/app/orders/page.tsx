'use client'

import { useEffect, useState } from "react"
import axios from "axios"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import Header from "@/components/header"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"

interface Product {
  id: number
  title: string
  price: number
  imageUrl: string
  description: string
  categoryId: number
}

interface OrderItem {
  id: number
  productId: number
  quantity: number
  product: Product
}

interface Order {
  id: number
  createdAt: string
  total: number
  status: string
  items: OrderItem[]
}

export default function OrdersPage() {
  const { loading, isAuthenticated, role, userId } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated || (role !== "USER" && role !== "ADMIN")) {
        router.push("/products")
      } else {
        const fetchOrders = async () => {
          try {
            const token = localStorage.getItem("token")
            const url = role === "ADMIN"
              ? `${process.env.NEXT_PUBLIC_API_URL}/orders`
              : `${process.env.NEXT_PUBLIC_API_URL}/orders/user/${userId}`

            const res = await axios.get(url, {
              headers: { Authorization: `Bearer ${token}` },
            })

            setOrders(res.data)
          } catch (err) {
            console.error("Error fetching orders", err)
          }
        }

        fetchOrders()
      }
    }
  }, [loading, isAuthenticated, role, userId, router])

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <Header />
      <h1 className="text-3xl font-bold text-center text-gray-800">🧾 Order History</h1>

      {orders.length === 0 ? (
        <p className="text-center text-muted-foreground">You havent placed any orders yet.</p>
      ) : (
        orders.map((order) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="rounded-2xl shadow-lg border border-gray-200">
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Order #{order.id} – {new Date(order.createdAt).toLocaleString()}
                    </p>
                    <p className="text-base font-semibold">Status: {order.status}</p>
                  </div>
                  <span className="text-xl font-bold text-green-600">${order.total}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {order.items.map(({ product, quantity }) => (
                    <div
                      key={product.id}
                      className="flex gap-4 items-center bg-gray-50 rounded-xl p-3 shadow-sm"
                    >
                      <div>
                        <h4 className="font-semibold">{product.title}</h4>
                        <p className="text-sm text-muted-foreground">{product.description}</p>
                        <p className="text-sm">Quantity <strong>{quantity}</strong></p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))
      )}
    </div>
  )
}
