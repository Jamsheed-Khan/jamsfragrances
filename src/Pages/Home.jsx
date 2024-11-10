import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, "products"));
      setProducts(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-center mt-5">Featured Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
        {products.map(product => (
          <div key={product.id} className="border p-4">
            <h2 className="font-bold">{product.name}</h2>
            <p>{product.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
