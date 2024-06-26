import React from "react";
import Image from "next/image";
import Link from "next/link";
const RecentPostProfilePage = ({ title, desc, time, postedOn, upvotes, downvotes,postedBy,imageUrl,content,uID }) => {
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
          imageUrl:imageUrl,
          content:content,
          uID:uID,
        },
      }}
    >
      <div className="cnt flex flex-col rounded-lg shadow-2xl  cursor-pointer bg-gray-200 transition-transform duration-300 transform hover:scale-105 border-2">
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
            <div className="pt-3 flex justify-between gap-2">
              <div className="text-3xl font-semibold font-raleway">{title}</div>
            </div>
            <span className="font-roboto">{desc}</span>
            <div className="flex justify-between absolute bottom-1 w-full">
              <div className="text-lg flex gap-2 font-roboto">
                Posted On: <div className="text-purple-800"> {postedOn}</div>{" "}
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </Link>
  );
};

export default RecentPostProfilePage;
