import React, { useState } from "react";
import { MdMenu, MdClose, MdShoppingCart } from "react-icons/md";
import { Link } from "react-router-dom";
import jamsfrag from "../Assets/jamsfrag.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Function to toggle the mobile menu
  const toggleMenu = () => {
    setIsOpen(!isOpen);
    // Disable scrolling on the body when the menu is open
    if (!isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  };

  return (
    <nav className="bg-white shadow-md py-4 px-6 md:px-12 flex justify-between items-center rounded-lg md:rounded-none relative">
      {/* Logo */}
      <div className="flex items-center">
        <Link to="/">
          <img src={jamsfrag} alt="Logo" className="h-12 md:h-16" />
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center space-x-4 ml-auto">
        <Link to="/cart" className="text-gray-800">
          <MdShoppingCart className="h-6 w-6" />
        </Link>
        <button onClick={toggleMenu} className="text-gray-800">
          {isOpen ? (
            <MdClose className="h-7 w-7" />
          ) : (
            <MdMenu className="h-7 w-7" />
          )}
        </button>
      </div>

      {/* Navigation Links */}
      <ul
        className={`md:flex items-center md:space-x-8 text-gray-800 font-medium absolute md:static w-full md:w-auto bg-white md:bg-transparent top-0 md:top-auto left-0 md:left-auto transition-transform duration-300 ease-in-out ${
          isOpen
            ? "flex flex-col items-center space-y-6 mt-20 bg-white shadow-lg py-6 md:py-0 w-2/3 h-screen fixed top-0 left-0 z-50"
            : "transform translate-x-full md:translate-x-0"
        }`}
      >
        <li>
          <Link
            to="/"
            className="hover:text-green-600 transition-colors duration-200 py-2"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/about"
            className="hover:text-green-600 transition-colors duration-200 py-2"
            onClick={() => setIsOpen(false)}
          >
            About
          </Link>
        </li>
        <li>
          <Link
            to="/services"
            className="hover:text-green-600 transition-colors duration-200 py-2"
            onClick={() => setIsOpen(false)}
          >
            Services
          </Link>
        </li>
        <li>
          <Link
            to="/contact"
            className="hover:text-green-600 transition-colors duration-200 py-2"
            onClick={() => setIsOpen(false)}
          >
            Contact
          </Link>
        </li>
        <li className="md:hidden">
          <button
            className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition duration-300"
            onClick={() => setIsOpen(false)}
          >
            Login
          </button>
        </li>
      </ul>

      {/* Right Section (Desktop Only) */}
      <div className="hidden md:flex items-center space-x-4">
        <Link to="/cart" className="text-gray-800">
          <MdShoppingCart className="h-7 w-7" />
        </Link>
        <button className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition duration-300">
          Login
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
