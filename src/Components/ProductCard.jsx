import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig"; 
const ProductCard = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, "products"));
      const productsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productsData);
    };

    fetchProducts();
  }, []);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 px-4 py-8">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition duration-300"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-800">
              {product.name}
            </h2>
            <p className="text-sm text-gray-600 truncate">{product.description}</p>
            <div className="mt-4 flex justify-between items-center">
              <span className="text-xl font-bold text-green-600">
                ${product.price}
              </span>
              <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-300">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductCard;
