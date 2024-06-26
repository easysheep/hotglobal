"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "../../AuthContext";
import { toast } from "react-toastify";
import { Bounce } from "react-toastify";
import { useRouter } from "next/navigation";
import {
  getDatabase,
  ref as dbRef,
  child,
  push,
  update,
  get,
} from "firebase/database";
import {
  getStorage,
  ref as storageRef,
  getDownloadURL,
  uploadBytes,
} from "firebase/storage";

const CreateBlogByPage = () => {
  const { logedin, currentUser } = useAuth();
  const searchParams = useSearchParams();
  const postedOn = searchParams.get("postedOn");
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [categoryInput, setCategoryInput] = useState("");
  const [showCategoryInput, setShowCategoryInput] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [username, setUsername] = useState("");

  useEffect(() => {
    console.log("useEffect triggered with currentUser:", currentUser);

    if (currentUser) {
      console.log("Current user exists:", currentUser.uid);

      const db = getDatabase();
      const userRef = dbRef(db, `users/${currentUser.uid}`);

      // Fetch user data
      get(userRef)
        .then((snapshot) => {
          console.log("Fetching user data...");

          if (snapshot.exists()) {
            const userData = snapshot.val();
            console.log("User data fetched:", userData);

            setUsername(userData.username || "");
            console.log("Username set to:", userData.username || "");
          } else {
            console.log("No user data found.");
          }
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    } else {
      console.log("No current user.");
    }
  }, [currentUser]);

  useEffect(() => {
    console.log("username is " + username);
  }, [username]);

  const writeNewPost = (
    uid,
    desc,
    time,
    postedBy,
    postedOn,
    title,
    category,
    imageUrl,
    content
  ) => {
    const db = getDatabase();

    const postData = {
      desc: desc,
      uid: uid,
      postedOn: postedOn,
      postedBy: postedBy,
      upvotes: 0,
      downvotes: 0,
      categories: category,
      time: time,
      title: title,
      imageUrl: imageUrl,
      content: content,
    };

    // Get a key for a new Post.
    const newPostKey = push(child(dbRef(db), "allposts")).key;

    // Write the new post's data simultaneously in the posts list and the user's post list.
    const updates = {};
    updates["/allposts/" + newPostKey] = postData;
    updates[`users/${currentUser.uid}/myposts/` + newPostKey] = postData;

    return update(dbRef(db), updates);
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = (postedBy) => {
    if (!imageFile || !title || !desc) {
      console.log("Please fill all the fields and select an image");
      return;
    }

    const storageInstance = getStorage();
    const storageRefInstance = storageRef(
      storageInstance,
      `images/${imageFile.name}`
    );

    uploadBytes(storageRefInstance, imageFile)
      .then((snapshot) => {
        return getDownloadURL(snapshot.ref);
      })
      .then((downloadURL) => {
        const uid = currentUser.uid; // Use the actual UID of the current user
        const time = new Date().toISOString(); // Use the current timestamp
        const category = categories.length > 0 ? categories : ["default"];

        // Call the writeNewPost function with your data
        return writeNewPost(
          uid,
          desc,
          time,
          postedBy,
          postedOn,
          title,
          category,
          downloadURL,
          content
        );
      })
      .then(() => {
        console.log("New post created successfully!");
        toast.success("Post created successfully!", {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        });
        router.back();
      })
      .catch((error) => {
        console.error("Error writing new post:", error);
        toast.error("Error creating post!", {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        });
      });
  };

  const toggleCategoryInput = () => {
    setShowCategoryInput(!showCategoryInput);
  };

  const handleCategoryInputChange = (e) => {
    setCategoryInput(e.target.value);
  };

  const handleAddCategory = () => {
    if (categoryInput.trim() !== "") {
      setCategories([...categories, categoryInput.trim()]);
      setCategoryInput("");
    }
  };

  const handleCategoryInputKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission
      handleAddCategory();
    }
  };

  const handlePostUser = () => {
    if (!logedin) {
      toast.warn("Login To Post", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
    } else {
      handleSubmit(username);
    }
  };

  const handlePostAnonymously = () => {
    if (!logedin) {
      toast.warn("Login To Post", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
    } else {
      handleSubmit("Anonymous");
    }
  };

  // return (
  //   <div className="">
  //     <div className="h-1 bg-slate-800 mb-3"></div>
  //     <div className="font-bold text-5xl pt-8 pb-2 font-monte">
  //       Create Post.
  //     </div>
  //     <form
  //       className="border-4 min-h-64 py-4 px-3 flex flex-row gap-3"
  //       onSubmit={(e) => e.preventDefault()} // Prevent default form submission
  //     >
  //       <div className="imgbox border-4 w-3/12 flex justify-center items-center max-h-52">
  //         {imageFile ? (
  //           <div className="flex flex-col items-center">
  //             <span className="text-2xl text-gray-400 font-bold font-roboto">
  //               Image Added
  //             </span>
  //           </div>
  //         ) : (
  //           <label
  //             htmlFor="file-upload"
  //             className="custom-file-upload flex flex-col cursor-pointer"
  //           >
  //             <span className="text-8xl text-gray-400 flex justify-center font-roboto">
  //               +
  //             </span>
  //             <span className="text-xl text-gray-400 font-bold font-roboto">
  //               Add Image
  //             </span>
  //           </label>
  //         )}
  //         <input
  //           id="file-upload"
  //           type="file"
  //           style={{ display: "none" }}
  //           onChange={handleFileChange}
  //         />
  //       </div>
  //       <div className="w-9/12 flex flex-col">
  //         <div className="flex gap-4">
  //           <input
  //             type="text"
  //             className="text-3xl border-4 font-bold h-16 py-1 w-2/6 px-3 font-roboto"
  //             placeholder="Add Title"
  //             value={title}
  //             onChange={(e) => setTitle(e.target.value)}
  //           />
  //           <input
  //             type="text"
  //             className="text-lg border-4 font-bold h-16 py-1 w-4/6 px-3 font-roboto"
  //             placeholder="Add Description"
  //             value={desc}
  //             onChange={(e) => setDesc(e.target.value)}
  //           />
  //         </div>

  //         <textarea
  //           className="border-4 font-bold min-h-32 mt-2 p-1 px-3 flex font-roboto"
  //           placeholder="Write content"
  //           value={content}
  //           onChange={(e) => setContent(e.target.value)}
  //         ></textarea>
  //         {!postedOn ? (
  //           <input
  //             type="text"
  //             className="text-xl border-4 font-bold h-10 py-1 w-40 px-3 mt-2 font-roboto"
  //             placeholder="Post On"
  //           />
  //         ) : (
  //           <div className="text-xl border-4 h-10 py-1 w-fit px-3 mt-2 font-roboto">
  //             {postedOn}
  //           </div>
  //         )}

  //         <div className="flex justify-between">
  //           <div className="flex gap-3 text-white pt-9">
  //             <button
  //               type="button"
  //               className="bg-purple1 py-1 px-2 font-roboto"
  //               onClick={handlePostAnonymously}
  //             >
  //               Post Anonymously
  //             </button>
  //             <button
  //               type="button"
  //               className="bg-purple1 py-1 px-2 font-roboto"
  //               onClick={handlePostUser}
  //             >
  //               Post As User
  //             </button>
  //           </div>
  //           <div className="text-white pt-9 flex gap-5">
  //             {showCategoryInput && (
  //               <>
  //                 <input
  //                   type="text"
  //                   placeholder="Category"
  //                   className="border-2 border-gray-500 px-2 text-black font-roboto"
  //                   value={categoryInput}
  //                   onChange={handleCategoryInputChange}
  //                   onKeyDown={handleCategoryInputKeyPress}
  //                 />
  //               </>
  //             )}
  //             <button
  //               type="button"
  //               className="bg-purple1 color-white py-1 px-2 font-roboto"
  //               onClick={toggleCategoryInput}
  //               title={categories.length > 0 ? categories.join(", ") : ""}
  //             >
  //               +Add Categories
  //             </button>
  //           </div>
  //         </div>
  //       </div>
  //     </form>
  //   </div>
  // );
  return (
    <div className="">
      <div className="h-1 bg-slate-800 mb-3"></div>
      <div className="font-bold text-5xl pt-8 pb-2 font-monte">
        Create Post.
      </div>
      <form
        className="border-4 min-h-64 py-4 px-3 flex flex-col md:flex-row gap-3"
        onSubmit={(e) => e.preventDefault()} // Prevent default form submission
      >
        <div className="imgbox border-4 w-full md:w-3/12 flex justify-center items-center max-h-52">
          {imageFile ? (
            <div className="flex flex-col items-center">
              <span className="text-2xl text-gray-400 font-bold font-roboto">
                Image Added
              </span>
            </div>
          ) : (
            <label
              htmlFor="file-upload"
              className="custom-file-upload flex flex-col cursor-pointer"
            >
              <span className="text-8xl text-gray-400 flex justify-center font-roboto">
                +
              </span>
              <span className="text-xl text-gray-400 font-bold font-roboto">
                Add Image
              </span>
            </label>
          )}
          <input
            id="file-upload"
            type="file"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </div>
        <div className="w-full md:w-9/12 flex flex-col">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              className="text-3xl border-4 font-bold h-16 py-1 w-full md:w-2/6 px-3 font-roboto"
              placeholder="Add Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              type="text"
              className="text-lg border-4 font-bold h-16 py-1 w-full md:w-4/6 px-3 font-roboto"
              placeholder="Add Description"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>
  
          <textarea
            className="border-4 font-bold min-h-32 mt-2 p-1 px-3 flex font-roboto"
            placeholder="Write content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
          {!postedOn ? (
            <input
              type="text"
              className="text-xl border-4 font-bold h-10 py-1 w-40 px-3 mt-2 font-roboto"
              placeholder="Post On"
            />
          ) : (
            <div className="text-xl border-4 h-10 py-1 w-fit px-3 mt-2 font-roboto">
              {postedOn}
            </div>
          )}
  
          <div className="flex flex-col md:flex-row justify-between mt-4">
            <div className="flex gap-3 text-white pt-2 md:pt-9">
              <button
                type="button"
                className="bg-purple1 py-1 px-2 font-roboto"
                onClick={handlePostAnonymously}
              >
                Post Anonymously
              </button>
              <button
                type="button"
                className="bg-purple1 py-1 px-2 font-roboto"
                onClick={handlePostUser}
              >
                Post As User
              </button>
            </div>
            <div className="text-white pt-2 md:pt-9 flex gap-5">
              {showCategoryInput && (
                <>
                  <input
                    type="text"
                    placeholder="Category"
                    className="border-2 border-gray-500 px-2 text-black font-roboto"
                    value={categoryInput}
                    onChange={handleCategoryInputChange}
                    onKeyDown={handleCategoryInputKeyPress}
                  />
                </>
              )}
              <button
                type="button"
                className="bg-purple1 color-white py-1 px-2 font-roboto"
                onClick={toggleCategoryInput}
                title={categories.length > 0 ? categories.join(", ") : ""}
              >
                +Add Categories
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
  
};

export default CreateBlogByPage;
