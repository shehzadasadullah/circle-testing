import React from "react";
import dynamic from "next/dynamic";
const AttendHero = dynamic(() => import("./AttendHero"), { ssr: false });
const Footer = dynamic(() => import("../Common/Footer"), { ssr: false });

const AttendMain = () => {
  return (
    <div className="w-full h-full bg-[#E9EDF5]">
      <AttendHero />
      <Footer />
    </div>
  );
};

export default AttendMain;
