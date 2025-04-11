import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "RCSandwitch - Daily Sandwich Ordering System",
  description: "Order your daily sandwich easily before 11:00 PM",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 overflow-hidden relative">
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute -top-1/3 -right-1/3 w-2/3 h-2/3 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-1/3 -left-1/3 w-2/3 h-2/3 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/3 left-1/3 w-1/2 h-1/2 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <main className="flex flex-col items-center justify-center max-w-6xl mx-auto px-4 pt-8 pb-16 md:py-20 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4 bg-gradient-to-r from-orange-700 via-orange-600 to-amber-600 bg-clip-text text-transparent">
            RCSandwitch
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 max-w-2xl mx-auto">
            Your daily sandwich ordering system
          </p>
        </div>

        {/* Hero card */}
        <div className="w-full max-w-4xl bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden mb-16">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 p-8 md:p-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                Daily Fresh <span className="text-orange-600">Sandwiches</span>
              </h2>
              <p className="text-gray-600 mb-6">
                Order your favorite sandwiches for lunch before 11:00 PM every
                day. Simple, convenient, and delicious!
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/user"
                  className="inline-flex items-center justify-center bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                  </svg>
                  Place an Order
                </Link>
                <Link
                  href="/admin"
                  className="inline-flex items-center justify-center bg-gray-700 hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Admin Panel
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 bg-gradient-to-br from-orange-400 to-amber-500 p-8 md:p-10 text-white">
              <div className="border-2 border-white/20 rounded-xl p-6 backdrop-blur-sm bg-white/10">
                <h3 className="text-xl font-bold mb-4">Today&apos;s Special</h3>
                <p className="mb-3">
                  Check out our special menu of the day and discover new
                  flavors!
                </p>
                <div className="flex items-center mt-6">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path
                        fillRule="evenodd"
                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="font-medium">View Today&apos;s Menu</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How it works section */}
        <div className="w-full max-w-4xl">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 card-hover">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-orange-600 text-xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Register & Login
              </h3>
              <p className="text-gray-600">
                Create an account and login to access our ordering system.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 card-hover">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-orange-600 text-xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Select & Order Before 11:00 PM
              </h3>
              <p className="text-gray-600">
                Choose from our menu and submit your order before the daily
                cutoff time.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 card-hover">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-orange-600 text-xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Enjoy Your Lunch
              </h3>
              <p className="text-gray-600">
                Your sandwich will be freshly prepared and delivered for
                lunchtime.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="w-full max-w-4xl bg-gradient-to-r from-orange-500 to-amber-600 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8 md:p-10 text-center text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Order?
            </h2>
            <p className="text-lg mb-6 max-w-2xl mx-auto">
              Satisfy your hunger with our delicious sandwich selection. Sign up
              now to start ordering!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center bg-white text-orange-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
              >
                Register Now
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center bg-orange-600/20 hover:bg-orange-600/30 border border-white/40 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
              >
                Log In
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-gray-600 text-sm">
        <p>
          &copy; {new Date().getFullYear()} RCSandwitch. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
