import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LogoIcon } from "../SvgIcons";
import Register from "../Home/Register";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { HeartIcon, LogoutIcon, UserIcon } from "@/icons";
import ProfileIcon from "@/icons/ProfileIcon";
import ImageComp from "../ImageComp";
import { useRouter } from "next/router";
import { HiMiniUserCircle } from "react-icons/hi2";
import { setDoc, doc } from "firebase/firestore";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { FaSignOutAlt, FaQuestionCircle } from "react-icons/fa";
import { IoSettingsSharp } from "react-icons/io5";
import { MdOutlineFavorite } from "react-icons/md";
import { BsFillInfoCircleFill } from "react-icons/bs";
import { BiSolidPhoneCall } from "react-icons/bi";
import { FaSignInAlt } from "react-icons/fa";
import { FcAbout, FcContacts, FcUnlock } from "react-icons/fc";
import { AiFillHome } from "react-icons/ai";
import { IoIosArrowForward } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiOutlineMenu } from "react-icons/ai";

const Header = ({ type = "", page = "" }) => {
  const [showModal, setShowModal] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);

  const router = useRouter();
  const { pathname } = router;
  const [user] = useAuthState(auth);

  const { accessToken, errorval, error_description } = router.query;
  //useEffect

  ///get email address from linkedin using accesstoken
  const GetEmailAddress = async (access_token) => {
    try {
      let url =
        "/api/linkedin/email/?accessToken=" + encodeURIComponent(access_token);
      const response = await fetch(url, { method: "GET" });
      if (!response.ok) {
        // throw new Error(`HTTP error! status: ${response.status}`);
        console.error(
          "state",
          `HTTP error! status: ${response.status}`,
          response
        );
        return "";
      }
      const data = await response.json();
      if (data?.data?.status >= 400) {
        console.error("state", "error", data?.data?.message);
      }
      // console.log(
      //   "state",
      //   "data",
      //   data?.data?.["elements"]?.[0]?.["handle~"]?.["emailAddress"]
      // );
      return data?.data?.["elements"]?.[0]?.["handle~"]?.["emailAddress"] || "";
    } catch (e) {
      console.error("state", "error", e);
    }
  };
  ///get userDetail from linkedin using accesstoken
  const GetUserDetails = async (access_token) => {
    try {
      let url =
        "/api/linkedin/details/?accessToken=" +
        encodeURIComponent(access_token);
      const response = await fetch(url, { method: "GET" });
      if (!response.ok) {
        // throw new Error(`HTTP error! status: ${response.status}`);
        console.error(
          "state",
          `HTTP error! status: ${response.status}`,
          response
        );
        return "";
      }
      const data = await response.json();
      if (data?.data?.status >= 400) {
        console.error("state", "error", data?.data?.message);
      }
      let lnEmail = await GetEmailAddress(access_token);
      let lnlastName = data?.data?.["localizedLastName"] || "";
      let lnfirstName = data?.data?.["localizedFirstName"] || "";
      let lnprofilePicture =
        data?.data?.["profilePicture"]["displayImage~"]["elements"][3][
          "identifiers"
        ][0]["identifier"] ?? "";
      let lnheadlin = data?.data?.["localizedHeadline"] || "";
      let lnProfile_url = data?.data["vanityName"]
        ? "https://www.linkedin.com/in/" + data?.data["vanityName"]
        : "";
      CreateLinkedinLogin(
        lnEmail,
        lnlastName,
        lnfirstName,
        lnprofilePicture,
        lnheadlin,
        lnProfile_url
      );
    } catch (e) {
      console.error("state", "error", e);
    }
  };

  //login as email and password as email for linkedin login user, to connect with firebase
  const CreateLinkedinLogin = async (
    lnEmail,
    lnlastName,
    lnfirstName,
    lnprofilePicture,
    lnheadlin,
    lnProfile_url
  ) => {
    createUserWithEmailAndPassword(auth, lnEmail, lnEmail)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // ...
        // store user data in Firestore
        setDoc(doc(db, "Users", user.uid), {
          company_name: "",
          companyaddress: "",
          uid: user.uid || "",
          display_name: lnfirstName + " " + lnlastName || "",
          email: user.email || "",
          full_name: lnfirstName + " " + lnlastName || "",
          full_name_insensitive:
            (lnfirstName + " " + lnlastName || "").toUpperCase() || "",
          job_title: lnheadlin || "",
          linkedin_profile: lnProfile_url || "",
          phone_number: phone || "",
          photo_url: lnprofilePicture || "",
          created_time: new Date(),
          who_i_met: {},
          // add additional user data here
        })
          .then(() => {
            console.log("state", "Successfully added the data");
            const urlWithoutQueryParams = pathname; // Preserve the path

            window.history.replaceState(
              {},
              document.title,
              urlWithoutQueryParams
            );
          })
          .catch((error) => {
            console.error("state", "Error adding the data", error);
          });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorCode === "auth/email-already-in-use") {
          signInWithEmailAndPassword(auth, lnEmail, lnEmail)
            .then((user) => {
              const urlWithoutQueryParams = pathname; // Preserve the path

              window.history.replaceState(
                {},
                document.title,
                urlWithoutQueryParams
              );
            })
            .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
              console.log("state", "error", error);
            });
        } else {
          if (errorCode === "auth/invalid-email") {
            console.error(`Email address ${this.state.email} is invalid.`);
          }
          if (errorCode === "auth/operation-not-allowed") {
            console.log(`Error during sign up.`);
          }
          if (errorCode === "auth/weak-password") {
            console.log(
              "Password is not strong enough. Add additional characters including special characters and numbers."
            );
          }
          console.log(error.message);
        }
      });
  };
  useEffect(() => {
    if (accessToken?.length > 0) {
      GetUserDetails(accessToken);
    }
  }, [accessToken]);

  useEffect(() => {
    if (errorval) {
      console.log("state", "errorval", errorval, error_description);
    }
  }, [errorval, error_description]);

  const handleClick = () => {
    setShowModal(true);
  };

  //logout function
  const logout = async () => {
    try {
      await signOut(auth);

      // Additional cleanup or state updates can be done here
      console.log("User logged out successfully");
    } catch (error) {
      console.log("Error logging out:", error);
    }
  };

  const classNames = (...classes) => {
    return classes.filter(Boolean).join(" ");
  };

  return (
    <>
      <ToastContainer />
      <div>
        <div className="w-full h-auto md:px-12 md:py-5">
          <div className="hidden md:flex md:justify-center md:items-center md:w-full md:h-auto">
            <div className="w-1/2 h-auto flex justify-center items-center">
              <div className="flex justify-between flex-row items-center w-full">
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    router.push("/");
                  }}
                >
                  <LogoIcon className="sm:w-20 sm:h-20 w-12 h-12" type={type} />
                </div>
                <div className="text-left w-full h-auto">
                  <Link
                    href="/"
                    className={`ml-10 lg:ml-16 font16 font-medium font-Montserrat border-b-2 ${
                      type === "dark"
                        ? "hover:text-[#fff] hover:border-[#fff]"
                        : "hover:text-[#007BAB] hover:border-[#007BAB]"
                    } ${
                      page == "home"
                        ? ` ${
                            type === "dark"
                              ? "border-[#fff] text-[#fff]"
                              : "border-[#007BAB] text-[#007BAB]"
                          }`
                        : `border-transparent ${
                            type === "dark" ? "text-[#fff]" : "text-[#333]"
                          }`
                    } py-0.5`}
                  >
                    Home
                  </Link>
                  {/* <Link
                    href="/events"
                    className={`ml-6 font16 font-medium font-Montserrat border-b-2 hover:text-[#007BAB] hover:border-[#007BAB] ${
                      page == "attend"
                        ? "border-[#007BAB] text-[#007BAB]"
                        : "border-transparent text-[#333]"
                    } py-0.5`}
                  >
                    Events
                  </Link> */}
                  <Link
                    href="/about"
                    className={`ml-6 font16 font-medium font-Montserrat border-b-2 ${
                      type === "dark"
                        ? "hover:text-[#fff] hover:border-[#fff]"
                        : "hover:text-[#007BAB] hover:border-[#007BAB]"
                    } ${
                      page == "about"
                        ? ` ${
                            type === "dark"
                              ? "border-[#fff] text-[#fff]"
                              : "border-[#007BAB] text-[#007BAB]"
                          }`
                        : `border-transparent ${
                            type === "dark" ? "text-[#fff]" : "text-[#333]"
                          }`
                    } py-0.5`}
                  >
                    About
                  </Link>
                  <Link
                    href="/contact"
                    className={`ml-6 font16 font-medium font-Montserrat border-b-2 ${
                      type === "dark"
                        ? "hover:text-[#fff] hover:border-[#fff]"
                        : "hover:text-[#007BAB] hover:border-[#007BAB]"
                    } ${
                      page == "contact"
                        ? ` ${
                            type === "dark"
                              ? "border-[#fff] text-[#fff]"
                              : "border-[#007BAB] text-[#007BAB]"
                          }`
                        : `border-transparent ${
                            type === "dark" ? "text-[#fff]" : "text-[#333]"
                          }`
                    } py-0.5`}
                  >
                    Contact
                  </Link>
                </div>
              </div>
            </div>
            <div className="w-1/2 h-auto flex justify-end items-center">
              <div>
                {user?.email === undefined && (
                  <>
                    <div className="flex justify-between items-center">
                      <button
                        onClick={handleClick}
                        className={`font16 font-medium font-Montserrat ${
                          type === "dark"
                            ? "text-[#fff] hover:text-[#fff]"
                            : "text-[#333] hover:text-[#007BAB]"
                        }`}
                      >
                        Login / SignUp
                      </button>
                      <button
                        onClick={() => {
                          if (user?.email === undefined) {
                            handleClick();
                          } else {
                            router.push("/create-event");
                          }
                        }}
                        className={`ml-5 font14 font-medium rounded-full p-4 font-Montserrat text-[#fff] hover:text-[#007BAB] border-2 border-[#007BAB] hover:bg-[#fff] bg-[#007BAB]`}
                      >
                        <div className="flex justify-between items-center">
                          Create an Event
                          <span>
                            <IoIosArrowForward className="ml-1" size={20} />
                          </span>
                        </div>
                      </button>
                    </div>
                  </>
                )}

                {user?.email && (
                  <>
                    <div className="flex justify-center items-center p-4 lg:p-0">
                      <Menu
                        as="div"
                        className="relative inline-block text-left"
                      >
                        <div>
                          <Menu.Button className={"flex items-center"}>
                            <div className="flex items-center justify-start">
                              <HiMiniUserCircle
                                size={40}
                                color={`${
                                  type === "dark" ? "#fff" : "#007BAB"
                                }`}
                              />
                              <div
                                className={`ml-1 font16 ${
                                  type === "dark"
                                    ? "text-[#fff]"
                                    : "text-[#007BAB]"
                                } font-semibold font-Montserrat`}
                              >
                                Hi,{" "}
                                {user?.displayName
                                  ? user?.displayName
                                  : user?.email
                                      .slice(0, user?.email.indexOf("@"))
                                      .toUpperCase()}
                                !
                              </div>
                              <div className="hidden lg:flex">
                                <ChevronDownIcon
                                  className={`h-5 w-5 ${
                                    type === "dark" && "text-[#fff]"
                                  }`}
                                  aria-hidden="true"
                                />
                              </div>
                              <div className="flex lg:hidden ml-3">
                                <div
                                  className={`font16 font-semibold font-Montserrat bg-[#007BAB] rounded-lg p-2 text-white`}
                                >
                                  <AiOutlineMenu size={30} />
                                </div>
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
                          <Menu.Items className="absolute right-0 z-10 mt-2 w-auto origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div className="py-1">
                              <Menu.Item>
                                {({ active }) => (
                                  <>
                                    <div className="flex justify-start items-center">
                                      <div className="p-2">
                                        {localStorage.getItem("#userImage$") ? (
                                          <ImageComp
                                            src={localStorage.getItem(
                                              "#userImage$"
                                            )}
                                            alt="User Image"
                                            height={64}
                                            width={64}
                                            style={{
                                              borderRadius: "32px",
                                            }}
                                            fallbackSrc={"/useravatar.svg"}
                                            fallbackComp={() => {
                                              return (
                                                <UserIcon className="h-12 w-12" />
                                              );
                                            }}
                                          />
                                        ) : (
                                          <UserIcon className="w-12 h-12" />
                                        )}
                                      </div>
                                      <div className="flex p-2 pr-5 flex-col justify-start items-start">
                                        <div className="font-bold">
                                          {user?.displayName}
                                        </div>
                                        <div>{user?.email}</div>
                                      </div>
                                    </div>
                                  </>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <div
                                    className={classNames(
                                      active
                                        ? "bg-gray-100 text-gray-900"
                                        : "text-gray-700",
                                      "block px-4 py-4 cursor-pointer text-sm"
                                    )}
                                    onClick={() => {
                                      router.push(`/${user?.uid}/favorites`);
                                    }}
                                  >
                                    <div className="flex justify-start items-start">
                                      <MdOutlineFavorite className="w-5 h-5" />
                                      <span className="px-4 text-sm text-[#666F76] font-Poppins font-normal">
                                        FAVORITES
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
                                        ? "bg-gray-100 text-gray-900"
                                        : "text-gray-700",
                                      "block px-4 py-4 cursor-pointer text-sm"
                                    )}
                                    onClick={() => {
                                      router.push("/faq");
                                    }}
                                  >
                                    <div className="flex justify-start items-start">
                                      <FaQuestionCircle className="w-5 h-5" />
                                      <span className="px-4 text-sm text-[#666F76] font-Poppins font-normal">
                                        FAQ
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
                                        ? "bg-gray-100 text-gray-900"
                                        : "text-gray-700",
                                      "block px-4 py-4 cursor-pointer text-sm"
                                    )}
                                    onClick={() => {
                                      router.push("/settings");
                                    }}
                                  >
                                    <div className="flex justify-start items-start">
                                      <IoSettingsSharp className="w-5 h-5" />
                                      <span className="px-4 text-sm text-[#666F76] font-Poppins font-normal">
                                        Integrations
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </Menu.Item>
                              <form method="POST" action="#">
                                <Menu.Item>
                                  {({ active }) => (
                                    <div
                                      className={classNames(
                                        active
                                          ? "bg-gray-100 text-gray-900"
                                          : "text-gray-700",
                                        "block px-4 py-4 cursor-pointer text-sm"
                                      )}
                                      onClick={() => {
                                        signOut(auth)
                                          .then(() => {
                                            logout();
                                            setUserDropdown(false);
                                            toast.success(
                                              "Logged Out Successfully!",
                                              {
                                                position: "top-right",
                                                autoClose: 3000, // Time in milliseconds
                                              }
                                            );
                                            setTimeout(() => {
                                              router.push("/");
                                            }, 2000);
                                          })
                                          .catch((error) => {
                                            toast.error("Error!", {
                                              position: "top-right",
                                              autoClose: 3000, // Time in milliseconds
                                            });
                                          });
                                      }}
                                    >
                                      <div className="flex justify-start items-start">
                                        <FaSignOutAlt className="w-5 h-5" />
                                        <span className="px-4 text-sm text-[#666F76] font-Poppins font-normal">
                                          LOGOUT
                                        </span>
                                      </div>
                                    </div>
                                  )}
                                </Menu.Item>
                              </form>
                            </div>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                      <div className="ml-5 hidden lg:flex">
                        <button
                          onClick={() => {
                            if (user?.email === undefined) {
                              handleClick();
                            } else {
                              router.push("/create-event");
                            }
                          }}
                          className={`font14 font-medium rounded-full p-4 font-Montserrat text-[#fff] hover:text-[#007BAB] border-2 border-[#007BAB] hover:bg-[#fff] bg-[#007BAB]`}
                        >
                          <div className="flex justify-between items-center">
                            Create an Event
                            <span>
                              <IoIosArrowForward className="ml-1" size={20} />
                            </span>
                          </div>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="md:hidden flex justify-between items-center w-full h-auto px-10 py-5">
            <div className="w-1/2 h-auto flex justify-start items-center">
              <div
                className="cursor-pointer"
                onClick={() => {
                  router.push("/");
                }}
              >
                <LogoIcon className="w-20 h-20" type={type} />
              </div>
            </div>
            <div className="w-1/2 h-auto flex justify-end items-center">
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button
                    className={
                      "flex items-center bg-[#007BAB] rounded-lg p-2 text-white"
                    }
                  >
                    <div className="flex items-center justify-start">
                      <div className={`font16 font-semibold font-Montserrat`}>
                        <AiOutlineMenu size={30} />
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
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-auto origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      {user?.email && (
                        <Menu.Item>
                          {({ active }) => (
                            <>
                              <div className="flex justify-start items-center">
                                <div className="p-2">
                                  {localStorage.getItem("#userImage$") ? (
                                    <ImageComp
                                      src={localStorage.getItem("#userImage$")}
                                      alt="User Image"
                                      height={64}
                                      width={64}
                                      style={{
                                        borderRadius: "32px",
                                      }}
                                      fallbackSrc={"/useravatar.svg"}
                                      fallbackComp={() => {
                                        return (
                                          <UserIcon className="h-12 w-12" />
                                        );
                                      }}
                                    />
                                  ) : (
                                    <UserIcon className="w-12 h-12" />
                                  )}
                                </div>
                                <div className="flex p-2 pr-5 flex-col justify-start items-start">
                                  <div className="font-bold">
                                    {user?.displayName}
                                  </div>
                                  <div>{user?.email}</div>
                                </div>
                              </div>
                            </>
                          )}
                        </Menu.Item>
                      )}
                      <Menu.Item>
                        {({ active }) => (
                          <div
                            className={classNames(
                              active
                                ? "bg-gray-100 text-gray-900"
                                : "text-gray-700",
                              "block px-4 py-4 cursor-pointer text-sm"
                            )}
                            onClick={() => {
                              router.push(`/`);
                            }}
                          >
                            <div className="flex justify-start items-start">
                              <AiFillHome className="w-5 h-5" />
                              <span className="px-4 text-sm text-[#666F76] font-Poppins font-normal">
                                HOME
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
                                ? "bg-gray-100 text-gray-900"
                                : "text-gray-700",
                              "block px-4 py-4 cursor-pointer text-sm"
                            )}
                            onClick={() => {
                              router.push(`/about`);
                            }}
                          >
                            <div className="flex justify-start items-start">
                              <BsFillInfoCircleFill className="w-5 h-5" />
                              <span className="px-4 text-sm text-[#666F76] font-Poppins font-normal">
                                ABOUT
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
                                ? "bg-gray-100 text-gray-900"
                                : "text-gray-700",
                              "block px-4 py-4 cursor-pointer text-sm"
                            )}
                            onClick={() => {
                              router.push(`/contact`);
                            }}
                          >
                            <div className="flex justify-start items-start">
                              <BiSolidPhoneCall className="w-5 h-5" />
                              <span className="px-4 text-sm text-[#666F76] font-Poppins font-normal">
                                CONTACT
                              </span>
                            </div>
                          </div>
                        )}
                      </Menu.Item>
                      {user?.email === undefined && (
                        <Menu.Item>
                          {({ active }) => (
                            <div
                              className={classNames(
                                active
                                  ? "bg-gray-100 text-gray-900"
                                  : "text-gray-700",
                                "block px-4 py-4 cursor-pointer text-sm"
                              )}
                              onClick={() => {
                                handleClick();
                              }}
                            >
                              <div className="flex justify-start items-start">
                                <FaSignInAlt className="w-5 h-5" />
                                <span className="px-4 text-sm text-[#666F76] font-Poppins font-normal">
                                  LOGIN/SIGNUP
                                </span>
                              </div>
                            </div>
                          )}
                        </Menu.Item>
                      )}
                      {user?.email && (
                        <>
                          <Menu.Item>
                            {({ active }) => (
                              <div
                                className={classNames(
                                  active
                                    ? "bg-gray-100 text-gray-900"
                                    : "text-gray-700",
                                  "block px-4 py-4 cursor-pointer text-sm"
                                )}
                                onClick={() => {
                                  router.push(`/${user?.uid}/favorites`);
                                }}
                              >
                                <div className="flex justify-start items-start">
                                  <MdOutlineFavorite className="w-5 h-5" />
                                  <span className="px-4 text-sm text-[#666F76] font-Poppins font-normal">
                                    FAVORITES
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
                                    ? "bg-gray-100 text-gray-900"
                                    : "text-gray-700",
                                  "block px-4 py-4 cursor-pointer text-sm"
                                )}
                                onClick={() => {
                                  router.push("/faq");
                                }}
                              >
                                <div className="flex justify-start items-start">
                                  <FaQuestionCircle className="w-5 h-5" />
                                  <span className="px-4 text-sm text-[#666F76] font-Poppins font-normal">
                                    FAQ
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
                                    ? "bg-gray-100 text-gray-900"
                                    : "text-gray-700",
                                  "block px-4 py-4 cursor-pointer text-sm"
                                )}
                                onClick={() => {
                                  router.push("/settings");
                                }}
                              >
                                <div className="flex justify-start items-start">
                                  <IoSettingsSharp className="w-5 h-5" />
                                  <span className="px-4 text-sm text-[#666F76] font-Poppins font-normal">
                                    Integrations
                                  </span>
                                </div>
                              </div>
                            )}
                          </Menu.Item>
                          <form method="POST" action="#">
                            <Menu.Item>
                              {({ active }) => (
                                <div
                                  className={classNames(
                                    active
                                      ? "bg-gray-100 text-gray-900"
                                      : "text-gray-700",
                                    "block px-4 py-4 cursor-pointer text-sm"
                                  )}
                                  onClick={() => {
                                    signOut(auth)
                                      .then(() => {
                                        logout();
                                        setUserDropdown(false);
                                        toast.success(
                                          "Logged Out Successfully!",
                                          {
                                            position: "top-right",
                                            autoClose: 3000, // Time in milliseconds
                                          }
                                        );
                                        setTimeout(() => {
                                          router.push("/");
                                        }, 2000);
                                      })
                                      .catch((error) => {
                                        toast.error("Error!", {
                                          position: "top-right",
                                          autoClose: 3000, // Time in milliseconds
                                        });
                                      });
                                  }}
                                >
                                  <div className="flex justify-start items-start">
                                    <FaSignOutAlt className="w-5 h-5" />
                                    <span className="px-4 text-sm text-[#666F76] font-Poppins font-normal">
                                      LOGOUT
                                    </span>
                                  </div>
                                </div>
                              )}
                            </Menu.Item>
                          </form>
                        </>
                      )}
                      {/* <Menu.Item>
                        {({ active }) => (
                          <div
                            className={classNames(
                              active
                                ? "bg-gray-100 text-gray-900"
                                : "text-gray-700",
                              "block text-center px-4 py-4 cursor-pointer text-sm"
                            )}
                          >
                            <button
                              onClick={() => {
                                router.push(create-event);
                              }}
                              className={`font14 font-medium rounded-full p-4 font-Montserrat text-[#fff] hover:text-[#007BAB] border-2 border-[#007BAB] hover:bg-[#fff] bg-[#007BAB]`}
                            >
                              <div className="flex justify-between items-center">
                                Create an Event
                                <span>
                                  <IoIosArrowForward
                                    className="ml-1"
                                    size={20}
                                  />
                                </span>
                              </div>
                            </button>
                          </div>
                        )}
                      </Menu.Item> */}
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
        </div>
        {/* <div className="w-full  flex justify-between items-center px-2 sm:px-8 md:px-12 lg:px-16 xl:px-24 2xl:px-32  py-2 md:py-3.5 ">
          <div
            className="px-2 cursor-pointer"
            onClick={() => {
              router.push("/");
            }}
          >
            <LogoIcon className="sm:w-20 sm:h-20 w-12 h-12" type={type} />
          </div>
          <div className="w-full h-[40pt]">
            <div className="flex justify-between items-center">
              <div className="mt-2">
                <Link
                  href="/"
                  className={`ml-20 font16 font-medium font-Montserrat border-b-2 hover:text-[#007BAB] hover:border-[#007BAB] ${
                    page == "home"
                      ? "border-[#007BAB] text-[#007BAB]"
                      : "border-transparent text-[#333]"
                  } py-0.5`}
                >
                  Home
                </Link>
                <Link
                  href="/events"
                  className={`ml-6 font16 font-medium font-Montserrat border-b-2 hover:text-[#007BAB] hover:border-[#007BAB] ${
                    page == "attend"
                      ? "border-[#007BAB] text-[#007BAB]"
                      : "border-transparent text-[#333]"
                  } py-0.5`}
                >
                  Events
                </Link>
                <Link
                  href="/about"
                  className={`ml-6 font16 font-medium font-Montserrat border-b-2 hover:text-[#007BAB] hover:border-[#007BAB] ${
                    page == "about"
                      ? "border-[#007BAB] text-[#007BAB]"
                      : "border-transparent text-[#333]"
                  } py-0.5`}
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  className={`ml-6 font16 font-medium font-Montserrat border-b-2 hover:text-[#007BAB] hover:border-[#007BAB] ${
                    page == "contact"
                      ? "border-[#007BAB] text-[#007BAB]"
                      : "border-transparent text-[#333]"
                  } py-0.5`}
                >
                  Contact
                </Link>
              </div>
              <div>
                <div className="flex items-center">
                  {user?.email === undefined && (
                    <>
                      <div className="flex justify-between items-center">
                        <button
                          onClick={handleClick}
                          className={`font16 font-medium font-Montserrat text-[#333] hover:text-[#007BAB]`}
                        >
                          Login / SignUp
                        </button>
                        <button
                          onClick={() => {
                            router.push(create-event);
                          }}
                          className={`ml-5 font14 font-medium rounded-full p-4 font-Montserrat text-[#fff] hover:text-[#007BAB] border-2 border-[#007BAB] hover:bg-[#fff] bg-[#007BAB]`}
                        >
                          <div className="flex justify-between items-center">
                            Create an Event
                            <span>
                              <IoIosArrowForward className="ml-1" size={20} />
                            </span>
                          </div>
                        </button>
                      </div>
                    </>
                  )}

                  {user?.email && (
                    <>
                      <Menu
                        as="div"
                        className="relative inline-block text-left"
                      >
                        <div>
                          <Menu.Button className={"flex items-center"}>
                            <div className="flex items-center justify-start">
                              <img
                                src="/ProfileIcon.png"
                                alt="Profile Icon"
                                className="w-6 lg:w-10 2xl:w-10 h-auto"
                              />
                              <div
                                className={`ml-2 font16 text-[#007BAB] font-semibold font-Montserrat`}
                              >
                                Hi,{" "}
                                {user?.full_name
                                  ? user?.full_name
                                  : user?.email.slice(
                                      0,
                                      user?.email.indexOf("@")
                                    )}
                                !
                              </div>
                              <ChevronDownIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
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
                          <Menu.Items className="absolute right-0 z-10 mt-2 w-auto origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div className="py-1">
                              <Menu.Item>
                                {({ active }) => (
                                  <>
                                    <div className="flex justify-start items-center">
                                      <div className="p-2">
                                        {localStorage.getItem("#userImage$") ? (
                                          <ImageComp
                                            src={localStorage.getItem(
                                              "#userImage$"
                                            )}
                                            alt="User Image"
                                            height={64}
                                            width={64}
                                            style={{
                                              borderRadius: "32px",
                                            }}
                                            fallbackSrc={"/useravatar.svg"}
                                            fallbackComp={() => {
                                              return (
                                                <UserIcon className="h-12 w-12" />
                                              );
                                            }}
                                          />
                                        ) : (
                                          <UserIcon className="w-12 h-12" />
                                        )}
                                      </div>
                                      <div className="flex p-2 flex-col justify-start items-start">
                                        <div className="font-bold">
                                          {user?.full_name}
                                        </div>
                                        <div>{user?.email}</div>
                                      </div>
                                    </div>
                                  </>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <div
                                    className={classNames(
                                      active
                                        ? "bg-gray-100 text-gray-900"
                                        : "text-gray-700",
                                      "block px-4 py-4 cursor-pointer text-sm"
                                    )}
                                    onClick={() => {
                                      router.push(`/${user?.uid}/favorites`);
                                    }}
                                  >
                                    <div className="flex justify-start items-start">
                                      <MdOutlineFavorite className="w-5 h-5" />
                                      <span className="px-4 text-sm text-[#666F76] font-Poppins font-normal">
                                        FAVORITES
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
                                        ? "bg-gray-100 text-gray-900"
                                        : "text-gray-700",
                                      "block px-4 py-4 cursor-pointer text-sm"
                                    )}
                                    onClick={() => {
                                      router.push("/faq");
                                    }}
                                  >
                                    <div className="flex justify-start items-start">
                                      <FaQuestionCircle className="w-5 h-5" />
                                      <span className="px-4 text-sm text-[#666F76] font-Poppins font-normal">
                                        FAQ
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </Menu.Item>
                              <form method="POST" action="#">
                                <Menu.Item>
                                  {({ active }) => (
                                    <div
                                      className={classNames(
                                        active
                                          ? "bg-gray-100 text-gray-900"
                                          : "text-gray-700",
                                        "block px-4 py-4 cursor-pointer text-sm"
                                      )}
                                      onClick={() => {
                                        signOut(auth)
                                          .then(() => {
                                            logout();
                                            setUserDropdown(false);
                                            toast.success(
                                              "Logged Out Successfully!",
                                              {
                                                position: "top-right",
                                                autoClose: 3000, // Time in milliseconds
                                              }
                                            );
                                          })
                                          .catch((error) => {
                                            toast.error("Error!", {
                                              position: "top-right",
                                              autoClose: 3000, // Time in milliseconds
                                            });
                                          });
                                      }}
                                    >
                                      <div className="flex justify-start items-start">
                                        <FaSignOutAlt className="w-5 h-5" />
                                        <span className="px-4 text-sm text-[#666F76] font-Poppins font-normal">
                                          LOGOUT
                                        </span>
                                      </div>
                                    </div>
                                  )}
                                </Menu.Item>
                              </form>
                            </div>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                      <div className="ml-5">
                        <button
                          onClick={() => {
                            router.push(create-event);
                          }}
                          className={`font14 font-medium rounded-full p-4 font-Montserrat text-[#fff] hover:text-[#007BAB] border-2 border-[#007BAB] hover:bg-[#fff] bg-[#007BAB]`}
                        >
                          <div className="flex justify-between items-center">
                            Create an Event
                            <span>
                              <IoIosArrowForward className="ml-1" size={20} />
                            </span>
                          </div>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
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
            className="z-50"
          >
            <Register showModal={showModal} setShowModal={setShowModal} />
          </div>
        )}
      </div>
    </>
  );
};

export default Header;
