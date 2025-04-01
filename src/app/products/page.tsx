'use client';

import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "@/components/productCard";


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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`);

        console.log("✅ Productos desde el backend:", res.data);
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products", err);
      }
    };
    fetchProducts();
  }, []);

  const grouped = products.reduce((acc, product) => {
    const key = product.category.name;
    if (!acc[key]) acc[key] = [];
    acc[key].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  return (
    <div className="px-6 py-8">
      {Object.entries(grouped).map(([categoryName, items]) => (
        <section key={categoryName} className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{categoryName}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
