import React, { useEffect } from "react";
import pentagon from "../../public/imgpentagon.png";
import { AiFillApple } from "react-icons/ai";
import { IoLogoGooglePlaystore } from "react-icons/io5";
// import AOS from "aos";
// import "aos/dist/aos.css";
import { useRouter } from "next/router";
import bgImage from "../../public/revamp/bg-invite.png";
import image from "../../public/revamp/img-invite.png";

const InviteToApp = () => {
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
  const router = useRouter();
  return (
    <>
      <div
        style={{
          backgroundImage: `url(${bgImage.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        className="flex justify-center items-center w-full h-auto p-2 lg:p-10"
      >
        <div className="w-full flex-col lg:flex-row flex justify-center items-center text-white">
          <div
            // data-aos="fade-up"
            // data-aos-delay="50"
            // data-aos-duration="4000"
            // data-aos-easing="ease-in-out"
            // data-aos-mirror="false"
            // data-aos-once="true"
            className="flex flex-col justify-center lg:items-start items-center mb-6"
          >
            <img
              src={image.src}
              alt=""
              className="flex object-contain lg:hidden p-6"
            />
            <h3 className="font48 hidden w-full mt-10 lg:mt-0 lg:flex font-semibold font-Montserrat text-center lg:text-left">
              Want to See Who's Coming?
            </h3>
            <h3 className="font48 mt-3 w-full font-semibold flex lg:hidden font-Montserrat text-center lg:text-left">
              Want to See Who's Coming? Download Circle.ooo
            </h3>
            <h3 className="text-xl w-full font-semibold mt-2 ml-2 font-Montserrat hidden lg:flex">
              Download Circle.ooo
            </h3>
            <div className="flex flex-row mt-10">
              <button
                onClick={() => {
                  router.push(
                    "https://apps.apple.com/pk/app/circle-ooo/id1611956542"
                  );
                }}
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
                onClick={() => {
                  router.push(
                    "https://play.google.com/store/apps/details?id=com.circle.ooo&hl=en&gl=US"
                  );
                }}
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

          <img
            // data-aos="fade-up"
            // data-aos-delay="50"
            // data-aos-duration="4000"
            // data-aos-easing="ease-in-out"
            // data-aos-mirror="false"
            // data-aos-once="true"
            src={image.src}
            alt=""
            className="hidden lg:flex ml-20 object-contain w-auto h-[500px]"
          />
        </div>
      </div>
    </>
  );
};

export default InviteToApp;
