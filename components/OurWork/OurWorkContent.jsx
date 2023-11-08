import Image from "next/image";
import React from "react";
import { HeartIcon } from "../SvgIcons";

const OurWorkContent = () => {
  return (
    <div className="w-full h-full px-2 sm:px-8 md:px-12 lg:px-16 xl:px-24 py-2 sm:py-4 md:py-6 lg:py-8 xl:py-12 2xl:py-16">
      <h1 className="font28 font-semibold text-[#14183E] font-Montserrat w-full flex justify-start items-center px-2">
        Our Work
      </h1>
      <h2 className="font18 text-[#14183E] font-Montserrat w-full flex justify-start items-center px-2 py-4">
        Finding Inspiration in Every Turn
      </h2>
      <div className="w-full h-full flex flex-col justify-center items-center gap-2 my-8">
        <div className="w-full  flex justify-center items-center gap-2 ">
          <div className="w-[31.5%] h-full ">
            <Image
              src={"/ourwork/image1.webp"}
              alt="Our Work image 1"
              className="w-full h-full aspect-auto object-cover"
              width={311}
              height={429}
            />
            <div className="hidden group-hover:block absolute top-0 right-0 left-0 bottom-0 bg-[#92888760] z-30">
              <div className="w-full h-full relative">
                <div className="absolute bottom-0 left-0 p-4 text-white ">
                  <button
                    className=""
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <HeartIcon className="w-6 h-6" selected={false} />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="w-2/3 h-full ">
            <Image
              src={"/ourwork/image2.webp"}
              alt="Our Work image 2"
              className="w-full h-full aspect-auto object-cover"
              width={659}
              height={429}
            />
            <div className="hidden group-hover:block absolute top-0 right-0 left-0 bottom-0 bg-[#92888760] z-30">
              <div className="w-full h-full relative">
                <div className="absolute bottom-0 left-0 p-4 text-white ">
                  <button
                    className=""
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <HeartIcon className="w-6 h-6" selected={false} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full  flex justify-center items-center gap-2">
          <div className="w-full h-full ">
            <Image
              src={"/ourwork/image3.webp"}
              alt="Our Work image 3"
              className="w-full h-full aspect-auto object-cover"
              width={484}
              height={322}
            />
            <div className="hidden group-hover:block absolute top-0 right-0 left-0 bottom-0 bg-[#92888760] z-30">
              <div className="w-full h-full relative">
                <div className="absolute bottom-0 left-0 p-4 text-white ">
                  <button
                    className=""
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <HeartIcon className="w-6 h-6" selected={false} />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full h-full ">
            <Image
              src={"/ourwork/image4.webp"}
              alt="Our Work image 4"
              className="w-full h-full aspect-auto object-cover"
              width={486}
              height={322}
            />
            <div className="hidden group-hover:block absolute top-0 right-0 left-0 bottom-0 bg-[#92888760] z-30">
              <div className="w-full h-full relative">
                <div className="absolute bottom-0 left-0 p-4 text-white ">
                  <button
                    className=""
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <HeartIcon className="w-6 h-6" selected={false} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full  flex justify-center items-center gap-2">
          <div className="w-full h-full ">
            <Image
              src={"/ourwork/image5.webp"}
              alt="Our Work image 3"
              className="w-full h-full aspect-auto object-cover"
              width={980}
              height={655}
            />
            <div className="hidden group-hover:block absolute top-0 right-0 left-0 bottom-0 bg-[#92888760] z-30">
              <div className="w-full h-full relative">
                <div className="absolute bottom-0 left-0 p-4 text-white ">
                  <button
                    className=""
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <HeartIcon className="w-6 h-6" selected={false} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurWorkContent;
