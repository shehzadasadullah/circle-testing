import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import EventCard from "../SmallComps/EventCard";
import { RandomNdigitnumber } from "@/utils/function";
import Geocode from "react-geocode";
import {
  Timestamp,
  collection,
  getDocs,
  query,
  where,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/firebase";
import geolib from "geolib";
import { useRouter } from "next/router";
import Loading from "../Loading";
import moment from "moment/moment";
import { LocationMarkerIcon, SearchIcon } from "@heroicons/react/outline";
import axios from "axios";
import LocationIcon from "@/icons/LocationIcon";
import { RotatingLines } from "react-loader-spinner";
import bgImage from "../../public/revamp/bg-sec3.png";
// import AOS from "aos";
// import "aos/dist/aos.css";
// import "intersection-observer";

const EventTabs = () => {
  const [activeTab, setActiveTab] = useState(1);
  const router = useRouter();
  const handleTabClick = (tabNumber) => {
    setActiveTab(tabNumber);
  };

  // const eventsRef = useRef(null);

  // useEffect(() => {
  //   const options = {
  //     root: null, // Use the viewport as the root
  //     rootMargin: "0px", // No margin around the root
  //     threshold: 0.2, // Trigger when 20% of the component is visible
  //   };

  //   const observer = new IntersectionObserver(handleIntersection, options);

  //   if (eventsRef.current) {
  //     observer.observe(eventsRef.current);
  //   }

  //   // Cleanup the observer on component unmount
  //   return () => {
  //     observer.disconnect();
  //   };
  // }, []);

  // const handleIntersection = (entries) => {
  //   entries.forEach((entry) => {
  //     if (entry.isIntersecting) {
  //       // The component is in focus
  //       AOS.init({
  //         duration: 800,
  //         once: true,
  //       });
  //       AOS.refresh(); // Refresh AOS to apply animations immediately
  //     }
  //   });
  // };

  // All Events
  const [EventsData, setEventsData] = useState([]);
  const [allEventsLimit, setAllEventsLimit] = useState(8);
  const [allEventsLoader, setAllEventsLoader] = useState(true);

  const getEventsData = async (limitNum) => {
    setAllEventsLoader(true);
    // reference to the events collection
    const eventsCollectionRef = collection(db, "events");
    //current time stamp
    let curtimestamp = Timestamp.now();
    //compound query - any event which start from now in future
    const q = query(
      eventsCollectionRef,
      where("timefrom", ">=", curtimestamp),
      limit(limitNum)
    );
    //reading the live data from firestore
    return onSnapshot(q, (querySnapshot) => {
      const Docs = [];
      querySnapshot.forEach((doc) => {
        Docs.push({ ...doc.data(), eventsDocId: doc?.id });
      });
      setEventsData(Docs || []);
      setAllEventsLoader(false);
    });
  };

  // Other Events Data
  const [otherEventsData, setOtherEventsData] = useState([]);
  const [otherEventsLimit, setOtherEventsLimit] = useState(8);
  const [otherEventsLoader, setOtherEventsLoader] = useState(false);

  const getOtherEventsData = async (limitNum) => {
    setOtherEventsLoader(true);
    // reference to the events collection
    const eventsCollectionRef = collection(db, "dev_events");
    //current time stamp
    let curtimestamp = Timestamp.now();
    console.log("CURRENT TIMESTAMP: ", curtimestamp);
    //compound query - any event which start from now in future
    const q = query(
      eventsCollectionRef,
      where("timefrom", ">=", curtimestamp),
      limit(limitNum)
    );
    //reading the live data from firestore
    return onSnapshot(q, (querySnapshot) => {
      const Docs = [];
      querySnapshot.forEach((doc) => {
        Docs.push({ ...doc.data(), eventsDocId: doc?.id });
      });
      console.log("OTHER EVENTS: ", Docs);
      setOtherEventsData(Docs || []);
      setOtherEventsLoader(false);
    });
  };

  // Events Near Me
  const [eventsNearMe, setEventsNearMe] = useState([]);
  const [allEventsNearMe, setAllEventsNearMe] = useState([]);
  const [eventsNearMeLimit, setEventsNearMeLimit] = useState(9999);
  const [eventsNearMeLoader, setEventsNearMeLoader] = useState(true);
  const [deviceLocation, setDeviceLocation] = useState(null);
  const [userLocation, setUserLocation] = useState({});

  useEffect(() => {
    if (deviceLocation !== null) {
      setUserLocation({
        latitude: deviceLocation[0],
        longitude: deviceLocation[1],
      });
    }
  }, [deviceLocation]);

  // Function to calculate distance between two coordinates using Haversine formula
  function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  }

  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  //function to get events Data from firestore
  const getEventsNearMeData = async (limitNum) => {
    setEventsNearMeLoader(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const array = [latitude, longitude]; // Define and populate array here
          console.log("Array", array); // Move the console.log here

          // Proceed with the logic that relies on array
          const eventsCollectionRef = collection(db, "events");
          const curtimestamp = Timestamp.now();
          const q = query(
            eventsCollectionRef,
            where("timefrom", ">=", curtimestamp),
            limit(limitNum)
          );

          onSnapshot(q, async (querySnapshot) => {
            const Docs = [];
            querySnapshot.forEach((doc) => {
              Docs.push({ ...doc.data(), eventsDocId: doc?.id });
            });

            const nearMeEvents = await Promise.all(
              Docs.map(async (item) => {
                if (item?.Coords) {
                  const distance = getDistanceFromLatLonInKm(
                    array[0],
                    array[1],
                    item?.Coords._lat,
                    item?.Coords._long
                  );
                  return distance >= 0 && distance <= 10 ? item : null;
                } else {
                  return null;
                }
              })
            );

            // Filter out null values (events that are not near the user)
            const filteredNearMeEvents = nearMeEvents.filter(
              (item) => item !== null
            );
            setAllEventsNearMe(Docs || []);
            setEventsNearMe(filteredNearMeEvents);
            setEventsNearMeLoader(false);
          });
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  // Paid Events - Premium
  const [paidEvents, setPaidEvents] = useState([]);
  const [paidEventsLimit, setPaidEventsLimit] = useState(9999);
  const [paidEventsLoader, setPaidEventsLoader] = useState(false);

  const getPaidEventsData = async (limitNum) => {
    setPaidEventsLoader(true);
    // Reference to the events collection
    const eventsCollectionRef = collection(db, "events");
    // Current timestamp
    let curtimestamp = Timestamp.now();

    // Query for paid events where ticketPrice > 0.00
    const q1 = query(
      eventsCollectionRef,
      where("ticketPrice", ">", "0.00"),
      limit(limitNum)
    );

    // Query for events where timefrom > current timestamp
    const q2 = query(
      eventsCollectionRef,
      where("timefrom", ">=", curtimestamp, limit(limitNum))
    );

    // Execute both queries concurrently using Promise.all
    const [querySnapshot1, querySnapshot2] = await Promise.all([
      getDocs(q1),
      getDocs(q2),
    ]);

    // Combine the results from both queries
    const Docs = [];

    querySnapshot1.forEach((doc1) => {
      querySnapshot2.forEach((doc2) => {
        if (doc1.id === doc2.id) {
          Docs.push({ ...doc1.data(), eventsDocId: doc1.id });
        }
      });
    });
    setPaidEvents(Docs || []);
    setPaidEventsLoader(false);
  };

  // Free Events
  const [freeEvents, setFreeEvents] = useState([]);
  const [freeEventsLimit, setFreeEventsLimit] = useState(9999);
  const [freeEventsLoader, setFreeEventsLoader] = useState(false);

  const getFreeEventsData = async (limitNum) => {
    setFreeEventsLoader(true);
    // Reference to the events collection
    const eventsCollectionRef = collection(db, "events");
    // Current timestamp
    let curtimestamp = Timestamp.now();

    // Query for paid events where ticketPrice > 0.00
    const q1 = query(eventsCollectionRef, where("ticketPrice", "==", "0.00"));

    // Query for events where timefrom > current timestamp
    const q2 = query(
      eventsCollectionRef,
      where("timefrom", ">=", curtimestamp),
      limit(limitNum)
    );

    // Execute both queries concurrently using Promise.all
    const [querySnapshot1, querySnapshot2] = await Promise.all([
      getDocs(q1),
      getDocs(q2),
    ]);

    // Combine the results from both queries
    const Docs = [];

    querySnapshot1.forEach((doc1) => {
      querySnapshot2.forEach((doc2) => {
        if (doc1.id === doc2.id) {
          Docs.push({ ...doc1.data(), eventsDocId: doc1.id });
        }
      });
    });
    setFreeEvents(Docs || []);
    setFreeEventsLoader(false);
  };

  // Today Tomorrow
  const [todayEvents, setTodayEvents] = useState([]);
  const [tomEvents, setTomEvents] = useState([]);
  const [TTLimit, setTTLimit] = useState(8);
  const [TTEventsLoader, setTTEventsLoader] = useState(false);

  const getExtraEventsData = async (limitNum) => {
    setTTEventsLoader(true);
    // reference to the events collection
    const eventsCollectionRef = collection(db, "events");
    //current time stamp
    let curtimestamp = Timestamp.now();
    //compound query - any event which start from now in future
    const q = query(
      eventsCollectionRef,
      where("timefrom", ">=", curtimestamp),
      limit(limitNum)
    );
    //reading the live data from firestore
    return onSnapshot(q, (querySnapshot) => {
      const Docs = [];
      querySnapshot.forEach((doc) => {
        Docs.push({ ...doc.data(), eventsDocId: doc?.id });
      });

      // Today Events Filter
      const filterEventsForToday = () => {
        const filtered = (Docs || []).filter((item) => {
          const eventTimeFrom = moment(item?.timefrom?.seconds * 1000);
          return moment().isSame(eventTimeFrom, "day");
        });
        // console.log("Today Events: ", filtered);
        setTodayEvents(filtered);
      };

      // Tomorrow Events Filter
      const filterEventsForTomorrow = () => {
        const filtered = (Docs || []).filter((item) => {
          const eventTimeFrom = moment(item?.timefrom?.seconds * 1000);
          return moment().add(1, "day").isSame(eventTimeFrom, "day");
        });
        // console.log("Tomorrow Events: ", filtered);
        setTomEvents(filtered);
      };

      filterEventsForToday();
      filterEventsForTomorrow();
      setTTEventsLoader(false);
    });
  };

  // By Location Search
  const [bySearchEvents, setBySearchEvents] = useState([]);
  const [bsLimit, setBSimit] = useState(8);
  const [bsEventsLoader, setBSEventsLoader] = useState(false);
  const bsEventsFound = [];
  const [bsEventsFoundState, setBsEventsFoundState] = useState();
  const [locationInput, setLocationInput] = useState("");

  const getBSEventsData = async (limitNum, locationQuery) => {
    setBSEventsLoader(true);
    // reference to the events collection
    const eventsCollectionRef = collection(db, "events");
    //current time stamp
    let curtimestamp = Timestamp.now();
    //compound query - any event which start from now in future
    const q = query(
      eventsCollectionRef,
      where("timefrom", ">=", curtimestamp),
      limit(limitNum)
    );
    //reading the live data from firestore
    return onSnapshot(q, (querySnapshot) => {
      const Docs = [];
      querySnapshot.forEach((doc) => {
        Docs.push({ ...doc.data(), eventsDocId: doc?.id });
      });

      const filterEventsByLocation = () => {
        if (locationQuery !== "") {
          const filtered = (Docs || []).filter((item) =>
            item?.location?.toLowerCase().includes(locationQuery.toLowerCase())
          );
          if (filtered.length > 0) {
            setBySearchEvents(filtered);
            bsEventsFound.push({
              bool: true,
              message: "Events Found!",
            });
            setBsEventsFoundState(bsEventsFound);
            // console.log(bsEventsFound[0].message, filtered);
          } else {
            setBySearchEvents(Docs);
            bsEventsFound.push({
              bool: false,
              message: "No Events Found!",
            });
            setBsEventsFoundState(bsEventsFound);
            // console.log(bsEventsFound[0].message, Docs);
          }
        } else {
          // If the search query is empty, reset the filtered events to the original data
          setBySearchEvents(Docs);
          bsEventsFound.push({
            bool: false,
            message: "Search Your Desired Event By Location Search!",
          });
          setBsEventsFoundState(bsEventsFound);
          // console.log(bsEventsFound[0].message, Docs);
        }
      };

      filterEventsByLocation();
      setBSEventsLoader(false);
    });
  };

  // Get Location Data
  const [locationData, setLocationData] = useState([]);
  // const getLocationData = async () => {
  //   try {
  //     if (navigator.geolocation) {
  //       navigator.geolocation.getCurrentPosition(
  //         async (position) => {
  //           const { latitude, longitude } = position.coords;
  //           console.log("USER LAT LONG: ", latitude, longitude);
  //           setDeviceLocation([latitude, longitude]);

  //           // Reverse geocoding
  //           const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;
  //           const response = await fetch(nominatimUrl);
  //           const data = await response.json();

  //           const { address } = data;
  //           const location = {
  //             city: address.city || "",
  //             town: address.town || "",
  //             village: address.village || "",
  //             country: address.country || "",
  //             state: address.state || "",
  //           };
  //           setLocationData(location);
  //           console.log("USER LOCATION: ", location);
  //         },
  //         (error) => {
  //           console.error("Error while fetching user location:", error);
  //         }
  //       );
  //     } else {
  //       console.error("Geolocation is not supported by this browser.");
  //     }
  //   } catch (error) {
  //     console.log("Error retrieving device location:", error);
  //     // Provide feedback to the user about the error
  //   }
  // };

  // UseEffect to call functions
  const [hasLocationEffectRun, setHasLocationEffectRun] = useState(false);

  useEffect(() => {
    // getLocationData();
    getEventsData(allEventsLimit);
    getEventsNearMeData(eventsNearMeLimit);
    getPaidEventsData(paidEventsLimit);
    getFreeEventsData(freeEventsLimit);
    getExtraEventsData(TTLimit);
  }, []);

  useEffect(() => {
    getBSEventsData(bsLimit, locationInput);
  }, [locationInput]);

  return (
    <div
      // ref={eventsRef}
      // data-aos="fade-up"
      // data-aos-delay="50"
      // data-aos-duration="4000"
      // data-aos-easing="ease-in-out"
      // data-aos-mirror="false"
      // data-aos-once="true"
      style={{
        backgroundImage: `url(${bgImage.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      className="flex flex-col items-center w-full h-auto justify-center"
    >
      <h3 className="font48 text-[#fff] font-semibold mt-20 text-center font-Montserrat">
        Events related to{" "}
        <span
          style={{
            background: "linear-gradient(269deg, #FFF -1.77%, #9E22FF 37.99%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          your interests
        </span>
      </h3>
      <div className="flex mt-10 flex-wrap lg:flex-row justify-center items-center w-full h-auto gap-2 lg:gap-4 overflow-auto">
        <button
          style={{
            background:
              activeTab === 1
                ? "linear-gradient(94deg, rgba(42, 28, 61, 0.60) 0.01%, rgba(144, 33, 255, 0.47) 103.3%)"
                : "#14112E",
            border: activeTab === 1 ? "1px solid rgba(64, 17, 124, 0.45)" : "",
          }}
          className={`${
            activeTab === 1 ? "text-white" : "text-[#8392AF]"
          } px-5 py-2 rounded-full`}
          onClick={() => {
            handleTabClick(1);
            getEventsData(allEventsLimit);
          }}
        >
          Upcoming
        </button>
        <button
          style={{
            background:
              activeTab === 2
                ? "linear-gradient(94deg, rgba(42, 28, 61, 0.60) 0.01%, rgba(144, 33, 255, 0.47) 103.3%)"
                : "#14112E",
            border: activeTab === 2 ? "1px solid rgba(64, 17, 124, 0.45)" : "",
          }}
          className={`${
            activeTab === 2 ? "text-white" : "text-[#8392AF]"
          } px-5 py-2 rounded-full`}
          onClick={() => {
            handleTabClick(2);
            getEventsNearMeData(eventsNearMeLimit);
          }}
        >
          Near Me
        </button>
        <button
          style={{
            background:
              activeTab === 3
                ? "linear-gradient(94deg, rgba(42, 28, 61, 0.60) 0.01%, rgba(144, 33, 255, 0.47) 103.3%)"
                : "#14112E",
            border: activeTab === 3 ? "1px solid rgba(64, 17, 124, 0.45)" : "",
          }}
          className={`${
            activeTab === 3 ? "text-white" : "text-[#8392AF]"
          } px-5 py-2 rounded-full`}
          onClick={() => {
            handleTabClick(3);
            getFreeEventsData(freeEventsLimit);
          }}
        >
          Free
        </button>
        <button
          style={{
            background:
              activeTab === 4
                ? "linear-gradient(94deg, rgba(42, 28, 61, 0.60) 0.01%, rgba(144, 33, 255, 0.47) 103.3%)"
                : "#14112E",
            border: activeTab === 4 ? "1px solid rgba(64, 17, 124, 0.45)" : "",
          }}
          className={`${
            activeTab === 4 ? "text-white" : "text-[#8392AF]"
          } px-5 py-2 rounded-full`}
          onClick={() => {
            handleTabClick(4);
            getPaidEventsData(paidEventsLimit);
          }}
        >
          Paid
        </button>
        <button
          style={{
            background:
              activeTab === 5
                ? "linear-gradient(94deg, rgba(42, 28, 61, 0.60) 0.01%, rgba(144, 33, 255, 0.47) 103.3%)"
                : "#14112E",
            border: activeTab === 5 ? "1px solid rgba(64, 17, 124, 0.45)" : "",
          }}
          className={`${
            activeTab === 5 ? "text-white" : "text-[#8392AF]"
          } px-5 py-2 rounded-full`}
          onClick={() => {
            handleTabClick(5);
            getExtraEventsData(TTLimit);
          }}
        >
          Today
        </button>
        <button
          style={{
            background:
              activeTab === 6
                ? "linear-gradient(94deg, rgba(42, 28, 61, 0.60) 0.01%, rgba(144, 33, 255, 0.47) 103.3%)"
                : "#14112E",
            border: activeTab === 6 ? "1px solid rgba(64, 17, 124, 0.45)" : "",
          }}
          className={`${
            activeTab === 6 ? "text-white" : "text-[#8392AF]"
          } px-5 py-2 rounded-full`}
          onClick={() => {
            handleTabClick(6);
            getExtraEventsData(TTLimit);
          }}
        >
          Tomorrow
        </button>
        <button
          style={{
            background:
              activeTab === 7
                ? "linear-gradient(94deg, rgba(42, 28, 61, 0.60) 0.01%, rgba(144, 33, 255, 0.47) 103.3%)"
                : "#14112E",
            border: activeTab === 7 ? "1px solid rgba(64, 17, 124, 0.45)" : "",
          }}
          className={`${
            activeTab === 7 ? "text-white" : "text-[#8392AF]"
          } px-5 py-2 rounded-full`}
          onClick={() => {
            handleTabClick(7);
            getBSEventsData(bsLimit, "");
          }}
        >
          By Location
        </button>
        <button
          style={{
            background:
              activeTab === 8
                ? "linear-gradient(94deg, rgba(42, 28, 61, 0.60) 0.01%, rgba(144, 33, 255, 0.47) 103.3%)"
                : "#14112E",
            border: activeTab === 8 ? "1px solid rgba(64, 17, 124, 0.45)" : "",
          }}
          className={`${
            activeTab === 8 ? "text-white" : "text-[#8392AF]"
          } px-5 py-2 rounded-full`}
          onClick={() => {
            handleTabClick(8);
            getOtherEventsData(otherEventsLimit);
          }}
        >
          Other Platform Events
        </button>
      </div>
      <div className="mt-10 mb-10 p-5 flex justify-center items-center h-auto w-full">
        {activeTab === 1 && (
          <div className="flex justify-center items-center flex-col w-full">
            <div className={`w-full flex justify-center items-center flex-col`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:lg:grid-cols-5 gap-6 lg:flex-row">
                {EventsData.length > 0 &&
                  EventsData.map((item, id) => (
                    <div
                      key={RandomNdigitnumber(10)}
                      onClick={() => {
                        router.push(`/events/${item?.eventsDocId}`);
                      }}
                    >
                      <EventCard
                        image={item.large_image || ""}
                        title={item.name || ""}
                        time={item.timefrom}
                        description={item.description || ""}
                        attend={item.attendees?.length || 0}
                        price={item.ticketPrice || 0}
                        id={item?.eventsDocId || ""}
                        location={item?.location || ""}
                      />
                    </div>
                  ))}
              </div>
              {allEventsLoader && (
                <div className="flex justify-center items-center mt-10">
                  <RotatingLines
                    strokeColor="#007BAB"
                    strokeWidth="5"
                    animationDuration="0.75"
                    width="40"
                    visible={true}
                  />
                </div>
              )}
              {EventsData.length <= 0 && !allEventsLoader && (
                <div className="flex justify-center items-center mt-10 text-white">
                  No Events Found!
                </div>
              )}
            </div>
            {EventsData.length > 0 &&
              !allEventsLoader &&
              EventsData.length >= allEventsLimit && (
                <button
                  onClick={() => {
                    setAllEventsLimit(allEventsLimit + 8);
                    getEventsData(allEventsLimit + 8);
                  }}
                  disabled={allEventsLoader && true}
                  style={{
                    border: "1px solid rgba(255, 255, 255, 0.20)",
                    background:
                      "linear-gradient(90deg, #4532BF 5.81%, #9429FF 100%)",
                    boxShadow: "0px 4px 50px 0px rgba(69, 50, 191, 0.50)",
                  }}
                  className={`px-10 mt-12 font14 font-medium rounded-full py-3 font-Montserrat text-[#fff]`}
                >
                  Show More
                </button>
              )}
          </div>
        )}
        {activeTab === 2 && (
          <div className="flex justify-center items-center flex-col w-full">
            <div className={`w-full flex justify-center items-center flex-col`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:lg:grid-cols-5 gap-6 lg:flex-row">
                {eventsNearMe.length > 0 &&
                  eventsNearMe.map((item, id) => (
                    <div
                      key={RandomNdigitnumber(10)}
                      onClick={() => {
                        router.push(`/events/${item?.eventsDocId}`);
                      }}
                    >
                      <EventCard
                        image={item.large_image || ""}
                        title={item.name || ""}
                        time={item.timefrom}
                        description={item.description || ""}
                        attend={item.attendees?.length || 0}
                        price={item.ticketPrice || 0}
                        id={item?.eventsDocId || ""}
                        location={item?.location || ""}
                      />
                    </div>
                  ))}
              </div>
              {eventsNearMeLoader && (
                <div className="flex justify-center items-center mt-10">
                  <RotatingLines
                    strokeColor="#007BAB"
                    strokeWidth="5"
                    animationDuration="0.75"
                    width="40"
                    visible={true}
                  />
                </div>
              )}
              {eventsNearMe.length <= 0 && !eventsNearMeLoader && (
                <div className="flex justify-center items-center mt-10 text-white">
                  No Events Found!
                </div>
              )}
            </div>
            {allEventsNearMe.length > 0 &&
              !eventsNearMeLoader &&
              allEventsNearMe.length >= eventsNearMeLimit && (
                <button
                  onClick={() => {
                    setEventsNearMeLimit(eventsNearMeLimit + 8);
                    getEventsNearMeData(eventsNearMeLimit + 8);
                  }}
                  disabled={eventsNearMeLoader && true}
                  style={{
                    border: "1px solid rgba(255, 255, 255, 0.20)",
                    background:
                      "linear-gradient(90deg, #4532BF 5.81%, #9429FF 100%)",
                    boxShadow: "0px 4px 50px 0px rgba(69, 50, 191, 0.50)",
                  }}
                  className={`px-10 mt-12 font14 font-medium rounded-full py-3 font-Montserrat text-[#fff]`}
                >
                  Show More
                </button>
              )}
          </div>
        )}
        {activeTab === 3 && (
          <div className="flex justify-center items-center flex-col w-full">
            <div className={`w-full flex justify-center items-center flex-col`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:lg:grid-cols-5 gap-6 lg:flex-row">
                {freeEvents.length > 0 &&
                  freeEvents.map((item, id) => (
                    <div
                      key={RandomNdigitnumber(10)}
                      onClick={() => {
                        router.push(`/events/${item?.eventsDocId}`);
                      }}
                    >
                      <EventCard
                        image={item.large_image || ""}
                        title={item.name || ""}
                        time={item.timefrom}
                        description={item.description || ""}
                        attend={item.attendees?.length || 0}
                        price={item.ticketPrice || 0}
                        id={item?.eventsDocId || ""}
                        location={item?.location || ""}
                      />
                    </div>
                  ))}
              </div>
              {freeEventsLoader && (
                <div className="flex justify-center items-center mt-10">
                  <RotatingLines
                    strokeColor="#007BAB"
                    strokeWidth="5"
                    animationDuration="0.75"
                    width="40"
                    visible={true}
                  />
                </div>
              )}
              {freeEvents.length <= 0 && !freeEventsLoader && (
                <div className="flex justify-center items-center mt-10 text-white">
                  No Events Found!
                </div>
              )}
            </div>
            {freeEvents.length > 0 &&
              !freeEventsLoader &&
              freeEvents.length >= freeEventsLimit && (
                <button
                  onClick={() => {
                    setFreeEventsLimit(freeEventsLimit + 8);
                    getFreeEventsData(freeEventsLimit + 8);
                  }}
                  disabled={freeEventsLoader && true}
                  style={{
                    border: "1px solid rgba(255, 255, 255, 0.20)",
                    background:
                      "linear-gradient(90deg, #4532BF 5.81%, #9429FF 100%)",
                    boxShadow: "0px 4px 50px 0px rgba(69, 50, 191, 0.50)",
                  }}
                  className={`px-10 mt-12 font14 font-medium rounded-full py-3 font-Montserrat text-[#fff]`}
                >
                  Show More
                </button>
              )}
          </div>
        )}
        {activeTab === 4 && (
          <div className="flex justify-center items-center flex-col w-full">
            <div className={`w-full flex justify-center items-center flex-col`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:lg:grid-cols-5 gap-6 lg:flex-row">
                {paidEvents.length > 0 &&
                  paidEvents.map((item, id) => (
                    <div
                      key={RandomNdigitnumber(10)}
                      onClick={() => {
                        router.push(`/events/${item?.eventsDocId}`);
                      }}
                    >
                      <EventCard
                        image={item.large_image || ""}
                        title={item.name || ""}
                        time={item.timefrom}
                        description={item.description || ""}
                        attend={item.attendees?.length || 0}
                        price={item.ticketPrice || 0}
                        id={item?.eventsDocId || ""}
                        location={item?.location || ""}
                      />
                    </div>
                  ))}
              </div>
              {paidEventsLoader && (
                <div className="flex justify-center items-center mt-10">
                  <RotatingLines
                    strokeColor="#007BAB"
                    strokeWidth="5"
                    animationDuration="0.75"
                    width="40"
                    visible={true}
                  />
                </div>
              )}
              {paidEvents.length <= 0 && !paidEventsLoader && (
                <div className="flex justify-center items-center mt-10 text-white">
                  No Events Found!
                </div>
              )}
            </div>
            {paidEvents.length > 0 &&
              !paidEventsLoader &&
              paidEvents.length >= paidEventsLimit && (
                <button
                  onClick={() => {
                    setPaidEventsLimit(paidEventsLimit + 8);
                    getPaidEventsData(paidEventsLimit + 8);
                  }}
                  disabled={paidEventsLoader && true}
                  style={{
                    border: "1px solid rgba(255, 255, 255, 0.20)",
                    background:
                      "linear-gradient(90deg, #4532BF 5.81%, #9429FF 100%)",
                    boxShadow: "0px 4px 50px 0px rgba(69, 50, 191, 0.50)",
                  }}
                  className={`px-10 mt-12 font14 font-medium rounded-full py-3 font-Montserrat text-[#fff]`}
                >
                  Show More
                </button>
              )}
          </div>
        )}
        {activeTab === 5 && (
          <div className="flex justify-center items-center flex-col w-full">
            <div className={`w-full flex justify-center items-center flex-col`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:lg:grid-cols-5 gap-6 lg:flex-row">
                {todayEvents.length > 0 &&
                  todayEvents.map((item, id) => (
                    <div
                      key={RandomNdigitnumber(10)}
                      onClick={() => {
                        router.push(`/events/${item?.eventsDocId}`);
                      }}
                    >
                      <EventCard
                        image={item.large_image || ""}
                        title={item.name || ""}
                        time={item.timefrom}
                        description={item.description || ""}
                        attend={item.attendees?.length || 0}
                        price={item.ticketPrice || 0}
                        id={item?.eventsDocId || ""}
                        location={item?.location || ""}
                      />
                    </div>
                  ))}
              </div>
              {TTEventsLoader && (
                <div className="flex justify-center items-center mt-10">
                  <RotatingLines
                    strokeColor="#007BAB"
                    strokeWidth="5"
                    animationDuration="0.75"
                    width="40"
                    visible={true}
                  />
                </div>
              )}
              {todayEvents.length <= 0 && !TTEventsLoader && (
                <div className="flex justify-center items-center mt-10 text-white">
                  No Events Found!
                </div>
              )}
            </div>
            {todayEvents.length > 0 &&
              !TTEventsLoader &&
              todayEvents.length >= TTLimit && (
                <button
                  onClick={() => {
                    setTTLimit(TTLimit + 8);
                    getExtraEventsData(TTLimit + 8);
                  }}
                  disabled={TTEventsLoader && true}
                  style={{
                    border: "1px solid rgba(255, 255, 255, 0.20)",
                    background:
                      "linear-gradient(90deg, #4532BF 5.81%, #9429FF 100%)",
                    boxShadow: "0px 4px 50px 0px rgba(69, 50, 191, 0.50)",
                  }}
                  className={`px-10 mt-12 font14 font-medium rounded-full py-3 font-Montserrat text-[#fff]`}
                >
                  Show More
                </button>
              )}
          </div>
        )}
        {activeTab === 6 && (
          <div className="flex justify-center items-center flex-col w-full">
            <div className={`w-full flex justify-center items-center flex-col`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:lg:grid-cols-5 gap-6 lg:flex-row">
                {tomEvents.length > 0 &&
                  tomEvents.map((item, id) => (
                    <div
                      key={RandomNdigitnumber(10)}
                      onClick={() => {
                        router.push(`/events/${item?.eventsDocId}`);
                      }}
                    >
                      <EventCard
                        image={item.large_image || ""}
                        title={item.name || ""}
                        time={item.timefrom}
                        description={item.description || ""}
                        attend={item.attendees?.length || 0}
                        price={item.ticketPrice || 0}
                        id={item?.eventsDocId || ""}
                        location={item?.location || ""}
                      />
                    </div>
                  ))}
              </div>
              {TTEventsLoader && (
                <div className="flex justify-center items-center mt-10">
                  <RotatingLines
                    strokeColor="#007BAB"
                    strokeWidth="5"
                    animationDuration="0.75"
                    width="40"
                    visible={true}
                  />
                </div>
              )}
              {tomEvents.length <= 0 && !TTEventsLoader && (
                <div className="flex justify-center items-center mt-10 text-white">
                  No Events Found!
                </div>
              )}
            </div>
            {tomEvents.length > 0 &&
              !TTEventsLoader &&
              tomEvents.length >= TTLimit && (
                <button
                  onClick={() => {
                    setTTLimit(TTLimit + 8);
                    getExtraEventsData(TTLimit + 8);
                  }}
                  disabled={TTEventsLoader && true}
                  style={{
                    border: "1px solid rgba(255, 255, 255, 0.20)",
                    background:
                      "linear-gradient(90deg, #4532BF 5.81%, #9429FF 100%)",
                    boxShadow: "0px 4px 50px 0px rgba(69, 50, 191, 0.50)",
                  }}
                  className={`px-10 mt-12 font14 font-medium rounded-full py-3 font-Montserrat text-[#fff]`}
                >
                  Show More
                </button>
              )}
          </div>
        )}
        {activeTab === 7 && (
          <div className="flex justify-center items-center flex-col w-full">
            <h3 className="text-lg font-semibold font-Montserrat text-center text-white">
              Search Your Desired Events By Location Search!
            </h3>
            <div className="w-[80%] lg:w-[40%] mt-5">
              <div className="relative w-full">
                <div className="absolute w-full inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-[#8392AF]"
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
                  style={{
                    border: "0.5px solid rgba(255, 255, 255, 0.10)",
                    background: "rgba(28, 34, 44, 0.60)",
                  }}
                  className="block w-full p-4 pl-10 border-2 text-[#fff] focus:border-[#007BAB] text-sm rounded-lg focus:outline-none"
                  placeholder="Search Events, By Location..."
                  value={locationInput}
                  onChange={(e) => {
                    setLocationInput(e.target.value);
                  }}
                />
              </div>
            </div>

            {bsEventsFoundState.length > 0 &&
              bsEventsFoundState[0].message ===
                "Search Your Desired Event By Location Search!" && (
                <>
                  <div
                    className={`w-full mt-10 flex justify-center items-center flex-col`}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:lg:grid-cols-5 gap-6 lg:flex-row">
                      {bySearchEvents.length > 0 &&
                        bySearchEvents.map((item, id) => (
                          <div
                            key={RandomNdigitnumber(10)}
                            onClick={() => {
                              router.push(`/events/${item?.eventsDocId}`);
                            }}
                          >
                            <EventCard
                              image={item.large_image || ""}
                              title={item.name || ""}
                              time={item.timefrom}
                              description={item.description || ""}
                              attend={item.attendees?.length || 0}
                              price={item.ticketPrice || 0}
                              id={item?.eventsDocId || ""}
                              location={item?.location || ""}
                            />
                          </div>
                        ))}
                    </div>
                    {bsEventsLoader && (
                      <div className="flex justify-center items-center mt-10">
                        <RotatingLines
                          strokeColor="#007BAB"
                          strokeWidth="5"
                          animationDuration="0.75"
                          width="40"
                          visible={true}
                        />
                      </div>
                    )}
                    {bySearchEvents.length <= 0 && !bsEventsLoader && (
                      <div className="flex justify-center items-center mt-10 text-white">
                        No Events Found!
                      </div>
                    )}
                  </div>
                  {bySearchEvents.length > 0 &&
                    !bsEventsLoader &&
                    bySearchEvents.length >= bsLimit && (
                      <button
                        onClick={() => {
                          setBSimit(bsLimit + 8);
                          getBSEventsData(bsLimit + 8, locationInput);
                        }}
                        disabled={bsEventsLoader && true}
                        style={{
                          border: "1px solid rgba(255, 255, 255, 0.20)",
                          background:
                            "linear-gradient(90deg, #4532BF 5.81%, #9429FF 100%)",
                          boxShadow: "0px 4px 50px 0px rgba(69, 50, 191, 0.50)",
                        }}
                        className={`px-10 mt-12 font14 font-medium rounded-full py-3 font-Montserrat text-[#fff]`}
                      >
                        Show More
                      </button>
                    )}
                </>
              )}

            {bsEventsFoundState.length > 0 &&
              bsEventsFoundState[0].message === "No Events Found!" && (
                <>
                  <div
                    className={`w-full mt-10 flex justify-center items-center flex-col`}
                  >
                    <h3 className="text-sm font-semibold font-Montserrat text-white">
                      No Events Found!
                    </h3>
                    {/* <div className="grid mt-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:lg:grid-cols-5 gap-6 lg:flex-row">
                      {bySearchEvents.length > 0 &&
                        bySearchEvents.map((item, id) => (
                          <div
                            key={RandomNdigitnumber(10)}
                            onClick={() => {
                              router.push(`/events/${item?.eventsDocId}`);
                            }}
                          >
                            <EventCard
                              image={item.large_image || ""}
                              title={item.name || ""}
                              time={item.timefrom}
                              description={item.description || ""}
                              attend={item.attendees?.length || 0}
                              price={item.ticketPrice || 0}
                              id={item?.eventsDocId || ""}
                              location={item?.location || ""}
                            />
                          </div>
                        ))}
                    </div>
                    {bsEventsLoader && (
                      <div className="flex justify-center items-center mt-10">
                        <RotatingLines
                          strokeColor="#007BAB"
                          strokeWidth="5"
                          animationDuration="0.75"
                          width="40"
                          visible={true}
                        />
                      </div>
                    )}
                    {bySearchEvents.length <= 0 && !bsEventsLoader && (
                      <div className="flex justify-center items-center mt-10">
                        No Events Found!
                      </div>
                    )} */}
                  </div>
                  {/* {bySearchEvents.length > 0 &&
                    !bsEventsLoader &&
                    bySearchEvents.length >= bsLimit && (
                      <button
                        onClick={() => {
                          setBSimit(bsLimit + 8);
                          getBSEventsData(bsLimit + 8, locationInput);
                        }}
                        disabled={bsEventsLoader && true}
                        className={`px-10 mt-12 font14 font-medium rounded-full py-3 font-Montserrat text-[#fff] hover:text-[#007BAB] border-2 border-[#007BAB] hover:bg-transparent bg-[#007BAB]`}
                      >
                        Show More
                      </button>
                    )} */}
                </>
              )}

            {bsEventsFoundState.length > 0 &&
              bsEventsFoundState[0].message === "Events Found!" && (
                <>
                  <div
                    className={`w-full mt-10 flex justify-center items-center flex-col`}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:lg:grid-cols-5 gap-6 lg:flex-row">
                      {bySearchEvents.length > 0 &&
                        bySearchEvents.map((item, id) => (
                          <div
                            key={RandomNdigitnumber(10)}
                            onClick={() => {
                              router.push(`/events/${item?.eventsDocId}`);
                            }}
                          >
                            <EventCard
                              image={item.large_image || ""}
                              title={item.name || ""}
                              time={item.timefrom}
                              description={item.description || ""}
                              attend={item.attendees?.length || 0}
                              price={item.ticketPrice || 0}
                              id={item?.eventsDocId || ""}
                              location={item?.location || ""}
                            />
                          </div>
                        ))}
                    </div>
                    {bsEventsLoader && (
                      <div className="flex justify-center items-center mt-10">
                        <RotatingLines
                          strokeColor="#007BAB"
                          strokeWidth="5"
                          animationDuration="0.75"
                          width="40"
                          visible={true}
                        />
                      </div>
                    )}
                    {bySearchEvents.length <= 0 && !bsEventsLoader && (
                      <div className="flex justify-center items-center mt-10 text-white">
                        No Events Found!
                      </div>
                    )}
                  </div>
                  {bySearchEvents.length > 0 &&
                    !bsEventsLoader &&
                    bySearchEvents.length >= bsLimit && (
                      <button
                        onClick={() => {
                          setBSimit(bsLimit + 8);
                          getBSEventsData(bsLimit + 8, locationInput);
                        }}
                        disabled={bsEventsLoader && true}
                        style={{
                          border: "1px solid rgba(255, 255, 255, 0.20)",
                          background:
                            "linear-gradient(90deg, #4532BF 5.81%, #9429FF 100%)",
                          boxShadow: "0px 4px 50px 0px rgba(69, 50, 191, 0.50)",
                        }}
                        className={`px-10 mt-12 font14 font-medium rounded-full py-3 font-Montserrat text-[#fff]`}
                      >
                        Show More
                      </button>
                    )}
                </>
              )}
          </div>
        )}
        {activeTab === 8 && (
          <div className="flex justify-center items-center flex-col w-full">
            <div className={`w-full flex justify-center items-center flex-col`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:lg:grid-cols-5 gap-6 lg:flex-row">
                {otherEventsData.length > 0 &&
                  otherEventsData.map((item, id) => (
                    <div
                      key={RandomNdigitnumber(10)}
                      // onClick={() => {
                      //   router.push(`/events/${item?.eventsDocId}`);
                      // }}
                    >
                      <EventCard
                        image={item.large_image || ""}
                        title={item.name || ""}
                        time={item.timefrom}
                        description={item.description || ""}
                        attend={item.attendees?.length || 0}
                        price={item.ticketPrice || item.ticketprice || ""}
                        id={item?.eventsDocId || ""}
                        location={item?.location || ""}
                        type={item.type || ""}
                      />
                    </div>
                  ))}
              </div>
              {otherEventsLoader && (
                <div className="flex justify-center items-center mt-10">
                  <RotatingLines
                    strokeColor="#007BAB"
                    strokeWidth="5"
                    animationDuration="0.75"
                    width="40"
                    visible={true}
                  />
                </div>
              )}
              {otherEventsData.length <= 0 && !otherEventsLoader && (
                <div className="flex justify-center items-center mt-10 text-white">
                  No Events Found!
                </div>
              )}
            </div>
            {otherEventsData.length > 0 &&
              !otherEventsLoader &&
              otherEventsData.length >= otherEventsLimit && (
                <button
                  onClick={() => {
                    setOtherEventsLimit(otherEventsLimit + 8);
                    getOtherEventsData(otherEventsLimit + 8);
                  }}
                  disabled={otherEventsLoader && true}
                  style={{
                    border: "1px solid rgba(255, 255, 255, 0.20)",
                    background:
                      "linear-gradient(90deg, #4532BF 5.81%, #9429FF 100%)",
                    boxShadow: "0px 4px 50px 0px rgba(69, 50, 191, 0.50)",
                  }}
                  className={`px-10 mt-12 font14 font-medium rounded-full py-3 font-Montserrat text-[#fff]`}
                >
                  Show More
                </button>
              )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventTabs;
