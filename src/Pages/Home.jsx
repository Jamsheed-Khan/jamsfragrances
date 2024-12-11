import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { motion } from "framer-motion";
import { PuffLoader } from "react-spinners"; // Install react-spinners

const Home = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  const categories = ["all", "men", "women", "kids", "accessories"];

  // Fetch products from Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const fetchedProducts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        // Log fetched products to debug
        console.log("Fetched Products:", fetchedProducts);

        setProducts(fetchedProducts);
        setFilteredProducts(fetchedProducts); // Initially show all products
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false); // Stop loader when data is fetched
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on selected category
  useEffect(() => {
    console.log("Selected Category:", selectedCategory);

    if (selectedCategory === "all") {
      setFilteredProducts(products); // Show all products if category is 'all'
    } else {
      const filtered = products.filter(product => product.category === selectedCategory);
      console.log("Filtered Products:", filtered);
      setFilteredProducts(filtered); // Set filtered products based on category
    }
  }, [selectedCategory, products]);

  return (
    <div className="container mx-auto px-4">
      {/* Loader */}
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <PuffLoader color="#3b82f6" size={60} />
        </div>
      ) : (
        <>
          {/* Category Buttons */}
          <div className="flex flex-wrap justify-center mt-6 space-x-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 text-sm md:text-lg font-medium border rounded-full transition-colors duration-300 
                ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-blue-600 border-gray-300 hover:bg-blue-100"
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>

          {/* Animated Beam */}
          <motion.div
            className="w-full h-2 mt-4 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 rounded-full"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{
              duration: 1,
              ease: "easeInOut",
            }}
          ></motion.div>

          {/* Product Cards */}
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8"
          >
            {filteredProducts.map(product => (
              <motion.div
                key={product.id}
                className="border rounded-lg shadow-lg p-4 bg-white hover:shadow-xl transition-shadow duration-300"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h2 className="font-bold text-lg mb-2">{product.name}</h2>
                <p className="text-gray-700 text-sm mb-4">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-blue-600 font-bold">${product.price}</span>
                  <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700">
                    Add to Cart
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* No Products Message */}
          {filteredProducts.length === 0 && (
            <motion.div
              className="text-center text-gray-500 mt-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <p>No products found in this category.</p>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
