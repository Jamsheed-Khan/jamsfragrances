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
      <footer className="bg-white text-gray-700 w-full mt-8">
       

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
