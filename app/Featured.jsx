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
}) => {
  return (
    <div className="featured-card h-64 rounded-xl relative shadow-xl cursor-pointer bg-gray-200 ">
      <div className="img-cont w-full h-40 relative">
        <Image
          src={imageUrl}
          alt=""
          layout="fill"
          className=" object-cover "
          loading="lazy"

        />
      </div>
      <div className="card-title font-bold flex items-center pl-2 pt-2">
        {title}
      </div>
      <div className="buttons py-3 px-2 flex justify-between">
        <button>
          <Link
            href={{
              pathname: "/singleblog",
              query: { imageUrl:imageUrl,title: title, upvotes: upvotes,downvotes: downvotes,desc: desc,postedBy: postedBy,postedOn: postedOn,time: time},
            }}
          >
            <div className="hover:scale-105 hover:text-purple1 transition-transform duration-300">View Post</div>
            
          </Link>
        </button>
        <div className="likes-container">
          <span className="flex gap-1">
            {upvotes} <FaArrowAltCircleUp size={25} color={"rgb(40 228 138)"} />
          </span>
        </div>
      </div>
    </div>
  );
};

export default Featured;
