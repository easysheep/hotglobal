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
const BlogPage = () => {
  const { allposts } = useAuth();
  const { logedin } = useAuth();
  const [pageposts, setpageposts] = useState([]);
  const searchParams = useSearchParams();
  const title = searchParams.get("title");
  const followers = searchParams.get("followers");
  const imageUrl = searchParams.get("imageUrl");
  const [showPosts, setShowPosts] = useState(true);
  const [followed, setFollowed] = useState(true);
  const router = useRouter(); 
  const togglePostsVisibility = () => {
    setShowPosts(!showPosts);
  };
  const handlefollow = () => {
    if (logedin) {
      setFollowed(!followed);
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
  const formattedImageUrl = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;

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
        <div className="font-bold text-8xl">{title}.</div>
        <div className="flex gap-1 items-center">
          <div className="font-bold text-purple1">{followers}</div>
          <div className="">follow this page</div>
        </div>
      </div>
      <div className="flex gap-3 text-white pt-10 justify-between">
        <div className="flex gap-3">
          <button
            className="bg-purple1 py-1 px-2"
            onClick={togglePostsVisibility}
          >
            {showPosts ? "Hide Posts" : "Show Posts"}
          </button>
          <button className="bg-purple1 py-1 px-2" onClick={handlecreate}>
            Create +
          </button>
        </div>

        <div className="flex">
          <button className="bg-purple1 py-1 px-2 flex" onClick={handlefollow}>
            {followed ? "Follow" : `Following ${" "}`}
            {!followed && <TiTick size={25} />}
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
