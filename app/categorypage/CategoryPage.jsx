"use client";
import React, { useEffect, useState } from "react";
import RecentPost from "../RecentPost";
import { useSearchParams } from "next/navigation";
import { useAuth } from "../../AuthContext";
import { useRouter } from "next/navigation";
const CategoryPage = () => {
  const { allposts } = useAuth();
  const searchParams = useSearchParams();
  const category = searchParams.get("category").toLowerCase();
  const [categoryPosts, setcategoryPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const filteredPosts = allposts.filter((ele) =>
      ele.categories.map((cat) => cat.toLowerCase()).includes(category)
    );
    setcategoryPosts(filteredPosts);
  }, [allposts, category]);
  const router = useRouter();

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
            }`
          );
        } else {
          alert("Page not found");
        }
      }
    }
  };

  return (
    <div>
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
      <div className="flex gap-2 text-5xl  pt-6">
        <div className="font-roboto">Posts For </div>
        <div className="font-black text-purple1 font-roboto">{category}</div>
      </div>
      <div className="pt-4 pb-8 flex flex-col gap-4">
        {categoryPosts.length > 0 ? (
          categoryPosts.map((data, index) => (
            <RecentPost key={index} {...data} />
          ))
        ) : (
          <div className="flex mt-20 gap-4 flex-col xl:flex-row  xl:items-start  xl:text-left">
          <div className="font-monte text-5xl xl:text-8xl font-bold">Nothing to</div>
          <div className="font-monte text-2xl xl:text-4xl font-bold text-purple1  xl:mb-0">show</div>
          <div className="font-monte text-5xl xl:text-8xl font-bold">here</div>
        </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
