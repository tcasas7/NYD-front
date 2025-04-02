"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
//import ProductCard from "@/components/productCard";
import { Button } from "@/components/ui/button";
//import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, ShoppingCart, Minus, Plus } from "lucide-react";
import Image from "next/image";
import Header from "@/components/header";



interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  title: string;
  price: number;
  imageUrl: string;
  description: string;
  category: Category;
}

export default function ProductosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`);
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products", err);
      }
    };
    fetchProducts();
  }, []);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const exists = prev.find(item => item.product.id === product.id);
      if (exists) {
        return prev.map(item =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const decreaseQuantity = (id: number) => {
    setCart(prev =>
      prev
        .map(item =>
          item.product.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter(item => item.quantity > 0)
    );
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.product.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const confirmOrder = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You are not logged in");
        return;
      }
  
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/orders`,
        {
          items: cart.map(item => ({
            productId: item.product.id,
            quantity: item.quantity,
          })),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (res.status === 201) {
        alert("✅ Order confirmed");
        setCart([]);
        setOpen(false);
      } else {
        alert("❌ Error confirming order");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Error confirming order");
    }
  };
  
  const grouped = products.reduce((acc, product) => {
    const key = product.category.name;
    if (!acc[key]) acc[key] = [];
    acc[key].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  const getQuantity = (productId: number) => {
    return cart.find(item => item.product.id === productId)?.quantity || 0;
  };

  return (
    <div className="relative flex pt-18">
      <Header />
      <div className="flex-1 px-6 py-8">
        {Object.entries(grouped).map(([categoryName, items]) => (
          <section key={categoryName} className="mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">{categoryName}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((product) => {
                const quantity = getQuantity(product.id);
                return (
                  <motion.div
                    key={product.id}
                    whileHover={{ scale: 1.02 }}
                    className="border rounded-xl p-4 shadow-sm relative flex flex-col gap-3"
                  >
                    <Image
                      src="/Helmet-Logo-NY-Dragons-1.png"
                      alt={product.title}
                      width={400}
                      height={240}
                      className="rounded-xl object-cover h-40 w-full"
                    />
                    <div className="text-lg font-bold">{product.title}</div>
                    <p className="text-sm text-muted-foreground">{product.description}</p>
                    <p className="text-sm mb-3">Category: <span className="font-medium text-blue-600">{product.category.name}</span></p>

                    <div className="flex justify-between items-center mt-auto">
                      <div className="flex items-center gap-2">
                        <ShoppingCart className="w-5 h-5" />
                        <Button variant="ghost" size="icon" onClick={() => decreaseQuantity(product.id)}>
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="font-semibold w-6 text-center">{quantity}</span>
                        <Button variant="ghost" size="icon" onClick={() => addToCart(product)}>
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <span className="text-green-600 font-bold text-lg">${product.price}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 w-full max-w-md h-full bg-white shadow-xl z-50 border-l flex flex-col"
          >
            <div className="p-6 flex justify-between items-center border-b">
              <h2 className="text-lg font-bold">🛒 Your order</h2>
              <Button variant="ghost" onClick={() => setOpen(false)}>Close</Button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 && <p className="text-muted-foreground">Your cart is empty</p>}
              {cart.map(({ product, quantity }) => (
                <div key={product.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{product.title}</p>
                    <p className="text-sm text-muted-foreground">x{quantity}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-right">${product.price * quantity}</span>
                    <Button variant="ghost" size="icon" onClick={() => removeFromCart(product.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t p-6 space-y-4">
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>${total}</span>
              </div>
              <Button className="w-full" onClick={confirmOrder}>Confirm purchase</Button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {cart.length > 0 && !open && (
        <Button onClick={() => setOpen(true)} className="fixed bottom-6 right-6 bg-primary">View cart</Button>
      )}
    </div>
  );
}