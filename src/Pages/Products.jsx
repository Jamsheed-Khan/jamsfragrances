import React, { useEffect, useState } from "react";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productsArray = [];
        querySnapshot.forEach((doc) => {
          productsArray.push({ id: doc.id, ...doc.data() });
        });
        setProducts(productsArray);
      } catch (err) {
        setError("An error occurred while fetching products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = async (product) => {
    const user = auth.currentUser;

    if (!user) {
      toast.error("Please log in to add items to your cart.", {
        onClose: () => {
          setTimeout(() => {
            navigate("/login");
          }, 1000);
        },
      });
      return;
    }

    try {
      const cartRef = collection(db, "users", user.uid, "cart");
      await addDoc(cartRef, {
        productId: product.id,
        name: product.name,
        price: product.price,
        description: product.description,
        imageUrl: product.imageUrl,
        quantity: 1,
        addedAt: new Date(),
      });
      toast.success(`${product.name} added to cart!`);
    } catch (err) {
      toast.error("Failed to add item to cart. Please try again.");
    }
  };

  if (loading) {
    return <div className="text-center py-10 text-gray-600">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Our Products
      </h1>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <div
            key={product.id}
            className="border rounded-lg p-4 shadow-lg hover:shadow-xl transition duration-300"
          >
            <img
              src={product.imageUrl || "fallback-image-url"}
              alt={product.name || "Product"}
              className="w-full h-48 object-cover rounded-md"
            />
            <h2 className="text-xl font-semibold text-gray-800 mt-4">
              {product.name || "Unnamed Product"}
            </h2>
            <p className="text-gray-600 mt-2">
              {product.description || "No description available."}
            </p>
            <div className="mt-4">
              <span className="text-lg font-bold text-green-600">
                ${product.price || "0.00"}
              </span>
            </div>
            <button
              onClick={() => addToCart(product)}
              className="mt-4 w-full bg-green-600 text-white py-2 rounded-md text-lg font-medium hover:bg-green-700 transition duration-300"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Product;
