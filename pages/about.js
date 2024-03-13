import Head from "next/head";
import React from "react";
import dynamic from "next/dynamic";
import Header from "@/components/Common/Header";
import Footer from "@/components/Common/Footer";
import img from "@/public/21.png";
import bgImage from "@/public/revamp/bg-new.png";
import bgImageInner from "@/public/revamp/bg-sec5.png";

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
        <div
          style={{
            backgroundImage: `url(${bgImage.src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
          className="w-full h-full"
        >
          <div className="w-full">
            <Header type="dark" page="about" />
          </div>
          <div className="flex justify-center items-center w-full">
            <div
              style={{
                backgroundImage: `url(${bgImageInner.src})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                border: "1px solid rgba(25, 112, 214, 0.30)",
                boxShadow:
                  "0px 13px 29px 0px rgba(0, 0, 0, 0.07), 0px 53px 53px 0px rgba(0, 0, 0, 0.06), 0px 118px 71px 0px rgba(0, 0, 0, 0.03), 0px 211px 84px 0px rgba(0, 0, 0, 0.01), 0px 329px 92px 0px rgba(0, 0, 0, 0.00)",
              }}
              className="flex flex-col lg:flex-row p-6 lg:p-10 mt-10 mb-10 justify-center w-[90%] lg:w-[90%] items-center rounded-xl "
            >
              <div className="w-full lg:w-1/2 flex flex-col justify-center lg:justify-start items-center lg:items-start">
                <p
                  style={{
                    background:
                      "linear-gradient(97deg, #FFF 18.18%, rgba(255, 255, 255, 0.00) 148.38%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text", // Add the Webkit prefix for older browsers
                    WebkitTextFillColor: "transparent", // Add the Webkit prefix for older browsers
                  }}
                  className="text-5xl text-center lg:text-start lg:text-6xl font-bold w-full"
                >
                  About Us
                </p>
                <p className="text-[#F8F9FD] w-full text-center lg:text-start lg:w-[90%] text-lg mt-8 lg:mt-5">
                  After talking to hundreds of Event Hosts and Attendees, we
                  learned that almost all shared the same concerns. Circle was
                  born to thrill All Event Participants!
                </p>
                <div className="w-full text-center flex justify-center items-center">
                  <img
                    src={img.src}
                    alt=""
                    className="mt-10 object-contain text-center w-full h-full lg:h-[500px] ml-[-2%] lg:ml-[-12%] lg:mt-[8%]"
                  />
                </div>
              </div>
              <div className="w-full lg:w-1/2 flex flex-col justify-center items-center mt-8 lg:mt-0 gap-y-5">
                <div
                  style={{
                    border: "1px solid rgba(25, 112, 214, 0.30)",
                    background: "rgba(28, 34, 44, 0.60)",
                    boxShadow:
                      "0px 13px 29px 0px rgba(0, 0, 0, 0.07), 0px 53px 53px 0px rgba(0, 0, 0, 0.06), 0px 118px 71px 0px rgba(0, 0, 0, 0.03), 0px 211px 84px 0px rgba(0, 0, 0, 0.01), 0px 329px 92px 0px rgba(0, 0, 0, 0.00)",
                  }}
                  className="flex p-5 flex-col lg:flex-row justify-center lg:justify-start items-center w-full rounded-xl"
                >
                  <div
                    style={{
                      background:
                        "linear-gradient(90deg, #4532BF 5.81%, #9429FF 100%)",
                    }}
                    className="h-10 w-12 p-7 text-lg font-bold text-white flex rounded-full justify-center items-center"
                  >
                    1.
                  </div>
                  <p className="flex justify-center text-center lg:text-start mt-3 lg:mt-0 items-center text-[#fff] text-lg lg:ml-3">
                    Too many steps to create & invite to events.
                    {/* Too many contacts in their phone, many of whom they don’t
                    remember ir outdated. */}
                  </p>
                </div>
                <div
                  style={{
                    border: "1px solid rgba(25, 112, 214, 0.30)",
                    background: "rgba(28, 34, 44, 0.60)",
                    boxShadow:
                      "0px 13px 29px 0px rgba(0, 0, 0, 0.07), 0px 53px 53px 0px rgba(0, 0, 0, 0.06), 0px 118px 71px 0px rgba(0, 0, 0, 0.03), 0px 211px 84px 0px rgba(0, 0, 0, 0.01), 0px 329px 92px 0px rgba(0, 0, 0, 0.00)",
                  }}
                  className="flex p-5 flex-col lg:flex-row justify-center lg:justify-start items-center w-full rounded-xl"
                >
                  <div
                    style={{
                      background:
                        "linear-gradient(90deg, #4532BF 5.81%, #9429FF 100%)",
                    }}
                    className="h-10 w-12 p-7 text-lg font-bold text-white flex rounded-full justify-center items-center"
                  >
                    2.
                  </div>
                  <p className="flex justify-center text-center lg:text-start mt-3 lg:mt-0 items-center text-[#fff] text-lg lg:ml-3">
                    Both Hosts & Attendees don't remember who they met.
                  </p>
                </div>
                <div
                  style={{
                    border: "1px solid rgba(25, 112, 214, 0.30)",
                    background: "rgba(28, 34, 44, 0.60)",
                    boxShadow:
                      "0px 13px 29px 0px rgba(0, 0, 0, 0.07), 0px 53px 53px 0px rgba(0, 0, 0, 0.06), 0px 118px 71px 0px rgba(0, 0, 0, 0.03), 0px 211px 84px 0px rgba(0, 0, 0, 0.01), 0px 329px 92px 0px rgba(0, 0, 0, 0.00)",
                  }}
                  className="flex p-5 flex-col lg:flex-row justify-center lg:justify-start items-center w-full rounded-xl"
                >
                  <div
                    style={{
                      background:
                        "linear-gradient(90deg, #4532BF 5.81%, #9429FF 100%)",
                    }}
                    className="h-10 w-12 p-7 text-lg font-bold text-white flex rounded-full justify-center items-center"
                  >
                    3.
                  </div>
                  <p className="flex justify-center text-center lg:text-start mt-3 lg:mt-0 items-center text-[#fff] text-lg lg:ml-3">
                    Have Lists of LinkedIn contacts they don't remember.
                  </p>
                </div>
                <div
                  style={{
                    border: "1px solid rgba(25, 112, 214, 0.30)",
                    background: "rgba(28, 34, 44, 0.60)",
                    boxShadow:
                      "0px 13px 29px 0px rgba(0, 0, 0, 0.07), 0px 53px 53px 0px rgba(0, 0, 0, 0.06), 0px 118px 71px 0px rgba(0, 0, 0, 0.03), 0px 211px 84px 0px rgba(0, 0, 0, 0.01), 0px 329px 92px 0px rgba(0, 0, 0, 0.00)",
                  }}
                  className="flex p-5 flex-col lg:flex-row justify-center lg:justify-start items-center w-full rounded-xl"
                >
                  <div
                    style={{
                      background:
                        "linear-gradient(90deg, #4532BF 5.81%, #9429FF 100%)",
                    }}
                    className="h-10 w-12 p-7 text-lg font-bold text-white flex rounded-full justify-center items-center"
                  >
                    4.
                  </div>
                  <p className="flex justify-center text-center lg:text-start mt-3 lg:mt-0 items-center text-[#fff] text-lg lg:ml-3">
                    People want to know who they should meet.
                  </p>
                </div>
                <div
                  style={{
                    border: "1px solid rgba(25, 112, 214, 0.30)",
                    background: "rgba(28, 34, 44, 0.60)",
                    boxShadow:
                      "0px 13px 29px 0px rgba(0, 0, 0, 0.07), 0px 53px 53px 0px rgba(0, 0, 0, 0.06), 0px 118px 71px 0px rgba(0, 0, 0, 0.03), 0px 211px 84px 0px rgba(0, 0, 0, 0.01), 0px 329px 92px 0px rgba(0, 0, 0, 0.00)",
                  }}
                  className="flex p-5 flex-col lg:flex-row justify-center lg:justify-start items-center w-full rounded-xl"
                >
                  <div
                    style={{
                      background:
                        "linear-gradient(90deg, #4532BF 5.81%, #9429FF 100%)",
                    }}
                    className="h-10 w-12 p-7 text-lg font-bold text-white flex rounded-full justify-center items-center"
                  >
                    5.
                  </div>
                  <p className="flex justify-center text-center lg:text-start mt-3 lg:mt-0 items-center text-[#fff] text-lg lg:ml-3">
                    Hosts & Sponsors need more and better data.
                  </p>
                </div>
                <div
                  style={{
                    border: "1px solid rgba(25, 112, 214, 0.30)",
                    background: "rgba(28, 34, 44, 0.60)",
                    boxShadow:
                      "0px 13px 29px 0px rgba(0, 0, 0, 0.07), 0px 53px 53px 0px rgba(0, 0, 0, 0.06), 0px 118px 71px 0px rgba(0, 0, 0, 0.03), 0px 211px 84px 0px rgba(0, 0, 0, 0.01), 0px 329px 92px 0px rgba(0, 0, 0, 0.00)",
                  }}
                  className="flex p-5 flex-col lg:flex-row justify-center lg:justify-start items-center w-full rounded-xl"
                >
                  <div
                    style={{
                      background:
                        "linear-gradient(90deg, #4532BF 5.81%, #9429FF 100%)",
                    }}
                    className="h-10 w-12 p-7 text-lg font-bold text-white flex rounded-full justify-center items-center"
                  >
                    6.
                  </div>
                  <p className="flex justify-center text-center lg:text-start mt-3 lg:mt-0 items-center text-[#fff] text-lg lg:ml-3">
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
