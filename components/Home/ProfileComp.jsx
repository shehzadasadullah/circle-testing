import React, { useEffect, useMemo, useState } from "react";
import DropDownComponent from "../SmallComps/DropDownComponent";
import Image from "next/image";
import { RandomNdigitnumber } from "@/utils/function";
import Loading from "../Loading";
import Organize from "../../public/organise.png";
import Safeguard from "../../public/safeguard.png";
import Curate from "../../public/curate.png";
import Safe from "../../public/safe.png";
import SavesTime from "../../public/savestime.png";
import Wishlist from "../../public/wishlist.png";
import AOS from "aos";
import "aos/dist/aos.css";
AOS.init();

const ProfileComp = () => {
  const [selectedDropdown, setSelectedDropdown] = useState("Organize");
  const [selectedOption, setSelectedOption] = useState({
    id: 1,
    title: "Organize",
    description: "contact lists or gift lists by occasion",
    image: "/profile_images/Organize.svg",
    width: 814,
    height: 856,
    image_path: Organize.src,
  });
  const [DropdownData, setDropdownData] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  useMemo(() => {
    setDropdownData([
      {
        id: 1,
        title: "Organize",
        description: "Contact lists or gift lists by occasion",
        image: "/profile_images/Organize.svg",
        width: 814,
        height: 856,
        image_path: Organize.src,
      },
      {
        id: 2,
        title: "Safeguard",
        description: "Set permissions for your contact info",
        image: "/profile_images/safeguard.svg",
        width: 676,
        height: 720,
        image_path: Safeguard.src,
      },
      {
        id: 3,
        title: "Curate",
        description: "Pre-plan networking in advance for group events",
        image: "/profile_images/Curate.svg",
        width: 676,
        height: 720,
        image_path: Curate.src,
      },
      {
        id: 4,
        title: "Safe",
        description: "Your profile gets smarter over time, but privately",
        image: "/profile_images/safe.svg",
        width: 676,
        height: 720,
        image_path: Safe.src,
      },
      {
        id: 5,
        title: "Saves time",
        description:
          "Instantly find contacts; text-to-invite groups or contacts",
        image: "/profile_images/savetime.svg",
        width: 722,
        height: 670,
        image_path: SavesTime.src,
      },
      {
        id: 6,
        title: "Community",
        description: "Stay Connected After the Event",
        image: "/profile_images/whishlist.svg",
        width: 713,
        height: 694,
        image_path: Wishlist.src,
      },
    ]);
  }, []);

  useEffect(() => {
    let SelectedOption = DropdownData.filter(
      (item) => item.title === selectedDropdown
    );
    setSelectedOption(SelectedOption?.[0] || {});
  }, [selectedDropdown, DropdownData]);

  const handleToggle = (id) => {
    setSelectedDropdown(DropdownData?.[id]?.title);
  };

  const [showItems, setShowItems] = useState(false);

  useEffect(() => {
    // Use a timeout to gradually show each item with a delay
    const showItemTimeout = setTimeout(() => {
      setShowItems(true);
    }, 100);

    // Clean up the timeout when the component unmounts
    return () => clearTimeout(showItemTimeout);
  }, [selectedDropdown, selectedOption]);
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
        className="flex bg-[#F8F9FD] justify-center items-center w-full h-auto"
      >
        <div className="hidden lg:flex w-1/2 justify-center items-center flex-col p-6">
          <h3 className="font48 font-semibold mt-20 text-[#14183E] font-Montserrat">
            One Profile for All Events
          </h3>

          <div
            style={
              {
                // opacity: showItems ? "1" : "0",
                // transition: "opacity 1s ease",
              }
            }
          >
            <img
              src={selectedOption.image}
              alt=""
              style={{
                height: "400pt",
              }}
              className="object-contain w-full"
            />
          </div>
        </div>
        <div className="w-full lg:w-1/2 justify-center items-center flex flex-col p-4">
          <h3 className="font48 font-semibold text-center mt-10 text-[#14183E] flex lg:hidden font-Montserrat">
            One Profile for All Events
          </h3>
          <div style={{ width: "80%" }} className="mt-5 mb-5 lg:mb-0 lg:mt-0">
            {/* <h5 className="font16">
              Lorem ipsum dolor sit amet consectetur. Interdum luctus id in
              pharetra potenti volutpat malesuada risus.
            </h5> */}

            {DropdownData.map((item, id) => {
              return (
                <div
                  style={
                    {
                      // opacity: showItems ? "1" : "0",
                      // transition: "opacity 0.5s ease",
                    }
                  }
                  className="mt-3"
                >
                  <DropDownComponent
                    key={RandomNdigitnumber(10)}
                    item={item}
                    selectedDropdown={selectedDropdown}
                    id={id}
                    handleToggle={handleToggle}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* <div
        style={{
          background: "#F8F9FD",
        }}
        className=" w-full h-full px-2 sm:px-8 md:px-12 lg:px-16 xl:px-24 2xl:px-32"
      >
        <div className="w-full h-full flex flex-col-reverse md:flex-row justify-between items-center py-4">
          <div className="w-full md:w-[36%] float-left flex flex-col justify-center items-start gap-1">
            <h3 className="font48 font-semibold text-[#14183E] font-Montserrat">
              One Profile
            </h3>
            <div className="my-4 md:my-6 xl:my-8 w-full">
              {DropdownData.map((item, id) => {
                return (
                  <div className="mt-3">
                    <DropDownComponent
                      key={RandomNdigitnumber(10)}
                      item={item}
                      selectedDropdown={selectedDropdown}
                      id={id}
                      handleToggle={handleToggle}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="w-4/5 md:w-[64%] h-full flex justify-end items-center">
            
          </div>
        </div>
      </div> */}
    </>
  );
};

export default ProfileComp;
