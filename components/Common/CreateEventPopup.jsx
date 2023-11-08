import Image from "next/image";
import Link from "next/link";
import React from "react";
import CloseIcon from "../SvgIcons/CloseIcon";
// import { LogoIcon } from "../SvgIcons";

const CreateEventPopup = ({ createEventPopup, setCreateEventPopup }) => {
  return (
    <div
      className="fixed top-0 right-0 left-0 bottom-0 bg-[#00000020] flex justify-center items-center z-30"
      onClick={(e) => setCreateEventPopup(false)}
    >
      <div
        className="w-full md:w-3/4 h-3/4 max-w-[980px] bg-white rounded-2xl flex flex-col-reverse  md:flex-row justify-between items-center relative shadow-md"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 "
          onClick={(e) => setCreateEventPopup(false)}
        >
          <CloseIcon className="w-3 h-3" />
        </button>
        <div
          className="sm:w-[45%] w-1/2 h-full flex justify-center items-end sm:rounded-l-2xl rounded-t-md bg-no-repeat bg-cover bg-center"
          style={{ backgroundImage: 'url("/newbackground.png")' }}
        >
          <Image
            className="w-[380px] md:w-full xl:w-3/4 aspect-auto object-contain md:object-cover flex justify-start items-center"
            src="/circlenew.png"
            alt="Circle_image"
            width={498}
            height={650}
          />
        </div>
        <div className="sm:w-[55%] w-11/12 h-full flex flex-col justify-center items-center rounded-r-2xl px-4 sm:px-6 lg:px-8">
      {/* <div className="bg-[#F5F5F5]">
      <LogoIcon className="w-20 h-20" />
      </div> */}
          <div className="w-full font28 font-semibold py-2">
            Circle Is Available For All Devices
          </div>
          <div className="font14 w-full font-light font-Montserrat py-2">
            Connect effortlessly at the event with a personalized digital
            business card!
          </div>
          <div className="font14 w-full font-light font-Montserrat py-2">
            Register now to explore who else will be there and use Circle, the
            user-friendly app for all devices. Sign up today for a free digital
            business card and unlock networking success!
          </div>
          <div className="w-full flex justify-start items-center gap-4 py-2">
            <Link href="/" className="active:scale-95">
              <Image
                src={"/app_store_img.svg"}
                alt="app store download button"
                className="w-[139px] h-[48px] rounded-md object-cover"
                width={173}
                height={65}
              />
            </Link>
            <Link href="/" className="active:scale-95">
              <Image
                src={"/Play_store_img.svg"}
                alt="play store download button"
                className="w-[146px] h-[49px] rounded-md object-cover"
                width={195}
                height={60}
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEventPopup;
