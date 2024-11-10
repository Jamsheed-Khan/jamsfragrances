import React, { useState } from "react";
// Importing Menu and Close icons from react-icons
import { MdMenu, MdClose } from "react-icons/md";
// Import Link from react-router-dom
import { Link } from "react-router-dom";
import jamsfrag from "../Assets/jamsfrag.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md py-4 px-6 md:px-12 flex justify-between items-center rounded-lg md:rounded-none">
      {/* Logo (Image) */}
      <div className="flex items-center">
        <Link to="/">
          <img
            src={jamsfrag} // Path to your logo image
            alt="Logo"
            className="h-12 md:h-16" // Increased logo height
          />
        </Link>
      </div>

      {/* Mobile Navbar - Hamburger and Login Button */}
      <div className="md:hidden flex items-center space-x-4 ml-auto">
        <button className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition duration-300">
          Login
        </button>
        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-800">
          {isOpen ? (
            <MdClose className="h-7 w-7" />
          ) : (
            <MdMenu className="h-7 w-7" />
          )}
        </button>
      </div>

      {/* Navigation Links */}
      <ul
        className={`md:flex items-center space-x-8 text-gray-800 font-medium absolute md:static w-full md:w-auto bg-white md:bg-transparent top-16 left-0 md:left-auto md:space-x-8 transition-transform duration-300 ease-in-out ${
          isOpen
            ? "flex flex-col items-center space-y-4 mt-4 absolute right-0 top-0 w-2/3 h-full bg-white shadow-lg transform translate-x-0"
            : "transform translate-x-full"
        }`}
      >
        <li className="relative group">
          <Link
            to="/"
            className="hover:text-green-600 transition-colors duration-200 py-2"
            onClick={() => setIsOpen(false)} // Close menu on link click
          >
            Home
          </Link>
          <div className="absolute left-0 bottom-0 w-full h-[2px] bg-green-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
        </li>
        <li className="py-2">
          <Link
            to="/about"
            className="hover:text-green-600 transition-colors duration-200"
            onClick={() => setIsOpen(false)} // Close menu on link click
          >
            About
          </Link>
        </li>
        <li className="py-2">
          <Link
            to="/services"
            className="hover:text-green-600 transition-colors duration-200"
            onClick={() => setIsOpen(false)} // Close menu on link click
          >
            Services
          </Link>
        </li>
        <li className="py-2">
          <Link
            to="/contact"
            className="hover:text-green-600 transition-colors duration-200"
            onClick={() => setIsOpen(false)} // Close menu on link click
          >
            Contact
          </Link>
        </li>
      </ul>

      {/* Login Button (visible on desktop screens only) */}
      <button className="hidden md:block bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition duration-300">
        Login
      </button>
    </nav>
  );
};

export default Navbar;
