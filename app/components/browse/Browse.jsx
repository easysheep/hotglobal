"use client";
import CategoryCard from "@/app/CategoryCard";
import React, { useState } from "react";
import RecentPost from "@/app/RecentPost";
import { useAuth } from "../../../AuthContext";
import { IoIosArrowDropleftCircle } from "react-icons/io";
import { IoIosArrowDroprightCircle } from "react-icons/io";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Import useRouter hook

const Browse = () => {
  const { allposts,pages } = useAuth();

  const [startIndex, setStartIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const handleNextClick = () => {
    const nextIndex = startIndex + 10;
    if (nextIndex < allposts.length) {
      smoothScrollToSection("section2");
      setStartIndex(nextIndex);
    }
  };

  const handlePreviousClick = () => {
    const prevIndex = startIndex - 10;
    if (prevIndex >= 0) {
      smoothScrollToSection("section2");
      setStartIndex(prevIndex);
    }
  };

  const smoothScrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const endIndex = Math.min(startIndex + 10, allposts.length);

  const categories = [
    { title: "Food", imageUrl: "/pizza.png" },
    { title: "Travel", imageUrl: "/travel.png" },
    { title: "Fashion", imageUrl: "/fashion.png" },
    { title: "Technology", imageUrl: "/tech.png" },
    { title: "Health & Fitness", imageUrl: "/health.png" },
    { title: "Institutes", imageUrl: "/education.png" },
    { title: "Sports", imageUrl: "/sports.png" },
    { title: "Books", imageUrl: "/books.png" },
    { title: "News", imageUrl: "/music.png" },
    { title: "Entertainment", imageUrl: "/movies.png" },
  ];

  

  const convertTimeToMilliseconds = (durationString) => {
    const durationUnitMap = {
      h: 3600000, // 1 hour in milliseconds
      d: 86400000, // 1 day in milliseconds
      w: 604800000, // 1 week in milliseconds
    };

    const durationUnit = durationString.slice(-1); // Get the last character of the duration string
    const durationValue = parseInt(durationString.slice(0, -1)); // Get the numerical value of duration, excluding the last character
    return durationValue * durationUnitMap[durationUnit]; // Convert to milliseconds
  };

  allposts.sort((a, b) => {
    const timeA = convertTimeToMilliseconds(a.time);
    const timeB = convertTimeToMilliseconds(b.time);
    return timeB - timeA;
  });

  const recentposts = allposts.slice(startIndex, endIndex).map((post) => ({
    title: post.title,
    imageUrl: post.imageUrl,
    upvotes: post.upvotes,
    downvotes: post.downvotes,
    desc: post.desc,
    time: post.time,
    postedOn: post.postedOn,
    postedBy: post.postedBy,
  }));

  const router = useRouter(); // Initialize useRouter hook

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (searchQuery.startsWith("#")) {
        // If searchQuery starts with '#', navigate to the other page
        const category = searchQuery.slice(1); // Remove the '#' from the start
        router.push(`/categorypage?category=${encodeURIComponent(category)}`);
      } else {
        // Existing code
        const page = pages.find(
          (p) => p.title.toLowerCase() === searchQuery.toLowerCase()
        );
        if (page) {
          router.push(
            `/blogpage?title=${encodeURIComponent(page.title)}&followers=${
              page.followers
            }&imageUrl=${page.imageUrl}`
          );
        } else {
          alert("Page not found");
        }
      }
    }
  };

  return (
    <div>
      <div className="pt-10 pb-10">
        <div className="flex justify-between">
          <div className="text-6xl font-bold">Browse.</div>
          <div className="flex items-end" id="section1">
            Browse your favourite categories and pages
          </div>
        </div>

        <div className="cardcontainer grid grid-cols-5 gap-4 pt-6 pb-12">
          {categories.map((data, index) => (
            <Link
              href={{
                pathname: "/categorypage",
                query: { category: data.title },
              }}
              key={index}
            >
              <CategoryCard {...data} />
            </Link>
          ))}
        </div>
        <div className="flex justify-center mb-10 mt-10">
          <input
            type="text"
            placeholder="Search Categories Or Popular Pages"
            className="w-2/5 border px-10 py-2 rounded-3xl border-black"
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={handleSearch}
          />
        </div>

        <div className="two-box flex gap-2 h-96" id="section2">
          <div className="left w-3/4 p-2">
            <div className="text-3xl font-bold">Recent Posts</div>
            <div className="grid grid-row-8 gap-8 pt-4 pb-6">
              {recentposts.map((data, index) => {
                return <RecentPost key={index} {...data} />;
              })}
            </div>

            <div className="flex justify-between text-white pb-6">
              <button
                className={`py-1 px-2 ${startIndex === 0 ? "opacity-50" : ""}`}
                onClick={handlePreviousClick}
                disabled={startIndex === 0}
              >
                <IoIosArrowDropleftCircle
                  size={40}
                  color={"rgb(162 107 206)"}
                />
              </button>
              <button
                className={`py-1 px-2 ${
                  endIndex === allposts.length ? "opacity-50" : ""
                }`}
                onClick={handleNextClick}
                disabled={endIndex === allposts.length}
              >
                <IoIosArrowDroprightCircle
                  size={40}
                  color={"rgb(162 107 206)"}
                />
              </button>
            </div>
          </div>
          <div className="right w-1/4 p-2">
            <div className="text-3xl font-bold pb-3">Popular Pages</div>
            <div className="gap-3 flex flex-col">
              {pages.map((data, index) => (
                <Link
                  href={{
                    pathname: "/blogpage",
                    query: {
                      title: data.title,
                      followers: data.followers,
                      imageUrl: data.imageUrl,
                    },
                  }}
                  key={index}
                >
                  <div className="text rounded-lg bg-gray-100 py-2 px-2 cursor-pointer flex justify-between shadow-md transition-all duration-300 hover:bg-purple1 hover:text-white">
                    <span className="text-base">{data.title}</span>
                    <span className="text-xs flex items-center">
                      {data.followers}+
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Browse;
