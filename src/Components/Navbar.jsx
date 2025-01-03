import React, { useState, useEffect } from "react";
import { MdMenu, MdClose, MdShoppingCart } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, query, onSnapshot } from "firebase/firestore";
import jamsfrag from "../Assets/jamsfrag.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();
  const userId = auth.currentUser?.uid;

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    document.body.style.overflow = isOpen ? "auto" : "hidden";
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [auth]);

  const handleLogout = async () => {
    await signOut(auth);
    setIsOpen(false);
    navigate("/");
  };

  useEffect(() => {
    if (!userId) return;

    const cartRef = collection(db, "users", userId, "cart");
    const q = query(cartRef);

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedCartItems = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCartItems(fetchedCartItems);
    });

    return () => unsubscribe(); // Clean up the listener when the component unmounts
  }, [userId, db]);

  const handleCartClick = () => {
    navigate("/cart"); // Navigate to the cart page directly
  };

  return (
    <>
      <nav className="bg-white py-4 px-6 md:px-12 flex justify-between items-center shadow-lg fixed top-0 w-full z-50">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/">
            <img src={jamsfrag} alt="Logo" className="h-16 md:h-20" />
          </Link>
        </div>

        {/* Mobile Menu and Cart */}
        <div className="md:hidden flex items-center space-x-4 ml-auto">
          <button onClick={handleCartClick} className="text-gray-700 relative">
            <MdShoppingCart className="h-6 w-6" />
            {cartItems.length > 0 && (
              <span className="absolute top-0 right-0 text-xs text-white bg-red-500 rounded-full w-5 h-5 flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </button>
          <button onClick={toggleMenu} className="text-gray-700">
            {isOpen ? <MdClose className="h-7 w-7" /> : <MdMenu className="h-7 w-7" />}
          </button>
        </div>

        {/* Navigation Links */}
        <ul
          className={`md:flex items-center md:space-x-8 text-gray-700 font-medium absolute md:static w-full md:w-auto bg-white top-0 md:top-auto left-0 md:left-auto transition-transform duration-300 ease-in-out ${
            isOpen
              ? "flex flex-col items-center space-y-6 mt-20 bg-white shadow-lg py-6 md:py-0 w-full h-screen fixed top-0 left-0 z-50"
              : "hidden md:flex"
          }`}
        >
          <li>
            <Link
              to="/"
              className="hover:text-gray-500 transition-colors duration-200 py-2"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className="hover:text-gray-500 transition-colors duration-200 py-2"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
          </li>
          <li>
            <Link
              to="/services"
              className="hover:text-gray-500 transition-colors duration-200 py-2"
              onClick={() => setIsOpen(false)}
            >
              Services
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              className="hover:text-gray-500 transition-colors duration-200 py-2"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
          </li>
          <li className="md:hidden">
            {user ? (
              <button
                className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition duration-300"
                onClick={handleLogout}
              >
                Logout
              </button>
            ) : (
              <button
                className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition duration-300"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
            )}
          </li>
        </ul>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <button onClick={handleCartClick} className="text-gray-700 relative">
            <MdShoppingCart className="h-7 w-7" />
            {cartItems.length > 0 && (
              <span className="absolute top-0 right-0 text-xs text-white bg-red-500 rounded-full w-5 h-5 flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </button>
          {user ? (
            <button
              className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition duration-300"
              onClick={handleLogout}
            >
              Logout
            </button>
          ) : (
            <button
              className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition duration-300"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          )}
        </div>
      </nav>
      <main className="mt-28">
      
    </main>
    </>
  );
};

export default Navbar;
