"use client"

import { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import Header from "@/components/header"

interface Product {
  id: number
  title: string
  price: number
  imageUrl: string
  description: string
  categoryId: number
}

export default function UpdateProductsPage() {
  const { loading, isAuthenticated, role } = useAuth()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [selected, setSelected] = useState<Product | null>(null)
  const [, setFile] = useState<File | null>(null)
  const [open, setOpen] = useState(false)

  const [form, setForm] = useState({
    title: '',
    price: '',
    description: '',
    categoryId: '',
  })

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated || role !== 'ADMIN') {
        router.push('/products')
      } else {
        fetchProducts()
      }
    }
  }, [loading, isAuthenticated, role, router])

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`)
      setProducts(res.data)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error('Failed to load products')
    }
  }

  const handleEdit = (product: Product) => {
    setSelected(product)
    setForm({
      title: product.title,
      price: product.price.toString(),
      description: product.description,
      categoryId: product.categoryId.toString(),
    })
    setOpen(true)
  }

  const handleSave = async () => {
    try {
      const imageUrl = selected?.imageUrl || '/uploads/Helmet-Logo-NY-Dragons.png'; 

      if (selected) {
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/products/${selected.id}`, {
          ...form,
          price: parseFloat(form.price),
          categoryId: parseInt(form.categoryId),
          imageUrl,
        })
        toast.success('Product updated')
      } else {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
          ...form,
          price: parseFloat(form.price),
          categoryId: parseInt(form.categoryId),
          imageUrl,
        })
        toast.success('Product created')
      }

      setOpen(false)
      setSelected(null)
      setFile(null)
      setForm({ title: '', price: '', description: '', categoryId: '' })
      fetchProducts()
    } catch {
      toast.error('Error saving product')
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`)
      toast.success('Product deleted')
      fetchProducts()
    } catch {
      toast.error('Failed to delete product')
    }
  }

  return (
    <div className="pt-20 pb-6 px-6 max-w-full mx-auto">
      <Header />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">🛠️ Manage Products</h1>
        <Button 
          className="bg-[#FFA500] hover:bg-[#e59400]"
          onClick={() => { setOpen(true); setSelected(null); }}>
          + Create Product
        </Button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold">{selected ? 'Edit' : 'Create'} Product</h2>
            <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <Input type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            <Textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <Input type="number" placeholder="Category ID" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} />
            <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            <div className="flex justify-end gap-2">
            <Button 
              className="bg-[#FFA500] hover:bg-[#e59400]"
              onClick={handleSave}>
              {selected ? 'Save Changes' : 'Create Product'}
            </Button>
              <Button variant="destructive" onClick={() => setOpen(false)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="border p-4 rounded-xl shadow-sm">
            <h3 className="font-bold text-lg">{product.title}</h3>
            <p className="text-muted-foreground text-sm">{product.description}</p>
            <p className="text-green-600 font-semibold mt-2">${product.price}</p>
            <div className="flex gap-2 mt-4">
            <Button 
              variant="secondary"
              className="bg-[#FFA500] hover:bg-[#e59400]"
              onClick={() => handleEdit(product)}>
              Edit
            </Button>
              <Button variant="destructive" onClick={() => handleDelete(product.id)}>Delete</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

