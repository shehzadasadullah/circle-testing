import React from "react";
import dynamic from "next/dynamic";
import Header from "../Common/Header";
import Footer from "../Common/Footer";
import PrivacyContent from "./PrivacyContent";

const AboutMain = () => {
  return (
    <div className="w-full h-full bg-[#E9EDF5]">
      <div className="w-full h-full">
        <Header type="light" />
      </div>
      <div className="w-full h-full">
        <PrivacyContent />
      </div>

      <Footer />
    </div>
  );
};

export default AboutMain;
