import React, { useState, useEffect } from "react";
import Header from "@/components/Common/Header";
import Footer from "@/components/Common/Footer";
import { useRouter } from "next/router";
import backgroundImage from "@/public/revamp/bg-createEvent.jpg";
import Head from "next/head";
import { RandomNdigitnumber } from "@/utils/function";
import { RotatingLines } from "react-loader-spinner";
import { ThreeDots } from "react-loader-spinner";
import {
  doc,
  onSnapshot,
  collection,
  query,
  where,
  limit,
  orderBy,
} from "firebase/firestore";
import { db } from "@/firebase";
import { getIdToken } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";
import toast from "react-simple-toasts";
import { LuCalendarDays } from "react-icons/lu";
import { FaLocationDot } from "react-icons/fa6";
import { FaTag } from "react-icons/fa6";
import { FaClock } from "react-icons/fa";
import img from "@/public/Profile_Picture.png";
import moment from "moment";
import loaderGif from "@/public/events/Loader.gif";
import EventCard from "@/components/SmallComps/EventCard";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import barCode from "@/public/scan-barcode.png";

const MyDigicard = () => {
  const router = useRouter();
  const { userID } = router.query;
  const [userRef, setUserRef] = useState("");
  const [digiCardData, setDigiCardData] = useState([]);
  const [digiCardLimit, setDigiCardLimit] = useState(20);
  const [digiCardLoader, setDigiCardLoader] = useState(true);
  const [showMoreLoader, setShowMoreLoader] = useState(true);
  const [circleAccessToken, setCircleAccessToken] = useState("");
  const [user] = useAuthState(auth);

  const classNames = (...classes) => {
    return classes.filter(Boolean).join(" ");
  };

  useEffect(() => {
    const getIdTokenForUser = async () => {
      if (user) {
        try {
          const idToken = await getIdToken(user);
          setCircleAccessToken(idToken);
        } catch (error) {
          toast(error.message);
        }
      }
    };
    console.log("USER ID: ", userID);
    getIdTokenForUser();
  }, [user]);

  // get digicard
  const getDigiCardData = async (limitNum) => {
    setDigiCardLoader(true);
    setShowMoreLoader(true); // show more issue page fluctuation
    const digiCardCollectionRef = collection(db, "businesscard");
    const q = query(digiCardCollectionRef, where("uid", "==", userID));
    return onSnapshot(q, (querySnapshot) => {
      const Docs = [];
      querySnapshot.forEach((doc) => {
        Docs.push({ ...doc.data() });
      });
      console.log("DIGICARD: ", Docs);
      setDigiCardData(Docs || []);
      setDigiCardLoader(false);
    });
  };

  useEffect(() => {
    if (userID) {
      getDigiCardData(digiCardLimit);
    }
  }, [userID]);

  return (
    <>
      <Head>
        <title>CIRCLE - MY DIGICARD</title>
        <meta
          name="description"
          content="Circle.ooo ❤️'s our customers! Events: beautiful, fast & simple for all."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div
        style={{
          backgroundImage: `url(${backgroundImage.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        className="w-full h-full"
      >
        <div className="w-full h-full">
          <Header type="dark" />
        </div>

        {digiCardLoader ? (
          <div className="flex w-full justify-center items-center p-10">
            <img src={loaderGif.src} alt="Loader" />
          </div>
        ) : (
          <>
            <div className="w-full h-auto flex flex-col justify-center items-center p-8 xl:p-16">
              <div
                style={{
                  borderRadius: "16px",
                  border: "1px solid rgba(255, 255, 255, 0.20)",
                  background: "rgba(255, 255, 255, 0.12)",
                  backdropFilter: "blur(40px)",
                }}
                className="flex justify-center flex-col items-center w-full"
              >
                <div
                  style={{
                    borderRadius: "24px 24px 0px 0px",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.10)",
                  }}
                  className="flex justify-center xl:justify-between flex-col xl:flex-row items-center w-full p-8 gap-5"
                >
                  <p className="text-4xl text-white font-semibold w-full text-center xl:text-start">
                    My DigiCard
                  </p>
                  <div className="w-full flex justify-center xl:justify-end items-center">
                    <button
                      onClick={() => {
                        router.push(
                          `/digicard/create-digicard?userID=${userID}`
                        );
                      }}
                      style={{
                        borderRadius: "8.284px",
                        border: "0.69px solid rgba(255, 255, 255, 0.20)",
                        background:
                          "linear-gradient(90deg, #4532BF 5.81%, #9429FF 100%)",
                      }}
                      className="py-3 px-5 text-white flex flex-row justify-center items-center gap-x-2"
                    >
                      <svg
                        width="21"
                        height="20"
                        viewBox="0 0 21 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clip-path="url(#clip0_2501_25137)">
                          <path
                            d="M10.0977 0C4.58344 0 0.0976562 4.48578 0.0976562 10C0.0976562 15.5142 4.58344 20 10.0977 20C15.6119 20 20.0977 15.5142 20.0977 10C20.0977 4.48578 15.6119 0 10.0977 0Z"
                            fill="white"
                          />
                          <path
                            d="M14.472 10.8331H10.9302V14.3748C10.9302 14.8348 10.557 15.2081 10.097 15.2081C9.63691 15.2081 9.26367 14.8348 9.26367 14.3748V10.8331H5.72195C5.26191 10.8331 4.88867 10.4598 4.88867 9.99979C4.88867 9.53975 5.26191 9.1665 5.72195 9.1665H9.26367V5.62479C9.26367 5.16475 9.63691 4.7915 10.097 4.7915C10.557 4.7915 10.9302 5.16475 10.9302 5.62479V9.1665H14.472C14.932 9.1665 15.3052 9.53975 15.3052 9.99979C15.3052 10.4598 14.932 10.8331 14.472 10.8331Z"
                            fill="#5530CC"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_2501_25137">
                            <rect
                              width="20"
                              height="20"
                              fill="white"
                              transform="translate(0.0976562)"
                            />
                          </clipPath>
                        </defs>
                      </svg>
                      <p className="text-white">Create New Card</p>
                    </button>
                  </div>
                </div>
                <div className="flex justify-center flex-col items-center w-full p-8 gap-3">
                  {digiCardData.length > 0 && (
                    <>
                      {digiCardData.map((item) => (
                        <div
                          style={{
                            borderRadius: "12px",
                            background: "#2B213F",
                          }}
                          className="flex justify-center flex-col xl:flex-row xl:justify-between items-center w-full p-6 gap-4"
                        >
                          <div className="w-full flex flex-row justify-center xl:justify-start items-center gap-4">
                            <div
                              style={{
                                border: "1px solid rgba(255, 255, 255, 0.60)",
                              }}
                              className="w-12 h-12 rounded-full bg-white"
                            >
                              {item.photo_url && item.photo_url !== "" ? (
                                <>
                                  <img
                                    src={item.photo_url}
                                    alt=""
                                    className="object-fill rounded-full w-full h-full"
                                  />
                                </>
                              ) : (
                                <>
                                  <img
                                    src={img.src}
                                    alt=""
                                    className="object-fill rounded-full w-full h-full"
                                  />
                                </>
                              )}
                            </div>
                            <p className="text-white font-semibold">
                              {item.full_name}
                            </p>
                          </div>
                          <div className="w-full flex flex-col xl:flex-row justify-center xl:justify-end items-center gap-2 xl:gap-6">
                            {item.linkedin_profile &&
                              item.linkedin_profile !== "" && (
                                <>
                                  <div className="flex w-full justify-center items-center gap-4 xl:border-r-[2px] xl:border-opacity-10 xl:border-[#fff] xl:pr-5">
                                    <div
                                      style={{
                                        border:
                                          "0.5px solid rgba(255, 255, 255, 0.10)",
                                        background: "rgba(255, 255, 255, 0.10)",
                                      }}
                                      className="w-12 h-12 p-3 rounded-full hidden md:flex justify-center items-center"
                                    >
                                      <a
                                        href={item.linkedin_profile}
                                        target="_blank"
                                        className="no-underline"
                                      >
                                        <svg
                                          width="24"
                                          height="24"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            d="M21.6004 21.5999V14.5679C21.6004 11.1119 20.8564 8.4719 16.8244 8.4719C14.8804 8.4719 13.5844 9.5279 13.0564 10.5359H13.0084V8.7839H9.19239V21.5999H13.1764V15.2399C13.1764 13.5599 13.4884 11.9519 15.5524 11.9519C17.5924 11.9519 17.6164 13.8479 17.6164 15.3359V21.5759H21.6004V21.5999ZM2.71239 8.7839H6.69639V21.5999H2.71239V8.7839ZM4.70439 2.3999C3.43239 2.3999 2.40039 3.4319 2.40039 4.7039C2.40039 5.9759 3.43239 7.0319 4.70439 7.0319C5.97639 7.0319 7.00839 5.9759 7.00839 4.7039C7.00839 3.4319 5.97639 2.3999 4.70439 2.3999Z"
                                            fill="white"
                                          />
                                        </svg>
                                      </a>
                                    </div>
                                    <div className="flex w-full flex-col justify-center items-center">
                                      <p className="text-white font-semibold w-full text-start">
                                        <a
                                          href={item.linkedin_profile}
                                          target="_blank"
                                          className="no-underline"
                                        >
                                          LinkedIn
                                        </a>
                                      </p>
                                      <p
                                        style={{
                                          color: "rgba(255, 255, 255, 0.80)",
                                        }}
                                        className="w-full truncate ... text-start"
                                      >
                                        <a
                                          href={item.linkedin_profile}
                                          target="_blank"
                                          className="no-underline text-[#3DFFD0]"
                                        >
                                          View Profile
                                        </a>
                                      </p>
                                    </div>
                                  </div>
                                </>
                              )}
                            <div className="flex w-full justify-center items-center gap-4 xl:border-r-[2px] xl:border-opacity-10 xl:border-[#fff] xl:pr-5">
                              <div
                                style={{
                                  border:
                                    "0.5px solid rgba(255, 255, 255, 0.10)",
                                  background: "rgba(255, 255, 255, 0.10)",
                                }}
                                className="w-12 h-12 p-3 rounded-full hidden md:flex justify-center items-center"
                              >
                                <a
                                  href={`tel:${item.phone_number}`}
                                  target="_blank"
                                  className="no-underline"
                                >
                                  <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <g clip-path="url(#clip0_2501_25002)">
                                      <path
                                        d="M19.4542 14.678L16.6631 11.8869C15.6663 10.8901 13.9717 11.2889 13.573 12.5847C13.274 13.4819 12.2772 13.9803 11.38 13.7809C9.38643 13.2825 6.69506 10.6908 6.19665 8.59746C5.89761 7.70029 6.49569 6.70349 7.39282 6.40448C8.68867 6.00576 9.08739 4.31119 8.09059 3.31438L5.29953 0.523324C4.50208 -0.174441 3.30591 -0.174441 2.60815 0.523324L0.714213 2.41726C-1.17972 4.41087 0.913575 9.69395 5.59857 14.3789C10.2836 19.0639 15.5666 21.2569 17.5603 19.2633L19.4542 17.3694C20.152 16.5719 20.152 15.3757 19.4542 14.678Z"
                                        fill="white"
                                      />
                                    </g>
                                    <defs>
                                      <clipPath id="clip0_2501_25002">
                                        <rect
                                          width="20"
                                          height="20"
                                          fill="white"
                                        />
                                      </clipPath>
                                    </defs>
                                  </svg>
                                </a>
                              </div>
                              <div className="flex w-full flex-col justify-center items-center">
                                <p className="text-white font-semibold w-full text-start">
                                  <a
                                    href={`tel:${item.phone_number}`}
                                    target="_blank"
                                    className="no-underline"
                                  >
                                    Phone
                                  </a>
                                </p>
                                <p
                                  style={{
                                    color: "rgba(255, 255, 255, 0.80)",
                                  }}
                                  className="w-full truncate ... text-start"
                                >
                                  <a
                                    href={`tel:${item.phone_number}`}
                                    target="_blank"
                                    className="no-underline"
                                  >
                                    {item.phone_number}
                                  </a>
                                </p>
                              </div>
                            </div>
                            <div className="flex w-full justify-center items-center gap-4 xl:border-r-[2px] xl:border-opacity-10 xl:border-[#fff] xl:pr-5">
                              <div
                                style={{
                                  border:
                                    "0.5px solid rgba(255, 255, 255, 0.10)",
                                  background: "rgba(255, 255, 255, 0.10)",
                                }}
                                className="w-12 h-12 p-3 rounded-full hidden md:flex justify-center items-center"
                              >
                                <a
                                  href={`mailto:${item.email}`}
                                  target="_blank"
                                  className="no-underline"
                                >
                                  <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <g clip-path="url(#clip0_2501_25011)">
                                      <path
                                        d="M14.0057 14.7043C13.4086 15.1024 12.7151 15.3128 12 15.3128C11.285 15.3128 10.5914 15.1024 9.99431 14.7043L0.159797 8.14777C0.105506 8.11147 0.0522208 8.07369 0 8.03447L0 18.7781C0 20.0099 0.999609 20.9874 2.20936 20.9874H21.7906C23.0224 20.9874 24 19.9878 24 18.7781V8.03442C23.9476 8.07375 23.8942 8.11161 23.8398 8.14796L14.0057 14.7043Z"
                                        fill="white"
                                      />
                                      <path
                                        d="M0.939845 6.9777L10.7744 13.5343C11.1466 13.7825 11.5733 13.9066 12 13.9066C12.4267 13.9066 12.8534 13.7825 13.2256 13.5343L23.0602 6.9777C23.6487 6.58559 24 5.92934 24 5.22106C24 4.0032 23.0092 3.01245 21.7914 3.01245H2.20861C0.990798 3.0125 1.16255e-06 4.00325 1.16255e-06 5.22223C-0.000363928 5.56967 0.085267 5.9118 0.249256 6.21811C0.413246 6.52441 0.650496 6.78537 0.939845 6.9777Z"
                                        fill="white"
                                      />
                                    </g>
                                    <defs>
                                      <clipPath id="clip0_2501_25011">
                                        <rect
                                          width="24"
                                          height="24"
                                          fill="white"
                                        />
                                      </clipPath>
                                    </defs>
                                  </svg>
                                </a>
                              </div>
                              <div className="flex w-full flex-col justify-center items-center">
                                <p className="text-white font-semibold w-full text-start">
                                  <a
                                    href={`mailto:${item.email}`}
                                    target="_blank"
                                    className="no-underline"
                                  >
                                    Email
                                  </a>
                                </p>
                                <p
                                  style={{
                                    color: "rgba(255, 255, 255, 0.80)",
                                  }}
                                  className="w-full truncate ... text-start"
                                >
                                  <a
                                    href={`mailto:${item.email}`}
                                    target="_blank"
                                    className="no-underline"
                                  >
                                    {item.email}
                                  </a>
                                </p>
                              </div>
                            </div>
                            <div className="flex w-full justify-center items-center gap-4 mt-2 xl:mt-0">
                              <div
                                style={{
                                  border:
                                    "0.5px solid rgba(255, 255, 255, 0.10)",
                                  background: "rgba(255, 255, 255, 0.10)",
                                }}
                                className="w-12 h-12 rounded-full flex justify-center items-center"
                              >
                                <Menu
                                  as="div"
                                  className="relative inline-block text-left"
                                >
                                  <div>
                                    <Menu.Button
                                      className={
                                        "flex items-center justify-center text-white"
                                      }
                                    >
                                      <div className="flex items-center justify-center">
                                        <div
                                          className={`font16 font-semibold font-Montserrat`}
                                        >
                                          <AiOutlineMenu size={25} />
                                        </div>
                                      </div>
                                    </Menu.Button>
                                  </div>

                                  <Transition
                                    as={Fragment}
                                    enter="transition ease-out duration-100"
                                    enterFrom="transform opacity-0 scale-95"
                                    enterTo="transform opacity-100 scale-100"
                                    leave="transition ease-in duration-75"
                                    leaveFrom="transform opacity-100 scale-100"
                                    leaveTo="transform opacity-0 scale-95"
                                  >
                                    <Menu.Items
                                      style={{
                                        borderRadius: "10px",
                                        border:
                                          "0.5px solid rgba(25, 112, 214, 0.30)",
                                        background:
                                          "linear-gradient(149deg, rgba(255, 255, 255, 0.20) 0.71%, rgba(255, 255, 255, 0.10) 98.8%)",
                                        boxShadow:
                                          "0px 0px 0px 1px rgba(0, 0, 0, 0.12), 0px 1px 3px 0px rgba(0, 0, 0, 0.16), 0px 1px 0px 0px rgba(255, 255, 255, 0.05) inset",
                                        backdropFilter: "blur(40px)",
                                      }}
                                      className="absolute right-0 z-10 mt-2 w-auto origin-top-right focus:outline-none"
                                    >
                                      <div className="px-2 py-2">
                                        <Menu.Item>
                                          {({ active }) => (
                                            <div
                                              className={classNames(
                                                active
                                                  ? "bg-[#fff] bg-opacity-10"
                                                  : "bg-transparent",
                                                "block px-4 py-3 xl:rounded-xl border-b-2 border-[#fff] border-opacity-20 xl:border-b-0 cursor-pointer text-sm"
                                              )}
                                              // onClick={() => {
                                              //   router.push(`/`);
                                              // }}
                                            >
                                              <div className="flex justify-start items-center">
                                                <svg
                                                  width="20"
                                                  height="20"
                                                  viewBox="0 0 20 20"
                                                  fill="none"
                                                  xmlns="http://www.w3.org/2000/svg"
                                                >
                                                  <path
                                                    d="M11.0504 3.00002L4.20878 10.2417C3.95045 10.5167 3.70045 11.0584 3.65045 11.4334L3.34211 14.1334C3.23378 15.1084 3.93378 15.775 4.90045 15.6084L7.58378 15.15C7.95878 15.0834 8.48378 14.8084 8.74211 14.525L15.5838 7.28335C16.7671 6.03335 17.3004 4.60835 15.4588 2.86668C13.6254 1.14168 12.2338 1.75002 11.0504 3.00002Z"
                                                    stroke="white"
                                                    stroke-width="1.5"
                                                    stroke-miterlimit="10"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                  />
                                                  <path
                                                    d="M9.9082 4.20825C10.2665 6.50825 12.1332 8.26659 14.4499 8.49992"
                                                    stroke="white"
                                                    stroke-width="1.5"
                                                    stroke-miterlimit="10"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                  />
                                                  <path
                                                    d="M2.5 18.3333H17.5"
                                                    stroke="white"
                                                    stroke-width="1.5"
                                                    stroke-miterlimit="10"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                  />
                                                </svg>

                                                <span className="ml-2 text-sm text-[#fff] font-Poppins font-normal">
                                                  Edit
                                                </span>
                                              </div>
                                            </div>
                                          )}
                                        </Menu.Item>
                                        <Menu.Item>
                                          {({ active }) => (
                                            <div
                                              className={classNames(
                                                active
                                                  ? "bg-[#fff] bg-opacity-10"
                                                  : "bg-transparent",
                                                "block px-4 py-3 xl:rounded-xl border-b-2 border-[#fff] border-opacity-20 xl:border-b-0 cursor-pointer text-sm"
                                              )}
                                              // onClick={() => {
                                              //   router.push(`/`);
                                              // }}
                                            >
                                              <div className="flex justify-start items-center">
                                                <svg
                                                  width="20"
                                                  height="20"
                                                  viewBox="0 0 20 20"
                                                  fill="none"
                                                  xmlns="http://www.w3.org/2000/svg"
                                                >
                                                  <path
                                                    d="M10.833 9.16658L17.6663 2.33325"
                                                    stroke="white"
                                                    stroke-width="1.5"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                  />
                                                  <path
                                                    d="M18.333 5.66675V1.66675H14.333"
                                                    stroke="white"
                                                    stroke-width="1.5"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                  />
                                                  <path
                                                    d="M9.16699 1.66675H7.50033C3.33366 1.66675 1.66699 3.33341 1.66699 7.50008V12.5001C1.66699 16.6667 3.33366 18.3334 7.50033 18.3334H12.5003C16.667 18.3334 18.3337 16.6667 18.3337 12.5001V10.8334"
                                                    stroke="white"
                                                    stroke-width="1.5"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                  />
                                                </svg>

                                                <span className="ml-2 text-sm text-[#fff] font-Poppins font-normal">
                                                  Share
                                                </span>
                                              </div>
                                            </div>
                                          )}
                                        </Menu.Item>
                                        <Menu.Item>
                                          {({ active }) => (
                                            <div
                                              className={classNames(
                                                active
                                                  ? "bg-[#fff] bg-opacity-10"
                                                  : "bg-transparent",
                                                "block px-4 py-3 xl:rounded-xl cursor-pointer text-sm"
                                              )}
                                              // onClick={() => {
                                              //   router.push(`/`);
                                              // }}
                                            >
                                              <div className="flex justify-start items-center">
                                                <svg
                                                  width="20"
                                                  height="20"
                                                  viewBox="0 0 20 20"
                                                  fill="none"
                                                  xmlns="http://www.w3.org/2000/svg"
                                                >
                                                  <path
                                                    d="M17.5 4.98332C14.725 4.70832 11.9333 4.56665 9.15 4.56665C7.5 4.56665 5.85 4.64998 4.2 4.81665L2.5 4.98332"
                                                    stroke="#FF453A"
                                                    stroke-width="1.5"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                  />
                                                  <path
                                                    d="M7.08301 4.14175L7.26634 3.05008C7.39967 2.25841 7.49967 1.66675 8.90801 1.66675H11.0913C12.4997 1.66675 12.608 2.29175 12.733 3.05841L12.9163 4.14175"
                                                    stroke="#FF453A"
                                                    stroke-width="1.5"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                  />
                                                  <path
                                                    d="M15.7087 7.6167L15.167 16.0084C15.0753 17.3167 15.0003 18.3334 12.6753 18.3334H7.32533C5.00033 18.3334 4.92533 17.3167 4.83366 16.0084L4.29199 7.6167"
                                                    stroke="#FF453A"
                                                    stroke-width="1.5"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                  />
                                                  <path
                                                    d="M8.6084 13.75H11.3834"
                                                    stroke="#FF453A"
                                                    stroke-width="1.5"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                  />
                                                  <path
                                                    d="M7.91699 10.4167H12.0837"
                                                    stroke="#FF453A"
                                                    stroke-width="1.5"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                  />
                                                </svg>

                                                <span className="ml-2 text-sm text-[#FF453A] font-Poppins font-normal">
                                                  Delete
                                                </span>
                                              </div>
                                            </div>
                                          )}
                                        </Menu.Item>
                                      </div>
                                    </Menu.Items>
                                  </Transition>
                                </Menu>
                              </div>
                              <div className="w-12 h-12 bg-white px-4 flex rounded-full justify-center items-center">
                                <img
                                  src={barCode.src}
                                  alt="barcode"
                                  className="object-contain w-full h-full"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                  {digiCardData.length === 0 && digiCardLoader === false && (
                    <>
                      <div
                        style={{
                          borderRadius: "12px",
                          background: "#2B213F",
                        }}
                        className="flex text-white justify-center flex-row items-center w-full p-6"
                      >
                        No DigiCard Found, Please Create Your First Event
                        Passport!
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        <div className="w-full h-full">
          <Footer />
        </div>
      </div>
    </>
  );
};

export default MyDigicard;
