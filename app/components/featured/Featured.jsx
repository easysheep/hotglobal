"use client";
import Featured from "@/app/Featured";
import { useAuth } from "../../../AuthContext";
import React from "react";

const FeaturedCards = () => {
  const { allposts } = useAuth();
  allposts.sort((a, b) => b.upvotes - a.upvotes);

  const featuredData = allposts.slice(0, 8).map((post) => ({
    title: post.title,
    imageUrl: post.imageUrl,
    upvotes: post.upvotes,
    downvotes: post.downvotes,
    desc: post.desc,
    time: post.time,
    postedOn: post.postedOn,
    postedBy: post.postedBy,
    content: post.content
  }));

  return (
    <div className="pt-4 pb-10">
      <div className="flex justify-between">
        <div className="text-6xl pb-4 font-bold">Hot Picks.</div>
        <div className="flex items-center font-raleway">
          See the latest trending hot topics
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4">
        {featuredData.map((data, index) => (
          <Featured key={index} {...data} />
        ))}
      </div>
    </div>
  );
};

export default FeaturedCards;

