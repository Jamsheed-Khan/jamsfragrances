import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ContactMe = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const contactCollectionRef = collection(db, "contactMessages");
      await addDoc(contactCollectionRef, {
        name,
        email,
        message,
        timestamp: new Date(),
      });

      toast.success("Your message has been sent successfully!", {
        position: "top-center",
        autoClose: 5000,
      });
      setName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Error sending your message. Please try again.", {
        position: "top-center",
        autoClose: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <ToastContainer />
      <h1 className="text-3xl text-center font-bold mb-8" style={{ fontFamily: 'Spicy Rice, cursive' }}>
        Contact Us
      </h1>
      <div className="max-w-md mx-auto bg-gradient-to-br from-pink-400 to-red-400 p-6 rounded-lg shadow-lg">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-white font-medium mb-2">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-lg border-none outline-none"
              required
              style={{ fontFamily: "Permanent Marker, cursive" }}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-white font-medium mb-2">
              Your Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg border-none outline-none"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="message" className="block text-white font-medium mb-2">
              Your Message
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3 rounded-lg border-none outline-none"
              rows="5"
              required
              style={{ fontFamily: "Permanent Marker, cursive" }}
            />
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className={`bg-yellow-400 text-black py-2 px-6 rounded-full ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactMe;
