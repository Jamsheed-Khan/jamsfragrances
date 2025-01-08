import React from "react";
import { useNavigate } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Main Content */}
      <div className="flex-grow">
        {/* Your page content goes here */}
      </div>

      {/* Footer */}
      <footer className="bg-white text-gray-700 w-full mt-auto">
        {/* Top Section */}
        <div className="text-center py-8 px-4">
          <h3 className="text-lg font-bold uppercase mb-2 text-gray-800">Join Our Community</h3>
          <p className="text-sm mb-4 text-gray-600">
            We’re 700+ strong. Join us by entering your email address. We’ll be sending our stories.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-green-500 w-full sm:w-64"
            />
            <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition duration-300 w-full sm:w-auto">
              Subscribe
            </button>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="bg-gray-800 text-center py-6">
          <div className="flex justify-center items-center space-x-4 mb-4">
            <button
              onClick={() => handleNavigation("/facebook")}
              className="text-white hover:text-gray-200 transition"
            >
              <FaFacebook className="h-6 w-6" />
            </button>
            <button
              onClick={() => handleNavigation("/twitter")}
              className="text-white hover:text-gray-200 transition"
            >
              <FaTwitter className="h-6 w-6" />
            </button>
            <button
              onClick={() => handleNavigation("/instagram")}
              className="text-white hover:text-gray-200 transition"
            >
              <FaInstagram className="h-6 w-6" />
            </button>
            <button
              onClick={() => handleNavigation("/linkedin")}
              className="text-white hover:text-gray-200 transition"
            >
              <FaLinkedin className="h-6 w-6" />
            </button>
          </div>
          <div className="flex flex-wrap justify-center space-x-4 text-sm text-gray-300">
            <button
              onClick={() => handleNavigation("/")}
              className="hover:text-gray-200"
            >
              Archives
            </button>
            <span className="text-gray-400">|</span>
            <button
              onClick={() => handleNavigation("/contributors")}
              className="hover:text-gray-200"
            >
              Contributors
            </button>
            <span className="text-gray-400">|</span>
            <button
              onClick={() => handleNavigation("/contact")}
              className="hover:text-gray-200"
            >
              Contact
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            All content copyright © {new Date().getFullYear()} JamsFragrances. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
