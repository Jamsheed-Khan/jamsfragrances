import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { PuffLoader } from "react-spinners";
import { Swiper, SwiperSlide } from "swiper/react";
import { toast } from "react-toastify";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import jamsfragrance1 from "../Assets/jamsfragrance1.jpg";
import jamsfragrance2 from "../Assets/jamsfragrance2.jpg";
import jamsfragrance3 from "../Assets/jamsfragrance3.jpg";
import jamsfragrance4 from "../Assets/jamsfragrance4.jpg";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate(); // Initialize navigate

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

  const handleAddToCart = async (product) => {
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

  const handleShopNow = (product) => {
    navigate(`/orderpage/${product.id}`);
  };
  const handleCardClick = (product) => {
    navigate(`/productdetails/${product.id}`);
  };
  

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
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-16"
          >
            {products.map((product) => (
              <motion.div
                key={product.id}
                className="relative bg-gradient-to-br from-pink-400 to-red-400 rounded-xl p-6 shadow-lg mt-8 cursor-pointer"
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
                <h2 className="text-black text-lg font-bold mt-6" style={{ fontFamily: 'Spicy Rice, cursive' }}>{product.name}</h2>
                <p className="text-white text-sm" style={{ fontFamily: 'Permanent Maker, cursive' }}>{product.description}</p>
                <div className="flex justify-between items-center mt-4">
                  <span className="bg-yellow-400 text-black font-bold py-1 px-3 rounded-lg">
                    ${product.price}
                  </span>
                </div>
                <div className="flex justify-between mt-4">
                  <button
                    className="bg-black text-white py-2 px-4 rounded-full hover:bg-gray-800"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product);
                    }}
                  >
                    Add to Cart
                  </button>
                  <button
                    className="bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShopNow(product);
                    }}
                  >
                    Shop Now
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </>
      )}
    </div>
  );
};

export default Home;
