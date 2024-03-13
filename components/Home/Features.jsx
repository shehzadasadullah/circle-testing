import React, { useEffect } from "react";
import imageLeft from "../../public/revamp/img-left.png";
import imageRight from "../../public/revamp/img-right.png";
import pentagon from "../../public/revamp/pentagon.png";
// import AOS from "aos";
// import "aos/dist/aos.css";
import bgImage from "../../public/revamp/bg-sec3.png";

const Features = () => {
  // useEffect(() => {
  //   // console.log("Initializing AOS");
  //   AOS.init({
  //     duration: 800,
  //     once: true,
  //   });

  //   const handleScroll = () => {
  //     // console.log("Scrolling...");
  //   };

  //   window.addEventListener("scroll", handleScroll);

  //   // Cleanup the event listener
  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //   };
  // }, []);

  return (
    <>
      <div
        style={{
          backgroundImage: `url(${bgImage.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        className="flex justify-center items-center w-full h-auto p-5"
      >
        <div className="w-full lg:w-1/2 text-center lg:text-left flex text-[#F8F9FD] flex-col justify-center items-center text-white p-5">
          <h3
            // data-aos="fade-up"
            // data-aos-delay="50"
            // data-aos-duration="4000"
            // data-aos-easing="ease-in-out"
            // data-aos-mirror="false"
            // data-aos-once="true"
            className="font48 w-full lg:ml-20 font-semibold mt-10 font-Montserrat"
          >
            Event Passport
          </h3>
          <h1
            // data-aos="fade-up"
            // data-aos-delay="50"
            // data-aos-duration="4000"
            // data-aos-easing="ease-in-out"
            // data-aos-mirror="false"
            // data-aos-once="true"
            className="lg:text-xl w-full lg:px-10 font-normal  mt-6"
          >
            The Last Event Profile, Account & Digicard You'll Ever Need
          </h1>
          <div
            // data-aos="fade-up"
            // data-aos-delay="50"
            // data-aos-duration="4000"
            // data-aos-easing="ease-in-out"
            // data-aos-mirror="false"
            // data-aos-once="true"
            className="mt-[-5%] lg:mt-[-8%]"
          >
            <img
              src={imageLeft.src}
              alt=""
              className="mt-[15%] ml-[-5%] lg:ml-[-10%] mb-0 lg:mb-10 lg:object-contain w-full lg:h-[500px]"
            />
            {/* <img
              src={pentagon.src}
              alt=""
              style={{ zIndex: "1", marginTop: "-84%", marginLeft: "-15%" }}
              className="absolute h-[40%] lg:h-auto"
            /> */}
          </div>
        </div>
        <div className="w-1/2 lg:flex hidden flex-col justify-center items-center text-white p-5">
          <img
            // data-aos="fade-up"
            // data-aos-delay="50"
            // data-aos-duration="4000"
            // data-aos-easing="ease-in-out"
            // data-aos-mirror="false"
            // data-aos-once="true"
            src={imageRight.src}
            className="object-contain w-full h-[400px]"
            alt=""
          />
          <h3
            // data-aos="fade-up"
            // data-aos-delay="50"
            // data-aos-duration="4000"
            // data-aos-easing="ease-in-out"
            // data-aos-mirror="false"
            // data-aos-once="true"
            className="font48 font-semibold mt-20 font-Montserrat text-[#F8F9FD]"
          >
            Hosts
          </h3>
          <p
            // data-aos="fade-up"
            // data-aos-delay="50"
            // data-aos-duration="4000"
            // data-aos-easing="ease-in-out"
            // data-aos-mirror="false"
            // data-aos-once="true"
            className="text-xl font-normal w-3/4 ml-6 mt-6 mb-10 text-[#F8F9FD]"
          >
            Know & Serve Your Audience at Depth, Create Events, and Much More
          </p>
        </div>
      </div>
    </>
  );
};

export default Features;
