import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Main Content */}
      <div className="flex-grow">
        {/* Your page content goes here */}
      </div>

      {/* Footer */}
      <footer className="bg-green-600 text-white w-full mt-auto">
        {/* Top Section */}
        <div className="bg-white text-center text-gray-800 py-8 px-4">
          <h3 className="text-lg font-bold uppercase mb-2">Join Our Community</h3>
          <p className="text-sm mb-4">
            We’re 700+ strong. Join us by entering your email address. We’ll be sending our stories.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-green-600 w-full sm:w-64"
            />
            <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition duration-300 w-full sm:w-auto">
              Subscribe
            </button>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="bg-green-700 text-center py-6">
          <div className="flex justify-center items-center space-x-4 mb-4">
            <Link to="/facebook" className="text-white hover:text-gray-200 transition">
              <FaFacebook className="h-6 w-6" />
            </Link>
            <Link to="/twitter" className="text-white hover:text-gray-200 transition">
              <FaTwitter className="h-6 w-6" />
            </Link>
            <Link to="/instagram" className="text-white hover:text-gray-200 transition">
              <FaInstagram className="h-6 w-6" />
            </Link>
            <Link to="/linkedin" className="text-white hover:text-gray-200 transition">
              <FaLinkedin className="h-6 w-6" />
            </Link>
          </div>
          <div className="flex flex-wrap justify-center space-x-4 text-sm">
            <Link to="/" className="hover:text-gray-200">
              Archives
            </Link>
            <span className="text-gray-400">|</span>
            <Link to="/contributors" className="hover:text-gray-200">
              Contributors
            </Link>
            <span className="text-gray-400">|</span>
            <Link to="/contact" className="hover:text-gray-200">
              Contact
            </Link>
          </div>
          <p className="text-xs text-gray-300 mt-4">
            All content copyright © {new Date().getFullYear()} JamsFragrances. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
