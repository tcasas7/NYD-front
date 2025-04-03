'use client'

import { Instagram, Linkedin, X } from 'lucide-react'
import Link from 'next/link'

export function FanClubBanner() {
    return (
      <footer className="w-screen bg-[#8B1A06] text-white py-12 text-center overflow-hidden">
        <h2 className="text-3xl font-bold mb-4 uppercase">Join our New York Dragons Fan Club!</h2>
        <div className="flex justify-center gap-6 mb-2">
          <Link href="https://x.com/entfla" target="_blank" rel="noopener noreferrer">
            <div className="bg-[#FFA500] p-2 rounded-full hover:scale-110 transition">
              <X className="w-6 h-6 text-black" />
            </div>
          </Link>
          <Link href="https://www.instagram.com/entfla" target="_blank" rel="noopener noreferrer">
            <div className="bg-[#FFA500] p-2 rounded-full hover:scale-110 transition">
              <Instagram className="w-6 h-6 text-black" />
            </div>
          </Link>

          <Link href="https://www.linkedin.com/company/entertainment-football-association/" target="_blank" rel="noopener noreferrer">
            <div className="bg-[#FFA500] p-2 rounded-full hover:scale-110 transition">
              <Linkedin className="w-6 h-6 text-black" />
            </div>
          </Link>
        </div>
      </footer>
    )
  }