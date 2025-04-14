'use client';

import Navbar from '@/components/Navbar/Navbar';

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="footer footer-center p-4 bg-neutral text-neutral-content">
        <div>
          <p>Copyright © 2025 - All rights reserved by SkillSync</p>
        </div>
      </footer>
    </div>
  );
}