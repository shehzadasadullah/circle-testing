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
import { getAuth, getIdToken } from "firebase/auth";
import { getFirestore, collection, getDocs, getDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";
import { arrayUnion } from "firebase/firestore";
import Register from "@/components/Home/Register";
import QRCode from "qrcode";
import { ThreeDots } from "react-loader-spinner";
// import toast from "react-simple-toasts";
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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaCalendarAlt } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { FaWallet } from "react-icons/fa";
import { FaMobile } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
import img1 from "./1.png";
import img2 from "./2.png";
import img3 from "./3.png";
import img4 from "./4.png";
import img5 from "./5.png";
import img6 from "./6.png";
import img7 from "./7.png";
import img8 from "./8.png";
import img9 from "./9.png";
import { AiFillApple } from "react-icons/ai";
import { IoLogoGooglePlaystore } from "react-icons/io5";
import loaderGif from "../../../public/events/Loader.gif";
import {
  FacebookIcon,
  FacebookShareButton,
  FacebookShareCount,
  LinkedinIcon,
  LinkedinShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
  XIcon,
} from "react-share";
import { useMediaQuery } from "react-responsive";
import calendarImage from "./schedule.png";

const EventDetails = () => {
  const breakpoints = {
    sm: "(max-width: 640px)",
    md: "(max-width: 768px)",
    lg: "(max-width: 1024px)",
    xl: "(max-width: 1280px)",
  };
  const isLgScreen = useMediaQuery({ query: breakpoints.lg });
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(window.location.href);
    }
  }, []);
  const title = "Hey, Join me by attending this Event!";
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
  const [emailLoading, setEmailLoading] = useState(false);
  const [showMobileScreen, setShowMobileScreen] = useState(false);
  const [showNoIntegrationScreen, setShowNoIntegrationScreen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showFreeModal, setShowFreeModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showticketModal, setShowTicketModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showsuccessModal, setShowSuccessModal] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const timestamp = EventData?.timefrom?.seconds * 1000;
  const formattedTime = moment(timestamp).local().format("LT");
  const [qrCodeBase64, setQRCodeBase64] = useState(null);
  const currentTime = new Date();
  const [text, setText] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const router = useRouter();
  const { id } = router.query;
  const { type } = router.query;
  const [allevents, setAllEvents] = useState([]);
  const sortedEvents = allevents.sort((a, b) => a.timefrom - b.timefrom);
  const currentDate = moment();
  const [upcomingcreatorData, setupcomingCreatorData] = useState(null);
  const [loaderOne, setLoaderOne] = useState(true);
  const [loaderTwo, setLoaderTwo] = useState(true);
  const [loaderThree, setLoaderThree] = useState(true);
  const [attendeesDataList, setAttendeesDataList] = useState(null);
  const [showDownloadMobileAppModal, setShowDownloadMobileAppModal] =
    useState(false);
  const [filteredAttendeesDataList, setFilteredAttendeesDataList] =
    useState(null);
  const [searchAttendees, setSearchAttendees] = useState("");

  // Filter events that occur after the current date and time
  const upcomingEvents = sortedEvents.filter((event) => {
    const eventDate = moment(event.timefrom.seconds * 1000);
    return eventDate.isAfter(currentDate);
  });

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  //get all events
  useEffect(() => {
    if (id?.length > 0) {
      // Reference of event
      if (type) {
        const eventRef = doc(db, "dev_events", id);

        return onSnapshot(eventRef, async (docquery) => {
          if (docquery.exists()) {
            console.log("SCRAPPED EVENT DATA: ", docquery);
            setEventData(docquery?.data() || {});
          }
          setLoaderOne(false);
        });
      } else {
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
            console.log("CO HOSTS: ", cohosts_list_temp_array);

            const attendesData = docquery?.data()?.attendees || [];
            let attendees_list_temp_array = [];
            let attendees_list_data_array = [];

            if (attendesData?.length > 0) {
              attendesData?.map((item) => {
                attendees_list_temp_array.push(item?.id);
              });
            }
            console.log("ATTENDEES LIST: ", attendees_list_temp_array);
            setAttendeList(attendees_list_temp_array || []);

            if (attendesData?.length > 0) {
              for (let i = 0; i < attendesData.length; i++) {
                const attendeesDocRef = doc(db, "Users", attendesData[i].id);
                const attendeesDocSnapshot = await getDoc(attendeesDocRef);
                if (attendeesDocSnapshot.exists()) {
                  const attendeesUserData = attendeesDocSnapshot.data();
                  attendees_list_data_array.push(attendeesUserData);
                }
              }
            }

            console.log("ATTENDEES LIST DATA: ", attendees_list_data_array);
            setAttendeesDataList(attendees_list_data_array);
            setFilteredAttendeesDataList(attendees_list_data_array);

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
          setTimeout(() => {
            setLoaderOne(false);
          }, 2000);
        });
      }
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

  // Get the next four upcoming events

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
        setLoaderTwo(false);
      } catch (error) {
        setLoaderTwo(false);
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
  const nextFourEvents = upcomingEvents.slice(0, 4);
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
    setLoaderThree(false);
  };

  useEffect(() => {
    if (nextFourEvents?.length > 0 && upcomingcreatorData === null) {
      fetchCreatorData();
    }
  }, [nextFourEvents]);

  const handleAttend = () => {
    if (user?.email == undefined) {
      setShowModal(true);
      toast.error("Please log in to attend event!");
    } else if (
      EventData.ticketPrice == null ||
      EventData.ticketPrice == "0.00"
    ) {
      // if (showSuccessPopup) {
      //   setShowSuccessModal(true);
      //   setShowSuccessPopup(false); // Set the flag to false after showing the success popup once
      // } else {
      setShowTicketModal(true); // Show the ticket modal for subsequent times
      // Event Mail

      try {
        var myHeaders = new Headers();
        myHeaders.append("accessToken", circleAccessToken);

        var requestOptions = {
          method: "GET",
          headers: myHeaders,
          redirect: "follow",
        };

        fetch(
          `https://api.circle.ooo/api/circle/email/event?eventId=${id}&emailType=ATTEND-EVENT-MAIL`,
          requestOptions
        )
          .then((response) => response.text())
          .then((result) => console.log("MAIL RESULT:", result))
          .catch((error) => console.log("error", error));
      } catch (error) {
        console.log(error);
      }
      // }
    } else if (Array.isArray(attendeList) && attendeList.includes(user?.uid)) {
      setShowTicketModal(true);
      try {
        var myHeaders = new Headers();
        myHeaders.append("accessToken", circleAccessToken);

        var requestOptions = {
          method: "GET",
          headers: myHeaders,
          redirect: "follow",
        };

        fetch(
          `https://api.circle.ooo/api/circle/email/event?eventId=${id}&emailType=ATTEND-EVENT-MAIL`,
          requestOptions
        )
          .then((response) => response.text())
          .then((result) => console.log("MAIL RESULT:", result))
          .catch((error) => console.log("error", error));
      } catch (error) {
        console.log(error);
      }
      // Add your routing logic here for checked-in users, e.g., router.push('/checked-in');
    } else {
      router.push(`/event/${id}/checkout`);
    }
  };

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

  const handleClick = (e) => {
    e?.preventDefault();
    setShowModal(true);
  };

  useEffect(() => {
    if (user) console.log("USER DATA: ", user);
  }, [user]);

  const EmailMe = async () => {
    // Set loading state to true
    setEmailLoading(true);

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
      EventData?.ticketPrice !== "0.00" ? EventData?.ticketPrice : "Free";
    const name = user?.displayName;
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
        const res = await axios.post("https://api.circle.ooo/ticket", {
          usersdata: email,
          bodymessage: msgbody,
        });

        // Email sent successfully, set loading state to false

        if (res.data.result === true && res.data.code === 5001) {
          toast.success("Email Sent Successfully!");
        } else {
          toast.error("Error sending Email!");
        }
        // Optionally, perform any success actions or display a success message
        console.log("Email sent successfully!");
        setEmailLoading(false);
      }
    } catch (error) {
      // Error occurred, set loading state to false
      setEmailLoading(false);
      toast.error("Error sending Email!");
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
    { id: "tab2", label: "Attendees", paddingLeft: 4 },
  ];

  const otherTabs = [{ id: "tab1", label: "About Event", paddingLeft: 0 }];
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  // useEffect(() => {
  //   if (searchAttendees !== "") {
  //     console.log(searchAttendees);
  //     console.log("Attendees Data List:", attendeesDataList);
  //     const filteredAttendees = attendeesDataList.filter(
  //       (f) =>
  //         f?.full_name?.toLowerCase() === searchAttendees?.toLowerCase() ||
  //         f?.display_name?.toLowerCase() === searchAttendees?.toLowerCase()
  //     );
  //     setFilteredAttendeesDataList(filteredAttendees);
  //     console.log("Filtered Attendees Data List:", filteredAttendees);
  //   } else {
  //     setFilteredAttendeesDataList(attendeesDataList);
  //   }
  // }, [searchAttendees]);

  useEffect(() => {
    if (searchAttendees !== "") {
      console.log(searchAttendees);
      const searchTermLowerCase = searchAttendees.toLowerCase();
      const filteredAttendees = attendeesDataList.filter(
        (f) =>
          f?.full_name?.toLowerCase().indexOf(searchTermLowerCase) !== -1 ||
          f?.display_name?.toLowerCase().indexOf(searchTermLowerCase) !== -1
      );
      setFilteredAttendeesDataList(filteredAttendees);
    } else {
      setFilteredAttendeesDataList(attendeesDataList);
    }
  }, [searchAttendees]);

  // Add to calendar

  const [circleAccessToken, setCircleAccessToken] = useState("");
  const [thirdPartyIntegrations, setThirdPartyIntegrations] = useState([]);
  const [addToCalenderLoader, setAddToCalenderLoader] = useState(false);

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
      .then((result) => {
        if (result) {
          const tempArrayCalendars = result?.data.reduce((acc, fl) => {
            if (fl.Type === "CALENDAR") {
              acc = acc.concat(fl.Integration);
            }
            return acc;
          }, []);
          setThirdPartyIntegrations(tempArrayCalendars);
        } else {
          toast.error("Something went wrong with the integrations!");
        }
      })
      .catch((error) => console.log("error", error));
  };

  useEffect(() => {
    if (user && circleAccessToken !== "") getThirdPartyIntegrations();
  }, [user, circleAccessToken]);

  const handleAddToCalendar = () => {
    setAddToCalenderLoader(true);

    try {
      var myHeaders = new Headers();
      myHeaders.append("accessToken", circleAccessToken);
      myHeaders.append("Content-Type", "application/json");

      const pArray = [];
      thirdPartyIntegrations
        .filter(
          (fl) =>
            fl.integrationType === "GOOGLECALENDAR" ||
            fl.integrationType === "ICAL"
        )
        .map((item) => {
          pArray.push(item.integrationType);
        });

      var raw = JSON.stringify({
        eventId: EventData.uid,
        platforms: pArray,
      });

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      fetch(
        "https://api.circle.ooo/api/circle/third-party/calendar/add-event",
        requestOptions
      )
        .then((response) => response.json())
        .then((res) => {
          res.map((item) => {
            if (item.result) {
              toast.success(item?.message?.toUpperCase());
              if (item.integration === "ICAL" && item.result === true) {
                try {
                  var myHeaders = new Headers();
                  myHeaders.append("accessToken", circleAccessToken);

                  var requestOptions = {
                    method: "GET",
                    headers: myHeaders,
                    redirect: "follow",
                  };

                  fetch(
                    `https://api.circle.ooo/api/circle/third-party/calendar/ical-event-file?eventId=${EventData.uid}`,
                    requestOptions
                  )
                    .then((response) => response.text())
                    .then((result) => {
                      // Parse the API response to get the calendar data
                      const calendarData = new Blob([result], {
                        type: "text/calendar",
                      });

                      // Create a download link
                      const downloadLink = document.createElement("a");
                      downloadLink.href = URL.createObjectURL(calendarData);
                      downloadLink.download = "calendar.ics";

                      // Append the link to the body and trigger a click event
                      document.body.appendChild(downloadLink);
                      downloadLink.click();

                      // Clean up: remove the download link from the body if it's a child
                      if (downloadLink.parentNode) {
                        document.body.removeChild(downloadLink);
                      }
                    })
                    .catch((error) => {
                      console.log("error", error);
                      toast.error("Error downloading iCal file!");
                    });
                } catch (error) {
                  console.error("Error:", error);
                  toast.error("Error downloading iCal file!");
                }
              }
            } else {
              toast.error(item?.message?.toUpperCase());
            }
          });
          setAddToCalenderLoader(false);
        })
        .catch((error) => {
          setAddToCalenderLoader(false);
          console.log("ERRRRRROR: ", error);
          toast.error("Something went wrong 1!");
        });
    } catch (error) {
      setAddToCalenderLoader(false);
      toast.error("Something went wrong 2!");
    }
  };

  const copyToClipboard = () => {
    const tempTextarea = document.createElement("textarea");
    tempTextarea.value = window.location.href;
    document.body.appendChild(tempTextarea);
    tempTextarea.select();
    tempTextarea.setSelectionRange(0, 99999);
    document.execCommand("copy");
    document.body.removeChild(tempTextarea);
    toast.success("Link copied to clipboard!");
  };

  return (
    <>
      {loaderOne === false && loaderTwo === false && loaderThree === false ? (
        <>
          <ToastContainer />
          <div className="w-full h-full p-4 lg:p-10">
            <div className="flex flex-col lg:flex-row justify-start items-start gap-6">
              {/* LEFT SIDE */}
              <div className="w-full lg:w-[70%] flex-col flex items-center justify-center">
                <div className="h-auto w-full rounded-xl">
                  <img
                    className="object-contain rounded-xl lg:h-96"
                    alt="event large image"
                    src={
                      EventData?.large_image || EventData.largeimage
                        ? EventData?.large_image || EventData.largeimage
                        : "https://cdnspicyfy.azureedge.net/images/8400a5e7-639e-4e1a-bd5e-41c689de93a5.jpg"
                    }
                  />
                </div>

                <div className="mt-8 text-[#F9F9F9] text-3xl flex justify-start items-center w-full font-bold">
                  {EventData?.name || EventData.title || ""}
                </div>

                <div className="w-full mt-8 flex flex-col justify-start items-center">
                  <div className="flex border-[#007BAB] flex-row gap-6 border-b-2 w-full">
                    {type
                      ? otherTabs.map((tab) => (
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
                        ))
                      : tabs.map((tab) => (
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
                      {EventData?.description || ""}
                    </div>
                  ) : (
                    activeTab === "tab2" && (
                      <div className="text-[#F9F9F9] mt-6 w-full flex justify-start items-center">
                        <div className="flex w-full flex-col flex-nowrap lg:flex-wrap lg:flex-row items-center justify-start gap-y-4">
                          {/* <div className="relative w-full">
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
                           value={searchAttendees}
                           onChange={(e) => {
                             setSearchAttendees(e.target.value);
                           }}
                         />
                       </div> */}
                          {filteredAttendeesDataList.length > 0 &&
                            filteredAttendeesDataList.map((key) => {
                              return (
                                <>
                                  <div className="flex w-full justify-start items-center flex-col bg-[#012432] rounded-xl p-2">
                                    <div
                                      style={{
                                        filter: "blur(3px)",
                                        opacity: "0.8",
                                        transition: "filter 0.5s, opacity 0.5s",
                                      }}
                                      className="flex text-base w-full justify-start items-center flex-col md:flex-row p-2"
                                    >
                                      <div className="flex w-full justify-start items-center">
                                        <div className="rounded-full border-2">
                                          {key?.photo_url ? (
                                            <>
                                              <img
                                                src={
                                                  key?.photo_url
                                                    ? key?.photo_url
                                                    : img.src
                                                }
                                                className="rounded-full w-12 h-12 object-cover"
                                                alt=""
                                              />
                                            </>
                                          ) : (
                                            <>
                                              <HiMiniUserCircle size={50} />
                                            </>
                                          )}
                                        </div>
                                        <div className="flex ml-2 flex-col justify-start items-center">
                                          <p className="font-bold">
                                            {key?.full_name
                                              ? key?.full_name?.toUpperCase()
                                              : key?.display_name?.toUpperCase()}
                                          </p>

                                          {/* <p>
                                         {key?.email
                                           ? key?.email?.toUpperCase()
                                           : user?.email?.toUpperCase()}
                                       </p> */}
                                        </div>
                                      </div>
                                      {/* <div className="flex w-full mt-3 md:mt-0 justify-center md:justify-end items-center">
                                     <button className="rounded-xl py-3 font-semibold px-6 bg-[#007BAB] hover:bg-transparent border-[#007BAB] border-2 text-white">
                                       Follow
                                     </button>
                                   </div> */}
                                    </div>
                                  </div>
                                </>
                              );
                            })}
                          {filteredAttendeesDataList.length > 0 && (
                            <>
                              <div className="flex text-base w-full justify-center items-center flex-col p-2">
                                <div className="flex w-full justify-center items-center">
                                  <button
                                    onClick={() => {
                                      setShowDownloadMobileAppModal(true);
                                    }}
                                    className={`rounded-xl text-lg py-2 px-5 w-full lg:w-auto font-semibold bg-[#007BAB] hover:bg-transparent border-[#007BAB] border-2 text-[#fff]`}
                                  >
                                    Download the App to See & Connect With
                                    Attendees!
                                  </button>
                                </div>
                              </div>
                            </>
                          )}

                          {filteredAttendeesDataList.length === 0 && (
                            <>
                              <div className="flex w-full justify-center items-center flex-col bg-[#012432] rounded-xl p-5">
                                <button
                                  onClick={() => {
                                    setShowDownloadMobileAppModal(true);
                                  }}
                                  className={`rounded-xl text-lg py-2 px-5 font-semibold bg-[#007BAB] hover:bg-transparent border-[#007BAB] border-2 text-[#fff]`}
                                >
                                  Download the App to See & Connect With
                                  Attendees!
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    )
                  )}

                  {showDownloadMobileAppModal && (
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
                          className={`inline-block w-full lg:w-[50%] align-middle bg-[#00384F] rounded-lg shadow-xl transform transition-all`}
                        >
                          <div className="w-full flex justify-between border-[#F9F9F9] text-[#F9F9F9] border-b-2 items-center px-6 py-3">
                            <p className="font-semibold text-xl w-full">
                              <div className="flex flex-row justify-start items-centre">
                                <p className="ml-2">Download Mobile App</p>
                              </div>
                            </p>
                            <button
                              type="button"
                              className="box-content rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
                              onClick={() => {
                                setShowDownloadMobileAppModal(false);
                              }}
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
                          <div className="w-full h-auto flex justify-center items-center flex-col gap-10 p-6">
                            <div className="w-full h-auto bg-[#012432] rounded-xl flex justify-center items-center flex-col p-10">
                              <p className="text-[#F9F9F9] text-3xl font-bold">
                                “Circle Is Available For All Devices”
                              </p>
                              <p className="text-[#BDBDBD] w-full lg:w-3/4 mt-4">
                                Connect effortlessly at the event with a
                                personalized digital business card. Register now
                                to explore who else will be there and use
                                Circle, the user-friendly app for all devices.
                                Sign up today for a free digital business card
                                and unlock networking success!
                              </p>
                              <div className="flex justify-center items-center flex-row mt-10 w-full">
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
                                  className={`px-5 ml-5 font14 font-medium rounded-full py-3 font-Montserrat text-[#000] hover:text-[#fff] border-2 border-[#F2F2F2] hover:bg-transparent bg-[#F2F2F2]`}
                                >
                                  <div className="flex justify-center items-center">
                                    <span>
                                      <IoLogoGooglePlaystore
                                        className="mr-1"
                                        size={30}
                                      />
                                    </span>
                                    Play Store
                                  </div>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
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
                            creatorData?.photo_url ||
                            EventData?.creator?.creatorimage
                              ? creatorData?.photo_url ||
                                EventData?.creator?.creatorimage
                              : img.src
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
                            EventData?.organizer ||
                            EventData?.creator?.creator ||
                            "Anonymous"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {cohostList.length > 0 && (
                  <>
                    <div className="flex w-full text-[#F2F2F2] flex-col items-start justify-start mt-8 border-dashed border-t-2 border-[#596A73]">
                      <div className="mt-6 font-bold text-[#F2F2F2] text-3xl">
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
                                      {key?.photo_url ? (
                                        <>
                                          <img
                                            src={
                                              key?.photo_url !== ""
                                                ? key?.photo_url
                                                : img.src
                                            }
                                            className="rounded-full h-20 object-cover"
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
                                          : key?.display_name?.toUpperCase()}
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
                  <p className="text-[#F9F9F9] font-bold text-lg">
                    Event Details
                  </p>

                  <div className="flex flex-row text-[#F9F9F9] mt-5 justify-start w-full items-center">
                    <LuCalendarDays size={30} />
                    <p className="font-Montserrat ml-3">
                      {type
                        ? EventData?.datetime
                        : moment(EventData?.timefrom?.seconds * 1000)
                            .local()
                            .format("LL") +
                          " - " +
                          moment(EventData?.timeto?.seconds * 1000)
                            .local()
                            .format("LL")}
                    </p>
                  </div>

                  {type ? (
                    ""
                  ) : (
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
                  )}

                  <div className="flex flex-row text-[#F9F9F9] mt-3 justify-start w-full items-center">
                    <FaLocationDot
                      onClick={() => {
                        const generateGoogleMapsUrl = (locationText) => {
                          const encodedLocation =
                            encodeURIComponent(locationText);
                          return `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
                        };

                        const locationText = EventData?.location;
                        const googleMapsUrl =
                          generateGoogleMapsUrl(locationText);
                        window.open(googleMapsUrl, "_blank");
                      }}
                      className="cursor-pointer"
                      size={30}
                    />
                    <p
                      onClick={() => {
                        const generateGoogleMapsUrl = (locationText) => {
                          const encodedLocation =
                            encodeURIComponent(locationText);
                          return `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
                        };

                        const locationText = EventData?.location;
                        const googleMapsUrl =
                          generateGoogleMapsUrl(locationText);
                        window.open(googleMapsUrl, "_blank");
                      }}
                      className="font-Montserrat ml-3 cursor-pointer"
                    >
                      {EventData?.location}
                    </p>
                  </div>

                  <div className="flex flex-row text-[#F9F9F9] mt-3 justify-start w-full items-center">
                    <FaTag size={30} />
                    <p className="font-Montserrat ml-3">
                      {type
                        ? EventData?.ticketprice === ""
                          ? "Free"
                          : EventData?.ticketprice
                        : EventData?.ticketPrice === "0.00"
                        ? "FREE"
                        : "PAID"}
                    </p>
                  </div>

                  <div className="flex text-base w-full justify-start items-center flex-row mt-5 border-dashed border-t-2 border-[#828282]">
                    <div className="rounded-full bg-white border-2 w-20 h-20 mt-5">
                      <img
                        src={
                          creatorData?.photo_url ||
                          EventData?.creator?.creatorimage
                            ? creatorData?.photo_url ||
                              EventData?.creator?.creatorimage
                            : img.src
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
                          EventData?.organizer ||
                          EventData?.creator?.creator ||
                          "Anonymous"}
                      </p>
                    </div>
                  </div>
                </div>

                {user.uid === creatorData.uid && (
                  <>
                    <div className="flex w-full mt-4 gap-y-4 flex-col justify-center items-center p-6 bg-[#012432] rounded-xl">
                      <button
                        onClick={() => {
                          router.push(`/event/${id}/edit-event`);
                        }}
                        className="rounded-xl px-5 flex flex-row justify-between items-center w-full py-4 bg-[#007BAB] border-2 border-[#007BAB] hover:bg-transparent font-semibold text-[#fff]"
                      >
                        <div className="flex flex-row justify-center items-center">
                          <FaPencil size={20} color="#fff" />
                          <p className="ml-2">Edit Event</p>
                        </div>

                        <div>
                          <IoIosArrowForward size={20} color="#fff" />
                        </div>
                      </button>
                    </div>
                  </>
                )}

                {Array.isArray(attendeList) &&
                  attendeList.includes(user?.uid) && (
                    <>
                      <div className="flex w-full mt-4 gap-y-4 flex-col justify-center items-center p-6 bg-[#012432] rounded-xl">
                        <button
                          disabled={addToCalenderLoader}
                          onClick={() => {
                            const hasValidIntegration =
                              thirdPartyIntegrations.some((fl) => {
                                return (
                                  fl.integrationType === "GOOGLECALENDAR" ||
                                  fl.integrationType === "ICAL"
                                );
                              });

                            if (!hasValidIntegration) {
                              setShowNoIntegrationScreen(true);
                            } else {
                              setShowNoIntegrationScreen(false);
                              handleAddToCalendar();
                            }
                          }}
                          className="rounded-xl px-5 flex flex-row justify-between items-center w-full py-4 bg-[#007BAB] border-2 border-[#007BAB] hover:bg-transparent font-semibold text-[#fff]"
                        >
                          <div className="flex flex-row justify-center items-center">
                            <FaCalendarAlt size={20} color="#fff" />
                            <p className="ml-2">Add to Calendar</p>
                          </div>
                          {addToCalenderLoader ? (
                            <>
                              <div>
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
                            <>
                              <div>
                                <IoIosArrowForward size={20} color="#fff" />
                              </div>
                            </>
                          )}
                        </button>
                      </div>
                    </>
                  )}

                <div className="flex w-full mt-4 flex-col xl:flex-row justify-center items-center p-6 bg-[#012432] rounded-xl">
                  <button
                    onClick={() => setShowShareModal(true)}
                    className="flex justify-center items-center flex-row rounded-xl text-lg px-5 py-4 w-full font-semibold bg-[#fff] hover:bg-transparent border-[#fff] border-2 text-[#000] hover:text-[#fff]"
                  >
                    <LiaShareAltSolid size={28} /> <p className="ml-2">Share</p>
                  </button>
                </div>

                <div className="flex w-full mt-4 flex-row justify-center items-center p-6 bg-[#012432] rounded-xl">
                  {type ? (
                    <button
                      onClick={(e) => {
                        window.open(EventData?.hyperlink, "_blank");
                      }}
                      className={`rounded-xl text-lg py-5 px-5 w-full font-bold bg-[#007BAB] hover:bg-transparent border-[#007BAB] border-2 text-[#fff]`}
                    >
                      Attend Event
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          AttendeesData();
                          handleAttend();
                        }}
                        className={`flex ${
                          Array.isArray(attendeList) &&
                          attendeList.includes(user?.uid)
                            ? "justify-center"
                            : "justify-between"
                        } items-center flex-row rounded-xl text-lg py-5 px-5 w-full font-bold bg-[#007BAB] hover:bg-transparent border-[#007BAB] border-2 text-[#fff]`}
                      >
                        <p>
                          {Array.isArray(attendeList) &&
                          attendeList.includes(user?.uid)
                            ? "View Ticket Details"
                            : "Attend Event"}
                        </p>
                        <p>
                          {Array.isArray(attendeList) &&
                          attendeList.includes(user?.uid)
                            ? ""
                            : "$" + EventData?.ticketPrice}
                        </p>
                      </button>
                    </>
                  )}
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
                                Your Event Registration is successfully confirm
                                to view ticket click here
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
                  <div className="fixed z-50 inset-0 overflow-y-auto">
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
                        className={`inline-block w-full ${
                          showMobileScreen || showNoIntegrationScreen
                            ? "lg:w-[50%]"
                            : "lg:w-[90%]"
                        } align-middle bg-[#00384F] rounded-lg shadow-xl transform transition-all`}
                      >
                        <div className="w-full flex justify-between border-[#F9F9F9] text-[#F9F9F9] border-b-2 items-center px-6 py-3">
                          <p className="font-semibold text-xl w-full">
                            {showMobileScreen === true ? (
                              <>
                                <div className="flex flex-row justify-start items-centre">
                                  <div>
                                    <IoIosArrowBack
                                      size={30}
                                      className="border-2 cursor-pointer rounded-full"
                                      onClick={() => setShowMobileScreen(false)}
                                    />
                                  </div>
                                  <p className="ml-2">Download Mobile App</p>
                                </div>
                              </>
                            ) : showNoIntegrationScreen ? (
                              <>
                                <div className="flex flex-row justify-start items-centre">
                                  <div>
                                    <IoIosArrowBack
                                      size={30}
                                      className="border-2 rounded-full cursor-pointer"
                                      onClick={() =>
                                        setShowNoIntegrationScreen(false)
                                      }
                                    />
                                  </div>
                                  <p className="ml-2">Integrate Calendars</p>
                                </div>
                              </>
                            ) : (
                              "Your Coupon"
                            )}
                          </p>
                          <button
                            type="button"
                            className="box-content rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
                            onClick={() => {
                              setShowMobileScreen(false);
                              setShowNoIntegrationScreen(false);
                              setShowTicketModal(false);
                            }}
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
                        {showMobileScreen === false &&
                          showNoIntegrationScreen === false && (
                            <>
                              <div className="w-full h-auto flex justify-start items-start flex-col lg:flex-row gap-2 lg:gap-10 p-6">
                                <div className="overflow-hidden w-full h-auto bg-[#012432] rounded-xl lg:w-2/3 flex justify-between items-center flex-row">
                                  <div className="ml-[-12.5%] lg:ml-[-4.5%] h-20 w-20 rounded-full bg-[#00384F]"></div>

                                  <div className="flex my-8 w-full justify-center items-center flex-col">
                                    <div className="flex w-full flex-col lg:flex-row justify-start items-start gap-3 p-3">
                                      <div className="w-full lg:w-4/5 text-white">
                                        <div className="flex w-full flex-col lg:flex-row justify-center lg:justify-start items-center">
                                          <div className="h-20 w-28 text-5xl flex justify-center items-center font-bold bg-[#D2FF3A] rounded-full text-black">
                                            ✓
                                          </div>
                                          <div className="flex mt-4 lg:mt-0 w-full lg:ml-4 flex-col text-center lg:text-start justify-center lg:justify-start items-center lg:items-start">
                                            <p className="text-[#F9F9F9] text-2xl font-semibold">
                                              Success in creating a ticket
                                            </p>
                                            <p
                                              style={{
                                                color:
                                                  "rgba(255, 255, 255, 0.80)",
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
                                            {moment(
                                              EventData?.timefrom?.seconds *
                                                1000
                                            )
                                              .local()
                                              .format("LL")}
                                            {" - "}{" "}
                                            {moment(
                                              EventData?.timeto?.seconds * 1000
                                            )
                                              .local()
                                              .format("LL")}
                                          </p>
                                        </div>

                                        <div className="flex flex-row text-[#F9F9F9] mt-3 justify-start w-full items-center">
                                          <FaClock size={30} />
                                          <p className="font-Montserrat ml-3">
                                            {moment(
                                              EventData?.timefrom?.seconds *
                                                1000
                                            )
                                              .local()
                                              .format("LT")}{" "}
                                            -{" "}
                                            {moment(
                                              EventData?.timeto?.seconds * 1000
                                            )
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
                                      <div className="w-full mt-5 lg:mt-0 lg:w-1/5 h-full text-white">
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
                                      style={{
                                        borderColor:
                                          "rgba(255, 255, 255, 0.21)",
                                      }}
                                      className="mt-8 p-3 flex w-full flex-col lg:flex-row justify-center lg:justify-between items-center border-t-2 border-dashed"
                                    >
                                      <div className="flex text-base w-full justify-start items-center flex-row mt-8">
                                        <div className="rounded-full bg-white border-2 w-20 h-20">
                                          <img
                                            src={
                                              creatorData?.photo_url ||
                                              EventData?.creator?.creatorimage
                                                ? creatorData?.photo_url ||
                                                  EventData?.creator
                                                    ?.creatorimage
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
                                              EventData?.organizer ||
                                              EventData?.creator?.creator ||
                                              "Anonymous"}
                                          </p>
                                        </div>
                                      </div>
                                      <button
                                        onClick={() =>
                                          setShowMobileScreen(true)
                                        }
                                        className="mt-8 rounded-xl w-full py-4 bg-[#007BAB] border-2 border-[#007BAB] hover:bg-transparent font-semibold text-[#fff]"
                                      >
                                        Create Your Free Event Passport
                                      </button>
                                    </div>
                                  </div>

                                  <div className="mr-[-12.5%] lg:mr-[-4.5%] h-20 w-20 rounded-full bg-[#00384F]"></div>
                                </div>

                                <div className="lg:w-1/3 flex w-full h-auto justify-center items-center flex-col">
                                  <div className="flex w-full justify-center items-center flex-col gap-4">
                                    <div className="bg-[#012432] mt-6 lg:mt-0 flex justify-start items-center flex-col rounded-xl w-full p-6">
                                      <button
                                        disabled={addToCalenderLoader}
                                        onClick={() => {
                                          const hasValidIntegration =
                                            thirdPartyIntegrations.some(
                                              (fl) => {
                                                return (
                                                  fl.integrationType ===
                                                    "GOOGLECALENDAR" ||
                                                  fl.integrationType === "ICAL"
                                                );
                                              }
                                            );

                                          if (!hasValidIntegration) {
                                            setShowNoIntegrationScreen(true);
                                          } else {
                                            setShowNoIntegrationScreen(false);
                                            handleAddToCalendar();
                                          }
                                        }}
                                        className="rounded-xl px-5 flex flex-row justify-between items-center w-full py-4 bg-[#007BAB] border-2 border-[#007BAB] hover:bg-transparent font-semibold text-[#fff]"
                                      >
                                        <div className="flex flex-row justify-center items-center">
                                          <FaCalendarAlt
                                            size={20}
                                            color="#fff"
                                          />
                                          <p className="ml-2">
                                            Add to Calendar
                                          </p>
                                        </div>
                                        {addToCalenderLoader ? (
                                          <>
                                            <div>
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
                                          <>
                                            <div>
                                              <IoIosArrowForward
                                                size={20}
                                                color="#fff"
                                              />
                                            </div>
                                          </>
                                        )}
                                      </button>
                                      {/* {showOptions && (
                           <div>
                             <AddToCalendarButton
                               className="rounded-xl w-full py-4 bg-[#007BAB] border-2 border-[#007BAB] hover:bg-transparent font-semibold text-[#fff]"
                               name={EventData.name}
                               buttonLabel="Add to My Calendar"
                               startDate={
                                 EventData?.timefrom
                                   ? new Date(
                                       EventData?.timefrom * 1000
                                     ).toISOString()
                                   : undefined
                               }
                               endDate={
                                 EventData?.timeto
                                   ? new Date(
                                       EventData.timeto * 1000
                                     ).toISOString()
                                   : undefined
                               }
                               options={[
                                 "Apple",
                                 "Google",
                                 "Yahoo",
                                 "iCal",
                                 "Outlook.com",
                               ]}
                             />
                           </div>
                         )} */}

                                      <button
                                        onClick={() =>
                                          setShowMobileScreen(true)
                                        }
                                        className="mt-3 rounded-xl px-5 flex flex-row justify-between items-center w-full py-4 bg-[#007BAB] border-2 border-[#007BAB] hover:bg-transparent font-semibold text-[#fff]"
                                      >
                                        <div className="flex flex-row justify-center items-center">
                                          <FaWallet size={20} color="#fff" />
                                          <p className="ml-2">Add to Wallet</p>
                                        </div>
                                        <div>
                                          <IoIosArrowForward
                                            size={20}
                                            color="#fff"
                                          />
                                        </div>
                                      </button>
                                      <button
                                        onClick={() => {
                                          EmailMe();
                                        }}
                                        disabled={emailLoading}
                                        className="mt-3 rounded-xl px-5 flex flex-row justify-between items-center w-full py-4 bg-[#007BAB] border-2 border-[#007BAB] hover:bg-transparent font-semibold text-[#fff]"
                                      >
                                        <div className="flex flex-row justify-center items-center">
                                          <FaMobile size={20} color="#fff" />
                                          <p className="ml-2">
                                            Ticket Text & Reminder
                                          </p>
                                        </div>
                                        <div>
                                          {emailLoading ? (
                                            <>
                                              <div>
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
                                            <>
                                              <div>
                                                <IoIosArrowForward
                                                  size={20}
                                                  color="#fff"
                                                />
                                              </div>
                                            </>
                                          )}
                                        </div>
                                      </button>
                                    </div>

                                    <div className="bg-[#012432] mt-6 flex justify-start items-center flex-col rounded-xl w-full p-6">
                                      <p className="w-full text-left mb-2 text-[#F9F9F9] text-xl">
                                        Connect with Attendees
                                      </p>
                                      <div className="w-full flex flex-row justify-center items-center">
                                        <div className="w-full flex justify-center items-center flex-wrap">
                                          <div className="rounded-full">
                                            <img src={img1.src} alt="" />
                                          </div>
                                          <div className="ml-[-7pt] rounded-full">
                                            <img src={img2.src} alt="" />
                                          </div>
                                          <div className="ml-[-7pt] rounded-full">
                                            <img src={img3.src} alt="" />
                                          </div>
                                          <div className="ml-[-7pt] rounded-full">
                                            <img src={img4.src} alt="" />
                                          </div>
                                          <div className="ml-[-7pt] rounded-full">
                                            <img src={img5.src} alt="" />
                                          </div>
                                          <div className="ml-[-7pt] rounded-full">
                                            <img src={img6.src} alt="" />
                                          </div>
                                          <div className="ml-[-7pt] rounded-full">
                                            <img src={img7.src} alt="" />
                                          </div>
                                          <div className="ml-[-7pt] rounded-full">
                                            <img src={img8.src} alt="" />
                                          </div>
                                          <div className="ml-[-7pt] rounded-full">
                                            <img src={img9.src} alt="" />
                                          </div>
                                        </div>
                                      </div>
                                      <button
                                        onClick={() =>
                                          setShowMobileScreen(true)
                                        }
                                        className="mt-3 rounded-xl w-full py-4 bg-[#007BAB] border-2 border-[#007BAB] hover:bg-transparent font-semibold text-[#fff]"
                                      >
                                        Connect with Attendees via Mobile App
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </>
                          )}
                        {showMobileScreen === true && (
                          <>
                            <div className="w-full h-auto flex justify-center items-center flex-col gap-10 p-6">
                              <div className="w-full h-auto bg-[#012432] rounded-xl flex justify-center items-center flex-col p-10">
                                <p className="text-[#F9F9F9] text-3xl font-bold">
                                  “Circle Is Available For All Devices”
                                </p>
                                <p className="text-[#BDBDBD] w-full lg:w-3/4 mt-4">
                                  Connect effortlessly at the event with a
                                  personalized digital business card. Register
                                  now to explore who else will be there and use
                                  Circle, the user-friendly app for all devices.
                                  Sign up today for a free digital business card
                                  and unlock networking success!
                                </p>
                                <div className="flex justify-center items-center flex-row mt-10 w-full">
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
                                        <AiFillApple
                                          className="mr-1"
                                          size={30}
                                        />
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
                                    className={`px-5 ml-5 font14 font-medium rounded-full py-3 font-Montserrat text-[#000] hover:text-[#fff] border-2 border-[#F2F2F2] hover:bg-transparent bg-[#F2F2F2]`}
                                  >
                                    <div className="flex justify-center items-center">
                                      <span>
                                        <IoLogoGooglePlaystore
                                          className="mr-1"
                                          size={30}
                                        />
                                      </span>
                                      Play Store
                                    </div>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                        {showNoIntegrationScreen === true && (
                          <>
                            <div className="w-full h-auto flex justify-center items-center flex-col gap-10 p-6">
                              <div className="w-full h-auto bg-[#012432] rounded-xl flex justify-center items-center flex-col p-10">
                                <img
                                  src={calendarImage.src}
                                  alt=""
                                  className="h-40"
                                />
                                <p className="text-[#F9F9F9] text-3xl mt-4 font-bold">
                                  “Oops, No Calendar Integration Found”
                                </p>
                                <p className="text-[#BDBDBD] w-full lg:w-3/4 mt-4">
                                  In-Order to add events into your calendars,
                                  you must have to integrate calendars first in
                                  the Settings page. Click on the button below
                                  to navigate to Settings page and integrate
                                  your calendars.
                                </p>
                                <div className="flex justify-center items-center flex-row mt-10 w-full">
                                  <button
                                    onClick={() => {
                                      router.push("/settings");
                                    }}
                                    className={`px-5 flex flex-row justify-center items-center font14 font-medium rounded-full py-3 font-Montserrat text-[#000] hover:text-[#fff] border-2 border-[#F2F2F2] hover:bg-transparent bg-[#F2F2F2]`}
                                  >
                                    <p>Add your first Calendar</p>
                                    <div className="ml-2">
                                      <IoIosArrowForward size={20} />
                                    </div>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                {showShareModal && (
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
                        className={`inline-block w-full lg:w-[50%] align-middle bg-[#00384F] rounded-lg shadow-xl transform transition-all`}
                      >
                        <div className="w-full flex justify-between border-[#F9F9F9] text-[#F9F9F9] border-b-2 items-center px-6 py-3">
                          <p className="font-semibold text-xl">
                            Share Event Details
                          </p>
                          <button
                            type="button"
                            className="box-content rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
                            onClick={() => {
                              setShowMobileScreen(false);
                              setShowNoIntegrationScreen(false);
                              setShowTicketModal(false);
                              setShowShareModal(false);
                            }}
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

                        <div className="w-full h-auto flex justify-center items-center flex-col p-6">
                          <div className="flex w-full h-auto justify-center items-center flex-col">
                            <div className="flex w-full justify-center items-center flex-col gap-4">
                              <div className="bg-[#012432] flex justify-center items-center flex-col rounded-xl w-full p-6">
                                <div className="w-full h-auto bg-[#012432] rounded-xl flex justify-center items-center flex-col lg:p-6">
                                  <p className="text-[#F9F9F9] text-3xl w-full font-bold">
                                    “Share & Invite others to Join You!”
                                  </p>

                                  <div className="flex w-full mt-6 justify-center lg:justify-between items-center flex-col lg:flex-row">
                                    <input
                                      type="text"
                                      name="copyLink"
                                      id="copyLink"
                                      value={window.location.href}
                                      disabled={true}
                                      className="w-full rounded-xl border-2 border-[#F2F2F2] p-4 text-[#000]"
                                    />

                                    <button
                                      onClick={copyToClipboard}
                                      className={`px-5 lg:ml-2 mt-2 lg:mt-0 rounded-xl py-4 bg-[#007BAB] hover:bg-transparent border-[#007BAB] border-2 text-[#fff]`}
                                    >
                                      {isLgScreen ? "Copy Link" : "Copy"}
                                    </button>
                                  </div>

                                  <p className="text-[#F9F9F9] mt-6 text-xl font-bold">
                                    Or
                                  </p>

                                  <div className="flex gap-x-2 justify-center items-center flex-wrap mt-6 w-full">
                                    <div className="">
                                      <FacebookShareButton
                                        url={shareUrl}
                                        className=""
                                      >
                                        <FacebookIcon size={50} round />
                                      </FacebookShareButton>

                                      <div>
                                        <FacebookShareCount
                                          url={shareUrl}
                                          className=""
                                        >
                                          {(count) => count}
                                        </FacebookShareCount>
                                      </div>
                                    </div>

                                    <div className="">
                                      <TwitterShareButton
                                        url={shareUrl}
                                        title={title}
                                        className=""
                                      >
                                        <XIcon size={50} round />
                                      </TwitterShareButton>
                                    </div>

                                    <div className="">
                                      <TelegramShareButton
                                        url={shareUrl}
                                        title={title}
                                        className=""
                                      >
                                        <TelegramIcon size={50} round />
                                      </TelegramShareButton>
                                    </div>

                                    <div className="">
                                      <WhatsappShareButton
                                        url={shareUrl}
                                        title={title}
                                        separator=" :: "
                                        className=""
                                      >
                                        <WhatsappIcon size={50} round />
                                      </WhatsappShareButton>
                                    </div>

                                    <div className="">
                                      <LinkedinShareButton
                                        url={shareUrl}
                                        className=""
                                      >
                                        <LinkedinIcon size={50} round />
                                      </LinkedinShareButton>
                                    </div>
                                  </div>
                                </div>
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
      ) : (
        <>
          <div className="flex w-screen h-screen justify-center items-center">
            <img src={loaderGif.src} alt="Loader" className="mt-[-5%]" />
          </div>
        </>
      )}
    </>
  );
};

export default EventDetails;
