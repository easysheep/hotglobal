import React from "react";
import Navbar from './components/navbar/Navbar'
import Featured from "./components/featured/Featured";
import Browse from "./components/browse/Browse";
import Footer from "./components/footer/Footer";
const page = () => {
  return (
    <div>
      <Featured></Featured>
      <Browse></Browse>
      <Footer></Footer>
    </div>
  );
};

export default page;
