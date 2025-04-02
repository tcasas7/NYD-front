"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/header";

const signupSchema = z.object({
  fullName: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z
    .string()
    .min(10, "Invalid phone number")
    .regex(/^[0-9\-\s]+$/, "Invalid phone format"),
  password: z.string().min(6, "Minimum 6 characters"),
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignUpPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, data);
      router.push("/login");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || "Error during registration");
      } else {
        setError("Unexpected error");
      }
    }
  };
  

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <Header />
      <Card className="w-full max-w-md">
        <CardContent className="space-y-4 pt-6">
          <h1 className="text-2xl font-bold text-center">Create Account</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" >
            <div>
              <Input {...register("fullName")} placeholder="Full Name" />
              {errors.fullName && <p className="text-sm text-red-500">{errors.fullName.message}</p>}
            </div>
            <div>
              <Input {...register("email")} placeholder="Email" />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>
            <div>
              <Input {...register("phone")} placeholder="Phone (e.g. 123-456-7890)" />
              {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
            </div>
            <div>
              <Input type="password" {...register("password")} placeholder="Password" />
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>

            {error && <p className="text-sm text-red-600 font-semibold text-center">{error}</p>}

            <Button type="submit" className="w-full bg-[#FFA500]" disabled={isSubmitting}>
              {isSubmitting ? "Registering..." : "Create Account"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
