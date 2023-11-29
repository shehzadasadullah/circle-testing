import React from "react";
import dynamic from "next/dynamic";
import EventDetails from "@/pages/event/[eventid]";
const InviteToApp = dynamic(() => import("../Home/InviteToApp"), {
  ssr: false,
});
const Footer = dynamic(() => import("../Common/Footer"), { ssr: false });
const Header = dynamic(() => import("../Common/Header"), { ssr: false });

const AttendEventMain = () => {
  return (
    <div className="w-full h-full bg-[#00384F]">
      <div className="w-full h-full  flex flex-col justify-start items-start relative bg-[#00384F]">
        <div className="w-full h-full">
          <Header type="dark" />
        </div>
        <div className="w-full h-full">
          <EventDetails />
        </div>
      </div>
      <InviteToApp />
      <Footer />
    </div>
  );
};

export default AttendEventMain;
