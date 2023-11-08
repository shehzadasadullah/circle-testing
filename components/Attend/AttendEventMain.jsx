import React from "react";
import dynamic from "next/dynamic";
import EventDetails from "@/pages/event/[eventid]";
const Footer = dynamic(() => import("../Common/Footer"), { ssr: false });
const Header = dynamic(() => import("../Common/Header"), { ssr: false });

const AttendEventMain = () => {
  return (
    <div className="w-full h-full bg-[#E9EDF5]">
      <div className="w-full h-full  flex flex-col justify-start items-start relative bg-[#E9EDF5]">
        <div className="w-full h-full">
          <Header type="light" page="attend" />
        </div>
        <div className="w-full h-full">
          <EventDetails />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AttendEventMain;
