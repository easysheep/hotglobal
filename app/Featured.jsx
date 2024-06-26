import React from "react";
import { FaArrowAltCircleUp } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

const Featured = ({
  title,
  imageUrl,
  upvotes,
  downvotes,
  desc,
  postedOn,
  postedBy,
  time,
  content
}) => {
  const screenWidth = typeof window !== "undefined" ? window.innerWidth : 1280;
  let titleLimit = 60; // Default title limit

  // Adjust title limit for screens between 1024px and 1280px
  if (screenWidth >= 1024 && screenWidth < 1280) {
    titleLimit = 37; // New limit for screens between 1024px and 1280px
  }

  return (
    <div className="featured-card h-64 rounded-xl relative shadow-2xl cursor-pointer bg-slate-300">
      <div className="img-cont w-full h-40 relative">
        <Image
          src={imageUrl}
          alt=""
          layout="fill"
          className="object-cover"
          loading="lazy"
        />
      </div>
      <div className="card-title font-semibold font-monte flex items-center pl-2 pt-2">
        {title.length > titleLimit ? `${title.substring(0, titleLimit - 3)}...` : title}
      </div>

      <div className="buttons px-2 absolute bottom-2 left-2 right-2 flex justify-between">
        <button>
          <Link
            href={{
              pathname: "/singleblog",
              query: {
                imageUrl,
                title,
                upvotes,
                downvotes,
                desc,
                postedBy,
                postedOn,
                time,
                content
              },
            }}
          >
            <div className="hover:scale-105 hover:text-purple1 transition-transform duration-300 font-monte font-bold">
              View Post
            </div>
          </Link>
        </button>
        <div className="likes-container">
          <span className="flex gap-1">
            {upvotes}{" "}
            <FaArrowAltCircleUp size={25} color={"rgb(40 228 138)"} />
          </span>
        </div>
      </div>
    </div>
  );
};

export default Featured;
