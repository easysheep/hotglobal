"use client";
import React, { createContext, useState, useEffect, useContext } from "react";
const AuthContext = createContext();
import { ref, child, get } from "firebase/database";
import { db } from "./Firebaseconfig";

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setuserData] = useState({});
  const [logedin, setlogedin] = useState(false);
  const [allposts, setallposts] = useState([]);
  const [pages, setpages] = useState([]);
  const [username, setUsername] = useState("");

  useEffect(() => {
    localStorage.setItem("logedin", JSON.stringify(logedin));
  }, [logedin]);

  const dbRef = ref(db);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await get(child(dbRef, "allposts"));

        if (snapshot.exists()) {
          const resultposts = Object.entries(snapshot.val()).map(
            ([key, value]) => ({ key, ...value })
          );
          setallposts(resultposts);
          console.log(resultposts);
        } else {
          console.log("No data available");
        }
      } catch (error) {
        console.error(error);
      }
    };
    

    const fetchData1 = async () => {
      try {
        const snapshot1 = await get(child(dbRef, "pages"));

        if (snapshot1.exists()) {
          const resultpages = Object.entries(snapshot1.val()).map(
            ([key, value]) => ({ key, ...value })
          );
          setpages(resultpages);
          console.log(resultpages);
        } else {
          console.log("No data available");
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
    fetchData1();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        userData,
        setuserData,
        logedin,
        setlogedin,
        allposts,
        setallposts,
        pages,
        setpages,
        username,
        setUsername,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
