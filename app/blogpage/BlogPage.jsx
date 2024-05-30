"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import RecentPost from "../RecentPost";
import { useSearchParams } from "next/navigation";
import { useAuth } from "../../AuthContext";
import { TiTick } from "react-icons/ti";
import { toast } from "react-toastify";
import { Bounce } from "react-toastify";
import { useRouter } from "next/navigation";
import {
  getDatabase,
  ref as dbRef,
  update,
  push,
  child,
  get,
} from "firebase/database";
import { db } from "../../Firebaseconfig";
const BlogPage = () => {
  const { allposts } = useAuth();
  const { logedin } = useAuth();
  const { currentUser } = useAuth();
  const [pageposts, setpageposts] = useState([]);
  const searchParams = useSearchParams();
  const title = searchParams.get("title");
  const followers = searchParams.get("followers");
  const imageUrl = searchParams.get("imageUrl");
  const [showPosts, setShowPosts] = useState(true);
  const [followed, setFollowed] = useState(false);
  const router = useRouter();
  const togglePostsVisibility = () => {
    setShowPosts(!showPosts);
  };



  useEffect(() => {
    const checkIfFollowed = async () => {
      console.log("use effect ran");
      if (currentUser) {
        try {
          const followedPagesRef = dbRef(
            db,
            `users/${currentUser.uid}/followedpages`
          );
          const snapshot = await get(followedPagesRef);
          if (snapshot.exists()) {
            let keyToDelete = null;
            snapshot.forEach((childSnapshot) => {
              const childData = childSnapshot.val();
              if (
                childData.title === title &&
                childData.followers === followers
              ) {
                keyToDelete = childSnapshot.key;
                console.log("found");
              }
            });
            
            if (keyToDelete) {
              setFollowed(true);
              console.log("follwing is true");
            }
            else {
              setFollowed(false);
              console.log("follwing is false");
            }
          }
        } catch (error) {
          console.error("Error checking followed pages: ", error);
        }
      }
    };
  
    checkIfFollowed();
  }, []);
  
  const handlefollow = async () => {
    if (logedin) {
      setFollowed(!followed);
      try {
        const postData = {
          title: title,
          followers: followers,
        };

        if (followed) {
          // If already followed, find the key of the followed page and remove it
          const followedPagesRef = dbRef(
            db,
            `users/${currentUser.uid}/followedpages`
          );
          const snapshot = await get(followedPagesRef);

          if (snapshot.exists()) {
            let keyToDelete = null;
            snapshot.forEach((childSnapshot) => {
              const childData = childSnapshot.val();
              if (
                childData.title === title &&
                childData.followers === followers
              ) {
                keyToDelete = childSnapshot.key;
              }
            });

            if (keyToDelete) {
              const updates = {};
              updates[`users/${currentUser.uid}/followedpages/${keyToDelete}`] =
                null;
              await update(dbRef(db), updates);
              toast.success("Unfollowed Successfully", {
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
              console.error("Page not found in followed pages");
            }
          }
        } else {
          // If not followed, add the new postData
          const newFollowedPageKey = push(
            child(dbRef(db), `users/${currentUser.uid}/followedpages`)
          ).key;
          const updates = {};
          updates[
            `users/${currentUser.uid}/followedpages/` + newFollowedPageKey
          ] = postData;

          await update(dbRef(db), updates);
          toast.success("Followed Successfully", {
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
        }
      } catch (error) {
        console.error("Error following/unfollowing the page: ", error);
        toast.error("Error following/unfollowing the page", {
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
      }
    } else {
      console.log("Please log in.");
      toast.warn("Login To Follow", {
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
    }
  };

  console.log("Current user ID: ", currentUser?.uid);
  const handlecreate = () => {
    if (logedin) {
      router.push(`/createblogbypage?postedOn=${encodeURIComponent(title)}`);
    } else {
      console.log("Please log in.");
      toast.warn("Login To Create", {
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
    }
  };
  useEffect(() => {
    const filteredPosts = allposts.filter((ele) => ele.postedOn === title);
    setpageposts(filteredPosts);

    console.log(filteredPosts);
    console.log(followers);
  }, [allposts, title]);
  const formattedImageUrl = imageUrl.startsWith("/")
    ? imageUrl
    : `/${imageUrl}`;

  return (
    <div>
      <div className="h-1 bg-slate-800  mb-3"></div>
      <div className="leftcnt w-full h-60 relative py-3">
        <Image
          src={formattedImageUrl}
          alt=""
          className="object-cover"
          priority
          fill
        />
      </div>

      <div className="flex justify-between">
        <div className="font-bold text-8xl font-raleway">{title}.</div>
        <div className="flex gap-1 items-center">
          <div className="font-bold text-purple1">{followers}</div>
          <div className=" font-roboto">follow this page</div>
        </div>
      </div>
      <div className="flex gap-3 text-white pt-10 justify-between">
        <div className="flex gap-3">
          <button
            className="bg-purple1 py-1 px-2 font-roboto"
            onClick={togglePostsVisibility}
          >
            {showPosts ? "Hide Posts" : "Show Posts"}
          </button>
          <button
            className="bg-purple1 py-1 px-2 font-roboto"
            onClick={handlecreate}
          >
            Create +
          </button>
        </div>

        <div className="flex">
          <button
            className="bg-purple1 py-1 px-2 flex font-roboto"
            onClick={handlefollow}
          >
            {followed ? "Unfollow" : "Follow"}
            {/* {!followed && <TiTick size={25} />} */}
          </button>
        </div>
      </div>

      <div className="pt-4 pb-8 flex flex-col gap-4">
        {showPosts &&
          pageposts.map((data, index) => {
            return <RecentPost key={index} {...data} />;
          })}
      </div>
    </div>
  );
};

export default BlogPage;
