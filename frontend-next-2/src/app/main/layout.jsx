"use client";

import Footer from "@/components/Footer/Footer";
import Navbar from "@/components/Navbar/Navbar";

export default function MainLayout({ children }) {
  return (
    <>
      <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100">
        <Navbar />
        <main className="flex-grow w-full mx-auto pt-8">{children}</main>
        <Footer />
      </div>
    </>
  );
}
