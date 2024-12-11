import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBupoIhqAcBhCydsZ1xBbmESX0UpiJtozs",
  authDomain: "rastruant-app.firebaseapp.com",
  projectId: "rastruant-app",
  storageBucket: "rastruant-app.appspot.com",
  messagingSenderId: "751791386204",
  appId: "1:751791386204:web:c8552b23e11a571cec4099",
  measurementId: "G-CB3ETT8XC9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db,storage,auth };
