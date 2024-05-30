"use client"
import React from "react";
import Link from "next/link";
import { useAuth } from "../../../AuthContext";

const Navbar = () => {
  const {logedin} = useAuth();

  return (
    <div className="px-8 flex justify-between p-3">
      {!logedin ? (
        <div className="flex flex-row gap-x-8 flex-1 justify-start">
          <ul className="nav-item cursor-pointer border-b-4 border-transparent hover:border-purple1 transition-all duration-300">
            <Link href="loginpage">Login</Link>
          </ul>
          <ul className="nav-item cursor-pointer border-b-4 border-transparent hover:border-purple1 transition-all duration-300">
            <Link href="signuppage">SignUp</Link>
          </ul>
        </div>
      ) : (
        <div className="flex flex-row gap-x-8 flex-1 justify-start">
          <ul className="nav-item cursor-pointer border-b-4 border-transparent hover:border-purple1 transition-all duration-300">
            <Link href="profilepage">Profile</Link>
          </ul>
          <ul className="nav-item cursor-pointer border-b-4 border-transparent hover:border-purple1 transition-all duration-300">
            <Link href="signoutpage">SignOut</Link>
          </ul>
        </div>
      )}

      <div className="font-bold text-2xl flex-1 items-center justify-center flex cursor-pointer gap-1">
        <div className="text-3xl font-poet text-purple1">X</div>
        <div className="text-xl">ploroScope</div>
      </div>

      <div className="flex flex-row gap-x-8 flex-1 justify-end">
        <ul className="nav-item cursor-pointer border-b-4 border-transparent hover:border-purple1 transition-all duration-300">
          <Link href="/">Homepage</Link>
        </ul>
        <ul className="nav-item cursor-pointer border-b-4 border-transparent hover:border-purple1 transition-all duration-300">
          <Link href="/createblogbypage">CreatePost</Link>
        </ul>
        <ul className="nav-item cursor-pointer border-b-4 border-transparent hover:border-purple1 transition-all duration-300">
          <Link href="/#section1">Browse</Link>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
