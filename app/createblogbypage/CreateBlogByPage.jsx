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
} from "firebase/database";
import {
  getStorage,
  ref as storageRef,
  getDownloadURL,
  uploadBytes,
} from "firebase/storage";

const CreateBlogByPage = () => {
  const { logedin, username, currentUser } = useAuth();
  const searchParams = useSearchParams();
  const postedOn = searchParams.get("postedOn");
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [categoryInput, setCategoryInput] = useState("");
  const [showCategoryInput, setShowCategoryInput] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    console.log("username is " + username);
    console.log(currentUser?.email);
  }, [username, currentUser?.email]);

  const writeNewPost = (
    uid,
    desc,
    time,
    postedBy,
    postedOn,
    title,
    category,
    imageUrl
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
    };

    // Get a key for a new Post.
    const newPostKey = push(child(dbRef(db), "allposts")).key;

    // Write the new post's data simultaneously in the posts list and the user's post list.
    const updates = {};
    updates["/allposts/" + newPostKey] = postData;

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
          downloadURL
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

  return (
    <div className="pt-5">
      <div className="font-bold text-5xl pt-8 pb-2">Create Post.</div>
      <form
        className="border-4 min-h-64 py-4 px-3 flex flex-row gap-3"
        onSubmit={(e) => e.preventDefault()} // Prevent default form submission
      >
        <div className="imgbox border-4 w-3/12 flex justify-center items-center max-h-52">
          <label
            htmlFor="file-upload"
            className="custom-file-upload flex flex-col cursor-pointer"
          >
            <span className="text-8xl text-gray-400 flex justify-center">
              +
            </span>
            <span className="text-xl text-gray-400 font-bold">Add Image</span>
          </label>
          <input
            id="file-upload"
            type="file"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </div>
        <div className="w-9/12 flex flex-col">
          <input
            type="text"
            className="text-3xl border-4 font-bold h-16 py-1 w-80 px-3"
            placeholder="Add Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="border-4 font-bold min-h-80 mt-2 p-1 px-3 flex"
            placeholder="Write Content"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          ></textarea>
          {!postedOn ? (
            <input
              type="text"
              className="text-xl border-4 font-bold h-10 py-1 w-40 px-3 mt-2"
              placeholder="Post On"
            />
          ) : (
            <div className="text-xl border-4 h-10 py-1 w-fit px-3 mt-2">
              {postedOn}
            </div>
          )}

          <div className="flex justify-between">
            <div className="flex gap-3 text-white pt-9">
              <button
                type="button"
                className="bg-purple1 py-1 px-2"
                onClick={handlePostAnonymously}
              >
                Post Anonymously
              </button>
              <button
                type="button"
                className="bg-purple1 py-1 px-2"
                onClick={handlePostUser}
              >
                Post As User
              </button>
            </div>
            <div className="text-white pt-9 flex gap-5">
              {showCategoryInput && (
                <>
                  <input
                    type="text"
                    placeholder="Category"
                    className="border-2 border-gray-500 px-2 text-black"
                    value={categoryInput}
                    onChange={handleCategoryInputChange}
                    onKeyDown={handleCategoryInputKeyPress}
                  />
                </>
              )}
              <button
                type="button"
                className="bg-purple1 color-white py-1 px-2"
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
