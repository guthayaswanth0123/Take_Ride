import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export default function Success() {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-green-50 min-h-screen flex items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
          {/* Decorative header strip */}
          <div className="h-2 bg-gradient-to-r from-primary to-blue-500"></div>

          <div className="px-8 py-8">
            {/* Success icon with animation */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center animate-pulse">
                  <svg
                    className="w-16 h-16 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
                {/* Outer ring */}
                <div className="absolute inset-0 rounded-full border-4 border-green-200 animate-ping opacity-75"></div>
              </div>
            </div>

            {/* Success message */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold font-primary text-gray-800 mb-2">
                Payment Successful!
              </h2>
              <p className="text-lg font-secondary text-gray-600 mb-4">
                Thank you for your purchase. Your order has been confirmed.
              </p>
              <p className="text-gray-500 font-secondary">
                We've sent the invoice to your email address.
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/rider/live-tracking"
                className="flex items-center justify-center flex-1 py-3 px-4 bg-white border-2 border-gray-300 hover:bg-gray-100 text-gray-700 rounded-md transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
              >
                <MapPin/>
                See live tracking
              </Link>
               <Link
                to="/"
                className="flex items-center justify-center flex-1 py-3 px-4 bg-white border-2 border-gray-300 hover:bg-gray-100 text-gray-700 rounded-md transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  ></path>
                </svg>
                Go to Home
              </Link>
            </div>

            {/* Additional info */}
            <p className="text-center mt-8 text-sm text-gray-500">
              Need help?{" "}
              <a
                href="#"
                className="text-blue-600 hover:text-blue-800 transition-colors duration-300"
              >
                Contact support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
