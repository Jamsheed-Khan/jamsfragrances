import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Home from "./Pages/Home";
import Footer from "./Components/Footer";
import AddProducts from "./Pages/AddProducts";
import Products from "./Pages/Products";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Cart from "./Pages/Cart";
import ProductDetails from "./Pages/ProductDetails";
import OrderPage from "./Pages/OrderPage";
import ProfilePage from "./Pages/Profile";

function App() {
  return (
    
    <Router>
    <ToastContainer />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
         <Route path="/products" element={<Products />} />
         <Route path="/addproducts" element={<AddProducts />} />
         <Route path="/productdetails/:productId" element={<ProductDetails />} />
         <Route path="/login" element={<Login />} />
         <Route path="/signup" element={<Signup />} />
        <Route path="/cart" element={<Cart />} />  
        <Route path="/profile" element={<ProfilePage />} />  
        <Route path="/orderpage/:productId" element={<OrderPage />} />  
      </Routes>
      <Footer />
    </Router>
   
  );
}

export default App;
