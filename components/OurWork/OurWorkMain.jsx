import React from "react";
import dynamic from "next/dynamic";
const Header = dynamic(() => import("../Common/Header"), { ssr: false });
const Footer = dynamic(() => import("../Common/Footer"), { ssr: false });
const OurWorkContent = dynamic(() => import("./OurWorkContent"), {
  ssr: false,
});

const OurWorkMain = () => {
  return (
    <div className="w-full h-full bg-[#E9EDF5]">
      <div className="w-full h-full  flex flex-col justify-start items-start relative bg-[#E9EDF5]">
        <div className="w-full h-full">
          <Header type="light" page="our-work" />
        </div>
        <div className="w-full h-full">
          <OurWorkContent />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OurWorkMain;
