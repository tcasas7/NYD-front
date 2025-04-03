import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NYD token fans",
  description: " NYD token fans",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col justify-between`}
      >
        <main className="flex-1">
          {children}
        </main>
  
        <Toaster 
          position="top-center"
          richColors
          toastOptions={{
            style: {
              background: "#922B0D",
              color: "white",
              border: "1px solid #FFA500",
              fontWeight: "500"
            },
            className: "shadow-lg rounded-xl",
            duration: 4000,
          }}
        />
      </body>
    </html>
  );
  
}
