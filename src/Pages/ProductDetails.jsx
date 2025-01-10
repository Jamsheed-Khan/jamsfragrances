import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, updateDoc, arrayUnion, onSnapshot, collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { FaThumbsUp, FaRegComment, FaRegCommentAlt } from "react-icons/fa";

const ProductDetails = () => {
  const [product, setProduct] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [newReply, setNewReply] = useState({});
  const [rating, setRating] = useState(0);
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false); // State to track if the product is liked
  const { productId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (productId) {
        try {
          const productRef = doc(db, "products", productId);
          const productSnap = await getDoc(productRef);
          if (productSnap.exists()) {
            setProduct(productSnap.data());
          }
        } catch (error) {
          console.error("Error fetching product:", error);
        }
      }
    };
    fetchProductDetails();
  }, [productId]);

  useEffect(() => {
    if (productId) {
      const commentsRef = collection(db, "products", productId, "comments");
      const unsubscribe = onSnapshot(commentsRef, (snapshot) => {
        const fetchedComments = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setComments(fetchedComments);
      });

      const productRef = doc(db, "products", productId);
      const unsubscribeLikes = onSnapshot(productRef, (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          setLikes(data.likes || 0);
          setRating(data.rating || 0);
        }
      });

      return () => {
        unsubscribe();
        unsubscribeLikes();
      };
    }
  }, [productId]);

  const handleLikeProduct = async () => {
    try {
      const productRef = doc(db, "products", productId);
      if (isLiked) {
        await updateDoc(productRef, { likes: likes - 1 });
        setLikes(likes - 1);
      } else {
        await updateDoc(productRef, { likes: likes + 1 });
        setLikes(likes + 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error("Error liking product:", error);
    }
  };

  const handleAddComment = async () => {
    if (newComment.trim() === "") return;
    try {
      const commentsRef = collection(db, "products", productId, "comments");
      await addDoc(commentsRef, { text: newComment, timestamp: Date.now(), replies: [] });
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleAddReply = async (commentId) => {
    if (!newReply[commentId]?.trim()) return;
    try {
      const commentRef = doc(db, "products", productId, "comments", commentId);
      await updateDoc(commentRef, {
        replies: arrayUnion({ text: newReply[commentId], timestamp: Date.now() }),
      });
      setNewReply((prev) => ({ ...prev, [commentId]: "" }));
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };

  const handleRatingChange = async (newRating) => {
    try {
      const productRef = doc(db, "products", productId);
      await updateDoc(productRef, { rating: newRating });
      setRating(newRating);
    } catch (error) {
      console.error("Error updating rating:", error);
    }
  };

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600 text-xl">Loading product details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 flex flex-col lg:flex-row gap-8">
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
      <div className="w-full lg:w-1/2 space-y-4">
        <h1 className="text-2xl font-bold text-gray-800">{product.name}</h1>
        <div className="flex items-center gap-2">
          <div className="flex text-yellow-500">
            {[...Array(Math.round(rating) || 5)].map((_, i) => (
              <span key={i}>&#9733;</span>
            ))}
          </div>
          <p className="text-gray-500">{product.ratingsCount || 0} Ratings</p>
        </div>
        <p className="text-red-500 text-xl font-bold">Rs. {product.price}</p>
        <p className="line-through text-gray-500">
          Rs. {product.originalPrice || "N/A"}
        </p>
        <p className="text-gray-700">{product.description}</p>
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-lg font-bold text-gray-800">Full Details</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            {product.details?.map((detail, index) => (
              <li key={index}>{detail}</li>
            ))}
          </ul>
        </div>
        <div className="flex gap-4">
          <div onClick={handleLikeProduct} className="flex items-center gap-2 cursor-pointer">
            <FaThumbsUp
              className={`text-${isLiked ? "red" : "black"}-500`}
            />
            <span className={`text-${isLiked ? "red" : "black"}-500`}>
              Like ({likes})
            </span>
          </div>
        </div>
        <div className="mt-4">
          <h2 className="text-lg font-bold">Rate this Product</h2>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`cursor-pointer text-${star <= rating ? "yellow" : "gray"}-500`}
                onClick={() => handleRatingChange(star)}
              >
                &#9733;
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4 mt-4">
          <h2 className="text-lg font-bold">Comments</h2>
          <div className="space-y-2">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-gray-100 p-2 rounded-lg">
                <p>{comment.text}</p>
                <div className="mt-2 space-y-2">
                  {comment.replies?.map((reply, idx) => (
                    <div key={idx} className="bg-gray-200 p-2 rounded-lg">
                      {reply.text}
                    </div>
                  ))}
                  <div className="flex gap-2 mt-2">
                    <input
                      type="text"
                      className="border rounded-lg p-2 flex-1"
                      placeholder="Add a reply"
                      value={newReply[comment.id] || ""}
                      onChange={(e) => setNewReply((prev) => ({ ...prev, [comment.id]: e.target.value }))}
                    />
                    <FaRegCommentAlt
                      className="cursor-pointer text-blue-500"
                      onClick={() => handleAddReply(comment.id)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              className="border rounded-lg p-2 flex-1"
              placeholder="Add a comment"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <FaRegComment
              className="cursor-pointer text-blue-500"
              onClick={handleAddComment}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
