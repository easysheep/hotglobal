"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "../../AuthContext";
import { FaArrowRight } from "react-icons/fa";
import {
  getStorage,
  ref as storageRef,
  getDownloadURL,
  uploadBytes,
} from "firebase/storage";
import { getDatabase, ref as dbRef, get, update } from "firebase/database";
import RecentPostProfilePage from "../RecentPostProfilePage";

const ProfilePage = () => {
  const { userData, setuserData } = useAuth();
  const { currentUser } = useAuth();
  const [profileCompleted, setProfileCompleted] = useState(false);
  const [username, setUsername] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [photoUrl, setPhotoUrl] = useState("");
  const [pages, setPages] = useState([]);
  const [myposts, setMyposts] = useState([]);
  const [view, setView] = useState("pages");

  useEffect(() => {
    if (currentUser) {
      const db = getDatabase();
      const userRef = dbRef(db, `users/${currentUser.uid}`);
      const followedPagesRef = dbRef(
        db,
        `users/${currentUser.uid}/followedpages`
      );
      const myPostsRef = dbRef(db, `users/${currentUser.uid}/myposts`);

      // Fetch user data
      get(userRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const userData = snapshot.val();
            setUsername(userData.username || "");
            setPhotoUrl(userData.photoUrl || "");
            setProfileCompleted(!!userData.username);
          }
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });

      // Fetch followed pages
      get(followedPagesRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const followedPagesData = snapshot.val();
            const followedPagesArray = Object.values(followedPagesData);
            setPages(followedPagesArray);
          }
        })
        .catch((error) => {
          console.error("Error fetching followed pages:", error);
        });

      // Fetch my posts
      get(myPostsRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const myPostsData = snapshot.val();
            const myPostsArray = Object.values(myPostsData);
            setMyposts(myPostsArray);
          }
        })
        .catch((error) => {
          console.error("Error fetching my posts:", error);
        });
    }
  }, [currentUser]);
  
  
  
  const handleInputChange = (e) => {
    setUsername(e.target.value);
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username) {
      console.log("Username is required");
      return;
    }

    if (imageFile) {
      const storage = getStorage();
      const storageRefInstance = storageRef(
        storage,
        `profileImages/${currentUser.uid}/${imageFile.name}`
      );
      uploadBytes(storageRefInstance, imageFile)
        .then((snapshot) => {
          return getDownloadURL(snapshot.ref);
        })
        .then((downloadURL) => {
          updateUserProfile(downloadURL);
        })
        .catch((error) => {
          console.error("Error uploading image:", error);
        });
    } else {
      updateUserProfile(photoUrl);
    }
  };

  const updateUserProfile = (photoUrl) => {
    const db = getDatabase();
    const userRef = dbRef(db, `users/${currentUser.uid}`);
    const userData = {
      username: username,
      email: currentUser.email,
      photoUrl: photoUrl,
    };

    update(userRef, userData)
      .then(() => {
        console.log("User profile updated successfully!");
        setProfileCompleted(true);
      })
      .catch((error) => {
        console.error("Error updating user profile:", error);
      });
  };

  return (
    <div className="flex" style={{ height: "calc(100vh - 60px)" }}>
      {!profileCompleted && (
        <>
          <form
            onSubmit={handleSubmit}
            className="w-1/2 bg-purple1 overflow-hidden flex justify-start items-center flex-col"
          >
            <div
              className="cursor-pointer bg-white opacity-40 h-36 w-36 mt-12 shadow-2xl justify-center flex items-center flex-col"
              style={{ borderRadius: "50%" }}
            >
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col"
              >
                <span className="text-5xl flex justify-center">+</span>
                <span className="">Add Profile</span>
              </label>
              <input
                id="file-upload"
                type="file"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </div>
            <input
              type="text"
              value={username}
              onChange={handleInputChange}
              className="cursor-pointer bg-white opacity-40 h-12 w-36 mt-12 shadow-2xl text-center justify-center flex items-center px-1 placeholder-gray-900"
              placeholder="Post As"
              style={{ "::placeholder": { color: "#61407C" } }}
              required
            />
            <button
              type="submit"
              className="px-4 py-2 mt-4 bg-purple1 text-white"
            >
              <div className="flex gap-1">
                <div className="">Continue</div>
                <div className="flex items-center">
                  <FaArrowRight />
                </div>
              </div>
            </button>
          </form>
          <div className="w-1/2 h-full pt-10 pl-4">
            <div className="font-bold text-7xl">Complete profile</div>
            <div className="font-bold text-7xl">to begin</div>
            <div className="font-bold text-7xl">posting.</div>
          </div>
        </>
      )}
      <div
        className={`h-full pt-10 flex w-full ${
          profileCompleted
            ? "opacity-100 transition-opacity duration-500"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="leftcont w-1/2 h-full pt-2 flex flex-col">
          <div className="font-bold text-7xl">See Your Posts</div>
          <div className="font-bold text-7xl">And Pages</div>
          <div className="font-bold text-7xl">You Follow.</div>
          <div className="flex gap-8">
            <button
              onClick={() => setView("myposts")}
              className="px-2 py-1 bg-purple1 text-white mt-5"
            >
              My Posts
            </button>
            <button
              onClick={() => setView("pages")}
              className="px-2 py-1 bg-purple1 text-white mt-5"
            >
              Followed Pages
            </button>
          </div>
        </div>
        <div className="rightcont w-1/2 h-full pt-5">
          <div className="gap-3 flex flex-col">
            {view === "pages" ? (
              pages.length > 0 ? (
                pages.map((data, index) => (
                  <Link
                    href={{
                      pathname: "/blogpage",
                      query: { title: data.title, followers: data.followers,imageUrl: data.imageUrl, },
                    }}
                    key={index}
                  >
                    <div
                      className="text rounded-lg bg-gray-100 py-2 px-2 cursor-pointer flex justify-between shadow-md transition-all duration-300 hover:bg-purple1 hover:text-white"
                      key={index}
                    >
                      <span className="text-base">{data.title}</span>
                      <span className="text-xs flex items-center">
                        {data.followers}+
                      </span>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="font-bold text-purple1 text-6xl">
                  Nothing to show here
                </div>
              )
            ) : myposts.length > 0 ? (
              myposts.map((data, index) => {
                return <RecentPostProfilePage key={index} {...data} />;
              }
            ) ): (
              <div className="font-bold text-purple1 text-6xl">
                Nothing to show here
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
