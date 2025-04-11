"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import RoleGate from "@/app/components/RoleGate";

interface Sandwich {
  id: string;
  name: string;
  description: string | null;
  price: number;
}

interface OrderItem {
  sandwichId: string;
  quantity: number;
  sandwich: Sandwich;
}

export default function UserOrderPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [userName, setUserName] = useState("");
  const [sandwiches, setSandwiches] = useState<Sandwich[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Set username if authenticated
  useEffect(() => {
    if (status === "authenticated" && session?.user?.name) {
      setUserName(session.user.name);
    }
  }, [status, session]);

  // Check if we&apos;re past the cutoff time (11:00 PM)
  const isPastCutoffTime = () => {
    const now = new Date();
    const startTime = new Date(now);
    const endTime = new Date(now);

    startTime.setHours(9, 0, 0, 0); // 9:00 AM
    endTime.setHours(23, 0, 0, 0); // 11:00 PM

    return now < startTime || now >= endTime;
  };

  // Load sandwiches
  useEffect(() => {
    async function fetchSandwiches() {
      try {
        const response = await fetch("/api/sandwiches");

        if (!response.ok) {
          throw new Error("Failed to fetch sandwiches");
        }

        const data = await response.json();
        setSandwiches(data);
      } catch (err) {
        console.error("Error fetching sandwiches:", err);
        setError("Failed to load sandwich options. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }

    if (status === "authenticated") {
      fetchSandwiches();
    }
  }, [status]);

  // Calculate total price
  const totalPrice = orderItems.reduce((sum, item) => {
    return sum + item.sandwich.price * item.quantity;
  }, 0);

  // Add/update sandwich to/in order
  const handleAddToOrder = (sandwich: Sandwich) => {
    setOrderItems((prev) => {
      const existingItem = prev.find((item) => item.sandwichId === sandwich.id);

      if (existingItem) {
        return prev.map((item) =>
          item.sandwichId === sandwich.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { sandwichId: sandwich.id, quantity: 1, sandwich }];
      }
    });
  };

  // Remove sandwich from order
  const handleRemoveFromOrder = (sandwichId: string) => {
    setOrderItems((prev) => {
      const existingItem = prev.find((item) => item.sandwichId === sandwichId);

      if (existingItem && existingItem.quantity > 1) {
        return prev.map((item) =>
          item.sandwichId === sandwichId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      } else {
        return prev.filter((item) => item.sandwichId !== sandwichId);
      }
    });
  };

  // Submit order
  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isPastCutoffTime()) {
      setError(
        "Sorry, it&apos;s past the 11:00 PM cutoff time for today&apos;s orders."
      );
      return;
    }

    if (!session || !session.user) {
      setError("You must be logged in to place an order");
      router.push("/login");
      return;
    }

    if (orderItems.length === 0) {
      setError("Please add at least one sandwich to your order.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: orderItems.map((item) => ({
            sandwichId: item.sandwichId,
            quantity: item.quantity,
          })),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit order");
      }

      setSuccessMessage("Your order has been submitted successfully!");
      setOrderItems([]);

      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (err) {
      console.error("Error submitting order:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter sandwiches based on search term
  const filteredSandwiches = searchTerm
    ? sandwiches.filter(
        (sandwich) =>
          sandwich.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (sandwich.description &&
            sandwich.description
              .toLowerCase()
              .includes(searchTerm.toLowerCase()))
      )
    : sandwiches;

  // Show loading screen when session is loading
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <RoleGate requiredRole="user">
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 py-8 overflow-hidden relative">
        {/* Animated background shapes */}
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="absolute -top-1/3 -right-1/3 w-2/3 h-2/3 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-1/3 -left-1/3 w-2/3 h-2/3 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <div className="flex justify-between items-center mb-6">
              <Link href="/" className="inline-block">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-700 via-orange-600 to-amber-600 bg-clip-text text-transparent">
                  RCSandwitch
                </h1>
              </Link>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => signOut({ callbackUrl: "/" })}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-2 px-4 rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-200 flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414l-4-4H3zm9 2.586L14.586 8H12V5.586zM5 5a1 1 0 011-1h4v3a1 1 0 001 1h3v7H5V5z"
                    clipRule="evenodd"
                  />
                  <path
                    fillRule="evenodd"
                    d="M11 3a1 1 0 00-1 1v3.586l1.293-1.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414L7 7.586V4a1 1 0 011-1h3z"
                    clipRule="evenodd"
                  />
                </svg>
                Logout
              </motion.button>
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Place Your Order
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Welcome, {session?.user?.name || userName}! Select your
                sandwiches for today&apos;s order.
                {isPastCutoffTime() && (
                  <span className="text-red-600 ml-2 font-medium">
                    Note: It&apos;s past the 11:00 PM cutoff time. Your order
                    will be for tomorrow.
                  </span>
                )}
              </p>
            </div>
          </motion.header>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6 shadow-sm"
              >
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-red-500 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{error}</span>
                </div>
                <button
                  onClick={() => setError("")}
                  className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </motion.div>
            )}

            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-lg mb-6 shadow-sm"
              >
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-500 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{successMessage}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left side - Menu */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full lg:w-7/12"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    Available Sandwiches
                  </h2>
                  <p className="text-sm text-gray-500">
                    Select your favorite sandwiches for today&apos;s order
                  </p>
                </div>

                <div className="p-4">
                  <div className="relative mb-4">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <input
                      type="text"
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                      placeholder="Search sandwiches..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="relative w-16 h-16">
                        <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 rounded-full"></div>
                        <div className="absolute top-0 left-0 w-full h-full border-4 border-t-orange-500 rounded-full animate-spin"></div>
                      </div>
                      <p className="mt-4 text-gray-600">
                        Loading sandwiches...
                      </p>
                    </div>
                  ) : sandwiches.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-16 w-16 mx-auto text-gray-300 mb-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <p className="font-medium mb-2">
                        No sandwiches available
                      </p>
                      <p className="text-sm">
                        No sandwiches available at the moment.
                      </p>
                    </div>
                  ) : filteredSandwiches.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p>
                        No sandwiches match your search. Try different keywords.
                      </p>
                      <button
                        onClick={() => setSearchTerm("")}
                        className="mt-2 text-orange-500 hover:text-orange-600 font-medium"
                      >
                        Clear search
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[450px] overflow-y-auto pr-2">
                      {filteredSandwiches.map((sandwich, index) => (
                        <motion.div
                          key={sandwich.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="border border-gray-200 hover:border-orange-200 bg-white rounded-xl p-4 hover:shadow-md transition-all duration-200"
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex-1 pr-4">
                              <h3 className="font-medium text-gray-900">
                                {sandwich.name}
                              </h3>
                              {sandwich.description && (
                                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                  {sandwich.description}
                                </p>
                              )}
                            </div>
                            <div className="flex flex-col items-end">
                              <span className="text-lg font-medium text-gray-900 mb-2">
                                ${sandwich.price.toFixed(2)}
                              </span>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleAddToOrder(sandwich)}
                                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-lg px-3 py-1.5 font-medium text-sm shadow-sm hover:shadow transition-all duration-200 flex items-center"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4 mr-1"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                Add
                              </motion.button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Rest of your component... */}
            {/* Right side - Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-full lg:w-5/12"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-6 lg:sticky lg:top-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Your Order
                  </h2>
                  {orderItems.length > 0 && (
                    <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-1 rounded-full">
                      {orderItems.reduce(
                        (total, item) => total + item.quantity,
                        0
                      )}{" "}
                      items
                    </span>
                  )}
                </div>

                {orderItems.length === 0 ? (
                  <div className="py-12 text-center">
                    <div className="w-20 h-20 mx-auto bg-orange-100 rounded-full flex items-center justify-center mb-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-10 w-10 text-orange-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Your order is empty
                    </h3>
                    <p className="text-gray-500 mb-6">
                      Add some delicious sandwiches from the menu
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 mb-6 max-h-[350px] overflow-y-auto pr-2">
                      <div className="pb-2 border-b border-gray-100 text-xs text-gray-500 uppercase flex justify-between">
                        <span>Item</span>
                        <span>Subtotal</span>
                      </div>

                      {orderItems.map((item) => (
                        <motion.div
                          key={item.sandwichId}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex justify-between"
                        >
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 mb-1">
                              {item.sandwich.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              ${item.sandwich.price.toFixed(2)} each
                            </p>
                            <div className="flex items-center mt-2">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() =>
                                  handleRemoveFromOrder(item.sandwichId)
                                }
                                className="bg-gray-100 hover:bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center focus:outline-none transition-colors"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-3 w-3 text-gray-600"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </motion.button>
                              <span className="mx-2 font-medium text-gray-900">
                                {item.quantity}
                              </span>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleAddToOrder(item.sandwich)}
                                className="bg-gray-100 hover:bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center focus:outline-none transition-colors"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-3 w-3 text-gray-600"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </motion.button>
                            </div>
                          </div>
                          <div className="pl-4 flex flex-col items-end">
                            <span className="font-medium text-gray-900">
                              $
                              {(item.sandwich.price * item.quantity).toFixed(2)}
                            </span>
                            <button
                              onClick={() => {
                                setOrderItems((prev) =>
                                  prev.filter(
                                    (i) => i.sandwichId !== item.sandwichId
                                  )
                                );
                              }}
                              className="text-xs text-red-500 hover:text-red-700 mt-2"
                            >
                              Remove
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="space-y-3 py-4 border-t border-gray-200">
                      <div className="flex justify-between text-gray-600">
                        <span>Subtotal</span>
                        <span>${totalPrice.toFixed(2)}</span>
                      </div>

                      <div className="flex justify-between font-semibold text-xl text-gray-900">
                        <span>Total</span>
                        <span>${totalPrice.toFixed(2)}</span>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSubmitOrder}
                      disabled={isSubmitting || orderItems.length === 0}
                      className="w-full mt-4 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex justify-center items-center"
                    >
                      {isSubmitting ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
                          Submitting Order...
                        </>
                      ) : (
                        <>
                          Submit Order
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 ml-2"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </>
                      )}
                    </motion.button>
                  </>
                )}

                <div className="mt-6 text-center">
                  <Link
                    href="/"
                    className="text-orange-600 hover:text-orange-700 font-medium inline-flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Back to Home
                  </Link>
                </div>
              </div>

              {/* Important note card */}
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4 shadow-sm">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-blue-600"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      Important Information
                    </h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Orders must be placed before 11:00 PM</li>
                        <li>Sandwiches will be delivered at 9:00AM</li>
                        <li>
                          Any special requests should be emailed to
                          support@rcsandwitch.com
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <footer className="mt-16 py-6 text-center text-gray-600 text-sm">
          <p>
            &copy; {new Date().getFullYear()} RCSandwitch. All rights reserved.
          </p>
        </footer>
      </div>
    </RoleGate>
  );
}
