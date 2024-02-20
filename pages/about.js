import Head from "next/head";
import React from "react";
import dynamic from "next/dynamic";
import Header from "@/components/Common/Header";
import Footer from "@/components/Common/Footer";
import img from "@/public/21.png";

const About = () => {
  return (
    <>
      <Head>
        <title>CIRCLE - About Us</title>
        <meta
          name="description"
          content="Circle.ooo ❤️'s our customers! Events: beautiful, fast & simple for all."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={`w-full h-full`}>
        <div className="w-full h-full bg-[#F8F9FD]">
          <div className="w-full">
            <Header type="light" page="about" />
          </div>
          <div className="flex justify-center items-center w-full bg-[#F8F9FD]">
            <div className="flex bg-[#F8F9FD] flex-col lg:flex-row p-6 lg:p-10 mt-10 mb-10 justify-center w-[90%] lg:w-[90%] items-center rounded-xl border-[#E0E0E0] border-[1px]">
              <div className="w-full lg:w-1/2 flex flex-col justify-center lg:justify-start items-center lg:items-start">
                <p className="text-5xl text-center lg:text-start lg:text-6xl font-bold w-full text-[#00384F]">
                  About Us
                </p>
                <p className="text-[#0E0E11] w-full text-center lg:text-start lg:w-[90%] text-lg mt-8 lg:mt-5">
                  After talking to hundreds of Event Hosts and Attendees, we
                  learned that almost all shared the same concerns.
                </p>
                <p className="text-[#0E0E11] mt-2 w-full text-center lg:text-start lg:w-[90%] text-lg mt-8 lg:mt-5">
                  Circle was born to thrill All Event Participants!
                </p>
                <p className="text-[#0E0E11] mt-2 w-full text-center lg:text-start lg:w-[90%] text-lg mt-8 lg:mt-5">
                  OOO: The Last App, Digicard, Event tech Account and Conference
                  App you’ll ever need….
                </p>
                <div className="w-full text-center flex justify-center items-center">
                  <img
                    src={img.src}
                    alt=""
                    className="mt-10 text-center h-96 lg:h-[400pt] ml-[-2%] lg:ml-[-12%] lg:mt-[8%]"
                  />
                </div>
              </div>
              <div className="w-full lg:w-1/2 flex flex-col justify-center items-center mt-8 lg:mt-0 gap-y-5">
                <div className="flex p-5 flex-col lg:flex-row justify-center lg:justify-start items-center w-full border-[1px] border-[#E0E0E0] rounded-xl">
                  <div className="h-10 w-12 p-7 bg-[#007BAB] text-lg font-bold text-white flex rounded-full justify-center items-center">
                    1.
                  </div>
                  <p className="flex justify-center text-center lg:text-start mt-3 lg:mt-0 items-center text-[#000] text-lg lg:ml-3">
                    Too many steps to create & invite to events.
                    {/* Too many contacts in their phone, many of whom they don’t
                    remember ir outdated. */}
                  </p>
                </div>
                <div className="flex p-5 flex-col lg:flex-row justify-center lg:justify-start items-center w-full border-[1px] border-[#E0E0E0] rounded-xl">
                  <div className="h-10 w-12 p-7 bg-[#007BAB] text-lg font-bold text-white flex rounded-full justify-center items-center">
                    2.
                  </div>
                  <p className="flex justify-center text-center lg:text-start mt-3 lg:mt-0 items-center text-[#000] text-lg lg:ml-3">
                    Both Hosts & Attendees don't remember who they met.
                  </p>
                </div>
                <div className="flex p-5 flex-col lg:flex-row justify-center lg:justify-start items-center w-full border-[1px] border-[#E0E0E0] rounded-xl">
                  <div className="h-10 w-12 p-7 bg-[#007BAB] text-lg font-bold text-white flex rounded-full justify-center items-center">
                    3.
                  </div>
                  <p className="flex justify-center text-center lg:text-start mt-3 lg:mt-0 items-center text-[#000] text-lg lg:ml-3">
                    Have Lists of LinkedIn contacts they don't remember.
                  </p>
                </div>
                <div className="flex p-5 flex-col lg:flex-row justify-center lg:justify-start items-center w-full border-[1px] border-[#E0E0E0] rounded-xl">
                  <div className="h-10 w-12 p-7 bg-[#007BAB] text-lg font-bold text-white flex rounded-full justify-center items-center">
                    4.
                  </div>
                  <p className="flex justify-center text-center lg:text-start mt-3 lg:mt-0 items-center text-[#000] text-lg lg:ml-3">
                    People want to know who they should meet.
                  </p>
                </div>
                <div className="flex p-5 flex-col lg:flex-row justify-center lg:justify-start items-center w-full border-[1px] border-[#E0E0E0] rounded-xl">
                  <div className="h-10 w-12 p-7 bg-[#007BAB] text-lg font-bold text-white flex rounded-full justify-center items-center">
                    5.
                  </div>
                  <p className="flex justify-center text-center lg:text-start mt-3 lg:mt-0 items-center text-[#000] text-lg lg:ml-3">
                    Hosts & Sponsors need more and better data.
                  </p>
                </div>
                <div className="flex p-5 flex-col lg:flex-row justify-center lg:justify-start items-center w-full border-[1px] border-[#E0E0E0] rounded-xl">
                  <div className="h-10 w-12 p-7 bg-[#007BAB] text-lg font-bold text-white flex rounded-full justify-center items-center">
                    6.
                  </div>
                  <p className="flex justify-center text-center lg:text-start mt-3 lg:mt-0 items-center text-[#000] text-lg lg:ml-3">
                    People prefer text reminders.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default About;
