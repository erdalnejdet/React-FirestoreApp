
import { initializeApp } from "firebase/app";

import { getFirestore} from "firebase/firestore"
 
const firebaseConfig = {
  apiKey: "AIzaSyCCB8fpwR4zYeHjn-Kydqig1MPDmGQI9hM",
  authDomain: "react-add-product-68da0.firebaseapp.com",
  projectId: "react-add-product-68da0",
  storageBucket: "react-add-product-68da0.appspot.com",
  messagingSenderId: "656827454740",
  appId: "1:656827454740:web:c4859872dd43e9bab01e01",
  measurementId: "G-J7XS7CYQMZ"
};


const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db };

