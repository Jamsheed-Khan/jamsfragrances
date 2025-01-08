import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null); // Store userId after authentication

  useEffect(() => {
    const auth = getAuth();

    // Set up an authentication state listener to handle user login state
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid); // Set userId if user is authenticated
      } else {
        setError("User not authenticated");
      }
      setIsLoading(false); // Once we know the user status, set loading to false
    });

    return () => unsubscribeAuth(); // Clean up the listener on component unmount
  }, []);

  useEffect(() => {
    if (!userId) return; // Don't fetch data if the user isn't authenticated

    const cartRef = collection(db, "users", userId, "cart");

    const unsubscribe = onSnapshot(
      cartRef,
      (querySnapshot) => {
        const fetchedCartItems = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCartItems(fetchedCartItems);
        setIsLoading(false);
      },
      (error) => {
        console.error("Error fetching cart items:", error);
        setError("Failed to load cart items");
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]); // Run the second useEffect when userId is updated

  const calculateTotal = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const updateQuantity = async (itemId, newQuantity) => {
    try {
      const itemRef = doc(db, "users", userId, "cart", itemId);
      await updateDoc(itemRef, { quantity: newQuantity });
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const removeItem = async (itemId) => {
    try {
      const itemRef = doc(db, "users", userId, "cart", itemId);
      await deleteDoc(itemRef);
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const handleOrder = (item) => {
    // Handle order logic here (e.g., updating database, showing confirmation)
    alert(`Ordered ${item.name}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">Shopping Cart</h1>

      {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : cartItems.length === 0 ? (
        <div className="text-center text-gray-500">Your cart is empty.</div>
      ) : (
        <div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-primary text-black">
                  <th className="p-3 border">Remove</th>
                  <th className="p-3 border">Image</th>
                  <th className="p-3 border">Product</th>
                  <th className="p-3 border">Price</th>
                  <th className="p-3 border">Quantity</th>
                  <th className="p-3 border">Total</th>
                  <th className="p-3 border">Order</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.id} className="text-center">
                    <td className="p-3 border">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        🗑️
                      </button>
                    </td>
                    <td className="p-3 border">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-16 h-16 object-cover mx-auto"
                      />
                    </td>
                    <td className="p-3 border">{item.name}</td>
                    <td className="p-3 border">${item.price.toFixed(2)}</td>
                    <td className="p-3 border">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() =>
                            item.quantity > 1 && updateQuantity(item.id, item.quantity - 1)
                          }
                          className="px-2 py-1 bg-gray-200 hover:bg-gray-300"
                        >
                          -
                        </button>
                        <span className="mx-2">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 bg-gray-200 hover:bg-gray-300"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="p-3 border">
                      ${(item.price * item.quantity).toFixed(2)}
                    </td>
                    <td className="p-3 border">
                      <button
                        onClick={() => handleOrder(item)}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Order
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <div className="border p-4">
              <h2 className="font-bold mb-2">COUPON</h2>
              <p className="text-gray-500 text-sm mb-2">
                Enter your coupon code if you have one.
              </p>
              <div className="flex flex-col sm:flex-row">
                <input
                  type="text"
                  className="flex-1 border p-2 mr-2 mb-2 sm:mb-0"
                  placeholder="Coupon Code"
                />
                <button className="bg-gradient-to-br from-pink-400 to-red-400 border text-black px-4 py-2">
                  APPLY COUPON
                </button>
              </div>
            </div>

            <div className="border p-4">
              <h2 className="font-bold mb-2">CART TOTAL</h2>
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Shipping</span>
                <span>$50.00</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${(calculateTotal() + 50).toFixed(2)}</span>
              </div>
              <button className="bg-gradient-to-br from-pink-400 to-red-400 border text-black w-full mt-4 py-2">
                PROCEED TO CHECKOUT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
