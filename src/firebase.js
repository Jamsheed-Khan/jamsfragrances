import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyA4SsFUa5N5P6IZ9uGoPJw4h6Q5mXcBTPE",
    authDomain: "jamsfragrances.firebaseapp.com",
    projectId: "jamsfragrances",
    storageBucket: "jamsfragrances.firebasestorage.app",
    messagingSenderId: "88871330940",
    appId: "1:88871330940:web:f1639934022759a82455f9",
    measurementId: "G-W3XF1T8R3B"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
