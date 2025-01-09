import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { motion } from "framer-motion";
import { PuffLoader } from "react-spinners";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/autoplay';
import { useNavigate } from "react-router-dom";
import jamsfragrance1 from "../Assets/jamsfragrance1.jpg";
import jamsfragrance2 from "../Assets/jamsfragrance2.jpg";
import jamsfragrance3 from "../Assets/jamsfragrance3.jpg";
import jamsfragrance4 from "../Assets/jamsfragrance4.jpg";

const Category = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Man");
  const navigate = useNavigate();

  const adImages = [jamsfragrance1, jamsfragrance2, jamsfragrance3, jamsfragrance4];
  const categories = ["Men", "Women", "Kids"];

  useEffect(() => {
    const fetchProducts = async () => {
      console.log("Fetching products for category:", selectedCategory); // Log the selected category
      try {
        const q = query(collection(db, "products"), where("category", "==", selectedCategory));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          console.log("No products found for this category.");
        }

        const fetchedProducts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log("Fetched products:", fetchedProducts); // Log the fetched products

        setProducts(fetchedProducts);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory]); // Re-fetch when category changes

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleCardClick = (product) => {
    navigate(`/productdetails/${product.id}`);
  };

  return (
    <div className="container mx-auto px-4">
      {/* Category Selection */}
      <div className="flex justify-center space-x-6 my-6">
        {categories.map((category) => (
          <button
            key={category}
            className={`px-4 py-2 text-xl rounded-md ${
              selectedCategory === category
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-black"
            }`}
            onClick={() => handleCategoryChange(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <PuffLoader color="#3b82f6" size={60} />
        </div>
      ) : (
        <>
          {products.length > 0 ? (
            <>
              <Swiper
                modules={[Autoplay]}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                loop={true}
                effect="slide"
                speed={1500}
                className="w-full h-[50vh] sm:h-[50vh] md:h-[60vh] lg:h-[70vh] rounded-lg overflow-hidden"
              >
                {adImages.map((image, index) => (
                  <SwiperSlide key={index}>
                    <motion.div
                      className="h-full w-full flex justify-center items-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <img
                        src={image}
                        alt={`Ad ${index + 1}`}
                        className="w-full h-full object-contain"
                      />
                    </motion.div>
                  </SwiperSlide>
                ))}
              </Swiper>

              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12 mt-12"
              >
                {products.map((product) => (
                  <motion.div
                    key={product.id}
                    className="relative bg-gradient-to-br from-pink-400 to-red-400 rounded-xl p-6 shadow-lg mt-8 cursor-pointer flex flex-col justify-between h-full"
                    whileHover={{ scale: 1.05 }}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => handleCardClick(product)}
                  >
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-40 h-40 object-contain mx-auto -mt-16 bg-white rounded-full"
                    />
                    <h2 className="text-black text-2xl font-bold mt-6" style={{ fontFamily: 'Spicy Rice, cursive' }}>
                      {product.name}
                    </h2>
                    <p className="text-white text-lg overflow-hidden line-clamp-2 mt-2" style={{ fontFamily: 'Permanent Marker, cursive' }}>
                      {product.description}
                    </p>
                    <div className="flex justify-between items-center mt-4">
                      {product.discount ? (
                        <>
                          <span className="text-gray-500 line-through">${product.price}</span>
                          <span className="bg-yellow-400 text-black font-bold py-1 px-3 rounded-lg">
                            ${((product.price - (product.price * (product.discount / 100))).toFixed(2))}
                          </span>
                        </>
                      ) : (
                        <span className="bg-yellow-400 text-black font-bold py-1 px-3 rounded-lg">
                          ${product.price}
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between mt-auto">
                      <button className="bg-black text-white py-2 px-4 rounded-full hover:bg-gray-800">
                        Add to Cart
                      </button>
                      <button
                        className="bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/orderpage/${product.id}`);
                        }}
                      >
                        Shop Now
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </>
          ) : (
            <p className="text-center text-xl text-gray-500 mt-12">No products available in this category.</p>
          )}
        </>
      )}
    </div>
  );
};

export default Category;
