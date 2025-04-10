"use client";

import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("");

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
      return;
    }

    if (!session.user?.isAdmin) {
      router.push("/");
      return;
    }

    // Determine active link based on current path
    const path = window.location.pathname;
    if (path === "/admin") setActiveLink("dashboard");
    else if (path.includes("/admin/sandwiches")) setActiveLink("sandwiches");
    else if (path.includes("/admin/summary")) setActiveLink("summary");

    setIsLoading(false);
  }, [session, status, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 to-amber-100">
        <div className="text-center">
          <div className="flex justify-center">
            <svg
              className="animate-spin h-12 w-12 text-orange-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
          <h2 className="mt-4 text-xl font-semibold text-gray-700">
            Loading your dashboard...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      <header className="bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-lg z-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="mr-8"
            >
              <Link href="/admin" className="flex items-center">
                <span className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">
                  RCSandwitch
                </span>
                <span className="ml-2 px-2 py-1 text-xs font-semibold rounded bg-gradient-to-r from-orange-500 to-amber-600 text-white">
                  ADMIN
                </span>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex">
              <ul className="flex space-x-1">
                <li>
                  <Link
                    href="/admin"
                    className={`px-4 py-2 rounded-lg flex items-center space-x-1 transition-all duration-200 ${
                      activeLink === "dashboard"
                        ? "bg-white/10 text-white font-medium"
                        : "text-gray-300 hover:bg-white/5 hover:text-white"
                    }`}
                    onClick={() => setActiveLink("dashboard")}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                    </svg>
                    <span>Dashboard</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/sandwiches"
                    className={`px-4 py-2 rounded-lg flex items-center space-x-1 transition-all duration-200 ${
                      activeLink === "sandwiches"
                        ? "bg-white/10 text-white font-medium"
                        : "text-gray-300 hover:bg-white/5 hover:text-white"
                    }`}
                    onClick={() => setActiveLink("sandwiches")}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                    </svg>
                    <span>Sandwiches</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/summary"
                    className={`px-4 py-2 rounded-lg flex items-center space-x-1 transition-all duration-200 ${
                      activeLink === "summary"
                        ? "bg-white/10 text-white font-medium"
                        : "text-gray-300 hover:bg-white/5 hover:text-white"
                    }`}
                    onClick={() => setActiveLink("summary")}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-3 1a1 1 0 10-2 0v3a1 1 0 102 0V8zM8 9a1 1 0 00-2 0v2a1 1 0 102 0V9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Order Summary</span>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {/* User Menu */}
            <div className="hidden md:flex items-center">
              <div className="mr-4">
                <p className="text-sm text-gray-300">
                  Hello,{" "}
                  <span className="font-semibold text-white">
                    {session?.user?.name || "Admin"}
                  </span>
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => signOut({ redirect: false })}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-md transition-all duration-200 flex items-center space-x-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414l-5-5H3zm7 5a1 1 0 10-2 0v4.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L12 12.586V8z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Sign Out</span>
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden rounded-lg p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-gray-800 pb-3 px-4"
            >
              <nav>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/admin"
                      className={`block px-3 py-2 rounded-md ${
                        activeLink === "dashboard"
                          ? "bg-gray-700 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white"
                      }`}
                      onClick={() => {
                        setActiveLink("dashboard");
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/admin/sandwiches"
                      className={`block px-3 py-2 rounded-md ${
                        activeLink === "sandwiches"
                          ? "bg-gray-700 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white"
                      }`}
                      onClick={() => {
                        setActiveLink("sandwiches");
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      Sandwiches
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/admin/summary"
                      className={`block px-3 py-2 rounded-md ${
                        activeLink === "summary"
                          ? "bg-gray-700 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white"
                      }`}
                      onClick={() => {
                        setActiveLink("summary");
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      Order Summary
                    </Link>
                  </li>
                  <li className="pt-2 border-t border-gray-700">
                    <button
                      onClick={() => router.push("/api/auth/signout")}
                      className="w-full text-left px-3 py-2 rounded-md text-white bg-red-600 hover:bg-red-700"
                    >
                      Sign Out
                    </button>
                  </li>
                </ul>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1 overflow-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mx-auto max-w-7xl"
        >
          {children}
        </motion.div>
      </main>

      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 py-4 px-6 shadow-inner">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm text-center md:text-left">
            &copy; {new Date().getFullYear()} RCSandwitch - Admin Panel
          </p>
          <div className="mt-2 md:mt-0 flex space-x-4">
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
