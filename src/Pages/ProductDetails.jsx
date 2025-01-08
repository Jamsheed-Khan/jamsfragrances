import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useParams } from "react-router-dom";

const ProductDetails = () => {
  const [product, setProduct] = useState(null);
  const location = useLocation();
  const { productId } = useParams();

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (productId) {
        try {
          const productRef = doc(db, "products", productId);
          const productSnap = await getDoc(productRef);
  
          if (productSnap.exists()) {
            setProduct(productSnap.data());
          } else {
            console.error("No product found!");
          }
        } catch (error) {
          console.error("Error fetching product:", error);
        }
      }
    };
  
    fetchProductDetails();
  }, [productId]);
  

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600 text-xl">Loading product details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 flex flex-col lg:flex-row gap-8">
      {/* Left Section */}
      <div className="w-full lg:w-1/2">
        <div className="border p-2 rounded-lg">
          <img
            src={product.imageUrl || "https://via.placeholder.com/500"}
            alt={product.name}
            className="w-full rounded-lg"
          />
        </div>
        <div className="flex gap-2 mt-4">
          {product.additionalImages?.map((url, index) => (
            <img
              key={index}
              src={url || "https://via.placeholder.com/100"}
              alt={`Thumbnail ${index + 1}`}
              className="w-20 h-20 rounded-lg border cursor-pointer"
            />
          ))}
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full lg:w-1/2 space-y-4">
        <h1 className="text-2xl font-bold">{product.name}</h1>
        <div className="flex items-center gap-2">
          <div className="flex text-yellow-500">
            {[...Array(product.rating || 5)].map((_, i) => (
              <span key={i}>&#9733;</span>
            ))}
          </div>
          <p className="text-gray-500">{product.ratingsCount || 5} Ratings</p>
        </div>
        <p className="text-red-500 text-xl font-bold">Rs. {product.price}</p>
        <p className="line-through text-gray-500">
          Rs. {product.originalPrice || "N/A"}
        </p>
        <p>{product.description}</p>

        <div className="flex gap-4">
          <button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Buy Now
          </button>
          <button className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
