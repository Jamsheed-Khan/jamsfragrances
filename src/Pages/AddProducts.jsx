import React, { useState, useEffect } from "react";
import { storage, db, auth } from "../firebase"; // Include `auth` for user info
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const AddProduct = () => {
  const [userId, setUserId] = useState(null); // Store the user ID
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch the user ID when the component mounts
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null); // Reset if no user is logged in
      }
    });

    return () => unsubscribe(); // Cleanup on component unmount
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!userId) {
        alert("You must be logged in to add a product.");
        setLoading(false);
        return;
      }

      if (!image) {
        alert("Please select an image.");
        setLoading(false);
        return;
      }

      // Derive a unique product ID (e.g., based on timestamp)
      const productId = `PRODUCT-${Date.now()}`;

      // Upload image to Firebase Storage
      const storageRef = ref(storage, `products/${Date.now()}-${image.name}`);
      const snapshot = await uploadBytes(storageRef, image);
      const imageUrl = await getDownloadURL(snapshot.ref);

      // Add product details to Firestore
      await setDoc(doc(db, "products", productId), {
        productId, // Explicit product ID
        userId, // Store the user ID
        name: productName,
        description,
        price: parseFloat(price),
        discount: parseFloat(discount),
        imageUrl,
        category, // Save the category
        createdAt: serverTimestamp(), // Use Firestore's server timestamp
      });

      alert("Product added successfully!");
      setProductName("");
      setDescription("");
      setPrice("");
      setDiscount("");
      setCategory("");
      setImage(null);
    } catch (error) {
      console.error("Error adding product: ", error);
      alert("Failed to add product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-lg rounded-md">
      <h2 className="text-2xl font-semibold mb-4">Add New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Product Name</label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded"
            required
          ></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium">Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Discount</label>
          <input
            type="number"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Category</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
            <option value="Accessories">Accessories</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Product Image</label>
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
