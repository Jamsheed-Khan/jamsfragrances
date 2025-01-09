import React, { useState, useEffect } from "react";
import { db } from "../firebase"; // Ensure proper Firebase setup
import { doc, getDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";

const OrderStatus = () => {
  const { orderId } = useParams(); // Assuming orderId is passed in the URL
  const [orderData, setOrderData] = useState(null);
  const [trackingId, setTrackingId] = useState("");
  const [formError, setFormError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch order data from Firestore
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (orderId) {
        try {
          const orderRef = doc(db, "orders", orderId);
          const orderSnap = await getDoc(orderRef);
          if (orderSnap.exists()) {
            setOrderData(orderSnap.data());
          } else {
            console.error("No such order found!");
          }
        } catch (error) {
          console.error("Error fetching order:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchOrderDetails();
  }, [orderId]);

  // Handle tracking ID submission
  const handleTrackingSubmit = () => {
    if (trackingId !== orderData?.trackingId) {
      setFormError("Invalid tracking ID. Please try again.");
    } else {
      setFormError("");
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Order Status</h2>

      {isLoading ? (
        <p>Loading order details...</p>
      ) : (
        <>
          {/* Order Tracking Section */}
          <div className="bg-white shadow-md p-6 rounded-lg mb-6">
            <h3 className="text-xl font-semibold mb-4">Track Your Order</h3>
            <input
              type="text"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              placeholder="Enter your tracking ID"
              className="p-2 border rounded mb-2 w-full"
            />
            <button
              onClick={handleTrackingSubmit}
              className="bg-blue-500 text-white p-2 rounded w-full"
            >
              Track Order
            </button>
            {formError && <p className="text-red-500 mt-2">{formError}</p>}
          </div>

          {/* Order Details */}
          {orderData && (
            <div className="bg-gray-100 shadow-md p-6 rounded-lg">
              <h3 className="text-lg font-bold mb-2">Order Information</h3>
              <p className="mb-2">
                <strong>Order ID:</strong> {orderData.trackingId}
              </p>
              <p className="mb-2">
                <strong>Payment Status:</strong> {orderData.status}
              </p>
              <p className="mb-2">
                <strong>Payment Method:</strong> {orderData.paymentMethod}
              </p>

              <h4 className="text-lg font-bold mb-2">Delivery Status</h4>
              <ul>
                <li>
                  <strong>Pending:</strong> {orderData.deliveryStatus?.pending ? "Yes" : "No"}
                </li>
                <li>
                  <strong>Packed:</strong> {orderData.deliveryStatus?.packed ? "Yes" : "No"}
                </li>
                <li>
                  <strong>Shipped:</strong> {orderData.deliveryStatus?.shipped ? "Yes" : "No"}
                </li>
                <li>
                  <strong>Estimated Delivery:</strong> {orderData.deliveryStatus?.estimatedDate}
                </li>
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default OrderStatus;
