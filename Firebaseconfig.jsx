import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
import { getDatabase } from "firebase/database";
import { getApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBmpBBBX7L-9IF_odYwj_8HUnNxFN0aftI",
  authDomain: "xploroscope.firebaseapp.com",
  projectId: "xploroscope",
  storageBucket: "xploroscope.appspot.com",
  messagingSenderId: "1388675569",
  appId: "1:1388675569:web:9009e4b57391515e584450",
  measurementId: "G-ZGR7L42R72"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app); 
export const storage = getStorage(app);

