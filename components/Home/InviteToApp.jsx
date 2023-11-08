import React from "react";
import mobile from "../../public/mobilebg.png";
import pentagon from "../../public/imgpentagon.png";
import { AiFillApple } from "react-icons/ai";
import { IoLogoGooglePlaystore } from "react-icons/io5";
import AOS from "aos";
import "aos/dist/aos.css";
AOS.init();

const InviteToApp = () => {
  return (
    <>
      <div
        data-aos="fade-up"
        data-aos-delay="50"
        data-aos-duration="1000"
        data-aos-easing="ease-in-out"
        data-aos-mirror="false"
        data-aos-once="true"
        style={{
          background: "rgba(17, 129, 172, 1)",
          //   background:
          //     "linear-gradient(to bottom right, rgba(255, 255, 255, 1) 50%, rgba(17, 129, 172, 1) 100%)",
        }}
        className="flex justify-center items-center w-full h-auto p-2 lg:p-10"
      >
        <div className="w-full flex-col lg:flex-row flex justify-center items-center text-white">
          <div className="flex flex-col justify-center lg:items-start items-center mb-6">
            <img src={mobile.src} alt="" className="flex lg:hidden p-6" />
            <h3 className="font48 hidden mt-10 lg:mt-0 lg:flex font-semibold font-Montserrat text-center lg:text-left">
              What are you waiting for?
            </h3>
            <h3 className="font48 mt-3 font-semibold flex lg:hidden font-Montserrat text-center lg:text-left">
              What are you waiting for? Download the Circle App Now!
            </h3>
            <h3 className="font48 font-semibold mt-2 font-Montserrat hidden lg:flex">
              Download the Circle App
            </h3>
            <div className="flex flex-row mt-10">
              <button
                className={`px-5 font14 font-medium rounded-full py-3 font-Montserrat text-[#000] hover:text-[#fff] border-2 border-[#F2F2F2] hover:bg-transparent bg-[#F2F2F2]`}
              >
                <div className="flex justify-center items-center">
                  <span>
                    <AiFillApple className="mr-1" size={30} />
                  </span>
                  App Store
                </div>
              </button>
              <button
                className={`px-5 ml-5 font14 font-medium rounded-full py-3 font-Montserrat text-[#000] hover:text-[#fff] border-2 border-[#F2F2F2] hover:bg-transparent bg-[#F2F2F2]`}
              >
                <div className="flex justify-center items-center">
                  <span>
                    <IoLogoGooglePlaystore className="mr-1" size={30} />
                  </span>
                  Play Store
                </div>
              </button>
            </div>
          </div>

          <img src={mobile.src} alt="" className="hidden lg:flex ml-20" />
        </div>
      </div>
    </>
  );
};

export default InviteToApp;
