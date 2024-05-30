"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "../../AuthContext";
import { FaArrowRight } from "react-icons/fa";
import {
  getStorage,
  ref as storageRef,
  getDownloadURL,
  uploadBytes,
} from "firebase/storage";
import { getDatabase, ref as dbRef, update } from "firebase/database";
import { useEffect } from "react";

const ProfilePage = () => {
  const { userData, setuserData } = useAuth();
  const { currentUser } = useAuth();
  const [profileCompleted, setProfileCompleted] = useState(false);
  const [username, setUsername] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const pages = [
    // ... (your pages array)
  ];

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
      updateUserProfile(null);
    }
  };

  const updateUserProfile = (photoUrl) => {
    const db = getDatabase();
    const userRef = dbRef(db, `users/${currentUser.uid}`);
    const userData = {
      username: username,
      email: currentUser.email,
    };
    if (photoUrl) {
      userData.photoUrl = photoUrl;
    }

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
    <div className="flex " style={{ height: "calc(100vh - 60px)" }}>
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
                <div className="">Continue </div>
                <div className="flex items-center">
                  <FaArrowRight />
                </div>
              </div>
            </button>
          </form>
          <div className="w-1/2 h-full pt-10 pl-4 ">
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
          <div className="font-bold text-7xl">And Pages </div>
          <div className="font-bold text-7xl">You Follow.</div>
          <div className="flex gap-8">
            <button className="px-2 py-1 bg-purple1 text-white mt-5">
              My Posts
            </button>
            <button className="px-2 py-1 bg-purple1 text-white mt-5">
              Followed Pages
            </button>
          </div>
        </div>
        {/* <div className="rightcont w-1/2 h-full pt-5 ">
          <div className=" gap-3 flex flex-col">
            {pages.map((data, index) => (
              <Link
                href={{
                  pathname: "/blogpage",
                  query: { title: data.title, followers: data.followers },
                }}
                key={index}
              >
                <div
                  className="text rounded-lg bg-gray-100 py-2 px-2 cursor-pointer flex justify-between shadow-md transition-all duration-300 hover:bg-purple1 hover:text-white"
                  key={index}
                >
                  <span className="text-base">{data.title}</span>
                  <span className="text-xs flex items-center">{data.followers}+</span>
                </div>
              </Link>
            ))}
          </div>
        </div> */}
        <div className="rightcont w-1/2 h-full pt-5 ">
          <div className=" gap-3 flex flex-col">
            {pages.length > 0 ? (
              pages.map((data, index) => (
                <Link
                  href={{
                    pathname: "/blogpage",
                    query: { title: data.title, followers: data.followers },
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// Get a reference to the storage service.
// import { db, storage } from "../../Firebaseconfig";
// import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
// import { ref as databaseRef, get, child, update } from "firebase/database";
// import { useEffect } from "react";

// const ProfilePage = () => {
//   const uploadImagesAndUpdatePosts = async () => {
//     try {
//       // Step 1: Fetch all posts from Realtime Database
//       const dbRef = databaseRef(db);
//       const snapshot = await get(child(dbRef, "allposts"));
//       if (snapshot.exists()) {
//         const posts = snapshot.val();
        
//         // Convert posts object to an array with IDs
//         const postsArray = Object.keys(posts).map(key => ({
//           ...posts[key],
//           id: key,
//         }));

//         for (const post of postsArray) {
//           try {
//             // Step 2: Prepare the image path (assuming it's a relative path)
//             const imagePath = post.imageUrl.startsWith("/")
//               ? post.imageUrl.slice(1)
//               : post.imageUrl;
//             const imageRef = storageRef(storage, `images/${imagePath}`);

//             // Step 3: Fetch the image file from the public folder
//             const response = await fetch(post.imageUrl);
//             if (!response.ok) {
//               throw new Error('Network response was not ok');
//             }
//             const blob = await response.blob();

//             // Step 4: Upload the image to Firebase Storage
//             await uploadBytes(imageRef, blob);

//             // Step 5: Get the download URL for the uploaded image
//             const downloadURL = await getDownloadURL(imageRef);

//             // Step 6: Update the Realtime Database with the new image URL
//             const postRef = databaseRef(db, `allposts/${post.id}`);
//             await update(postRef, { imageUrl: downloadURL });

//             console.log(`Successfully updated post ${post.id} with new image URL.`);
//           } catch (error) {
//             console.error(`Error processing post ${post.id}:`, error);
//           }
//         }

//         console.log("All posts updated successfully.");
//       } else {
//         console.log("No posts found in the database.");
//       }
//     } catch (error) {
//       console.error("Error fetching posts from Realtime Database:", error);
//     }
//   };





//   const uploadImagesAndUpdatePages = async () => {
//     try {
//       // Step 1: Fetch all posts from Realtime Database
//       const dbRef = databaseRef(db);
//       const snapshot = await get(child(dbRef, "pages"));
//       if (snapshot.exists()) {
//         const posts = snapshot.val();
        
//         // Convert posts object to an array with IDs
//         const postsArray = Object.keys(posts).map(key => ({
//           ...posts[key],
//           id: key,
//         }));

//         for (const post of postsArray) {
//           try {
//             // Step 2: Prepare the image path (assuming it's a relative path)
//             const imagePath = post.imageUrl.startsWith("/")
//               ? post.imageUrl.slice(1)
//               : post.imageUrl;
//             const imageRef = storageRef(storage, `images/${imagePath}`);

//             // Step 3: Fetch the image file from the public folder
//             const response = await fetch(post.imageUrl);
//             if (!response.ok) {
//               throw new Error('Network response was not ok');
//             }
//             const blob = await response.blob();

//             // Step 4: Upload the image to Firebase Storage
//             await uploadBytes(imageRef, blob);

//             // Step 5: Get the download URL for the uploaded image
//             const downloadURL = await getDownloadURL(imageRef);

//             // Step 6: Update the Realtime Database with the new image URL
//             const postRef = databaseRef(db, `pages/${post.id}`);
//             await update(postRef, { imageUrl: downloadURL });

//             console.log(`Successfully updated page ${post.id} with new image URL.`);
//           } catch (error) {
//             console.error(`Error processing page ${post.id}:`, error);
//           }
//         }

//         console.log("All pages updated successfully.");
//       } else {
//         console.log("No pages found in the database.");
//       }
//     } catch (error) {
//       console.error("Error fetching posts from Realtime Database:", error);
//     }
//   };

//   return <div>
//     <button onClick={uploadImagesAndUpdatePosts}>upload post images</button>
//     <br />
//     <br />
//     <button onClick={uploadImagesAndUpdatePages}>upload pages images</button>
//     </div>;
// };

// export default ProfilePage;
