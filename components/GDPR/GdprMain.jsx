import React from "react";
import dynamic from "next/dynamic";
import Header from "../Common/Header";
import GdprContent from "./GdprContent";
import Footer from "../Common/Footer";

const AboutMain = () => {
  return (
    <div className="w-full h-full bg-[#E9EDF5]">
      <div className="w-full h-full  flex flex-col justify-start items-start relative bg-[#E9EDF5]">
        <div className="w-full h-full">
          <Header type="light" />
        </div>
        <div className="w-full h-full">
          <GdprContent />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AboutMain;
