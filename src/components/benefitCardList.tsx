
'use client';
import { motion } from "framer-motion";

interface Benefit {
  icon: React.ReactNode;
  title: string;
}

export default function BenefitCardList({ benefits }: { benefits: Benefit[] }) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl">
      {benefits.map((b, i) => (
        <motion.div
          key={i}
          whileHover={{ scale: 1.05 }}
          className="bg-white text-black p-6 rounded-2xl shadow flex flex-col items-center space-y-2"
        >
          {b.icon}
          <h3 className="font-semibold text-lg">{b.title}</h3>
        </motion.div>
      ))}
    </section>
  );
}
