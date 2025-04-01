import React from "react";

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

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="bg-white rounded-2xl shadow p-4 flex flex-col justify-between">
      <img
        src={product.imageUrl}
        alt={product.title}
        className="w-full h-40 object-cover rounded-xl mb-2"
      />
      <h2 className="text-lg font-semibold mb-1 text-gray-800">
        {product.title}
      </h2>
      <p className="text-gray-600 text-sm mb-2">{product.description}</p>
      <div className="text-sm text-blue-600 font-semibold mb-1">
        Categoría: {product.category.name}
      </div>
      <div className="text-right text-lg font-bold text-green-700">
        ${product.price}
      </div>
    </div>
  );
}
