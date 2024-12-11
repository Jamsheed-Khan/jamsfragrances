import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { motion } from "framer-motion";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const auth = getAuth();
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!userId) {
        setError("User not authenticated");
        setIsLoading(false);
        return;
      }

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
        setError("Failed to load cart items");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCartItems();
  }, [userId]);

  const calculateTotal = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  // Increase quantity
  const increaseQuantity = async (itemId, currentQuantity) => {
    const itemRef = doc(db, "users", userId, "cart", itemId);
    await updateDoc(itemRef, {
      quantity: currentQuantity + 1,
    });
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity: currentQuantity + 1 } : item
      )
    );
  };

  // Decrease quantity
  const decreaseQuantity = async (itemId, currentQuantity) => {
    if (currentQuantity > 1) {
      const itemRef = doc(db, "users", userId, "cart", itemId);
      await updateDoc(itemRef, {
        quantity: currentQuantity - 1,
      });
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId ? { ...item, quantity: currentQuantity - 1 } : item
        )
      );
    }
  };

  // Remove item from cart
  const removeItem = async (itemId) => {
    const itemRef = doc(db, "users", userId, "cart", itemId);
    await deleteDoc(itemRef);
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">Your Cart</h1>

      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <p>Loading your cart...</p>
          </motion.div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 mt-16">
          <p>{error}</p>
        </div>
      ) : cartItems.length === 0 ? (
        <div className="text-center text-gray-500 mt-16">
          <p>Your cart is empty.</p>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {cartItems.map((item) => (
              <motion.div
                key={item.id}
                className="border rounded-lg shadow-lg p-4 bg-white hover:shadow-xl transition-shadow duration-300"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h2 className="font-bold text-lg mb-2">{item.name}</h2>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <button
                      onClick={() => decreaseQuantity(item.id, item.quantity)}
                      className="px-3 py-1 text-white bg-red-600 rounded-md mr-2 hover:bg-red-700"
                    >
                      -
                    </button>
                    <span className="text-gray-700">{item.quantity}</span>
                    <button
                      onClick={() => increaseQuantity(item.id, item.quantity)}
                      className="px-3 py-1 text-white bg-green-600 rounded-md ml-2 hover:bg-green-700"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-600 font-bold hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
                <p className="text-gray-700 text-sm mb-4">Price: ${item.price}</p>
                <p className="text-gray-700 text-sm mb-4">
                  Total: ${item.price * item.quantity}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 text-right">
            <h2 className="text-xl font-bold">
              Total Amount: ${calculateTotal().toFixed(2)}
            </h2>
            <button className="mt-4 px-6 py-3 text-white bg-blue-600 rounded-full hover:bg-blue-700">
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
