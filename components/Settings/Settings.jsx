import React, { useState, useEffect } from "react";
import { BsLink } from "react-icons/bs";
import { FaSignOutAlt } from "react-icons/fa";
import LogoIcon from "../SvgIcons/LogoIcon";
import Footer from "../Common/Footer";
import img from "./Profile_Picture.png";
import { useRouter } from "next/router";
import { TiThMenu } from "react-icons/ti";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { getAuth, getIdToken } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Register from "../Home/Register";
import { IoIosArrowForward } from "react-icons/io";

function Dashboard() {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [activeView, setActiveView] = useState("integrations");
  const [isOnLinkedIn, setIsOnLinkedIn] = useState(false);
  const [isOnFaceBook, setIsOnFaceBook] = useState(false);
  const [isOnEventBrite, setIsOnEventBrite] = useState(false);
  const [isOnMeetUp, setIsOnMeetUp] = useState(false);
  const [showSideBar, setShowSideBar] = useState(true);
  const [circleAccessToken, setCircleAccessToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Define your breakpoint for "md" here (e.g., 768 pixels).
    const mdBreakpoint = 992;

    const handleResize = () => {
      if (window.innerWidth <= mdBreakpoint) {
        setShowSideBar(false);
      } else {
        setShowSideBar(true);
      }
    };

    // Add an event listener for window resize
    window.addEventListener("resize", handleResize);

    // Initial check on component mount
    handleResize();

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const getIdTokenForUser = async () => {
      if (user) {
        try {
          const idToken = await getIdToken(user);
          setCircleAccessToken(idToken);
        } catch (error) {
          console.error("Error getting ID token:", error);
        }
      }
    };
    console.log("USER DATA", user);
    getIdTokenForUser();
  }, [user]);

  useEffect(() => {
    if (isOnEventBrite) {
      setLoading(true);
      var myHeaders = new Headers();
      myHeaders.append("accessToken", circleAccessToken);

      var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      fetch(
        "https://api.circle.ooo/api/circle/third-party/eventbrite/oauth-url",
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          if (result.result) {
            window.push(result.data);
          } else {
            toast.error("Something went wrong!");
          }
          setLoading(false);
        })
        .catch((error) => console.log("error", error));
    }
  }, [isOnEventBrite]);

  const toggleSwitchLinkedIn = () => {
    setIsOnLinkedIn(!isOnLinkedIn);
  };

  const toggleSwitchFaceBook = () => {
    setIsOnFaceBook(!isOnFaceBook);
  };

  const toggleSwitchEventBrite = () => {
    setIsOnEventBrite(!isOnEventBrite);
  };

  const toggleSwitchMeetUp = () => {
    setIsOnMeetUp(!isOnMeetUp);
  };

  const switchView = (view) => {
    setActiveView(view);
  };

  const handleClick = () => {
    setShowModal(true);
  };

  //logout function
  const logout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged Out Successfully!", {
        position: "top-right",
        autoClose: 3000, // Time in milliseconds
      });
      router.push("/");
      // Additional cleanup or state updates can be done here
      console.log("User logged out successfully");
    } catch (error) {
      console.log("Error logging out:", error);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="flex h-screen">
        {/* Sidebar Menu */}
        {showSideBar && (
          <div className="w-64 flex flex-col border-2 text-[#091E42] p-4">
            <div
              className="cursor-pointer w-full flex justify-center items-center flex-row"
              onClick={() => {
                router.push("/");
              }}
            >
              <div>
                <LogoIcon className="sm:w-16 sm:h-16 w-12 h-12" type={"dark"} />
              </div>
              <div className="text-[#1E1E1E] text-[22px] ml-4 font-bold">
                Circle
              </div>
            </div>
            <ul className="flex justify-start items-start flex-col mt-10 w-full">
              <li className="mb-3 rounded-lg p-2 w-full">
                <button
                  className={`text-[#091E42] ${
                    activeView === "integrations"
                      ? "text-[#091E42] font-bold"
                      : ""
                  }`}
                  onClick={() => switchView("integrations")}
                >
                  <div className="flex flex-row justify-start items-start">
                    <BsLink className="w-6 h-6 mr-2" />
                    <div>Integrations</div>
                  </div>
                </button>
              </li>
              <li className="mb-3 rounded-lg p-2 w-full">
                <button
                  className={`text-[#091E42] ${
                    activeView === "logout" ? "text-[#091E42] font-bold" : ""
                  }`}
                  onClick={() => {
                    signOut(auth)
                      .then(() => {
                        logout();
                      })
                      .catch((error) => {
                        toast.error("Error!", {
                          position: "top-right",
                          autoClose: 3000, // Time in milliseconds
                        });
                      });
                  }}
                >
                  <div className="flex flex-row justify-start items-start">
                    <FaSignOutAlt className="w-6 h-6 mr-2" />
                    <div>Logout</div>
                  </div>
                </button>
              </li>
              {/* Add more menu items */}
            </ul>
          </div>
        )}
        {/* Main Content */}
        <div className="flex-1 flex-col bg-[#FAFCFF]">
          <div className="border-b-2 flex justify-between p-2 items-center w-full bg-white">
            <div className="ml-2">
              <div
                onClick={() => {
                  setShowSideBar(!showSideBar);
                }}
                className="rounded-xl p-2 cursor-pointer border-2 flex flex-row justify-center items-center"
              >
                <div>
                  <TiThMenu size={25} />
                </div>
              </div>
            </div>
            <div className="flex flex-row items-center justify-center">
              <button
                onClick={() => {
                  if (user?.email === undefined) {
                    handleClick();
                  } else {
                    router.push("/CreateEvent");
                  }
                }}
                className={`hidden md:flex font14 font-medium rounded-full py-4 px-5 font-Montserrat text-[#fff] hover:text-[#007BAB] border-2 border-[#007BAB] hover:bg-transparent bg-[#007BAB]`}
              >
                <div className="flex justify-center items-center">
                  Create Event
                  <span>
                    <IoIosArrowForward className="ml-1" size={20} />
                  </span>
                </div>
              </button>
              <div className="bg-[#F9F9F9] p-2 flex ml-3 rounded-full">
                <div className="flex flex-row justify-center items-center">
                  <div className="rounded-full border-2 w-10 h-10">
                    <img
                      src={user?.photoURL}
                      className="rounded-full w-full h-full object-cover"
                      alt=""
                    />
                  </div>
                  <div className="flex flex-col ml-3">
                    <div className="text-[#292D32] font-bold">
                      {user?.displayName}
                    </div>
                    <div className="text-[#292D32]">{user?.email}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="p-6 w-full h-auto">
            {activeView === "integrations" && (
              <>
                <div className="p-6 bg-white rounded-xl">
                  <h1 className="text-2xl text-[#17191C] font-semibold mb-4">
                    Integrations
                  </h1>
                  <p className="text-[#8392AF]">
                    Add all third party event integrations here - (EventBrite,
                    Meetup, LinkedIn etc.)
                  </p>
                  <div className="flex w-full h-auto flex-col justify-start items-start rounded-lg mt-5">
                    {/* <div className="flex justify-between text-[#292D32] flex-row w-full h-auto mt-5">
                      <div className="text-[#292D32] font-semibold">
                        LinkedIn
                      </div>
                      <div>
                        <label
                          className={`${
                            isOnLinkedIn ? "bg-[#7367F0]" : "bg-[#E2E2E2]"
                          } relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer`}
                        >
                          <input
                            type="checkbox"
                            className="absolute h-0 w-0 opacity-0"
                            onChange={toggleSwitchLinkedIn}
                            checked={isOnLinkedIn}
                          />
                          <span
                            className={`${
                              isOnLinkedIn ? "translate-x-6" : "translate-x-1"
                            } inline-block w-4 h-4 transform translate-x-0.5 bg-white rounded-full transition-transform duration-200 ease-in-out`}
                          ></span>
                        </label>
                      </div>
                    </div>
                    <div className="flex justify-between text-[#292D32] flex-row w-full h-auto mt-2">
                      <div className="text-[#292D32] font-semibold">
                        FaceBook
                      </div>
                      <div>
                        <label
                          className={`${
                            isOnFaceBook ? "bg-[#7367F0]" : "bg-[#E2E2E2]"
                          } relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer`}
                        >
                          <input
                            type="checkbox"
                            className="absolute h-0 w-0 opacity-0"
                            onChange={toggleSwitchFaceBook}
                            checked={isOnFaceBook}
                          />
                          <span
                            className={`${
                              isOnFaceBook ? "translate-x-6" : "translate-x-1"
                            } inline-block w-4 h-4 transform translate-x-0.5 bg-white rounded-full transition-transform duration-200 ease-in-out`}
                          ></span>
                        </label>
                      </div>
                    </div> */}
                    <div className="flex justify-between text-[#292D32] flex-row w-full h-auto mt-2">
                      <div className="text-[#292D32] font-semibold">
                        EventBrite
                      </div>
                      <div>
                        <label
                          className={`${
                            isOnEventBrite ? "bg-[#7367F0]" : "bg-[#E2E2E2]"
                          } relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer`}
                        >
                          <input
                            type="checkbox"
                            className="absolute h-0 w-0 opacity-0"
                            onChange={toggleSwitchEventBrite}
                            checked={isOnEventBrite}
                            disabled={loading}
                          />
                          <span
                            className={`${
                              isOnEventBrite ? "translate-x-6" : "translate-x-1"
                            } inline-block w-4 h-4 transform translate-x-0.5 bg-white rounded-full transition-transform duration-200 ease-in-out`}
                          ></span>
                        </label>
                      </div>
                    </div>
                    <div className="flex justify-between text-[#292D32] flex-row w-full h-auto mt-2">
                      <div className="text-[#292D32] font-semibold">MeetUp</div>
                      <div>
                        <label
                          className={`${
                            isOnMeetUp ? "bg-[#7367F0]" : "bg-[#E2E2E2]"
                          } relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer`}
                        >
                          <input
                            type="checkbox"
                            className="absolute h-0 w-0 opacity-0"
                            onChange={toggleSwitchMeetUp}
                            checked={isOnMeetUp}
                          />
                          <span
                            className={`${
                              isOnMeetUp ? "translate-x-6" : "translate-x-1"
                            } inline-block w-4 h-4 transform translate-x-0.5 bg-white rounded-full transition-transform duration-200 ease-in-out`}
                          ></span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
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
      <Footer />
    </>
  );
}

export default Dashboard;
