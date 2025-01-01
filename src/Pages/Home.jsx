import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { motion } from "framer-motion";
import { PuffLoader } from "react-spinners";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";
import jamsfragrance1 from "../Assets/jamsfragrance1.jpg";
import jamsfragrance2 from "../Assets/jamsfragrance2.jpg";
import jamsfragrance3 from "../Assets/jamsfragrance3.jpg";
import jamsfragrance4 from "../Assets/jamsfragrance4.jpg";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const adImages = [jamsfragrance1, jamsfragrance2, jamsfragrance3, jamsfragrance4];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const fetchedProducts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto px-4">
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <PuffLoader color="#3b82f6" size={60} />
        </div>
      ) : (
        <>
          <Swiper
            modules={[Autoplay]}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            loop={true}
            className="w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] rounded-lg overflow-hidden"
          >
            {adImages.map((image, index) => (
              <SwiperSlide key={index}>
                <motion.div
                  className="h-full w-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <img
                    src={image}
                    alt={`Ad ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>

          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8"
          >
            {products.map((product) => (
              <motion.div
                key={product.id}
                className="relative bg-gradient-to-r from-pink-500 to-orange-400 rounded-2xl shadow-lg p-6 text-center transition-transform duration-500 hover:scale-105"
                whileHover={{ scale: 1.1 }}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Product Image */}
                <div className="flex justify-center items-center mb-4">
                  <div className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 bg-white rounded-full flex items-center justify-center overflow-hidden">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                {/* Product Name */}
                <h2 className="text-lg md:text-xl font-extrabold text-white mb-2">
                  {product.name}
                </h2>

                {/* Product Description */}
                <p className="text-xs md:text-sm text-white mb-4">
                  {product.description}
                </p>

                {/* Price Tag */}
                <div className="absolute top-4 right-4 bg-yellow-400 text-black font-bold px-3 py-1 rounded-full shadow">
                  ${product.price}
                </div>

                {/* Shop Now Button */}
                <button className="mt-4 px-6 py-2 bg-black text-white text-sm font-semibold rounded-full shadow hover:bg-gray-800">
                  Shop Now
                </button>
              </motion.div>
            ))}
          </motion.div>
        </>
      )}
    </div>
  );
};

export default Home;
