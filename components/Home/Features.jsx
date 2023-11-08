import React from "react";
import mobile from "../../public/mobilebg.png";
import pentagon from "../../public/imgpentagon.png";
import AOS from "aos";
import "aos/dist/aos.css";
AOS.init();

const Features = () => {
  return (
    <>
      <div
        data-aos="fade-up"
        data-aos-offset="200"
        data-aos-delay="50"
        data-aos-duration="1000"
        data-aos-easing="ease-in-out"
        data-aos-mirror="false"
        data-aos-once="true"
        className="flex justify-center items-center bg-[#14374D] w-full h-auto p-5"
      >
        <div className="w-full lg:w-1/2 text-center lg:text-left flex text-[#F8F9FD] flex-col justify-center items-center text-white p-5">
          <h3 className="font48 w-full lg:ml-20 font-semibold mt-10 font-Montserrat">
            One Profile
            <br />
            Feature Lorem Ipsum
          </h3>
          <h1 className="font16 w-full lg:px-10 font-normal  mt-6">
            Lorem ipsum dolor sit amet consectetur. Interdum luctus id in
            pharetra potenti volutpat malesuada risus.
          </h1>
          <div className="relative mt-[-5%] lg:mt-0">
            <img src={mobile.src} alt="" className="mt-[25%] mb-10" />
            <img
              src={pentagon.src}
              alt=""
              style={{ zIndex: "1", marginTop: "-84%", marginLeft: "-15%" }}
              className="absolute h-[40%] lg:h-auto"
            />
          </div>
        </div>
        <div className="w-1/2 lg:flex hidden flex-col justify-center items-center text-white p-5">
          <img src={mobile.src} alt="" />
          <h3 className="font48 font-semibold mt-20 font-Montserrat">
            One Profile
            <br />
            Feature Lorem Ipsum
          </h3>
          <p className="font16 font-normal w-3/4 ml-6 mt-6 mb-10">
            Lorem ipsum dolor sit amet consectetur. Interdum luctus id in
            pharetra potenti volutpat malesuada risus.
          </p>
        </div>
      </div>
    </>
  );
};

export default Features;
