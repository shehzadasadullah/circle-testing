import React, { useContext, useState, useEffect } from "react";
import Image from "next/image";
import { FindContact, InstaBizCard, SocialMedaiIcon } from "../SvgIcons";
import Header from "../Common/Header";
import { Create_Event_Popup } from "@/context/context";
import img from "../../public/Frame7.png";
import blue from "../../public/blue.png";
import green from "../../public/green.png";
import purple from "../../public/purple.png";
import { IoIosArrowForward } from "react-icons/io";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/firebase";
import Register from "./Register";
import AOS from "aos";
import "aos/dist/aos.css";

const HeroSection = () => {
  useEffect(() => {
    // console.log("Initializing AOS");
    AOS.init({
      duration: 800,
      once: true,
    });

    const handleScroll = () => {
      // console.log("Scrolling...");
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup the event listener
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const router = useRouter();
  const [user] = useAuthState(auth);
  const [showModal, setShowModal] = useState(false);

  //context
  const [createEventPopup, setCreateEventPopup] =
    useContext(Create_Event_Popup);

  const handleClick = () => {
    setShowModal(true);
  };
  return (
    <div
      style={{
        background: "rgb(255, 255, 255)",
        background:
          "linear-gradient(to bottom right, rgba(255, 255, 255, 1) 50%, rgba(17, 129, 172, 1) 100%)",
      }}
      className="w-full h-auto flex flex-col justify-start items-start relative"
    >
      {/* <div className="absolute top-0 right-0 bottom-0 w-full h-full ">
        <img src={"/backgroundVector.svg"} alt="background Vector" />
      </div> */}
      <div className="w-full h-full  z-10">
        <Header type="light" page="home" />
      </div>
      <div
        data-aos="fade-up"
        data-aos-delay="50"
        data-aos-duration="4000"
        data-aos-easing="ease-in-out"
        data-aos-mirror="false"
        data-aos-once="true"
        className="w-full flex flex-col lg:flex-row h-full py-2 sm:py-4 lg:py-8 xl:py-12 2xl:py-16 z-0"
      >
        <div className="w-full lg:w-[50%] h-full pl-5 pr-5 lg:pl-16 xl:pl-20 2xl:pl-24 gap-2 lg:pr-8">
          <div className="hidden md:flex lg:hidden justify-center items-center w-full mt-[-5%]">
            <img
              src={img.src}
              className="object-contain h-[300pt] mt-10 text-center"
              alt=""
            />
          </div>
          <h1 className="lg:text-[64px] text-[40px] text-center lg:text-left text-black font-Poppins font-semibold py-2 mt-5">
            Invite, Meet & Network Smarter
          </h1>
          <div className="w-full mt-5 flex flex-col  justify-start h-auto">
            <h2 className="flex font18 w-auto p-4 rounded-full border-2 border-[#007bab80] text-black font-Poppins font-light">
              <img src={blue.src} alt="" />
              <span className="ml-3">Stacks of Biz Cards On Your Desk?</span>
            </h2>
            <p className="flex font18 w-auto p-4 mt-3 border-2 border-[#007bab80] rounded-full text-black font-Poppins font-light">
              <img src={green.src} alt="" />
              <span className="ml-3">Create Events Quickly and Better!</span>
            </p>

            <p className="flex font18 w-auto p-4 mt-3 border-2 border-[#007bab80] rounded-full text-black font-Poppins font-light">
              <img src={purple.src} alt="" />
              <span className="ml-3">Know Who You've Met at Every Event!</span>
            </p>
          </div>
          <div className="w-full hidden lg:flex justify-center items-center">
            <button
              onClick={() => {
                if (user?.email === undefined) {
                  handleClick();
                } else {
                  router.push("/create-event");
                }
              }}
              className={`w-[50%] mt-10 font14 font-medium rounded-full py-5 font-Montserrat text-[#fff] hover:text-[#007BAB] border-2 border-[#007BAB] hover:bg-transparent bg-[#007BAB]`}
            >
              <div className="flex justify-center items-center">
                Create an Event
                <span>
                  <IoIosArrowForward className="ml-1" size={20} />
                </span>
              </div>
            </button>
          </div>
        </div>
        <div className="w-full lg:w-[50%] flex flex-col justify-start items-center h-auto">
          <img
            data-aos="fade-up"
            data-aos-delay="50"
            data-aos-duration="4000"
            data-aos-easing="ease-in-out"
            data-aos-mirror="true"
            data-aos-once="false"
            src={img.src}
            className="object-contain hidden lg:flex"
            alt=""
          />
          <button
            onClick={() => {
              if (user?.email === undefined) {
                handleClick();
              } else {
                router.push("/create-event");
              }
            }}
            className={`flex lg:hidden px-10 mt-5 mb-5 lg:mt-[-102pt] lg:ml-[-65%] font16 md:font14 font-medium rounded-full py-5 font-Montserrat text-[#fff] hover:text-[#007BAB] border-2 border-[#007BAB] hover:bg-transparent bg-[#007BAB]`}
          >
            <div className="flex justify-center items-center">
              Create an Event
              <span>
                <IoIosArrowForward className="ml-1" size={20} />
              </span>
            </div>
          </button>
        </div>
      </div>
      {/* <div className="flex w-full mt-2 lg:mt-0 justify-center items-center">
        <div
          style={{ width: "30pt", height: "30pt" }}
          className="rounded-full bg-[#085675] flex justify-center items-center mb-5"
        >
          <MdOutlineKeyboardArrowDown size={40} color="white" />
        </div>
      </div> */}
      {/* <div className="w-full ">
        <div className="w-full bg-white py-6 md:py-8 lg:py-10 xl:py-12 2xl:py-14 px-4 md:px-6 lg:px-8 flex justify-center items-start gap-2 md:gap-4 lg:gap-8 xl:gap-10 2xl:gap-12 z-10">
          <div
            className="flex justify-center items-center text-[#909090] font16 font-Poppins rotate-180 pb-6"
            style={{ writingMode: "vertical-rl" }}
          >
            &#8592; Scroll
          </div>
          <div className="w-full flex flex-col justify-start items-start gap-2 max-w-[340px]">
            <InstaBizCard className={"w-6 h-6"} />
            <p className="text-[#333] font16 font-semibold uppercase font-Poppins w-full">
              Insta Biz Card
            </p>
            <p className="text-[#909090] font14 font-Poppins w-full break-word">
              Make your website user friendly and look more professional
            </p>
          </div>
          <div className="w-full flex flex-col justify-center items-start gap-2 max-w-[340px]">
            <SocialMedaiIcon className={"w-6 h-6"} />
            <p className="text-[#333] font16 font-semibold uppercase font-Poppins w-full">
              Invite
            </p>
            <p className="text-[#909090] font14 font-Poppins w-full break-word">
              Gain more followers or subscribers with the right template
            </p>
          </div>
          <div className="w-full flex flex-col justify-center items-start gap-2 max-w-[340px]">
            <FindContact className={"w-6 h-6"} />
            <p className="text-[#333] font16 font-semibold uppercase font-Poppins w-full">
              FIND CONTACTS
            </p>
            <p className="text-[#909090] font14 font-Poppins w-full break-word">
              Complete your digital work with appropriate artwork
            </p>
          </div>
        </div>
      </div> */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
          }}
          className="z-10"
        >
          <Register showModal={showModal} setShowModal={setShowModal} />
        </div>
      )}
    </div>
  );
};

export default HeroSection;
