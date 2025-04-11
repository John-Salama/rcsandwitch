"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

interface DashboardStats {
  totalOrders: number;
  totalSandwiches: number;
  totalUsers: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalSandwiches: 0,
    totalUsers: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("/api/admin/stats");
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, []);

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-gray-800 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent"
        >
          Admin Dashboard
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-gray-500 mt-2 md:mt-0"
        >
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </motion.p>
      </div>

      {isLoading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center p-12"
        >
          <div className="relative w-20 h-20">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-t-orange-500 rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </motion.div>
      ) : (
        <>
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            <motion.div
              variants={item}
              whileHover={{
                y: -5,
                boxShadow:
                  "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
              className="bg-white rounded-2xl overflow-hidden shadow-md transition-all duration-300"
            >
              <div className="bg-gradient-to-r from-orange-400 to-orange-500 px-6 py-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path
                    fillRule="evenodd"
                    d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-2">
                  Total Orders
                </h2>
                <p className="text-4xl font-bold text-gray-800 mb-4">
                  {stats.totalOrders}
                </p>
                <Link
                  href="/admin/summary"
                  className="text-orange-500 hover:text-orange-600 font-medium inline-flex items-center transition-colors"
                >
                  <span>View Orders</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>
            </motion.div>

            <motion.div
              variants={item}
              whileHover={{
                y: -5,
                boxShadow:
                  "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
              className="bg-white rounded-2xl overflow-hidden shadow-md transition-all duration-300"
            >
              <div className="bg-gradient-to-r from-amber-400 to-amber-500 px-6 py-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 3a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm.293 7.707a1 1 0 011.414 0L10 13.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414zM7 17a1 1 0 01-1-1v-2a1 1 0 012 0v2a1 1 0 01-1 1zm3 0a1 1 0 01-1-1v-8a1 1 0 012 0v8a1 1 0 01-1 1zm3 0a1 1 0 01-1-1v-4a1 1 0 112 0v4a1 1 0 01-1 1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-2">
                  Sandwich Options
                </h2>
                <p className="text-4xl font-bold text-gray-800 mb-4">
                  {stats.totalSandwiches}
                </p>
                <Link
                  href="/admin/sandwiches"
                  className="text-amber-500 hover:text-amber-600 font-medium inline-flex items-center transition-colors"
                >
                  <span>Manage Sandwiches</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>
            </motion.div>

            <motion.div
              variants={item}
              whileHover={{
                y: -5,
                boxShadow:
                  "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
              className="bg-white rounded-2xl overflow-hidden shadow-md transition-all duration-300"
            >
              <div className="bg-gradient-to-r from-blue-400 to-blue-500 px-6 py-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
              </div>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-2">
                  Total Users
                </h2>
                <p className="text-4xl font-bold text-gray-800 mb-4">
                  {stats.totalUsers}
                </p>
                <Link
                  href="/admin/users"
                  className="text-blue-500 hover:text-blue-600 font-medium inline-flex items-center transition-colors"
                >
                  <span>View Users</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-2xl shadow-md overflow-hidden"
          >
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800">
                Quick Actions
              </h2>
              <p className="text-gray-500 mt-1">
                Shortcuts to frequently used actions
              </p>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/admin/sandwiches/new"
                className="group relative bg-white border border-gray-200 hover:border-green-500 rounded-xl p-6 transition-all duration-300 flex items-start space-x-4"
              >
                <div className="bg-green-100 rounded-lg p-3 text-green-600 group-hover:bg-green-500 group-hover:text-white transition-all duration-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 group-hover:text-green-600 transition-colors duration-300">
                    Add New Sandwich
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Create a new sandwich option for orders
                  </p>
                </div>
              </Link>

              <Link
                href="/admin/summary"
                className="group relative bg-white border border-gray-200 hover:border-blue-500 rounded-xl p-6 transition-all duration-300 flex items-start space-x-4"
              >
                <div className="bg-blue-100 rounded-lg p-3 text-blue-600 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                    View Today&apos;s Orders
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    See order summaries and details
                  </p>
                </div>
              </Link>

              <Link
                href="/admin/users"
                className="group relative bg-white border border-gray-200 hover:border-purple-500 rounded-xl p-6 transition-all duration-300 flex items-start space-x-4"
              >
                <div className="bg-purple-100 rounded-lg p-3 text-purple-600 group-hover:bg-purple-500 group-hover:text-white transition-all duration-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 group-hover:text-purple-600 transition-colors duration-300">
                    Manage Users
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    View all registered user accounts
                  </p>
                </div>
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}
