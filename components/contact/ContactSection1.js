import Header from "@/components/Common/Header";
import React from "react";
import Image from "next/image";
import { HeartIcon } from "@/icons";
import Footer from "@/components/Common/Footer";

const ContactSection1 = () => {
  return (
    <div>
      <Header type="light" page="contact" />
      <div className="w-full h-full flex flex-col justify-start items-start relative">
        {/* <div
          className="w-full h-[330px] absolute top-0 right-0 bottom-0 "
          style={{ zIndex: 0 }}
        >
          <img
            src={"/contactImage1.webp"}
            alt="background Vector"
            className="w-full h-full object-cover"
          />
        </div> */}
        <div className="absolute  left-0 w-full h-full flex flex-col items-center justify-center mt-40">
          <p
            className="text-black text-6xl font-normal w-full flex items-center justify-center"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontStyle: "normal",
              fontWeight: 400,

              lineHeight: "125%",
              display: "flex",
              alignItems: "flex-end",
            }}
          >
            Contact Us
          </p>
          <p
            className="text-black text-2xl font-semibold w-full flex items-center justify-center py-2"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontStyle: "normal",
              fontWeight: 400,

              lineHeight: "125%",
              display: "flex",
              alignItems: "flex-end",
            }}
          >
            Where we are
          </p>
        </div>
        <div></div>
        {/* <div className="w-full h-full">
          
        </div> */}
      </div>
    </div>
  );
};

export default ContactSection1;
