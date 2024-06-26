"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "../../../AuthContext";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const { logedin } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <div className="relative lg:px-8 flex justify-between p-3">
      {/* Hamburger Menu */}
      <div className="lg:hidden">
        <button onClick={toggleMenu} className="focus:outline-none">
          {menuOpen ? <FaTimes size={28} /> : <FaBars size={28} />}
        </button>
      </div>

      {/* Menu Items - Left Side */}
      <div className={`lg:flex flex-row gap-x-8 ${menuOpen ? 'block' : 'hidden'} lg:block lg:mr-auto`}>
        {!logedin ? (
          <>
            <ul className="nav-item cursor-pointer border-b-4 border-transparent">
              <Link href="/loginpage" onClick={closeMenu}>Login</Link>
            </ul>
            <ul className="nav-item cursor-pointer border-b-4 border-transparent">
              <Link href="/signuppage" onClick={closeMenu}>SignUp</Link>
            </ul>
          </>
        ) : (
          <>
            <ul className="nav-item cursor-pointer border-b-4 border-transparent">
              <Link href="/profilepage" onClick={closeMenu}>Profile</Link>
            </ul>
            <ul className="nav-item cursor-pointer border-b-4 border-transparent">
              <Link href="/signoutpage" onClick={closeMenu}>SignOut</Link>
            </ul>
          </>
        )}
      </div>

      {/* Logo */}
      <div className="font-bold text-2xl flex items-center justify-center cursor-pointer gap-1 absolute left-1/2 transform -translate-x-1/2 lg:static lg:transform-none">
        <div className="text-3xl font-poet text-purple1">X</div>
        <div className="text-xl">ploroScope</div>
      </div>

      {/* Menu Items - Right Side */}
      <div className={`lg:flex flex-row gap-x-8 ${menuOpen ? 'block' : 'hidden'} lg:block lg:ml-auto`}>
        <ul className="nav-item cursor-pointer border-b-4 border-transparent">
          <Link href="/" onClick={closeMenu}>Homepage</Link>
        </ul>
        <ul className="nav-item cursor-pointer border-b-4 border-transparent">
          <Link href="/createblogbypage" onClick={closeMenu}>CreatePost</Link>
        </ul>
        <ul className="nav-item cursor-pointer border-b-4 border-transparent">
          <Link href="/#section1" onClick={closeMenu}>Browse</Link>
        </ul>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-100 z-50 flex flex-col items-start py-4 px-6 shadow-lg">
          <button onClick={toggleMenu} className="self-end mb-4">
            <FaTimes size={28} />
          </button>
          {!logedin ? (
            <>
              <ul className="nav-item cursor-pointer py-2 px-4 w-full text-left border-b border-gray-300 hover:bg-purple1 hover:text-white transition-all duration-300">
                <Link href="/loginpage" onClick={closeMenu}>Login</Link>
              </ul>
              <ul className="nav-item cursor-pointer py-2 px-4 w-full text-left border-b border-gray-300 hover:bg-purple1 hover:text-white transition-all duration-300">
                <Link href="/signuppage" onClick={closeMenu}>SignUp</Link>
              </ul>
            </>
          ) : (
            <>
              <ul className="nav-item cursor-pointer py-2 px-4 w-full text-left border-b border-gray-300 hover:bg-purple1 hover:text-white transition-all duration-300">
                <Link href="/profilepage" onClick={closeMenu}>Profile</Link>
              </ul>
              <ul className="nav-item cursor-pointer py-2 px-4 w-full text-left border-b border-gray-300 hover:bg-purple1 hover:text-white transition-all duration-300">
                <Link href="/signoutpage" onClick={closeMenu}>SignOut</Link>
              </ul>
            </>
          )}
          <ul className="nav-item cursor-pointer py-2 px-4 w-full text-left border-b border-gray-300 hover:bg-purple1 hover:text-white transition-all duration-300">
            <Link href="/" onClick={closeMenu}>Homepage</Link>
          </ul>
          <ul className="nav-item cursor-pointer py-2 px-4 w-full text-left border-b border-gray-300 hover:bg-purple1 hover:text-white transition-all duration-300">
            <Link href="/createblogbypage" onClick={closeMenu}>CreatePost</Link>
          </ul>
          <ul className="nav-item cursor-pointer py-2 px-4 w-full text-left border-b border-gray-300 hover:bg-purple1 hover:text-white transition-all duration-300">
            <Link href="/#section1" onClick={closeMenu}>Browse</Link>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;
