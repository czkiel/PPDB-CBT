"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import axios from "@/app/lib/axios";
import { LayoutDashboard, Users, FileText, Settings, LogOut, Menu, X } from "lucide-react";

export default function AdminLayout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await axios.delete("/logout");
    } catch (error) {
      console.error(error);
    } finally {
      router.push("/");
      router.refresh();
    }
  };

  const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Manajemen Soal CBT", href: "/admin/soal", icon: FileText },
    // Add more admin links here as needed
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans">
      {/* Mobile Topbar */}
      <div className="md:hidden flex items-center justify-between bg-[#1a2e1f] text-white p-4 shadow-md sticky top-0 z-50">
        <h1 className="text-xl font-black tracking-wider">PPDB ADMIN</h1>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 hover:bg-[#2b4d33] rounded-lg transition-colors"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed md:sticky top-0 left-0 h-screen w-64 bg-[#1a2e1f] text-white flex flex-col transition-transform duration-300 ease-in-out z-40 shadow-xl`}
      >
        <div className="p-6 hidden md:block border-b border-[#2b4d33]">
          <h1 className="text-2xl font-black tracking-wider text-green-400">PPDB</h1>
          <p className="text-sm font-medium text-gray-300">Admin Panel</p>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-green-600 text-white font-bold shadow-md"
                    : "text-gray-300 hover:bg-[#2b4d33] hover:text-white font-medium"
                }`}
              >
                <Icon size={20} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#2b4d33]">
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors font-medium"
          >
            <LogOut size={20} />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top Header (Desktop) */}
        <header className="hidden md:flex bg-white h-20 items-center justify-between px-8 border-b border-gray-200 shadow-sm sticky top-0 z-30">
          <h2 className="text-xl font-bold text-gray-800">
            {navItems.find((item) => item.href === pathname)?.name || "Admin Panel"}
          </h2>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-bold text-gray-800">Administrator</p>
              <p className="text-xs text-gray-500">Super Admin</p>
            </div>
            <div className="h-10 w-10 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-bold text-lg border-2 border-green-200">
              A
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-4 md:p-8 overflow-y-auto w-full max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
