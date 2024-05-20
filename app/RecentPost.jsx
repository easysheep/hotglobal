import React from "react";
import Image from "next/image";
import { FaArrowAltCircleUp } from "react-icons/fa";
import { FaArrowAltCircleDown } from "react-icons/fa";
import Link from "next/link";
const RecentPost = ({ title, desc, time, postedOn, upvotes, downvotes,postedBy,imageUrl }) => {
  return (
    <Link
      href={{
        pathname: "/singleblog",
        query: {
          title: title,
          upvotes: upvotes,
          downvotes: downvotes,
          desc: desc,
          postedBy: postedBy,
          postedOn: postedOn,
          time: time,
          imageUrl:imageUrl
        },
      }}
    >
      <div className="cnt flex flex-col rounded-lg shadow-2xl  cursor-pointer bg-gray-50 transition-transform duration-300 transform hover:scale-105 border-2">
        <div className="flex flex-row">
          <div className="leftcnt w-2/6 h-48 relative">
            <Image
              src={imageUrl}
              alt=""
              layout="fill"
              className="object-cover"
              loading="lazy"
              
              
            />
          </div>
          <div className="rightcnt w-4/6 py-1 px-2 relative">
            <div className="pt-3 flex justify-between">
              <div className="text-3xl">{title}</div>
              <div className="flex text-sm items-end font-bold">{time} ago</div>
            </div>
            <span className="">{desc}</span>
            <div className="flex justify-between absolute bottom-1 w-full">
              <div className="text-sm flex gap-2">
                Posted On: <div className="text-purple-800"> {postedOn}</div>{" "}
              </div>
              <div className="flex gap-2 pr-5 pb-2">
                <button className="font-bold flex gap-1">
                  {upvotes}
                  <FaArrowAltCircleUp size={25} color={"rgb(40 228 138)"} />
                </button>
                <button className="font-bold flex gap-1">
                  {downvotes}{" "}
                  <FaArrowAltCircleDown size={25} color={"rgb(196 57 57)"} />
                </button>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </Link>
  );
};

export default RecentPost;
