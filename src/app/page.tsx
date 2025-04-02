"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PartyPopper, Gift, TicketCheck } from "lucide-react";
import { useRouter } from 'next/navigation';
import BenefitCardList from "@/components/benefitCardList";
import Header from "@/components/header";
import Link from "next/link";

export default function HomePage() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center text-center px-6 pt-32 pb-12 space-y-16">
      <Header />

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl space-y-6"
      >
        <h1 className="text-4xl md:text-5xl font-serif font-semibold text-black leading-tight">
          Connect with your club like never before
        </h1>
        <p className="text-black text-lg font-serif leading-relaxed">
          Join the New York Dragons fan community and unlock exclusive benefits.
        </p>
        <p className="text-black text-lg font-serif leading-relaxed">
          Get access to exclusive experiences, raffles, and unique benefits by being part of the fan community.
        </p>
        <Button
          className="text-lg px-8 py-6 rounded-xl bg-[#FFA500] text-white mt-4 font-serif"
          size="lg"
          onClick={() => router.push('/products')}
        >
          View Benefits
        </Button>

      </motion.section>

      {/* Benefits */}
      <BenefitCardList
        benefits={[
          { icon: <TicketCheck className="w-8 h-8" />, title: "VIP Tickets" },
          { icon: <Gift className="w-8 h-8" />, title: "Exclusive Raffles" },
          { icon: <PartyPopper className="w-8 h-8" />, title: "Meet & Greet" },
        ]}
      />

      {/* How It Works */}
      <section className="max-w-3xl text-left space-y-8 font-serif">
        <h2 className="text-2xl font-semibold text-black">How does it work?</h2>
        <ol className="list-decimal list-inside text-black text-lg space-y-2 leading-relaxed">
          <li>Buy your tokens</li>
          <li>Redeem them for products or experiences</li>
          <li>Enjoy real benefits</li>
        </ol>
      </section>

      {/* Final CTA */}
      <section className="bg-white rounded-2xl p-8 shadow-lg text-black text-center max-w-xl font-serif">
        <h3 className="text-xl font-semibold mb-2">Over 3,000 fans have already joined</h3>
        <p className="mb-4">What are you waiting for?</p>
        <Link href="/register">
          <Button className="text-lg px-8 py-6 rounded-xl bg-[#FFA500] text-white" size="lg">
            Join Now
          </Button>
        </Link>
      </section>
    </div>
  );
}
