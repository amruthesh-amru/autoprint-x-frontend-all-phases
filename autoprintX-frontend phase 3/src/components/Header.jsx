import { Link, useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi"; // Using Feather icons from React Icons
import { useState } from "react";
import axios from "axios";
import { API } from "@/utils/api";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const handleLogout = async () => {
    const response = await axios.post(
      API.LOGOUT,
      {},
      { withCredentials: true }
    );
    if (response.data.success) {
      navigate("/login");
    } else {
      alert("unable to logout");
    }
  };
  return (
    <header className="bg-white shadow-md sticky w-full z-10">
      <nav className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-indigo-600">Auto</span>
              <span className="text-2xl font-bold text-gray-800">Print X</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/how-it-works"
              className="text-gray-600 hover:text-indigo-600 transition-colors"
            >
              How It Works
            </Link>
            <Link
              to="/pricing"
              className="text-gray-600 hover:text-indigo-600 transition-colors"
            >
              Pricing
            </Link>
            <Link
              to="/contact"
              className="text-gray-600 hover:text-indigo-600 transition-colors"
            >
              Contact
            </Link>
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/login"
              className="px-4 py-2 text-gray-600 hover:text-indigo-600 transition-colors"
            >
              Sign In
            </Link>
            <button
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-indigo-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <FiX className="w-6 h-6" />
            ) : (
              <FiMenu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute w-full bg-white shadow-lg py-4">
            <div className="px-4 space-y-4">
              <Link
                to="/how-it-works"
                className="block text-gray-600 hover:text-indigo-600"
              >
                How It Works
              </Link>
              <Link
                to="/pricing"
                className="block text-gray-600 hover:text-indigo-600"
              >
                Pricing
              </Link>
              <Link
                to="/contact"
                className="block text-gray-600 hover:text-indigo-600"
              >
                Contact
              </Link>
              <div className="border-t pt-4">
                <Link
                  to="/login"
                  className="block text-gray-600 hover:text-indigo-600"
                >
                  Sign In
                </Link>
                <button
                  className="mt-2 block px-4 py-2 bg-indigo-600 text-white rounded-lg text-center hover:bg-indigo-700"
                  onClick={handleLogout}
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
