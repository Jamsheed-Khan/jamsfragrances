import React, { useState, useEffect } from "react";
import { MdMenu, MdClose, MdShoppingCart } from "react-icons/md";
import { useNavigate, useLocation } from "react-router-dom";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, doc, getDoc, query, onSnapshot } from "firebase/firestore";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [profilePicture, setProfilePicture] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const auth = getAuth();
  const db = getFirestore();

  const toggleMenu = () => {
    setIsOpen((prevState) => {
      const newState = !prevState;
      document.body.style.overflow = newState ? "hidden" : "auto";
      return newState;
    });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const fetchUserProfile = async () => {
          const userDoc = doc(db, "users", currentUser.uid);
          const userSnap = await getDoc(userDoc);
          if (userSnap.exists()) {
            setProfilePicture(userSnap.data().profilePicture || null);
          }
        };
        fetchUserProfile();
      } else {
        setProfilePicture(null);
      }
    });

    return () => unsubscribe();
  }, [auth, db]);

  const handleLogout = async () => {
    await signOut(auth);
    setIsOpen(false);
    navigate("/");
  };

  useEffect(() => {
    if (!user) return;

    const cartRef = collection(db, "users", user.uid, "cart");
    const q = query(cartRef);

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedCartItems = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCartItems(fetchedCartItems);
    });

    return () => unsubscribe();
  }, [user, db]);

  const handleCartClick = () => {
    setIsOpen(false);
    navigate("/cart");
  };

  const handleProfileClick = () => {
    setIsOpen(false);
    navigate("/profile");
  };
 

  const handleNavigate = (path) => {
    setIsOpen(false);
    document.body.style.overflow = "auto"; // Reset overflow to allow scrolling
    navigate(path);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    return () => {
      document.body.style.overflow = "auto"; // Cleanup on component unmount
    };
  }, []);

  const isOnProfilePage = location.pathname === "/profile";

  return (
    <>
      <nav className="bg-white py-4 px-6 md:px-12 flex justify-between items-center shadow-lg fixed top-0 w-full z-50">
        {/* Name in Stylish Font */}
        <div className="font-pacifico text-2xl md:text-3xl font-semibold text-gray-700">
          <h2 onClick={() => handleNavigate("/")}>JamsFragrances</h2>
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
          {/* Show Profile Picture at the Top in Mobile View */}
          {user && (
            <li className="w-full flex justify-center md:hidden mb-4">
              <img
                src={profilePicture || "https://via.placeholder.com/50"}
                alt="Profile"
                className="h-12 w-12 rounded-full cursor-pointer border-2 border-gray-300"
                onClick={handleProfileClick}
              />
            </li>
          )}
          <li>
            <button
              onClick={() => handleNavigate("/")}
              className="hover:text-gray-500 text-lg transition-colors duration-200 py-2"
              style={{ fontFamily: "Permanent Marker, cursive" }}
            >
              Home
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavigate("/about")}
              className="hover:text-gray-500 text-lg transition-colors duration-200 py-2"
              style={{ fontFamily: "Permanent Marker, cursive" }}
            >
              About
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavigate("/category/:category")}
              className="hover:text-gray-500 text-lg transition-colors duration-200 py-2"
              style={{ fontFamily: "Permanent Marker, cursive" }}
            >
              Category
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavigate("/contact")}
              className="hover:text-gray-500 text-lg transition-colors duration-200 py-2"
              style={{ fontFamily: "Permanent Marker, cursive" }}
            >
              Contact
            </button>
          </li>
          <li className="md:hidden">
            {user ? (
              isOnProfilePage ? (
                <button
                  className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition duration-300"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              ) : (
                <button
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-300 transition duration-300"
                  onClick={handleProfileClick}
                >
                  Profile
                </button>
              )
            ) : null}
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
            isOnProfilePage ? (
              <button
                className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition duration-300"
                onClick={handleLogout}
              >
                Logout
              </button>
            ) : (
              <img
                src={profilePicture || "https://via.placeholder.com/50"}
                alt="Profile"
                className="h-10 w-10 rounded-full cursor-pointer"
                onClick={handleProfileClick}
              />
            )
          ) : (
            <button
              className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition duration-300"
              onClick={() => handleNavigate("/login")}
            >
              Login
            </button>
          )}
        </div>
      </nav>
      <main className="mt-24"></main>
    </>
  );
};

export default Navbar;
