import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
import { getDatabase } from "firebase/database";
import { getApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: "xploroscope.firebaseapp.com",
  projectId: "xploroscope",
  storageBucket: "xploroscope.appspot.com",
  messagingSenderId: "1388675569",
  appId: process.env.NEXT_PUBLIC_APP_ID,
  measurementId: "G-ZGR7L42R72"

};




// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app); 
export const storage = getStorage(app);

