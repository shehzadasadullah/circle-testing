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
import { Dialog } from "@headlessui/react";
import loaderGif from "../../public/events/Loader.gif";
import Header from "../Common/Header";

function Dashboard() {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [activeView, setActiveView] = useState("integrations");
  const [showSideBar, setShowSideBar] = useState(true);
  const [circleAccessToken, setCircleAccessToken] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [eventBriteLoader, setEventBriteLoader] = useState(false);
  const [meetUpLoader, setMeetUpLoader] = useState(false);
  const [googleCalenderLoader, setGoogleCalenderLoader] = useState(false);
  const [iCalLoader, setICalLoader] = useState(false);
  const [isIntegratedEventBrite, setIsIntegratedEventBrite] = useState(false);
  const [isIntegratedMeetUp, setIsIntegratedMeetUp] = useState(false);
  const [isIntegratedGC, setIsIntegratedGC] = useState(false);
  const [isIntegratedIC, setIsIntegratedIC] = useState(false);
  const [eventBriteAccessCode, setEventBriteAccessCode] = useState("");
  const [meetUpAccessCode, setMeetUpAccessCode] = useState("");
  const [GCAccessCode, setGCAccessCode] = useState("");
  const [ICAccessCode, setICAccessCode] = useState("");
  let [isOpen, setIsOpen] = useState(false);
  const [groupURL, setGroupURL] = useState("");
  const [groupURLLoader, setGroupURLLoader] = useState(false);
  const [thirdPartLoader, setThirdPartLoader] = useState(true);

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
          console.log("ACCESS TOKEN: ", idToken);
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
    if (codeParam && integration === "GC") {
      setGCAccessCode(codeParam);
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
              if (result.result === true) {
                if (result.message === "meetup integrated successfully") {
                  setIsOpen(true);
                }
              } else {
                setMeetUpLoader(false);
                toast.error(
                  "Integration error from third party, Please try again!"
                );
                localStorage.removeItem("integration");
                localStorage.removeItem("loader");
              }
            })
            .catch((error) => {
              setMeetUpLoader(false);
              toast.error(
                "Integration error from third party, Please try again!"
              );
              localStorage.removeItem("integration");
              localStorage.removeItem("loader");
            });
        }
      }
    }
  }, [meetUpAccessCode, circleAccessToken]);

  useEffect(() => {
    const integration = localStorage.getItem("integration");
    const loader = localStorage.getItem("loader");
    if (circleAccessToken && integration && integration === "GC") {
      if (loader && loader === "true") {
        setGoogleCalenderLoader(true);
        if (GCAccessCode !== "") {
          var myHeaders = new Headers();
          myHeaders.append("accessToken", circleAccessToken);
          var requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow",
          };

          fetch(
            `https://api.circle.ooo/api/circle/third-party/calendar/google-integrate?accessCode=${GCAccessCode}`,
            requestOptions
          )
            .then((response) => response.json())
            .then((result) => {
              if (result.result === true) {
                if (
                  result.message === "google calendar integrated successfully"
                ) {
                  setGoogleCalenderLoader(false);
                  setIsIntegratedGC(true);
                  toast.success("Google Calender integrated successfully!");
                  localStorage.removeItem("integration");
                  localStorage.removeItem("loader");
                }
              } else {
                setGoogleCalenderLoader(false);
                toast.error(
                  "Integration error from third party, Please try again!"
                );
                localStorage.removeItem("integration");
                localStorage.removeItem("loader");
              }
            })
            .catch((error) => {
              setGoogleCalenderLoader(false);
              toast.error(
                "Integration error from third party, Please try again!"
              );
              localStorage.removeItem("integration");
              localStorage.removeItem("loader");
            });
        }
      }
    }
  }, [GCAccessCode, circleAccessToken]);

  const getThirdPartyIntegrations = async () => {
    var myHeaders = new Headers();
    myHeaders.append("accessToken", circleAccessToken);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    await fetch(
      "https://api.circle.ooo/api/circle/third-party/get-by-type",
      requestOptions
    )
      .then((response) => response.json())
      .then((res) => {
        if (res.result) {
          const tempArrayThirdParty = res?.data.reduce((acc, fl) => {
            if (fl.Type === "THIRD_PARTY") {
              acc = acc.concat(fl.Integration);
            }
            return acc;
          }, []);

          const tempArrayCalendars = res?.data.reduce((acc, fl) => {
            if (fl.Type === "CALENDAR") {
              acc = acc.concat(fl.Integration);
            }
            return acc;
          }, []);

          tempArrayCalendars.map((item) => {
            if (item.integrationType === "GOOGLECALENDAR") {
              setGoogleCalenderLoader(false);
              setIsIntegratedGC(true);
            }

            if (item.integrationType === "ICAL") {
              setICalLoader(false);
              setIsIntegratedIC(true);
            }
          });

          tempArrayThirdParty.map((item) => {
            if (item.integrationType === "EVENTBRITE") {
              setEventBriteLoader(false);
              setIsIntegratedEventBrite(true);
            }

            if (item.integrationType === "MEETUP") {
              setMeetUpLoader(false);
              setIsIntegratedMeetUp(true);
            }
          });
        } else {
          toast.error("Something went wrong with the integrations!");
        }
        setThirdPartLoader(false);
      })
      .catch((error) => {
        setThirdPartLoader(false);
        console.log("error", error);
      });
  };

  useEffect(() => {
    if (circleAccessToken !== "") getThirdPartyIntegrations();
  }, [
    user,
    eventBriteAccessCode,
    circleAccessToken,
    meetUpAccessCode,
    GCAccessCode,
  ]);

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

  const handleGCIntegration = () => {
    setGoogleCalenderLoader(true);
    var myHeaders = new Headers();
    myHeaders.append("accessToken", circleAccessToken);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      "https://api.circle.ooo/api/circle/third-party/calendar/google-oauth-url",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log("GC oAuth Result: ", result);
        if (result.result) {
          localStorage.setItem("integration", "GC");
          localStorage.setItem("loader", "true");
          router.push(result.data);
        } else {
          toast.error("Something went wrong!");
        }
      })
      .catch((error) => console.log("error", error));
  };

  const handleICIntegration = () => {
    setICalLoader(true);
    var myHeaders = new Headers();
    myHeaders.append("accessToken", circleAccessToken);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      "https://api.circle.ooo/api/circle/third-party/calendar/ical-integrate",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        if (result.result) {
          if (result.message === "ical integrated successfully") {
            setICalLoader(false);
            setIsIntegratedIC(true);
            toast.success("iCal Integrated Successfully!");
          }
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

  const handleIntegrateMeetup = () => {
    if (groupURL === "") {
      toast.error("Please add group url!");
    } else {
      setGroupURLLoader(true);
      var myHeaders = new Headers();
      myHeaders.append("accessToken", circleAccessToken);

      var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      fetch(
        `https://api.circle.ooo/api/circle/third-party/meetup/add/group-url?group-url=${groupURL}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          if (result.result === true) {
            if (result.message === "meetup group url added successfully") {
              setGroupURLLoader(false);
              setIsOpen(false);
              setMeetUpLoader(false);
              setIsIntegratedMeetUp(true);
              toast.success("Meetup Integrated Successfully!");
              localStorage.removeItem("integration");
              localStorage.removeItem("loader");
            }
          } else {
            setGroupURLLoader(false);
            toast.error("Invalid Group URL, or Third Party Error!");
          }
        })
        .catch((error) => {
          setGroupURLLoader(false);
          toast.error("Invalid Group URL, or Third Party Error!");
        });
    }
  };

  return (
    <>
      <ToastContainer />
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Dialog.Panel className="w-full md:w-1/2 xl:w-1/3 h-auto rounded-xl shadow-xl bg-white">
              <Dialog.Title
                className={`flex w-full items-center justify-between p-3 flex-row border-b-2`}
              >
                <p className="font-bold text-lg">Integrate Meetup</p>
                <button
                  type="button"
                  className="box-content rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
                  onClick={() => setIsOpen(false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </Dialog.Title>
              <div className="relative p-4 flex flex-col w-full">
                <div className="mb-4 mt-2 w-full h-auto">
                  <label
                    htmlFor="groupUrl"
                    className="block text-[#292D32] font-bold text-[16px] ml-1"
                  >
                    Add Group URL
                    <span className="text-red-600"> *</span>
                  </label>
                  <input
                    type="text"
                    id="groupUrl"
                    className="border-2 text-[#8392AF] border-[#E6E7EC] mt-2 p-3 w-full rounded-lg focus:border-[#007BAB] focus:outline-none"
                    placeholder="Enter your group url here"
                    value={groupURL}
                    onChange={(e) => {
                      setGroupURL(e.target.value);
                    }}
                  />
                </div>
              </div>
              <Dialog.Title
                className={`flex w-full items-center justify-end p-3 flex-row border-t-2`}
              >
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className={`bg-[red] border-2 border-[red] text-white hover:border-2 hover:border-[red] hover:bg-transparent hover:text-[red] py-2 px-4 rounded-lg`}
                >
                  Close
                </button>
                <button
                  type="button"
                  disabled={groupURLLoader === true}
                  onClick={handleIntegrateMeetup}
                  className={`bg-[#007BAB] ml-2 border-2 border-[#007BAB] text-white hover:border-2 hover:border-[#007BAB] hover:bg-transparent hover:text-[#00384F] py-2 px-4 rounded-lg`}
                >
                  {groupURLLoader ? (
                    <>
                      <div className="flex justify-center items-center w-full">
                        <ThreeDots
                          height="20"
                          color="#fff"
                          width="60"
                          radius="9"
                          ariaLabel="three-dots-loading"
                          visible={true}
                        />
                      </div>
                    </>
                  ) : (
                    "Integrate"
                  )}
                </button>
              </Dialog.Title>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
      <div className="flex flex-col w-full h-auto bg-[#00384F]">
        <Header type="dark" page="attend" />
        {/* Sidebar Menu */}
        {/* {showSideBar && (
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
            </ul>
          </div>
        )} */}
        {/* Main Content */}
        <div className="flex flex-col">
          {/* <div className="border-b-2 flex justify-between p-2 items-center w-full bg-white">
            <div className="ml-2">
              <div
                onClick={() => {
                  setShowSideBar(!showSideBar);
                }}
                className="rounded-xl p-2 cursor-pointer border-2 flex flex-row justify-center items-center"
              >
                <div>
                  <TiThMenu size={30} />
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
          </div> */}
          <div className="p-6 w-full h-auto">
            {activeView === "integrations" && (
              <>
                {thirdPartLoader ? (
                  <>
                    <>
                      <div className="flex mt-50 justify-center items-center">
                        <img src={loaderGif.src} alt="Loader" />
                      </div>
                    </>
                  </>
                ) : (
                  <>
                    <div className="p-6 lg:p-20 bg-[#012432] rounded-xl">
                      <h1 className="text-4xl text-[#F9F9F9] font-bold mb-4">
                        Third Party Integrations
                      </h1>
                      <p className="text-[#BDBDBD]">
                        Add all third party event integrations here -
                        (EventBrite, Meetup, LinkedIn etc.)
                      </p>
                      <div className="flex w-full h-auto flex-col justify-start items-start rounded-lg mt-5">
                        <div className="flex justify-between text-[#292D32] flex-row w-full h-auto mt-2">
                          <div className="text-[#F9F9F9] text-xl font-bold">
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
                                  className={`font14 font-medium rounded-xl sm:py-2 px-4 font-Montserrat text-[#fff] border-2 border-[#007BAB] bg-[#007BAB]`}
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
                                  className={`font14 font-medium rounded-xl py-3 px-5 font-Montserrat text-[#fff] hover:text-[#fff] border-2 border-[#007BAB] hover:bg-transparent bg-[#007BAB]`}
                                >
                                  <div className="flex justify-center items-center">
                                    Integrate
                                  </div>
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex justify-between text-[#292D32] flex-row w-full h-auto mt-4">
                          <div className="text-[#F9F9F9] text-xl font-bold">
                            MeetUp
                          </div>
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
                                  className={`font14 font-medium rounded-xl sm:py-2 px-4 font-Montserrat text-[#fff] border-2 border-[#007BAB] bg-[#007BAB]`}
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
                                  className={`font14 font-medium rounded-xl py-3 px-5 font-Montserrat text-[#fff] hover:text-[#fff] border-2 border-[#007BAB] hover:bg-transparent bg-[#007BAB]`}
                                >
                                  <div className="flex justify-center items-center">
                                    Integrate
                                  </div>
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex justify-between text-[#292D32] flex-row w-full h-auto mt-4">
                          <div className="text-[#F9F9F9] text-xl font-bold">
                            LinkedIn (Coming Soon)
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 mt-10 lg:p-20 bg-[#012432] rounded-xl">
                      <h1 className="text-4xl text-[#F9F9F9] font-bold mb-4">
                        Calendars Integration
                      </h1>
                      <p className="text-[#BDBDBD]">
                        Add all calendars integrations here - (Google Calendar,
                        iCal, Outlook etc.)
                      </p>
                      <div className="flex w-full h-auto flex-col justify-start items-start rounded-lg mt-5">
                        <div className="flex justify-between text-[#292D32] flex-row w-full h-auto mt-2">
                          <div className="text-[#F9F9F9] text-xl font-bold">
                            Google Calendar
                          </div>
                          <div>
                            {googleCalenderLoader ? (
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
                            ) : isIntegratedGC ? (
                              <>
                                <button
                                  disabled={true}
                                  className={`font14 font-medium rounded-xl sm:py-2 px-4 font-Montserrat text-[#fff] border-2 border-[#007BAB] bg-[#007BAB]`}
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
                                    handleGCIntegration();
                                  }}
                                  disabled={googleCalenderLoader}
                                  className={`font14 font-medium rounded-xl py-3 px-5 font-Montserrat text-[#fff] hover:text-[#fff] border-2 border-[#007BAB] hover:bg-transparent bg-[#007BAB]`}
                                >
                                  <div className="flex justify-center items-center">
                                    Integrate
                                  </div>
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex justify-between text-[#292D32] flex-row w-full h-auto mt-4">
                          <div className="text-[#F9F9F9] text-xl font-bold">
                            iCal
                          </div>
                          <div>
                            {iCalLoader ? (
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
                            ) : isIntegratedIC ? (
                              <>
                                <button
                                  disabled={true}
                                  className={`font14 font-medium rounded-xl sm:py-2 px-4 font-Montserrat text-[#fff] border-2 border-[#007BAB] bg-[#007BAB]`}
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
                                    handleICIntegration();
                                  }}
                                  disabled={iCalLoader}
                                  className={`font14 font-medium rounded-xl py-3 px-5 font-Montserrat text-[#fff] hover:text-[#fff] border-2 border-[#007BAB] hover:bg-transparent bg-[#007BAB]`}
                                >
                                  <div className="flex justify-center items-center">
                                    Integrate
                                  </div>
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex justify-between text-[#292D32] flex-row w-full h-auto mt-4">
                          <div className="text-[#F9F9F9] text-xl font-bold">
                            Microsoft Outlook (Coming Soon)
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
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
