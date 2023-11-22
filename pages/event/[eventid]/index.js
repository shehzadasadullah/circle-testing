import React, { useEffect, useState, useContext } from "react";
import DollorCircle from "@/components/SvgIcons/DollorCircle";
import { useRouter } from "next/router";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase";
import moment from "moment";
import { AddToCalendarButton } from "add-to-calendar-button-react";
import { ShareIcon } from "@/icons";
import { Create_Event_Popup } from "@/context/context";
import CreateEventPopup from "@/components/Common/CreateEventPopup";
import { updateDoc } from "firebase/firestore";
import { getFirestore, collection, getDocs, getDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";
import { arrayUnion } from "firebase/firestore";
import Register from "@/components/Home/Register";
import QRCode from "qrcode";
import toast from "react-simple-toasts";
import img from "./Profile_Picture.png";
import { LogoUrl } from "@/utils/logo";
import { HiMiniUserCircle } from "react-icons/hi2";
import axios from "axios";
import Loading from "@/components/Loading";
import {
  CalendarIcon,
  ClockIcon,
  LocationMarkerIcon,
} from "@heroicons/react/outline";
import { FaTimes, FaWatchmanMonitoring } from "react-icons/fa";
import LocationIcon from "@/icons/LocationIcon";
import { LuCalendarDays } from "react-icons/lu";
import { FaLocationDot } from "react-icons/fa6";
import { FaTag } from "react-icons/fa6";
import { FaClock } from "react-icons/fa";
import { LiaShareAltSolid } from "react-icons/lia";
import { FaQrcode } from "react-icons/fa";

const EventDetails = () => {
  const [createEventPopup, setCreateEventPopup] =
    useContext(Create_Event_Popup);
  //state
  const [userRef, setUserRef] = useState(null);
  const [creatorData, setCreatorData] = useState({});
  const [CircleData, setCircleDtata] = useState({});
  const [EventData, setEventData] = useState({});
  const [attendeList, setAttendeList] = useState({});
  const [cohostList, setCohostlist] = useState({});
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);

  //qr code
  const [text, setText] = useState("");

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  //router
  const router = useRouter();
  const { id } = router.query;
  //useEffect

  //get all events
  useEffect(() => {
    if (id?.length > 0) {
      // Reference of event
      const eventRef = doc(db, "events", id);

      return onSnapshot(eventRef, async (docquery) => {
        if (docquery.exists()) {
          setEventData(docquery?.data() || {});

          // Reference of creator
          const creatorRef = docquery?.data()?.creator;
          const circleRef = docquery?.data()?.circle_id;

          const cohostsData = docquery?.data()?.co_host || [];
          let cohosts_list_temp_array = [];
          if (cohostsData?.length > 0) {
            for (let i = 0; i < cohostsData.length; i++) {
              const cohostUserDocRef = doc(db, "Users", cohostsData[i].id);
              const cohostUserDocSnapshot = await getDoc(cohostUserDocRef);
              if (cohostUserDocSnapshot.exists()) {
                const cohostUserData = cohostUserDocSnapshot.data();
                cohosts_list_temp_array.push(cohostUserData);
              }
            }
          }

          setCohostlist(cohosts_list_temp_array || []);

          const attendesData = docquery?.data()?.attendees || [];
          let attendees_list_temp_array = [];

          if (attendesData?.length > 0) {
            attendesData?.map((item) => {
              attendees_list_temp_array.push(item?.id);
            });
          }
          console.log("ATTENDEES LIST: ", attendees_list_temp_array);
          setAttendeList(attendees_list_temp_array || []);

          console.log(creatorRef, "REFFFFFFFF");
          onSnapshot(creatorRef, (docval) => {
            if (docval?.exists()) {
              setCreatorData(docval?.data() || {});
            }
          });

          // Snapshot for circleRef
          if (circleRef) {
            const circleRefSnapshot = await getDoc(circleRef);
            if (circleRefSnapshot.exists()) {
              const circleData = circleRefSnapshot.data();
              setCircleDtata(circleData);

              // Update state or do something with circleData
            }
          }
        }
      });
    }
  }, [id]);

  const shareHandler = async (e) => {
    try {
      await navigator.share({
        title: EventData?.name,
        description: EventData?.description,
        // use e.target.title instead of event.name

        url: `https://circle.ooo/events/${EventData?.uid}`,
      });
    } catch (error) {
      console.log("Error sharing:", error);
    }
  };

  const [showOptions, setShowOptions] = useState(false);

  const [allevents, setAllEvents] = useState([]);
  const sortedEvents = allevents.sort((a, b) => a.timefrom - b.timefrom);

  // Get the current date and time
  const currentDate = moment();

  const [upcomingcreatorData, setupcomingCreatorData] = useState(null);
  // Filter events that occur after the current date and time
  const upcomingEvents = sortedEvents.filter((event) => {
    const eventDate = moment(event.timefrom.seconds * 1000);
    return eventDate.isAfter(currentDate);
  });

  //useeffect tp get creator data from upcoming events

  //upcoming events creator data

  // Get the next four upcoming events
  const nextFourEvents = upcomingEvents.slice(0, 4);

  useEffect(() => {
    async function fetchAllEvents() {
      try {
        // initialize Firebase app and firestore
        // ... your Firebase initialization code goes here ...

        // reference to the events collection
        const eventsCollection = collection(db, "events");

        // get all documents from the events collection
        const querySnapshot = await getDocs(eventsCollection);

        // map the query snapshot to an array of event objects
        const eventsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // save the events data in state and mark loading as false
        setAllEvents(eventsData);
      } catch (error) {
        console.error(error);
      }
    }

    fetchAllEvents();
  }, []); // Empty dependency array to ensure the effect runs only once

  // Render the next four events

  const handleButtonClick = () => {
    if (window.navigator && window.navigator.platform === "MacIntel") {
      // Default calendar exists (Apple)
      // Implement your logic here to show the default calendar
      // For example, you can trigger a specific behavior or render a component
      // specific to the default calendar.
      // You can also use a library like react-modal to show a modal with the calendar options.
      console.log("Default calendar exists (Apple)");
    } else {
      // Default calendar does not exist (other options)
      setShowOptions(true);
    }
  };

  //give useefect of creator data with the particular index not zero index always
  const fetchCreatorData = async () => {
    let creatorNames = [];
    nextFourEvents.map(async (event) => {
      if (event) {
        const creatorRef = event?.creator;
        // Use the creatorRef directly, no need to use .id
        if (creatorRef) {
          await getDoc(creatorRef)
            .then((doc) => {
              // console.log(doc.data()?.full_name, index);
              creatorNames.push(doc.data()?.full_name.toString() || "");
            })
            .catch((error) => {
              console.error("Error fetching creator data:", error);
            });
        } else {
          creatorNames.push("Unknown");
        }
      }
    });

    // const creatorNames = await Promise.all(promises);
    console.log(creatorNames);
    setupcomingCreatorData(creatorNames);
  };

  useEffect(() => {
    if (nextFourEvents?.length > 0 && upcomingcreatorData === null) {
      fetchCreatorData();
    }
  }, [nextFourEvents]);

  const [showFreeModal, setShowFreeModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showticketModal, setShowTicketModal] = useState(false);
  const [showsuccessModal, setShowSuccessModal] = useState(false);

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const handleAttend = () => {
    if (user?.email == undefined) {
      setShowModal(true);
    } else if (
      EventData.ticketPrice == null ||
      EventData.ticketPrice == "0.00"
    ) {
      // if (showSuccessPopup) {
      //   setShowSuccessModal(true);
      //   setShowSuccessPopup(false); // Set the flag to false after showing the success popup once
      // } else {
      setShowTicketModal(true); // Show the ticket modal for subsequent times
      // }
    } else if (Array.isArray(attendeList) && attendeList.includes(user?.uid)) {
      setShowTicketModal(true);
      // Add your routing logic here for checked-in users, e.g., router.push('/checked-in');
    } else {
      router.push(`/event/${id}/checkout`);
    }
  };

  const [isCheckedIn, setIsCheckedIn] = useState(false);

  const AttendeesData = async () => {
    try {
      // Define the path to the event document
      const eventRef = doc(db, "events", id);

      // Create a reference to the /Users/123 document
      const userRef = doc(db, "Users", user?.uid);

      // Update the attendee array using arrayUnion to append the user reference
      if (EventData?.ticketPrice > "0.00") {
        await updateDoc(eventRef);
      } else {
        await updateDoc(eventRef, {
          attendees: arrayUnion(userRef),
        });
      }
      console.log("Attendee data pushed successfully!");
    } catch (error) {
      console.error("Error pushing attendee data:", error);
    }
  };

  // useEffect(() => {
  //   if (Array.isArray(attendeList) && attendeList.includes(user?.uid)) {
  //     setIsCheckedIn(true);
  //   } else {
  //     setIsCheckedIn(false);
  //   }
  // }, [attendeList]);

  const [showModal, setShowModal] = useState(false);

  const handleClick = (e) => {
    e?.preventDefault();
    setShowModal(true);
  };

  const timestamp = EventData?.timeto?.seconds * 1000;
  const formattedTime = moment(timestamp).local().format("LT");

  const [qrCodeBase64, setQRCodeBase64] = useState(null);

  const EmailMe = async () => {
    // Set loading state to true
    setLoading(true);

    const eventId = EventData?.uid;
    const circleId = CircleData?.id || "JfHpj2gfm4viA7RBPJ8z";
    const currentUserId = user?.uid;
    const creatorId = creatorData?.uid;
    const eventName = EventData?.name;
    const eventAddress = EventData?.location;
    const eventdate = moment(EventData?.timefrom?.seconds * 1000)
      .local()
      .format("LLLL");
    const price =
      EventData?.ticketPrice >= "0.00" ? EventData?.ticketPrice : "Free";
    const name =
      creatorData?.full_name || creatorData?.display_name || "Anonymous";
    const eventtime = formattedTime;
    const email = user?.email;

    try {
      // Start generating QR code and await the result
      let dataUrl = await GenerateQr(
        eventId,
        circleId,
        currentUserId,
        creatorId
      );

      if (dataUrl) {
        let msgbody = {
          logo: LogoUrl,
          qrcode: dataUrl,
          eventname: eventName,
          eventaddress: eventAddress,
          eventdate: eventdate,
          price: price,
          name: name,
          eventtime: eventtime,
        };

        // Make the API call to send the email
        await axios.post("/api/ticket/", {
          usersdata: email,
          bodymessage: msgbody,
        });

        // Email sent successfully, set loading state to false
        setLoading(false);

        // Optionally, perform any success actions or display a success message
        console.log("Email sent successfully!");
      }
    } catch (error) {
      // Error occurred, set loading state to false
      setLoading(false);

      // Display or handle the error as needed
      console.error("An error occurred while sending the email:", error);
    }
  };

  const GenerateQr = async (eventId, circleId, currentUserId, creatorId) => {
    try {
      const link = `https://nowwsocial.page.link?id=events_${eventId}_${circleId}_${currentUserId}_${creatorId}`;
      let id = `events_${eventId}_${circleId}_${currentUserId}_${creatorId}`;

      let response = await axios.post("/api/database/getdynamiclink", {
        id: id,
        link: link,
      });

      let dynamicLink = response.data.shortLink;

      const qrCodeDataURL = await QRCode.toDataURL(dynamicLink);

      let dataUrl = qrCodeDataURL.split(",")[1];
      return dataUrl;
    } catch (error) {
      console.error("state", "QR code generation error:", error);
      return "";
    }
  };

  useEffect(() => {
    const generateQRCode = async (
      eventId,
      circleId,
      currentUserId,
      creatorId
    ) => {
      try {
        const link = `https://nowwsocial.page.link?id=events_${eventId}_${circleId}_${currentUserId}_${creatorId}`;
        let id = `events_${eventId}_${circleId}_${currentUserId}_${creatorId}`;
        let response = await axios.post("/api/database/getdynamiclink", {
          id: id,
          link: link,
        });
        let dynamicLink = response.data.shortLink;

        const qrCodeDataURL = await QRCode.toDataURL(dynamicLink);
        setQRCodeBase64(qrCodeDataURL);
      } catch (error) {
        console.error("QR code generation error:", error);
      }
    };

    generateQRCode();
  }, []);

  if (loading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  const currentTime = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };
  const formatedTime = currentTime.toLocaleString("en-US", options);

  // DATA TO PUT ON TOP

  const tabs = [
    { id: "tab1", label: "About Event", paddingLeft: 0 },
    { id: "tab2", label: "Attendees & Who I Meet", paddingLeft: 4 },
  ];
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  return (
    <>
      <div className="w-full h-full p-4 lg:p-10">
        <div className="flex flex-col lg:flex-row justify-start items-start gap-6">
          {/* LEFT SIDE */}
          <div className="w-full lg:w-[70%] flex-col flex items-center justify-center">
            <div className="h-auto w-full rounded-xl">
              <img
                className="w-full h-full object-contain rounded-xl "
                alt="event large image"
                src={
                  EventData?.large_image
                    ? EventData?.large_image
                    : "https://cdnspicyfy.azureedge.net/images/8400a5e7-639e-4e1a-bd5e-41c689de93a5.jpg"
                }
              />
            </div>

            <div className="mt-8 text-[#F9F9F9] text-3xl flex justify-start items-center w-full font-bold">
              {EventData?.name || ""}
            </div>

            <div className="w-full mt-8 flex flex-col justify-start items-center">
              <div className="flex border-[#007BAB] flex-row gap-6 border-b-2 w-full">
                {tabs.map((tab) => (
                  <>
                    <div
                      key={tab.id}
                      className={`cursor-pointer text-xl ${
                        activeTab === tab.id
                          ? "text-[#007BAB] border-b-4 border-[#007BAB]"
                          : "text-[#667085]"
                      }`}
                      onClick={() => handleTabClick(tab.id)}
                    >
                      {tab.label}
                    </div>
                  </>
                ))}
              </div>

              {activeTab === "tab1" ? (
                <div className="text-[#F9F9F9] mt-6 w-full flex justify-start items-start">
                  {EventData?.description || ""}{" "}
                </div>
              ) : (
                activeTab === "tab2" && (
                  <div className="text-[#F9F9F9] mt-6 w-full flex justify-start items-center">
                    {cohostList?.length > 0 && (
                      <div className="flex w-full flex-col flex-nowrap lg:flex-wrap lg:flex-row items-center justify-start gap-y-4">
                        <div className="relative w-full">
                          <div className="absolute w-full inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <svg
                              className="w-4 h-4 text-[#fff]"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 20 20"
                            >
                              <path
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                              />
                            </svg>
                          </div>
                          <input
                            type="search"
                            id="default-search"
                            className="block w-full p-4 pl-10 text-[#fff] bg-[#1D5369] border-2 border-[#1D5369] focus:border-[#fff] text-sm rounded-xl focus:outline-none"
                            placeholder="Search Attendees"
                            // value={locationInput}
                            // onChange={(e) => {
                            //   setLocationInput(e.target.value);
                            // }}
                          />
                        </div>
                        {cohostList.map((key) => {
                          return (
                            <>
                              <div className="flex w-full justify-center items-center flex-col bg-[#012432] rounded-xl p-2">
                                <div className="flex text-base w-full justify-between items-center flex-col lg:flex-row p-2">
                                  <div className="flex justify-start items-center">
                                    <div className="rounded-full border-2">
                                      {key?.photoURL ? (
                                        <>
                                          <img
                                            src={
                                              key?.photoURL
                                                ? key?.photoURL
                                                : img.src
                                            }
                                            className="rounded-full w-full h-full object-cover"
                                            alt=""
                                          />
                                        </>
                                      ) : (
                                        <>
                                          <HiMiniUserCircle size={50} />
                                        </>
                                      )}
                                    </div>
                                    <div className="flex ml-2 flex-col justify-start items-start">
                                      <p className="font-bold">
                                        {key?.full_name
                                          ? key?.full_name?.toUpperCase()
                                          : user?.displayName?.toUpperCase()}
                                      </p>
                                      <p>
                                        {key?.email
                                          ? key?.email?.toUpperCase()
                                          : user?.email?.toUpperCase()}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex mt-3 lg:mt-0 justify-center items-center">
                                    <button className="rounded-xl py-3 font-semibold px-6 bg-[#007BAB] hover:bg-transparent border-[#007BAB] border-2 text-white">
                                      Follow
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )
              )}
            </div>

            <div className="flex w-full text-[#F2F2F2] flex-col items-start justify-start mt-8 border-dashed border-t-2 border-[#596A73]">
              <div className="mt-6 font-bold text-[#F2F2F2] text-3xl">
                About The Host
              </div>
              <div className="flex w-full lg:w-auto justify-center items-center flex-col bg-[#012432] rounded-xl p-10 mt-6">
                <div className="flex text-base w-full justify-start items-center flex-row p-2">
                  <div className="rounded-full bg-white border-2 w-20 h-20">
                    <img
                      src={
                        creatorData?.photoURL ? creatorData?.photoURL : img.src
                      }
                      className="rounded-full w-full h-full object-cover"
                      alt=""
                    />
                  </div>
                  <div className="flex ml-3 flex-col justify-start items-start">
                    <p className="font-normal">Hosted By:</p>
                    <p className="font-bold">
                      {creatorData?.full_name ||
                        creatorData?.display_name ||
                        "Anonymous"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {cohostList.length > 0 && (
              <>
                <div className="flex w-full text-[#F2F2F2] flex-col items-start justify-start mt-8 border-dashed border-t-2 border-[#596A73]">
                  <div
                    onClick={() => {
                      console.log(cohostList);
                    }}
                    className="mt-6 font-bold text-[#F2F2F2] text-3xl"
                  >
                    About Co Hosts
                  </div>
                  {cohostList?.length > 0 && (
                    <div className="flex w-full flex-col flex-nowrap lg:flex-wrap lg:flex-row items-center justify-start gap-x-4">
                      {cohostList.map((key) => {
                        return (
                          <>
                            <div className="flex w-full lg:w-1/4 justify-center items-center flex-col bg-[#012432] rounded-xl p-2 mt-6">
                              <div className="flex text-base w-full justify-start items-center flex-col p-2">
                                <div className="rounded-full border-2 ">
                                  {key?.photoURL ? (
                                    <>
                                      <img
                                        src={
                                          key?.photoURL
                                            ? key?.photoURL
                                            : img.src
                                        }
                                        className="rounded-full w-full h-full object-cover"
                                        alt=""
                                      />
                                    </>
                                  ) : (
                                    <>
                                      <HiMiniUserCircle size={80} />
                                    </>
                                  )}
                                </div>
                                <div className="flex mt-3 w-full flex-col justify-center items-center">
                                  <p className="font-normal">Co-Host</p>
                                  <p className="font-bold">
                                    {key?.full_name
                                      ? key?.full_name?.toUpperCase()
                                      : user?.displayName?.toUpperCase()}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </>
                        );
                      })}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* RIGHT SIDE */}
          <div className="w-full lg:w-[30%] flex flex-col items-center justify-center">
            <div className="flex w-full flex-col justify-start items-start p-6 bg-[#012432] rounded-xl">
              <p className="text-[#F9F9F9] font-bold text-lg">Event Details</p>

              <div className="flex flex-row text-[#F9F9F9] mt-5 justify-start w-full items-center">
                <LuCalendarDays size={30} />
                <p className="font-Montserrat ml-3">
                  {moment(EventData?.timefrom?.seconds * 1000)
                    .local()
                    .format("LL")}
                </p>
              </div>

              <div className="flex flex-row text-[#F9F9F9] mt-3 justify-start w-full items-center">
                <FaClock size={30} />
                <p className="font-Montserrat ml-3">
                  {moment(EventData?.timefrom?.seconds * 1000)
                    .local()
                    .format("LT")}{" "}
                  -{" "}
                  {moment(EventData?.timeto?.seconds * 1000)
                    .local()
                    .format("LT")}
                </p>
              </div>

              <div className="flex flex-row text-[#F9F9F9] mt-3 justify-start w-full items-center">
                <FaLocationDot size={30} />
                <p className="font-Montserrat ml-3">{EventData?.location}</p>
              </div>

              <div className="flex flex-row text-[#F9F9F9] mt-3 justify-start w-full items-center">
                <FaTag size={30} />
                <p className="font-Montserrat ml-3">
                  {EventData?.ticketPrice === "0.00"
                    ? "FREE"
                    : EventData?.ticketPrice}
                </p>
              </div>

              <div className="flex text-base w-full justify-start items-center flex-row mt-5 border-dashed border-t-2 border-[#828282]">
                <div className="rounded-full bg-white border-2 w-20 h-20 mt-5">
                  <img
                    src={
                      creatorData?.photoURL ? creatorData?.photoURL : img.src
                    }
                    className="rounded-full w-full h-full object-cover"
                    alt=""
                  />
                </div>
                <div className="flex ml-3 flex-col justify-start items-start mt-3">
                  <p className="font-normal text-[#BDBDBD]">Hosted By:</p>
                  <p className="font-bold text-[#F2F2F2]">
                    {creatorData?.full_name ||
                      creatorData?.display_name ||
                      "Anonymous"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex w-full mt-4 flex-col xl:flex-row justify-center items-center p-6 bg-[#012432] rounded-xl">
              <button className="flex justify-center items-center flex-row rounded-xl text-lg px-5 py-4 w-full font-semibold bg-[#fff] hover:bg-transparent border-[#fff] border-2 text-[#000] hover:text-[#fff]">
                <LiaShareAltSolid size={28} /> <p className="ml-2">Share</p>
              </button>
              <button className="mt-3 xl:mt-0 flex justify-center items-center flex-row rounded-xl text-lg px-5 py-4 xl:ml-4 w-full font-semibold bg-[#fff] hover:bg-transparent border-[#fff] border-2 text-[#000] hover:text-[#fff]">
                <FaQrcode size={20} /> <p className="ml-2">QR Code</p>
              </button>
            </div>

            <div className="flex w-full mt-4 flex-row justify-center items-center p-6 bg-[#012432] rounded-xl">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  AttendeesData();
                  handleAttend();
                }}
                className="flex justify-between items-center flex-row rounded-xl text-lg py-5 px-5 w-full font-bold bg-[#007BAB] hover:bg-transparent border-[#007BAB] border-2 text-[#fff]"
              >
                <p>
                  {Array.isArray(attendeList) && attendeList.includes(user?.uid)
                    ? "Check In"
                    : "Attend Event"}
                </p>
                <p>${EventData?.ticketPrice}</p>
              </button>
            </div>

            {showFreeModal && (
              <div className="fixed z-10 inset-0 overflow-y-auto">
                <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                  <div
                    className="fixed inset-0 transition-opacity"
                    aria-hidden="true"
                  >
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                  </div>

                  <span
                    className="hidden sm:inline-block sm:align-middle sm:h-screen"
                    aria-hidden="true"
                  >
                    &#8203;
                  </span>

                  <div
                    className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6"
                    style={{ width: "420px", height: "551px" }}
                  >
                    <div className=" w-full h-full flex flex-col items-center justify-center">
                      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                        <div style={{ width: "100", height: "100" }}>
                          <svg
                            width="100"
                            height="100"
                            viewBox="0 0 100 100"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M96.4812 49.9979C98.0256 48.1995 99.1078 46.0514 99.6341 43.74C100.16 41.4286 100.115 39.0238 99.5011 36.734C98.8875 34.4443 97.7245 32.3388 96.113 30.6003C94.5015 28.8618 92.4902 27.5427 90.2534 26.7575C90.6917 24.4277 90.5549 22.0262 89.8548 19.7613C89.1548 17.4964 87.9127 15.4365 86.2363 13.7603C84.5599 12.0841 82.4999 10.8423 80.2349 10.1425C77.9699 9.44278 75.5683 9.30626 73.2386 9.74482C72.454 7.50759 71.1352 5.49569 69.3966 3.88379C67.6581 2.27189 65.5524 1.10872 63.2623 0.495259C60.9722 -0.118203 58.567 -0.163409 56.2555 0.363565C53.944 0.890539 51.7961 1.97377 49.9982 3.5192C48.1997 1.97483 46.0517 0.892578 43.7403 0.366332C41.4289 -0.159914 39.024 -0.114262 36.7342 0.499326C34.4445 1.11291 32.339 2.27591 30.6005 3.88741C28.862 5.49892 27.5429 7.51027 26.7577 9.74698C24.4281 9.30913 22.0268 9.44627 19.7622 10.1465C17.4976 10.8467 15.438 12.0888 13.7621 13.7652C12.0862 15.4415 10.8446 17.5014 10.1449 19.7662C9.44529 22.031 9.30878 24.4323 9.74722 26.7618C7.51051 27.547 5.49915 28.8661 3.88765 30.6046C2.27614 32.3431 1.11314 34.4486 0.499551 36.7383C-0.114037 39.0281 -0.159696 41.433 0.36655 43.7444C0.892796 46.0557 1.97507 48.2038 3.51943 50.0022C1.9746 51.8006 0.891994 53.9489 0.365598 56.2605C-0.160798 58.5721 -0.115099 60.9773 0.498757 63.2672C1.11261 65.5572 2.27606 67.6627 3.88812 69.4011C5.50018 71.1395 7.51216 72.4582 9.74939 73.2427C9.31057 75.5723 9.44693 77.9737 10.1466 80.2386C10.8464 82.5036 12.0883 84.5635 13.7646 86.2396C15.441 87.9157 17.501 89.1574 19.766 89.8568C22.0311 90.5562 24.4325 90.6923 26.7621 90.2532C27.5473 92.4899 28.8663 94.5013 30.6049 96.1128C32.3434 97.7243 34.4488 98.8873 36.7386 99.5008C39.0283 100.114 41.4332 100.16 43.7446 99.6338C46.056 99.1076 48.2041 98.0253 50.0025 96.481C51.8009 98.0258 53.9491 99.1084 56.2607 99.6348C58.5724 100.161 60.9775 100.115 63.2675 99.5016C65.5574 98.8878 67.663 97.7243 69.4013 96.1123C71.1397 94.5002 72.4584 92.4882 73.243 90.251C75.5726 90.6897 77.9741 90.5533 80.239 89.8535C82.504 89.1538 84.564 87.9119 86.2402 86.2357C87.9165 84.5594 89.1584 82.4994 89.8581 80.2345C90.5579 77.9695 90.6943 75.568 90.2556 73.2384C92.4925 72.4533 94.504 71.1343 96.1156 69.3957C97.7272 67.6571 98.8901 65.5515 99.5035 63.2616C100.117 60.9717 100.162 58.5667 99.6356 56.2553C99.1089 53.9439 98.0262 51.796 96.4812 49.9979Z"
                              fill="#18C07A"
                            />
                            <path
                              d="M41.0246 69.0843L27.1301 55.1985C26.6028 54.6703 26.3066 53.9545 26.3066 53.2082C26.3066 52.4618 26.6028 51.746 27.1301 51.2178L28.8182 49.5276C29.3464 49.0003 30.0622 48.7041 30.8085 48.7041C31.5549 48.7041 32.2707 49.0003 32.7989 49.5276L42.899 59.6212L66.6855 34.3439C67.1973 33.8008 67.9037 33.483 68.6496 33.4602C69.3956 33.4375 70.12 33.7116 70.664 34.2225L72.3976 35.8585C72.9413 36.3705 73.2595 37.0773 73.2822 37.8238C73.305 38.5702 73.0304 39.2951 72.5189 39.8392L45.0724 69.0214C44.814 69.2968 44.5028 69.5175 44.1574 69.6702C43.812 69.823 43.4394 69.9047 43.0618 69.9106C42.6842 69.9164 42.3092 69.8463 41.9593 69.7044C41.6093 69.5624 41.2914 69.3515 41.0246 69.0843Z"
                              fill="white"
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="mt-3 text-center sm:mt-12">
                        <h3 className="leading-6 font-bold text-[26px] text-[#1E232C] ">
                          Successful
                        </h3>
                        <div className="mt-2 text-center sm:mt-6">
                          <p
                            className="text-[15px] text-[#8391A1] font-medium  xl:w-[300px] xl:h-[46px]"
                            style={{ lineHeight: "150%" }}
                          >
                            Your Event Registration is successfully confirm to
                            view ticket click here
                          </p>
                        </div>
                      </div>
                      <div className="mt-5 sm:mt-6">
                        <button
                          type="button"
                          style={{ width: "318px", height: "66px" }}
                          className="w-full flex items-center  justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#2373CB] text-[16px] font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                          onClick={() => {
                            setShowFreeModal(false);
                            setShowTicketModal(true);
                          }}
                        >
                          View Your Ticket
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {showsuccessModal && (
              <div className="fixed z-10 inset-0 overflow-y-auto">
                <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                  <div
                    className="fixed inset-0 transition-opacity"
                    aria-hidden="true"
                  >
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                  </div>

                  <span
                    className="hidden sm:inline-block sm:align-middle sm:h-screen"
                    aria-hidden="true"
                  >
                    &#8203;
                  </span>

                  <div
                    className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6"
                    style={{ width: "420px", height: "550px" }}
                  >
                    <div
                      className="fixed inset-0 transition-opacity"
                      aria-hidden="true"
                    >
                      <div className="flex justify-end items-end  xl:mt-2">
                        <button
                          onClick={() => {
                            setShowSuccessModal(false);
                          }}
                          className="xl:mr-6"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="text-[#17161A] cursor-pointer w-6 h-6"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M11.414 10l4.293-4.293a1 1 0 0 0-1.414-1.414L10 8.586 5.707 4.293a1 1 0 1 0-1.414 1.414L8.586 10l-4.293 4.293a1 1 0 1 0 1.414 1.414L10 11.414l4.293 4.293a1 1 0 0 0 1.414-1.414L11.414 10z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="text-[20px] sm:mt-12">
                      Congrats! You are attending the{" "}
                      <span className="text-[16px] font-bold">
                        {EventData?.name}{" "}
                      </span>
                      event!
                    </div>

                    <div className="w-full flex items-start justify-start px-6 mt-6">
                      <CalendarIcon className="w-8 h-8" />
                      <div className="flex flex-col px-2">
                        <span className="text-[16px] font-bold font-Montserrat">
                          Date
                        </span>
                        <span className="text-[16px] font-Montserrat">
                          {moment(
                            new Date(EventData?.timefrom?.seconds * 1000)
                          ).format("dddd, MMMM D")}
                        </span>
                      </div>
                    </div>
                    <div className="w-full flex items-start justify-start px-6 mt-6">
                      <ClockIcon className="w-8 h-8" />
                      <div className="flex flex-col px-2">
                        <span className="text-[16px] font-bold font-Montserrat">
                          Time
                        </span>
                        <span className="text-[16px] font-Montserrat">
                          {moment(EventData?.timefrom?.toDate()).format(
                            "dddd, MMMM D, h:mm A"
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="w-full flex items-start justify-start px-6 mt-6">
                      <LocationMarkerIcon className="w-8 h-8" />
                      <div className="flex flex-col px-2">
                        <span className="text-[16px] font-bold font-Montserrat">
                          Location
                        </span>
                        <span className="text-[16px] font-Montserrat">
                          {EventData?.location}
                        </span>
                      </div>
                    </div>

                    <div className="w-full flex items-center justify-center px-6 mt-6 rounded-full z-10 ">
                      <div
                        className="cursor-pointer w-10 h-10 bg-green-300 rounded-full flex items-center justify-center z-10 "
                        onClick={() => {
                          shareHandler();
                        }}
                      >
                        <ShareIcon />
                      </div>
                    </div>
                    <div className="w-full flex items-center justify-center px-6 mt-6 rounded-full z-10 ">
                      <div
                        className="text-[16px] text-white font-bold cursor-pointer w-80 h-12 bg-green-300 rounded-[10px] flex items-center justify-center z-10 "
                        onClick={() => {
                          setShowSuccessModal(false);
                          setShowTicketModal(true);
                        }}
                      >
                        View Ticket
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {showticketModal && (
              <div className="fixed z-10 inset-0 overflow-y-auto">
                <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                  <div
                    className="fixed inset-0 transition-opacity"
                    aria-hidden="true"
                  >
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                  </div>

                  <span
                    className="hidden sm:inline-block sm:align-middle sm:h-screen"
                    aria-hidden="true"
                  >
                    &#8203;
                  </span>

                  <div className="inline-block w-full lg:w-[90%] align-middle bg-[#00384F] rounded-lg shadow-xl transform transition-all">
                    {/* <div
                      className="fixed inset-0 transition-opacity"
                      aria-hidden="true"
                    >
                      <div className="flex justify-between items-center xl:mt-2">
                        <div className="w-full flex items-center  ml-12 justify-center text-[20px] font-semibold  text-[#17161A]">
                          Your Coupon
                        </div>

                        <button
                          onClick={() => {
                            setShowTicketModal(false);
                          }}
                          className="xl:mr-6"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="text-[#17161A] cursor-pointer w-6 h-6"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M11.414 10l4.293-4.293a1 1 0 0 0-1.414-1.414L10 8.586 5.707 4.293a1 1 0 1 0-1.414 1.414L8.586 10l-4.293 4.293a1 1 0 1 0 1.414 1.414L10 11.414l4.293 4.293a1 1 0 0 0 1.414-1.414L11.414 10z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="w-full h-full flex flex-col items-center justify-start -mt-6">
                      <div className="mt-3 text-center sm:mt-12">
                        <div
                          style={{ width: "342px", height: "230px" }}
                          className="shadow-xl shadow=[#C4C4C4]"
                        >
                          <div className="flex flex-row items-start justify-around mt-6">
                            <div style={{ width: "84px", height: "87px" }}>
                              <img
                                src={"/nowwlogo.svg"}
                                className="w-full h-full "
                              />
                            </div>
                           
                            <div className="h-24 w-24">
                              {qrCodeBase64 ? (
                                <img src={qrCodeBase64} alt="QR Code w-8 h-8" />
                              ) : (
                                <p>Loading QR code...</p>
                              )}
                            </div>
                          </div>
                          <div className="w-full truncate flex items-start justify-start font-normal text-[20px] text-[#000] px-4 py-4">
                            {EventData.name}
                          </div>

                          <div className="w-full flex items-start justify-start  truncate text-[18px] text-[#000] px-4">
                            {EventData?.description}
                          </div>
                          
                        </div>
                        <div className="w-full my-4">
                          <hr className="custom-dotted-line" />
                        </div>
                        <div
                          style={{ width: "342px", height: "200px" }}
                          className="w-full flex flex-col items-center justify-center shadow-xl shadow=[#C4C4C4]"
                        >
                          <div className="w-full flex flex-row items-start justify-between">
                            <div className="w-full flex flex-col items-start justify-start font-medium text-[15px] text-[#8391A1] xl:ml-6 xl:mt-6">
                              Event Date{" "}
                              <p className="text-[15px] font-bold text-[#17161A] whitespace-nowrap">
                                {moment(
                                  new Date(EventData?.timefrom?.seconds * 1000)
                                ).format("dddd, MMM D")}
                              </p>
                            </div>
                            <div className="w-full flex flex-col items-center justify-center font-medium text-[15px] text-[#8391A1] xl:ml-6 xl:mt-6">
                              Price{" "}
                              <p className="ml-2 text-[15px] font-bold text-[#17161A] whitespace-nowrap">
                                {EventData.ticketPrice == null
                                  ? "Free"
                                  : EventData.ticketPrice}
                              </p>
                            </div>
                          </div>
                          
                          <div className="w-full flex flex-row items-start justify-between">
                            <div className="w-full flex flex-col items-start justify-start font-medium text-[15px] text-[#8391A1] xl:ml-6 xl:mt-6">
                              Name{" "}
                              <p className="text-[15px] font-bold text-[#17161A] whitespace-nowrap">
                                {creatorData?.full_name}
                              </p>
                            </div>
                            <div className="w-full flex flex-col items-center justify-center font-medium text-[15px] text-[#8391A1] xl:ml-6 xl:mt-6">
                              Gate Closes{" "}
                              <p className="ml-2 text-[15px] font-bold text-[#17161A] whitespace-nowrap">
                                {formattedTime}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <button
                        className="z-10 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded my-10"
                        onClick={() => {
                          user?.uid != undefined
                            ? EmailMe()
                            : setShowModal(true);
                        }}
                      >
                        Email me
                      </button>
                    </div> */}
                    <div className="w-full flex justify-between border-[#F9F9F9] text-[#F9F9F9] border-b-2 items-center px-6 py-3">
                      <p className="font-semibold text-xl">Your Coupon</p>
                      <button
                        type="button"
                        className="box-content rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
                        onClick={() => setShowTicketModal(false)}
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
                    </div>
                    <div className="w-full h-auto flex justify-start items-start flex-col lg:flex-row gap-2 lg:gap-10 p-2 lg:p-6">
                      <div className="overflow-hidden w-full h-auto bg-[#012432] rounded-xl lg:w-2/3 flex justify-between items-center flex-row">
                        <div className="ml-[-4.5%] h-20 w-20 rounded-full bg-[#00384F]"></div>

                        <div className="flex my-8 w-full justify-center items-center flex-col">
                          <div className="flex w-full flex-row justify-start items-start gap-3 p-3">
                            <div className="w-full lg:w-4/5 text-white">
                              <div className="flex w-full flex-row justify-start items-center flex-row">
                                <div className="h-20 w-28 text-5xl flex justify-center items-center font-bold bg-[#D2FF3A] rounded-full text-black">
                                  ✓
                                </div>
                                <div className="flex w-full ml-4 flex-col text-start justify-start items-start">
                                  <p className="text-[#F9F9F9] text-2xl font-semibold">
                                    Success in creating a ticket
                                  </p>
                                  <p
                                    style={{
                                      color: "rgba(255, 255, 255, 0.80)",
                                    }}
                                    className="text-lg mt-2"
                                  >
                                    Check details below
                                  </p>
                                </div>
                              </div>

                              <div className="mt-10 w-full flex justify-start items-start text-[#F9F9F9] text-3xl font-bold">
                                <p className="text-start">
                                  {EventData?.name || ""}
                                </p>
                              </div>

                              <div className="flex flex-row text-[#F9F9F9] mt-6 justify-start w-full items-center">
                                <LuCalendarDays size={30} />
                                <p className="font-Montserrat ml-3">
                                  {moment(EventData?.timefrom?.seconds * 1000)
                                    .local()
                                    .format("LL")}
                                </p>
                              </div>

                              <div className="flex flex-row text-[#F9F9F9] mt-3 justify-start w-full items-center">
                                <FaClock size={30} />
                                <p className="font-Montserrat ml-3">
                                  {moment(EventData?.timefrom?.seconds * 1000)
                                    .local()
                                    .format("LT")}{" "}
                                  -{" "}
                                  {moment(EventData?.timeto?.seconds * 1000)
                                    .local()
                                    .format("LT")}
                                </p>
                              </div>

                              <div className="flex flex-row text-[#F9F9F9] mt-3 justify-start w-full items-center">
                                <FaLocationDot size={30} />
                                <p className="font-Montserrat ml-3">
                                  {EventData?.location}
                                </p>
                              </div>

                              <div className="flex flex-row text-[#F9F9F9] mt-3 justify-start w-full items-center">
                                <FaTag size={30} />
                                <p className="font-Montserrat ml-3">
                                  {EventData?.ticketPrice === "0.00"
                                    ? "FREE"
                                    : EventData?.ticketPrice}
                                </p>
                              </div>
                            </div>
                            <div className="w-full lg:w-1/5 h-full text-white">
                              <div className="flex w-full justify-center items-center bg-white rounded-xl">
                                {qrCodeBase64 ? (
                                  <img
                                    src={qrCodeBase64}
                                    alt="QR Code"
                                    className="rounded-xl object-contain"
                                  />
                                ) : (
                                  <p>Loading QR code...</p>
                                )}
                              </div>
                              <div className="flex w-full justify-center text-black py-4 mt-3 items-center bg-white rounded-xl">
                                {EventData?.attendees?.length}{" "}
                                {EventData?.attendees?.length === 1
                                  ? "Attendee"
                                  : "Attendees"}{" "}
                                {EventData?.attendees?.length === 0 &&
                                  "No Attendees Yet!"}
                              </div>
                            </div>
                          </div>
                          <div
                            style={{ borderColor: "rgba(255, 255, 255, 0.21)" }}
                            className="mt-8 flex w-full flex-row justify-between items-center border-t-2 border-dashed"
                          >
                            <div className="flex text-base w-full justify-start items-center flex-row mt-8">
                              <div className="rounded-full bg-white border-2 w-20 h-20">
                                <img
                                  src={
                                    creatorData?.photoURL
                                      ? creatorData?.photoURL
                                      : img.src
                                  }
                                  className="rounded-full w-full h-full object-cover"
                                  alt=""
                                />
                              </div>
                              <div className="flex ml-3 flex-col justify-start items-start">
                                <p className="font-normal text-[#BDBDBD]">
                                  Hosted By:
                                </p>
                                <p className="font-bold text-[#F2F2F2]">
                                  {creatorData?.full_name ||
                                    creatorData?.display_name ||
                                    "Anonymous"}
                                </p>
                              </div>
                            </div>
                            <button className="mt-8 rounded-xl w-full py-4 bg-[#007BAB] border-2 border-[#007BAB] hover:bg-transparent font-semibold text-[#fff]">
                              Create Your Free Event Passport
                            </button>
                          </div>
                        </div>

                        <div className="mr-[-4.5%] h-20 w-20 rounded-full bg-[#00384F]"></div>
                      </div>

                      <div className="lg:w-1/3 flex w-full h-auto justify-center items-center flex-col">
                        <div className="flex w-full justify-center items-center flex-col gap-4">
                          <div className="bg-[#012432] flex justify-start items-center flex-col rounded-xl w-full p-6">
                            <button className="rounded-xl w-full py-4 bg-[#007BAB] border-2 border-[#007BAB] hover:bg-transparent font-semibold text-[#fff]">
                              Add to Calendar
                            </button>
                            <button className="mt-3 rounded-xl w-full py-4 bg-[#007BAB] border-2 border-[#007BAB] hover:bg-transparent font-semibold text-[#fff]">
                              Email my Ticket
                            </button>
                            <button className="mt-3 rounded-xl w-full py-4 bg-[#007BAB] border-2 border-[#007BAB] hover:bg-transparent font-semibold text-[#fff]">
                              Text my Ticket
                            </button>
                          </div>

                          <div className="bg-[#012432] mt-6 flex justify-start items-center flex-col rounded-xl w-full p-6">
                            <button className="rounded-xl w-full py-4 bg-[#007BAB] border-2 border-[#007BAB] hover:bg-transparent font-semibold text-[#fff]">
                              Add to Calendar
                            </button>
                            <button className="mt-3 rounded-xl w-full py-4 bg-[#007BAB] border-2 border-[#007BAB] hover:bg-transparent font-semibold text-[#fff]">
                              Email my Ticket
                            </button>
                            <button className="mt-3 rounded-xl w-full py-4 bg-[#007BAB] border-2 border-[#007BAB] hover:bg-transparent font-semibold text-[#fff]">
                              Text my Ticket
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {showPaymentModal && (
              <div className="fixed z-10 inset-0 overflow-y-auto">
                <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                  <div
                    className="fixed inset-0 transition-opacity"
                    aria-hidden="true"
                  >
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                  </div>

                  <span
                    className="hidden sm:inline-block sm:align-middle sm:h-screen"
                    aria-hidden="true"
                  >
                    &#8203;
                  </span>

                  <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                    <div>
                      <div className="mt-3 text-center sm:mt-5">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                          Stripe popup
                        </h3>
                      </div>
                    </div>
                    <div className="mt-5 sm:mt-6">
                      <button
                        type="button"
                        className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#123B79] text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                        onClick={() => {
                          setShowPaymentModal(false);
                        }}
                      >
                        pay
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default EventDetails;
