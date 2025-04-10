"use client";

import { useState, useEffect } from "react";

interface Sandwich {
  id: string;
  name: string;
  price: number;
}

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  sandwich: Sandwich;
}

interface User {
  id: string;
  name: string;
}

interface Order {
  id: string;
  user: User;
  date: string;
  items: OrderItem[];
}

interface SummaryItem {
  sandwichId: string;
  sandwichName: string;
  totalQuantity: number;
  totalCost: number;
  orders: {
    orderId: string;
    userName: string;
    quantity: number;
    price: number;
  }[];
}

export default function SummaryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch(`/api/admin/orders?date=${selectedDate}`);

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();
        setOrders(data);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrders();
  }, [selectedDate]);

  // Group orders by sandwich for summary
  const getSummary = (): SummaryItem[] => {
    const summary: Record<string, SummaryItem> = {};

    orders.forEach((order) => {
      order.items.forEach((item) => {
        // Initialize sandwich summary if not exists
        if (!summary[item.sandwich.id]) {
          summary[item.sandwich.id] = {
            sandwichId: item.sandwich.id,
            sandwichName: item.sandwich.name,
            totalQuantity: 0,
            totalCost: 0,
            orders: [],
          };
        }

        // Add to totals
        summary[item.sandwich.id].totalQuantity += item.quantity;
        summary[item.sandwich.id].totalCost += item.quantity * item.price;

        // Add individual order details
        summary[item.sandwich.id].orders.push({
          orderId: order.id,
          userName: order.user.name,
          quantity: item.quantity,
          price: item.price * item.quantity,
        });
      });
    });

    return Object.values(summary).sort((a, b) =>
      a.sandwichName.localeCompare(b.sandwichName)
    );
  };

  // Calculate grand totals
  const getGrandTotal = () => {
    let quantity = 0;
    let cost = 0;

    orders.forEach((order) => {
      order.items.forEach((item) => {
        quantity += item.quantity;
        cost += item.quantity * item.price;
      });
    });

    return { quantity, cost };
  };

  // Handle print functionality
  const handlePrint = () => {
    window.print();
  };

  // Handle export to CSV
  const handleExport = () => {
    const summary = getSummary();
    const grandTotal = getGrandTotal();

    let csvContent = "Sandwich,Total Quantity,Total Cost,Ordered By\n";

    summary.forEach((item) => {
      // Add the sandwich summary line
      csvContent += `"${item.sandwichName}",${
        item.totalQuantity
      },$${item.totalCost.toFixed(2)},""\n`;

      // Add individual order details
      item.orders.forEach((order) => {
        csvContent += `"","${order.quantity}","$${order.price.toFixed(2)}","${
          order.userName
        }"\n`;
      });
    });

    // Add grand total
    csvContent += `\n"Grand Total",${
      grandTotal.quantity
    },$${grandTotal.cost.toFixed(2)},""\n`;

    // Create and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `sandwich-orders-${selectedDate}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Order Summary</h1>
        <div className="flex gap-3">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Print Summary
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Export to CSV
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Select Date</h2>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-200 text-gray-600"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-8">
          <p>Loading orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-6 rounded text-center">
          <p>No orders found for the selected date.</p>
        </div>
      ) : (
        <div className="space-y-8 print:space-y-6">
          {/* Grand total card */}
          <div className="bg-white rounded-lg shadow-md p-6 print:shadow-none">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Order Summary for {selectedDate}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  Total Orders
                </h3>
                <p className="text-3xl font-bold text-orange-600">
                  {orders.length}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  Total Cost
                </h3>
                <p className="text-3xl font-bold text-orange-600">
                  ${getGrandTotal().cost.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Sandwich summary cards */}
          {getSummary().map((item) => (
            <div
              key={item.sandwichId}
              className="bg-white rounded-lg shadow-md overflow-hidden print:shadow-none print:border print:border-gray-200"
            >
              <div className="p-6 bg-gray-50 border-b">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {item.sandwichName}
                  </h3>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Total Quantity</div>
                    <div className="text-xl font-bold text-orange-600">
                      {item.totalQuantity}
                    </div>
                  </div>
                </div>
                <div className="mt-2 flex justify-between items-center">
                  <div className="text-gray-700">
                    Ordered by {item.orders.length}{" "}
                    {item.orders.length === 1 ? "person" : "people"}
                  </div>
                  <div>
                    <div className="text-sm text-gray-700">Total Cost</div>
                    <div className="text-lg font-semibold text-gray-600">
                      ${item.totalCost.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h4 className="text-md font-medium text-gray-700 mb-3">
                  Individual Orders:
                </h4>
                <div className="space-y-2">
                  {item.orders.map((order) => (
                    <div
                      key={`${item.sandwichId}-${order.orderId}`}
                      className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
                    >
                      <div className="font-medium text-gray-600">
                        {order.userName}
                      </div>
                      <div className="text-right">
                        <div className="text-gray-600">
                          {order.quantity} × $
                          {(order.price / order.quantity).toFixed(2)}
                        </div>
                        <div className="font-medium text-gray-600">
                          ${order.price.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
