"use client"
import React from "react";
import Image from "next/image";
import { FaArrowAltCircleUp } from "react-icons/fa";
import { FaArrowAltCircleDown } from "react-icons/fa";
import { useSearchParams } from "next/navigation";
const SingleBlog = () => {
  const searchParams = useSearchParams();
  const postedOn = searchParams.get("postedOn");
  const title = searchParams.get("title");
  const desc = searchParams.get("desc");
  const time = searchParams.get("time");
  const postedBy = searchParams.get("postedBy");
  const upvotes = searchParams.get("upvotes");
  const downvotes = searchParams.get("downvotes");
  const imageUrl = searchParams.get("imageUrl");




















  return (
    <div className="">
      <div className="p-4  mt-1 rounded-xl">
        <div className="cnt  flex flex-col pt-1">
          <div className="flex flex-col">
            <div className="upcnt  h-60 relative pt-1">
              <Image
                src={imageUrl}
                alt="/pizza.png"
                layout="fill"
                className="object-cover"
                priority
              />
            </div>
            <div className="downcnt   px-2 relative">
              <div className=" flex justify-center mt-2">
                <div className="text-3xl font-bold text-purple1  ">{title}</div>
                
              </div>

              <div className="flex justify-between mt-2">
                <div className="">
                <div className="text-lg pt-2 flex gap-1">Posted On: <div className="font-bold cursor-pointer text-purple1">{postedOn}</div></div>
                  
                </div>
                <div className="flex itmes-center">
                <div className="flex text-lg items-end font-bold">{time} ago</div>


                </div>
                

              </div>
              <div className="py-4">
                <div >{desc}</div>
              </div>

              <div className="flex justify-between">
                <div className="flex gap-2 ">By <div className="font-bold cursor-pointer text-purple1">{postedBy}</div></div>
                <div className="flex gap-2 pr-5 justify-end">
                  <button className="font-bold flex gap-1 mx-1">{upvotes} <FaArrowAltCircleUp size={25} color={'rgb(40 228 138)'} /></button>
                  <button className="font-bold flex gap-1 ml-1">{downvotes} <FaArrowAltCircleDown size={25} color={'rgb(196 57 57)'}/></button>
                </div>
            
  
              </div>
              

              
                
               
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleBlog;
