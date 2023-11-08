import React from "react";
import dynamic from "next/dynamic";
const Header = dynamic(() => import("../Common/Header"), { ssr: false });
const Footer = dynamic(() => import("../Common/Footer"), { ssr: false });
const TermsContent = dynamic(() => import("./TermsContent"), {
  ssr: false,
});

const AboutMain = () => {
  return (
    <div className="w-full h-full bg-[#E9EDF5]">
      <div className="w-full h-full  flex flex-col justify-start items-start relative bg-[#E9EDF5]">
        <div className="w-full h-full">
          <Header type="light" page="about" />
        </div>
        <div className="w-full h-full">
          <TermsContent/>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AboutMain;
