
"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full fixed top-0 left-0 z-50 bg-[#922B0D] text-white shadow-md">
      <div className="max-w-screen-xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Image
            src="/Helmet-Logo-NY-Dragons-1.png"
            alt="NY Dragons Logo"
            width={40}
            height={40}
            className="rounded-full"
          />
          <span className="text-xl font-semibold">New York Dragons</span>
        </div>

        <div className="flex gap-4">
          <Link href="/login">
            <Button variant="ghost" className="text-white hover:text-[#FFA500]">
              Sign In
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="bg-[#FFA500] text-white hover:bg-orange-600">
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
