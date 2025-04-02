import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");
    setIsLoggedIn(!!token);
    setRole(userRole);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  return (
<header className="w-full fixed top-0 left-0 z-50 bg-[#922B0D] text-white shadow-md">
  <div className="w-full px-6 py-4 flex justify-between items-center">
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

    {isLoggedIn ? (
      <nav className="flex gap-3 items-center flex-wrap">
        <Link href="/"><Button variant="ghost" className="text-white hover:text-yellow-300">Home</Button></Link>
        <Link href="/products"><Button variant="ghost" className="text-white hover:text-yellow-300">Products</Button></Link>
        <Link href="/orders"><Button variant="ghost" className="text-white hover:text-yellow-300">Orders</Button></Link>
        {role === "ADMIN" && (
          <>
            <Link href="/clients"><Button variant="ghost" className="text-white hover:text-yellow-300">Clients</Button></Link>
            <Link href="/clients-orders"><Button variant="ghost" className="text-white hover:text-yellow-300">Client Orders</Button></Link>
            <Link href="/update-products"><Button variant="ghost" className="text-white hover:text-yellow-300">Update Products</Button></Link>
          </>
        )}
        <Button variant="destructive" onClick={handleLogout}>Logout</Button>
      </nav>
    ) : (
      <div className="flex gap-4">
        <Link href="/login"><Button variant="ghost" className="text-white hover:text-[#FFA500]">Sign In</Button></Link>
        <Link href="/register"><Button className="bg-[#FFA500] text-white hover:bg-orange-600">Sign Up</Button></Link>
      </div>
    )}
  </div>
</header>

  );
}
