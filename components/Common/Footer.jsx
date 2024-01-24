import Image from "next/image";
import Link from "next/link";
import React, { useState, useContext } from "react";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  TwitterIcon,
} from "../SvgIcons";
import CreateEventPopup from "./CreateEventPopup";
import { Create_Event_Popup } from "@/context/context";
import { useRouter } from "next/router";
import Register from "../Home/Register";
import packageJson from "../../package.json";
import { AiFillApple } from "react-icons/ai";
import { IoLogoGooglePlaystore } from "react-icons/io5";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/firebase";

const Footer = () => {
  const [user] = useAuthState(auth);
  const [createEventPopup, setCreateEventPopup] =
    useContext(Create_Event_Popup);
  const router = useRouter();

  const [showModal, setShowModal] = useState(false);

  const handleClick = () => {
    setShowModal(true);
  };

  return (
    <div className="w-full h-full bg-[#00384F] pl-0 pr-0 pt-12 pb-12 lg:p-12 flex flex-col lg:flex-wrap justify-center lg:justify-between items-center lg:items-start">
      <div className="w-full flex flex-col lg:flex-row h-auto border-[#E0E0E0] border-b-2">
        <div className="w-full lg:w-2/5 flex flex-col justify-centre lg:justify-start items-center lg:items-start h-full py-2 px-4">
          <Link className="" href="/">
            <Image
              className="w-24 h-24 aspect-square object-cover"
              alt="logo"
              src="/logo.svg"
              height={100}
              width={100}
            />
          </Link>
          <div className="w-full lg:w-2/3 px-2 text-[#D9D9D9] text-md font-Montserrat mt-6 text-center lg:text-left">
            Circle.ooo ❤️'s our customers!
          </div>
          <div className="w-full lg:w-2/3 px-2 text-[#D9D9D9] text-md font-Montserrat text-center lg:text-left">
            Events: beautiful, fast & simple for all.
          </div>
        </div>

        <div className="w-full pb-6 lg:w-3/5 flex flex-col justify-center lg:justify-between items-center gap-4">
          <div className="w-full flex flex-wrap lg:flex-nowrap justify-center lg:justify-between items-center lg:items-start h-full pb-4">
            <div className="w-full lg:w-1/3 flex flex-col justify-center lg:justify-start items-center lg:items-start h-full gap-3 font16 font-medium font-Montserrat py-2 ">
              <div className="text-[#D9D9D9] text-lg font-bold">Try Us!</div>
              <div
                className="cursor-pointer text-[#D9D9D9]"
                onClick={() => {
                  if (user?.email === undefined) {
                    handleClick();
                  } else {
                    router.push("/create-event");
                  }
                }}
              >
                Create Events
              </div>
              {createEventPopup && (
                <CreateEventPopup
                  createEventPopup={createEventPopup}
                  setCreateEventPopup={setCreateEventPopup}
                />
              )}
              {/* <div className="text-[#9A989B]">Pricing</div> */}
              <div
                className="text-[#D9D9D9] cursor-pointer"
                onClick={() => {
                  router.push("/privacy-policy");
                }}
              >
                Privacy Policy
              </div>
              {/* <div
                className="text-[#D9D9D9]"
                onClick={() => {
                  router.push("/");
                }}
              >
                Sitemap
              </div> */}
              <div
                className="text-[#D9D9D9] cursor-pointer"
                onClick={() => {
                  router.push("/gdpr");
                }}
              >
                GDPR
              </div>
              <div
                className="cursor-pointer text-[#D9D9D9]"
                onClick={() => {
                  router.push("/faq");
                }}
              >
                FAQ’s
              </div>
            </div>

            <div className="w-full lg:w-1/3 flex flex-col justify-center mt-5 lg:mt-0 lg:justify-start items-center lg:items-start h-full gap-3 font16 font-medium font-Montserrat py-2 ">
              <div className="text-[#D9D9D9] text-lg font-bold">Contact</div>
              {/* <div className="text-[#9A989B] flex justify-start items-center gap-1">
              <span>Tel: </span>
              <Link
                className="underline"
                href="tel:832-622-5979"
                target="_blank"
              >{` 832-622-5979`}</Link>
            </div> */}
              <div className="text-[#9A989B] flex justify-start items-center gap-1">
                <span className="text-[#D9D9D9]">Email: </span>
                <Link
                  className="underline text-[#D9D9D9]"
                  href="mailto:support@circle.ooo"
                  target="_blank"
                >{` support@circle.ooo`}</Link>
              </div>
              <div className="text-[#D9D9D9] text-lg font-bold mt-8 lg:mt-10">
                Social Media
              </div>
              <div className="flex justify-center items-center gap-4 z-10">
                <a
                  target="_blank"
                  href="https://www.linkedin.com/company/circledotooo/"
                  className="cursor-pointer border-2 border-[#45434B] rounded-full w-10 h-10 flex justify-center items-center"
                >
                  <LinkedinIcon className={"w-4 h-4"} />
                </a>
                <a
                  target="_blank"
                  href="https://www.facebook.com/Circledot.ooo"
                  className="cursor-pointer border-2 border-[#45434B] rounded-full w-10 h-10 flex justify-center items-center"
                >
                  <FacebookIcon className={"w-4 h-4"} />
                </a>
                <a
                  target="_blank"
                  href="https://www.instagram.com/circledot.ooo/"
                  className="cursor-pointer border-2 border-[#45434B] rounded-full w-10 h-10 flex justify-center items-center"
                >
                  <InstagramIcon className={"w-4 h-4"} />
                </a>
              </div>
            </div>

            <div className="w-full lg:w-1/3 flex flex-col justify-center mt-5 lg:mt-0 lg:justify-start items-center lg:items-start h-full gap-3 font16 font-medium font-Montserrat py-2 ">
              <div className="text-[#D9D9D9] text-lg font-bold">Location</div>
              <div
                className="text-[#D9D9D9] cursor-pointer whitespace-pre-line text-center lg:text-left"
                onClick={() => {
                  const generateGoogleMapsUrl = (locationText) => {
                    const encodedLocation = encodeURIComponent(locationText);
                    return `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
                  };

                  const locationText =
                    "3233 W. Dallas St, Suite 1107 Houston, Tx 77019";
                  const googleMapsUrl = generateGoogleMapsUrl(locationText);
                  window.open(googleMapsUrl, "_blank");
                }}
              >
                3233 W. Dallas St, Suite 1107 Houston, TX 77019
              </div>
              <div className="flex flex-col mt-5 lg:mt-3">
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
                  className={`px-5 mt-3 font14 font-medium rounded-full py-3 font-Montserrat text-[#000] hover:text-[#fff] border-2 border-[#F2F2F2] hover:bg-transparent bg-[#F2F2F2]`}
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
          </div>
          {/* <div className="w-full flex justify-between items-center gap-3 px-8 py-2">
          <div className=" flex justify-start item-center gap-8 font16 font-medium text-[#D0DAF5] z-10">
            <div
              className="cursor-pointer"
              onClick={() => {
                router.push("/terms");
              }}
            >
              Terms
            </div>
            <div
              className="cursor-pointer "
              onClick={() => {
                router.push("/privacy-policy");
              }}
            >
              Privacy
            </div>
            <div className="">Cookies</div>
          </div>
          <div className="flex justify-center items-center gap-4 z-10">
            <a
              target="_blank"
              href="https://www.linkedin.com/company/circledotooo/"
              className="cursor-pointer border-2 border-[#45434B] rounded-full w-10 h-10 flex justify-center items-center"
            >
              <LinkedinIcon className={"w-4 h-4"} />
            </a>
            <a
              target="_blank"
              href="https://www.facebook.com/Circledot.ooo"
              className="cursor-pointer border-2 border-[#45434B] rounded-full w-10 h-10 flex justify-center items-center"
            >
              <FacebookIcon className={"w-4 h-4"} />
            </a>
            <a
              target="_blank"
              href="https://www.instagram.com/circledot.ooo/"
              className="cursor-pointer border-2 border-[#45434B] rounded-full w-10 h-10 flex justify-center items-center"
            >
              <InstagramIcon className={"w-4 h-4"} />
            </a>
          </div>
        </div> */}
        </div>
      </div>
      <div className="w-full flex justify-center text-center items-center">
        <p className="font18 text-[#D9D9D9] text-base mt-5">
          © Copyrights 2024 Circle.ooo All Rights Reserved.
        </p>
      </div>
      {showModal && (
        <div
          className="z-50"
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
          }}
        >
          <Register showModal={showModal} setShowModal={setShowModal} />
        </div>
      )}
      {/* <div className="w-full text-[#D0DAF5] flex items-center justify-center">
        <h3>{`Ver - ${packageJson.version} ${
          process.env.NEXT_PUBLIC_BUILD_VERSION
            ? "Build No - " + process.env.NEXT_PUBLIC_BUILD_VERSION
            : ""
        }`}</h3>
      </div> */}
    </div>
  );
};

export default Footer;
