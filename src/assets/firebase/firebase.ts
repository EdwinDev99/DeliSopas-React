// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // 👈 Agregado

const firebaseConfig = {
  apiKey: "AIzaSyC_O-rLJSFzj-aeGBE_cu42FsiR75DFp1E",
  authDomain: "restaurantedelisopas.firebaseapp.com",
  projectId: "restaurantedelisopas",
  storageBucket: "restaurantedelisopas.appspot.com", // 👈 Estaba mal escrito
  messagingSenderId: "1039014135182",
  appId: "1:1039014135182:web:9be4655969ff0210a410df",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app); // 👈 Exporta Auth
