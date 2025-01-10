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
  const newproducts = [
    {
      id: 1,
      name: "Diana - Impression of Delina",
      imageUrl: "https://buyrawaha.com/cdn/shop/files/Delina_Parfums_de_Marly_2ae1b267-dd75-4d6c-a941-69ce7c287071.jpg?v=1736313683&width=360",
      originalPrice: "575.00",
      discountedPrice: "460.00",
      discount: "-20%",
    },
    {
      id: 2,
      name: "Tempting Bliss - Impression of Envy Me",
      imageUrl: "https://buyrawaha.com/cdn/shop/files/Tempting_Bliss_Envy_Me_30ml_ab9e1eaf-4f34-488c-85e2-0b95b853e0cc.png?v=1736313401&width=360",
      originalPrice: "575.00",
      discountedPrice: "460.00",
      discount: "-20%",
    },
    {
      id: 3,
      name: "Majestic Veil - Impression of Tilia",
      imageUrl: "https://buyrawaha.com/cdn/shop/files/30_ml_bottle_e5bafa70-2874-4c77-aace-23ef6750e507.png?v=1736313404&width=360",
      originalPrice: "1050.00",
      discountedPrice: "840.00",
      discount: "-20%",
    },
  ];

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


  const FeaturedCollections = ({ products }) => {
    const navigate = useNavigate();
  
    
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
      <motion.div
      className="mt-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Title */}
      <div className="text-center my-8">
        <h2 className="text-3xl font-bold text-black">Featured Collections</h2>
        <p className="text-gray-600">
          The one's that deserve to be in your personal collection. <br />
          Rated the best from all your love.
        </p>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 md:px-8">
        {products.map((product) => (
          <div
            key={product.id}
            onClick={() => handleCardClick(product)}
            className="flex flex-col items-center bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
          >
            {/* Product Image */}
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-64 object-cover rounded-lg"
            />
            
            {/* Product Name */}
            <h3 className="mt-4 text-lg font-bold text-black">{product.name}</h3>
            
            {/* Product Category */}
            <p className="mt-1 text-sm text-gray-500">{product.category}</p>

            {/* Social Reaction Icons */}
            <div className="flex justify-center items-center gap-4 mt-4">
              <div className="flex items-center gap-1">
                <span className="text-gray-600 text-sm">+{product.likes}</span>
                <div className="w-6 h-6 rounded-full bg-gray-300"></div>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-6 h-6 rounded-full bg-gray-400"></div>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-6 h-6 rounded-full bg-gray-500"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>

    <section className="py-12 bg-white">
      {/* Section Header */}
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-black">New Arrivals</h2>
        <a
          href="/shop-all"
          className="text-sm font-semibold text-black hover:underline mt-4 inline-block"
        >
          Shop All Products →
        </a>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8 container mx-auto px-4">
        {newproducts.map((product) => (
          <div
            key={product.id}
            className="relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Product Image */}
            <div className="relative">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-80 object-cover"
              />
              <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold py-1 px-2 rounded">
                {product.discount}
              </span>
              <button className="absolute top-2 right-2 w-8 h-8 bg-white text-black rounded-full flex items-center justify-center shadow">
                ♥
              </button>
            </div>

            {/* Product Info */}
            <div className="text-center py-4 px-2">
              <h3 className="text-sm font-semibold text-gray-800">
                {product.name}
              </h3>
              <div className="mt-2">
                <span className="text-sm text-gray-400 line-through">
                  Rs. {product.originalPrice}
                </span>
                <span className="text-sm font-bold text-red-600 ml-2">
                  From Rs. {product.discountedPrice}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
    </div>
  );
};

export default Home;
