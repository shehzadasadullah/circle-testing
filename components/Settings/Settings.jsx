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
import { ThreeDots } from "react-loader-spinner";

function Dashboard() {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [activeView, setActiveView] = useState("integrations");
  const [showSideBar, setShowSideBar] = useState(true);
  const [circleAccessToken, setCircleAccessToken] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [eventBriteLoader, setEventBriteLoader] = useState(false);
  const [meetUpLoader, setMeetUpLoader] = useState(false);
  const [isIntegratedEventBrite, setIsIntegratedEventBrite] = useState(false);
  const [isIntegratedMeetUp, setIsIntegratedMeetUp] = useState(false);
  const [eventBriteAccessCode, setEventBriteAccessCode] = useState("");
  const [meetUpAccessCode, setMeetUpAccessCode] = useState("");

  useEffect(() => {
    const mdBreakpoint = 992;
    const handleResize = () => {
      if (window.innerWidth <= mdBreakpoint) {
        setShowSideBar(false);
      } else {
        setShowSideBar(true);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
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

  const switchView = (view) => {
    setActiveView(view);
  };

  const handleClick = () => {
    setShowModal(true);
  };

  useEffect(() => {
    const codeParam = router.query.code || "";
    const integration = localStorage.getItem("integration");

    if (circleAccessToken !== "" && !codeParam) {
      localStorage.removeItem("integration");
      localStorage.removeItem("loader");
    }
    if (codeParam && integration === "eventBrite") {
      setEventBriteAccessCode(codeParam);
    }
    if (codeParam && integration === "meetUp") {
      setMeetUpAccessCode(codeParam);
    }
  }, [user, circleAccessToken]);

  useEffect(() => {
    const integration = localStorage.getItem("integration");
    const loader = localStorage.getItem("loader");
    if (circleAccessToken && integration && integration === "eventBrite") {
      if (loader && loader === "true") {
        setEventBriteLoader(true);
        if (eventBriteAccessCode !== "") {
          var myHeaders = new Headers();
          myHeaders.append("accessToken", circleAccessToken);
          var requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow",
          };

          fetch(
            `https://api.circle.ooo/api/circle/third-party/eventbrite/integrate?accessCode=${eventBriteAccessCode}`,
            requestOptions
          )
            .then((response) => response.json())
            .then((result) => {
              if (result.result === true) {
                if (result.message === "eventbrite integrated successfully") {
                  setEventBriteLoader(false);
                  setIsIntegratedEventBrite(true);
                  toast.success("Eventbrite integrated successfully!");
                  localStorage.removeItem("integration");
                  localStorage.removeItem("loader");
                }
              } else {
                setEventBriteLoader(false);
                toast.error(
                  "Integration error from third party, Please try again!"
                );
                localStorage.removeItem("integration");
                localStorage.removeItem("loader");
              }
            })
            .catch((error) => {
              setEventBriteLoader(false);
              toast.error(
                "Integration error from third party, Please try again!"
              );
              localStorage.removeItem("integration");
              localStorage.removeItem("loader");
            });
        }
      }
    }
  }, [eventBriteAccessCode, circleAccessToken]);

  useEffect(() => {
    const integration = localStorage.getItem("integration");
    const loader = localStorage.getItem("loader");
    if (circleAccessToken && integration && integration === "meetUp") {
      if (loader && loader === "true") {
        setMeetUpLoader(true);
        if (meetUpAccessCode !== "") {
          var myHeaders = new Headers();
          myHeaders.append("accessToken", circleAccessToken);
          var requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow",
          };

          fetch(
            `https://api.circle.ooo/api/circle/third-party/meetup/integrate?accessCode=${meetUpAccessCode}`,
            requestOptions
          )
            .then((response) => response.json())
            .then((result) => {
              console.log("MEETUP RESULT: ", result);
              // if (result.result === true) {
              //   if (result.message === "eventbrite integrated successfully") {
              //     setEventBriteLoader(false);
              //     setIsIntegratedEventBrite(true);
              //     toast.success("Eventbrite integrated successfully!");
              //     localStorage.removeItem("integration");
              //     localStorage.removeItem("loader");
              //   }
              // }
            })
            .catch((error) => console.log("error", error));
        }
      }
    }
  }, [meetUpAccessCode, circleAccessToken]);

  const getThirdPartyIntegrations = async () => {
    var myHeaders = new Headers();
    myHeaders.append("accessToken", circleAccessToken);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    await fetch(
      "https://api.circle.ooo/api/circle/third-party/get",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        if (result.data.length > 0) {
          result.data.map((item) => {
            if (item.integrationType === "EVENTBRITE") {
              setEventBriteLoader(false);
              setIsIntegratedEventBrite(true);
            }

            if (item.integrationType === "MEETUP") {
              setMeetUpLoader(false);
              setIsIntegratedMeetUp(true);
            }
          });
        }
      })
      .catch((error) => console.log("error", error));
  };

  useEffect(() => {
    if (circleAccessToken !== "") getThirdPartyIntegrations();
  }, [user, eventBriteAccessCode, circleAccessToken, meetUpAccessCode]);

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

  const handleEventBriteIntegration = () => {
    setEventBriteLoader(true);
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
        if (result.result) {
          localStorage.setItem("integration", "eventBrite");
          localStorage.setItem("loader", "true");
          router.push(result.data);
        } else {
          toast.error("Something went wrong!");
        }
      })
      .catch((error) => console.log("error", error));
  };

  const handleMeetUpIntegration = () => {
    setMeetUpLoader(true);
    var myHeaders = new Headers();
    myHeaders.append("accessToken", circleAccessToken);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      "https://api.circle.ooo/api/circle/third-party/meetup/oauth-url",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        if (result.result) {
          localStorage.setItem("integration", "meetUp");
          localStorage.setItem("loader", "true");
          router.push(result.data);
        } else {
          toast.error("Something went wrong!");
        }
      })
      .catch((error) => console.log("error", error));
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
                      src={user?.photoURL ? user?.photoURL : img.src}
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
                    <div className="flex justify-between text-[#292D32] flex-row w-full h-auto mt-2">
                      <div className="text-[#292D32] font-semibold">
                        EventBrite
                      </div>
                      <div>
                        {eventBriteLoader ? (
                          <>
                            <div className="flex justify-center items-center w-full p-4">
                              <ThreeDots
                                height="20"
                                color="#007BAB"
                                width="60"
                                radius="9"
                                ariaLabel="three-dots-loading"
                                visible={true}
                              />
                            </div>
                          </>
                        ) : isIntegratedEventBrite ? (
                          <>
                            <button
                              disabled={true}
                              className={`font14 font-medium rounded-xl py-2 px-4 font-Montserrat text-[#fff] border-2 border-[#4BB543] bg-[#4BB543]`}
                            >
                              <div className="flex justify-center font-bold text-[20pt] items-center">
                                ✓
                              </div>
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => {
                                handleEventBriteIntegration();
                              }}
                              disabled={eventBriteLoader}
                              className={`font14 font-medium rounded-xl py-3 px-5 font-Montserrat text-[#fff] hover:text-[#007BAB] border-2 border-[#007BAB] hover:bg-transparent bg-[#007BAB]`}
                            >
                              <div className="flex justify-center items-center">
                                Integrate
                              </div>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between text-[#292D32] flex-row w-full h-auto mt-2">
                      <div className="text-[#292D32] font-semibold">MeetUp</div>
                      <div>
                        {meetUpLoader ? (
                          <>
                            <div className="flex justify-center items-center w-full p-4">
                              <ThreeDots
                                height="20"
                                color="#007BAB"
                                width="60"
                                radius="9"
                                ariaLabel="three-dots-loading"
                                visible={true}
                              />
                            </div>
                          </>
                        ) : isIntegratedMeetUp ? (
                          <>
                            <button
                              disabled={true}
                              className={`font14 font-medium rounded-xl py-2 px-4 font-Montserrat text-[#fff] border-2 border-[#4BB543] bg-[#4BB543]`}
                            >
                              <div className="flex justify-center font-bold text-[20pt] items-center">
                                ✓
                              </div>
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => {
                                handleMeetUpIntegration();
                              }}
                              disabled={meetUpLoader}
                              className={`font14 font-medium rounded-xl py-3 px-5 font-Montserrat text-[#fff] hover:text-[#007BAB] border-2 border-[#007BAB] hover:bg-transparent bg-[#007BAB]`}
                            >
                              <div className="flex justify-center items-center">
                                Integrate
                              </div>
                            </button>
                          </>
                        )}
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
