import React, { useState, useEffect } from "react";
import { db } from "../firebase"; // Adjust based on Firebase setup
import { doc, getDoc } from "firebase/firestore";
import "./OrderPage.css";
import { useParams } from "react-router-dom";

const OrderPage = () => {
  const [paymentMethod, setPaymentMethod] = useState("debit");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    tid: "",
    screenshot: null,
  });
  const [product, setProduct] = useState(null); // State to hold product details
  const [isFlipped, setIsFlipped] = useState(false);
  const { productId } = useParams(); // Get productId from URL

  // Fetch product details from Firestore
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        console.error("Product ID is missing.");
        return;
      }
      try {
        const productRef = doc(db, "products", productId);
        const productSnap = await getDoc(productRef);
        if (productSnap.exists()) {
          setProduct(productSnap.data());
          console.log("Product fetched:", productSnap.data());
        } else {
          console.error("No such product found in Firestore!");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
  }, [productId]);

  // Input Change Handlers
  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails({ ...cardDetails, [name]: value });
  };

  const handleFormInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleScreenshotUpload = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, screenshot: file });
  };

  const validateFields = () => {
    const errors = {};
    if (paymentMethod === "debit") {
      if (!cardDetails.cardNumber.match(/^\d{16}$/)) {
        errors.cardNumber = "Card number must be 16 digits.";
      }
      if (!cardDetails.cardHolder.trim()) {
        errors.cardHolder = "Card holder name is required.";
      }
      if (!cardDetails.expiryDate.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) {
        errors.expiryDate = "Expiry date must be in MM/YY format.";
      }
      if (!cardDetails.cvv.match(/^\d{3}$/)) {
        errors.cvv = "CVV must be 3 digits.";
      }
    } else if (paymentMethod === "easypaisa" || paymentMethod === "jazzcash") {
      if (!formData.tid.trim()) {
        errors.tid = "Transaction ID is required.";
      }
      if (!formData.screenshot) {
        errors.screenshot = "Screenshot is required.";
      }
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleConfirm = () => {
    if (validateFields()) {
      alert("Payment details submitted successfully!");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row p-4 gap-4">
      {/* Payment Method Selection */}
      <div className="flex-1 bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Select Payment Method</h2>
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            className={`px-4 py-2 rounded ${
              paymentMethod === "debit" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setPaymentMethod("debit")}
          >
            Debit/Credit Card
          </button>
          <button
            className={`px-4 py-2 rounded ${
              paymentMethod === "easypaisa" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setPaymentMethod("easypaisa")}
          >
            EasyPaisa
          </button>
          <button
            className={`px-4 py-2 rounded ${
              paymentMethod === "jazzcash" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setPaymentMethod("jazzcash")}
          >
            JazzCash
          </button>
          <button
            className={`px-4 py-2 rounded ${
              paymentMethod === "cash" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setPaymentMethod("cash")}
          >
            Cash on Delivery
          </button>
        </div>

        {/* Debit/Credit Card Form */}
        {paymentMethod === "debit" && (
          <div>
            {/* Card Design */}
            <div className={`card ${isFlipped ? "flipped" : ""}`}>
              <div className="card-front">
                <h3 className="text-lg font-semibold">Bank Name</h3>
                <p className="text-sm">Card Number: {cardDetails.cardNumber || "XXXX XXXX XXXX XXXX"}</p>
                <p className="text-sm">Card Holder: {cardDetails.cardHolder || "CARD HOLDER"}</p>
                <p className="text-sm">Expiry Date: {cardDetails.expiryDate || "MM/YY"}</p>
              </div>
              <div className="card-back">
                <p className="text-sm">CVV: {cardDetails.cvv || "XXX"}</p>
              </div>
            </div>

            {/* Card Input Form */}
            <form className="grid gap-4 mt-4">
              <input
                type="text"
                name="cardNumber"
                placeholder="Card Number"
                value={cardDetails.cardNumber}
                onChange={handleCardInputChange}
                className="p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              />
              {formErrors.cardNumber && <p className="text-red-500">{formErrors.cardNumber}</p>}
              <input
                type="text"
                name="cardHolder"
                placeholder="Card Holder Name"
                value={cardDetails.cardHolder}
                onChange={handleCardInputChange}
                className="p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              />
              {formErrors.cardHolder && <p className="text-red-500">{formErrors.cardHolder}</p>}
              <input
                type="text"
                name="expiryDate"
                placeholder="Expiry Date (MM/YY)"
                value={cardDetails.expiryDate}
                onChange={handleCardInputChange}
                className="p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              />
              {formErrors.expiryDate && <p className="text-red-500">{formErrors.expiryDate}</p>}
              <input
                type="password"
                name="cvv"
                placeholder="CVV"
                value={cardDetails.cvv}
                onFocus={() => setIsFlipped(true)}
                onBlur={() => setIsFlipped(false)}
                onChange={handleCardInputChange}
                className="p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              />
              {formErrors.cvv && <p className="text-red-500">{formErrors.cvv}</p>}
            </form>
          </div>
        )}

        {/* Easypaisa/JazzCash Form */}
        {(paymentMethod === "easypaisa" || paymentMethod === "jazzcash") && (
          <div>
            <h3 className="text-lg font-bold mb-2">
              Payment via {paymentMethod === "easypaisa" ? "EasyPaisa" : "JazzCash"}
            </h3>
            <p className="text-sm">
              Send payment to account number: <strong>03413675172</strong>
              <br />
              Account Name: <strong>Jamsheed Khan</strong>
            </p>
            <form className="grid gap-4 mt-4">
              <input
                type="text"
                name="tid"
                placeholder="Transaction ID (TID)"
                value={formData.tid}
                onChange={handleFormInputChange}
                className="p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                required
              />
              {formErrors.tid && <p className="text-red-500">{formErrors.tid}</p>}
              <input
                type="file"
                accept="image/*"
                onChange={handleScreenshotUpload}
                className="p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                required
              />
              {formErrors.screenshot && <p className="text-red-500">{formErrors.screenshot}</p>}
            </form>
          </div>
        )}

        {/* Cash on Delivery */}
        {paymentMethod === "cash" && (
          <div>
            <h3 className="text-lg font-bold">Cash on Delivery</h3>
            <p className="text-sm">You can pay for your order upon delivery.</p>
          </div>
        )}

<button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          onClick={handleConfirm}
        >
          Confirm Payment
        </button>
      </div>

      {/* Order Summary */}
      <div className="flex-1 bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Order Summary</h2>
        {product ? (
          <div>
            <img src={product.imageUrl} alt={product.name} className="w-full h-auto mb-4" />
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-sm">{product.description}</p>
            <p className="text-lg font-bold">Price: ${product.price}</p>
            {product.discount && <p className="text-red-500">Discount: {product.discount}%</p>}
            <p className="text-sm">Quantity: {product.quantity}</p>
          </div>
        ) : (
          <p>Loading product details...</p>
        )}
      </div>
    </div>
  );
};

export default OrderPage;
