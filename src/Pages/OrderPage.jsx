import React, { useState, useEffect } from "react";
import { db } from "../firebase"; // Ensure proper Firebase setup
import { collection, addDoc, doc, getDoc } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";

const OrderPage = () => {
  const { productId } = useParams(); // Assuming productId is passed in the URL
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    postalCode: "",
    city: "",
  });
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // Fetch selected product details
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (productId) {
        try {
          const productRef = doc(db, "products", productId);
          const productSnap = await getDoc(productRef);
          if (productSnap.exists()) {
            setSelectedProduct(productSnap.data());
          } else {
            console.error("No such product found!");
          }
        } catch (error) {
          console.error("Error fetching product:", error);
        }
      }
    };
    fetchProductDetails();
  }, [productId]);

  // Handle input changes for shipping info
  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo({ ...shippingInfo, [name]: value });
  };

  // Handle payment details change
  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails({ ...paymentDetails, [name]: value });
  };

  // Validate shipping form
  const validateShipping = () => {
    const errors = {};
    if (!shippingInfo.name.trim()) errors.name = "Name is required.";
    if (!shippingInfo.email.trim() || !/\S+@\S+\.\S+/.test(shippingInfo.email))
      errors.email = "Valid email is required.";
    if (!shippingInfo.phone.trim() || !/^\d{10,15}$/.test(shippingInfo.phone))
      errors.phone = "Valid phone number is required.";
    if (!shippingInfo.address.trim()) errors.address = "Address is required.";
    if (!shippingInfo.postalCode.trim() || !/^\d{5}$/.test(shippingInfo.postalCode))
      errors.postalCode = "Valid postal code is required.";
    if (!shippingInfo.city.trim()) errors.city = "City is required.";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit Shipping Info
  const handleShippingSubmit = () => {
    if (validateShipping()) {
      setIsModalOpen(true);
    }
  };

  // Submit Payment Info
  const handlePaymentSubmit = async () => {
    if (paymentMethod === "debit") {
      if (
        !paymentDetails.cardHolder ||
        !paymentDetails.cardNumber.match(/^\d{16}$/) ||
        !paymentDetails.expiryDate.match(/^(0[1-9]|1[0-2])\/\d{2}$/) ||
        !paymentDetails.cvv.match(/^\d{3}$/)
      ) {
        alert("Please fill all card details correctly.");
        return;
      }
    } else if (paymentMethod === "easypaisa" || paymentMethod === "jazzcash") {
      if (!paymentDetails.tid || !paymentDetails.screenshot) {
        alert("Please provide Transaction ID and Screenshot.");
        return;
      }
    }

    // Store data in Firestore
    const orderData = {
      shippingInfo,
      paymentMethod,
      paymentDetails,
      status: "Pending",
      trackingId: `ORD-${Date.now()}`,
    };
    try {
      const docRef = await addDoc(collection(db, "orders"), orderData);
      alert("Order placed successfully!");
      navigate(`/orderstatus/${docRef.id}`);
    } catch (error) {
      console.error("Error saving order:", error);
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Shipping Information */}
      <div className="bg-white shadow-md p-6 rounded-lg md:col-span-2">
        <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
        <form className="grid gap-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="p-2 border rounded"
            value={shippingInfo.name}
            onChange={handleShippingChange}
          />
          {formErrors.name && <p className="text-red-500">{formErrors.name}</p>}
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="p-2 border rounded"
            value={shippingInfo.email}
            onChange={handleShippingChange}
          />
          {formErrors.email && <p className="text-red-500">{formErrors.email}</p>}
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            className="p-2 border rounded"
            value={shippingInfo.phone}
            onChange={handleShippingChange}
          />
          {formErrors.phone && <p className="text-red-500">{formErrors.phone}</p>}
          <input
            type="text"
            name="address"
            placeholder="Address"
            className="p-2 border rounded"
            value={shippingInfo.address}
            onChange={handleShippingChange}
          />
          {formErrors.address && <p className="text-red-500">{formErrors.address}</p>}
          <input
            type="text"
            name="postalCode"
            placeholder="Postal Code"
            className="p-2 border rounded"
            value={shippingInfo.postalCode}
            onChange={handleShippingChange}
          />
          {formErrors.postalCode && <p className="text-red-500">{formErrors.postalCode}</p>}
          <input
            type="text"
            name="city"
            placeholder="City"
            className="p-2 border rounded"
            value={shippingInfo.city}
            onChange={handleShippingChange}
          />
          {formErrors.city && <p className="text-red-500">{formErrors.city}</p>}
        </form>
        <button
          className="mt-4 w-full bg-blue-500 text-white p-2 rounded"
          onClick={handleShippingSubmit}
        >
          Proceed to Payment
        </button>
      </div>
      {/* Payment Modal */}
      {isModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg max-w-md w-full">
      <h2 className="text-xl font-bold mb-4">Select Payment Method</h2>
      
      {/* Payment Method Buttons */}
      <div className="flex flex-col gap-4 mb-4">
        <button
          className={`p-2 rounded ${
            paymentMethod === "debit" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setPaymentMethod("debit")}
        >
          Debit/Credit Card
        </button>
        <button
          className={`p-2 rounded ${
            paymentMethod === "easypaisa" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setPaymentMethod("easypaisa")}
        >
          EasyPaisa
        </button>
        <button
          className={`p-2 rounded ${
            paymentMethod === "jazzcash" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setPaymentMethod("jazzcash")}
        >
          JazzCash
        </button>
        <button
          className={`p-2 rounded ${
            paymentMethod === "cash" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setPaymentMethod("cash")}
        >
          Cash on Delivery
        </button>
      </div>

      {/* Payment Details */}
      {paymentMethod === "debit" && (
        <div className="grid gap-4">
          <input
            type="text"
            name="cardHolder"
            placeholder="Card Holder Name"
            className="p-2 border rounded"
            onChange={handlePaymentChange}
          />
          <input
            type="text"
            name="cardNumber"
            placeholder="Card Number"
            className="p-2 border rounded"
            onChange={handlePaymentChange}
          />
          <input
            type="text"
            name="expiryDate"
            placeholder="Expiry Date (MM/YY)"
            className="p-2 border rounded"
            onChange={handlePaymentChange}
          />
          <input
            type="password"
            name="cvv"
            placeholder="CVV"
            className="p-2 border rounded"
            onChange={handlePaymentChange}
          />
        </div>
      )}

      {paymentMethod === "easypaisa" || paymentMethod === "jazzcash" ? (
        <div className="grid gap-4">
          <p>
            Send payment to <strong>Jamsheed Khan</strong> -{" "}
            <strong>03413675172</strong>
          </p>
          <input
            type="text"
            name="tid"
            placeholder="Transaction ID"
            className="p-2 border rounded"
            onChange={handlePaymentChange}
          />
          <input
            type="file"
            name="screenshot"
            accept="image/*"
            className="p-2 border rounded"
            onChange={(e) =>
              setPaymentDetails({
                ...paymentDetails,
                screenshot: e.target.files[0],
              })
            }
          />
        </div>
      ) : null}

      {paymentMethod === "cash" && (
        <p className="text-sm">You can pay upon delivery.</p>
      )}

      <div className="mt-4 flex gap-2">
        <button
          className="bg-blue-500 text-white p-2 rounded w-full"
          onClick={handlePaymentSubmit}
        >
          Confirm Order
        </button>
        <button
          className="bg-red-500 text-white p-2 rounded w-full"
          onClick={() => setIsModalOpen(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}


      {/* Product Details */}
      <div className="bg-gray-100 shadow-md p-6 rounded-lg">
  {selectedProduct ? (
    <div>
      <div className="w-full h-48 overflow-hidden rounded mb-4">
        <img
          src={selectedProduct.imageUrl}
          alt={selectedProduct.name}
          className="w-full h-full object-contain"
        />
      </div>
      <h3 className="text-lg font-bold mb-2">{selectedProduct.name}</h3>
      <p className="text-sm mb-2">{selectedProduct.description}</p>
      <p className="text-lg font-bold text-blue-500 mb-2">
        RS.{selectedProduct.price}
      </p>
      {selectedProduct.discount ? (
        <p className="text-lg font-bold text-green-500">
          Discounted Price: RS.
          {(
            selectedProduct.price -
            (selectedProduct.price * selectedProduct.discount) / 100
          ).toFixed(2)}
        </p>
      ) : (
        <p className="text-sm text-gray-500">No discount available</p>
      )}
    </div>
  ) : (
    <p>Loading product details...</p>
  )}
</div>

    </div>
  );
};

export default OrderPage;
