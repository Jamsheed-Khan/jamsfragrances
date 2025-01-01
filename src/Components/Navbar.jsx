import React, { useState, useEffect } from "react";
import { MdMenu, MdClose, MdShoppingCart } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import jamsfrag from "../Assets/jamsfrag.png";
import { DialogOverlay, DialogContent } from "@reach/dialog";
import "@reach/dialog/styles.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
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
    const fetchCartItems = async () => {
      if (!userId) return;

      try {
        const cartRef = collection(db, "users", userId, "cart");
        const querySnapshot = await getDocs(cartRef);
        const fetchedCartItems = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCartItems(fetchedCartItems);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    fetchCartItems();
  }, [userId]);

  const toggleCartModal = () => {
    setIsCartOpen(!isCartOpen);
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
        <button onClick={toggleCartModal} className="text-gray-700 relative">
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
        <button onClick={toggleCartModal} className="text-gray-700 relative">
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

      {/* Cart Modal */}
      <DialogOverlay isOpen={isCartOpen} onDismiss={toggleCartModal} style={{ zIndex: 9999 }}>
        <DialogContent className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Your Cart</h2>
          <div className="space-y-4">
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <img src={item.imageUrl} alt={item.name} className="w-12 h-12 object-cover mr-4" />
                    <span>{item.name}</span>
                  </div>
                  <span className="font-semibold">${item.price}</span>
                </div>
              ))
            ) : (
              <p>Your cart is empty.</p>
            )}
          </div>
          <div className="space-y-4">
            <button
              className="mt-4 bg-blue-600 text-white py-2 px-6 rounded-full hover:bg-blue-700 w-full"
              onClick={() => navigate("/cart")}
            >
              Proceed to Checkout
            </button>
            <button
              className="mt-2 text-gray-600 w-full border border-gray-300 py-2 px-6 rounded-full"
              onClick={toggleCartModal}
            >
              Close
            </button>
          </div>
        </DialogContent>
      </DialogOverlay>
   
    </nav>
      <main className="mt-28">
      
    </main></>
  );
};

export default Navbar;
