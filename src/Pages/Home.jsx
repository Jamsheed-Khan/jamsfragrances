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
import 'react-toastify/dist/ReactToastify.css'; // Import the styles for react-toastify

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

    // Display notification when the page is loaded or refreshed
    toast.info("This website is in the pre-launch period. Stay tuned for the official launch!", {
      position: "top-center",
      autoClose: 5000, // Toast stays for 5 seconds
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      style: {
        background: "#1d4ed8", // Blue background color
        color: "white",
        fontSize: "18px",
        fontWeight: "bold",
        borderRadius: "8px",
      },
      icon: "🛍️", // Optional custom icon
    });
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
            autoplay={{ delay: 4000, disableOnInteraction: false }} // Slower autoplay delay
            loop={true}
            effect="slide" // Ensures smooth sliding effect
            speed={1500} // Adjust the transition speed to make it slower (1500ms = 1.5s)
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
                    className="w-full h-full object-contain" // Use object-contain to show full image without cropping
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
              
              <h2 className="text-black text-2xl font-bold mt-6" style={{ fontFamily: 'Spicy Rice, cursive' }}>{product.name}</h2>
              
              {/* Limited description to 2 lines */}
              <p
                className="text-white text-lg overflow-hidden line-clamp-2 mt-2"
                style={{ fontFamily: 'Permanent Marker, cursive' }}
              >
                {product.description}
              </p>
            
              <div className="flex justify-between items-center mt-4">
                {/* Display original price with strikethrough and discounted price */}
                {product.discount ? (
                  <>
                    <span className="text-gray-500 line-through">${product.price}</span> {/* Original price */}
                    <span className="bg-yellow-400 text-black font-bold py-1 px-3 rounded-lg">
                      ${((product.price - (product.price * (product.discount / 100))).toFixed(2))}
                    </span> {/* Discounted price */}
                  </>
                ) : (
                  <span className="bg-yellow-400 text-black font-bold py-1 px-3 rounded-lg">
                    ${product.price}
                  </span> // If no discount, show the original price
                )}
              </div>
            
              {/* Fixed position buttons */}
              <div className="flex justify-between mt-auto">
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
