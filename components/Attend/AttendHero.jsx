import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import EventCard from "../SmallComps/EventCard";
import { RandomNdigitnumber } from "@/utils/function";
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
const Header = dynamic(() => import("../Common/Header"), { ssr: false });

const AttendHero = () => {
  //state
  const [EventsData, setEventsData] = useState([]);
  const [dropdown, setDropdown] = useState(false);
  const [dropDownSelected, setDropDownSelected] = useState("Location");
  const sortdrop = ["Location", "Date", "Free", "Paid"];
  const router = useRouter();
  const [showToday, setShowToday] = useState(false);
  const [showTomorrow, setShowTomorrow] = useState(false);
  const [showWeekend, setShowWeekend] = useState(false);
  const [showFree, setShowFree] = useState(false);
  const [showPaid, setShowPaid] = useState(false);

  let EventListData = [
    {
      image: "/events/Event_1.png",
      title: "Unreal Film Fest 2023",
      time: 1682619703000,
      description: "Hard Rock Cafe : tech survey park , Texas",
      attend: 12,
      price: 0,
    },
    {
      image: "/events/Event_2.png",
      title: "Unreal Film Fest 2023",
      time: 1682619703000,
      description: "Hard Rock Cafe : tech survey park , Texas",
      attend: 12,
      price: 0,
    },
    {
      image: "/events/Event_3.png",
      title: "Unreal Film Fest 2023",
      time: 1682619703000,
      description: "Hard Rock Cafe : tech survey park , Texas",
      attend: 12,
      price: 0,
    },
    {
      image: "/events/Event_4.png",
      title: "Unreal Film Fest 2023",
      time: 1682619703000,
      description: "Hard Rock Cafe : tech survey park , Texas",
      attend: 12,
      price: 0,
    },
    {
      image: "/events/Event_5.png",
      title: "Unreal Film Fest 2023",
      time: 1682619703000,
      description: "Hard Rock Cafe : tech survey park , Texas",
      attend: 12,
      price: 0,
    },
    {
      image: "/events/Event_6.png",
      title: "Unreal Film Fest 2023",
      time: 1682619703000,
      description: "Hard Rock Cafe : tech survey park , Texas",
      attend: 12,
      price: 0,
    },
    {
      image: "/events/Event_7.png",
      title: "Unreal Film Fest 2023",
      time: 1682619703000,
      description: "Hard Rock Cafe : tech survey park , Texas",
      attend: 12,
      price: 0,
    },
    {
      image: "/events/Event_8.png",
      title: "Unreal Film Fest 2023",
      time: 1682619703000,
      description: "Hard Rock Cafe : tech survey park , Texas",
      attend: 12,
      price: 0,
    },
    {
      image: "/events/Event_1.png",
      title: "Unreal Film Fest 2023",
      time: 1682619703000,
      description: "Hard Rock Cafe : tech survey park , Texas",
      attend: 12,
      price: 0,
    },
    {
      image: "/events/Event_2.png",
      title: "Unreal Film Fest 2023",
      time: 1682619703000,
      description: "Hard Rock Cafe : tech survey park , Texas",
      attend: 12,
      price: 0,
    },
    {
      image: "/events/Event_3.png",
      title: "Unreal Film Fest 2023",
      time: 1682619703000,
      description: "Hard Rock Cafe : tech survey park , Texas",
      attend: 12,
      price: 0,
    },
    {
      image: "/events/Event_4.png",
      title: "Unreal Film Fest 2023",
      time: 1682619703000,
      description: "Hard Rock Cafe : tech survey park , Texas",
      attend: 12,
      price: 0,
    },
  ];
  //function to get events Data from firestore
  const getEventsData = async () => {
    // reference to the events collection
    const eventsCollectionRef = collection(db, "events");
    //current time stamp
    let curtimestamp = Timestamp.now();
    //compound query - any event which start from now in future
    const q = query(
      eventsCollectionRef,
      where("timefrom", ">=", curtimestamp),
      limit(40)
    );
    //reading the live data from firestore
    return onSnapshot(q, (querySnapshot) => {
      const Docs = [];
      querySnapshot.forEach((doc) => {
        Docs.push({ ...doc.data(), eventsDocId: doc?.id });
      });
      setEventsData(Docs || []);
    });
  };

  useEffect(() => {
    getEventsData();
  }, []);

  const [deviceLocation, setDeviceLocation] = useState(null);
  const [events, setEvents] = useState([]);

  const [locationname, setLocationname] = useState([]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setDeviceLocation({ latitude, longitude });

          // Reverse geocoding
          const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;

          axios
            .get(nominatimUrl)
            .then((response) => {
              const { address } = response.data;
              const locationName =
                address.city ||
                address.town ||
                address.village ||
                address.county ||
                address.state ||
                "";
              setLocationname(locationName);
            })
            .catch((error) => {
              console.log("Error retrieving device location:", error);
            });
        },
        (error) => {
          console.log("Error retrieving device location:", error);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, []);

  // Function to check if an event is nearby based on location proximity

  // Function to calculate distance between two coordinates using Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in kilometers
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  };

  // Function to convert degrees to radians
  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  const NearestSundayDate = () => {
    const today = new Date(); // create a new Date object for today's date
    let day = today.getDay(); // current day of the week (0-6)
    const nearestSunday = new Date(today); // create a new Date object with today's date
    nearestSunday.setDate(today.getDate() + (7 - day)); // set the date to the nearest Sunday
    const nearestStaurday = new Date(nearestSunday);
    nearestStaurday.setDate(nearestStaurday.getDate() - 1);

    return [nearestStaurday, nearestSunday];
  };

  const [loading, setLoading] = useState(false);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const weekends = NearestSundayDate();
  const today = moment();
  const tomorrow = moment().add(1, "day");

  const isSameDay = (date1, date2) => {
    const momentDate1 = moment(date1);
    const momentDate2 = moment(date2);
    return momentDate1.isSame(momentDate2, "day");
  };

  const isWeekend = (date) => {
    const dayOfWeek = date.day();
    return dayOfWeek == 0 || dayOfWeek == 6;
  };

  useEffect(() => {
    setLoading(true);
    // Simulating an asynchronous filtering process
    setTimeout(() => {
      const filtered = (EventsData || []).filter((item) => {
        const isPriceMatched =
          (!showFree && !showPaid) ||
          (showFree && (item?.ticketPrice == "0.00" || !item?.ticketPrice)) ||
          (showPaid && item?.ticketPrice > "0.00");

        const eventTimeFrom = moment(item?.timefrom?.seconds * 1000);

        const isDateMatched =
          (!showToday && !showTomorrow && !showWeekend) ||
          (showToday && moment(eventTimeFrom).isSame(moment(), "day")) ||
          (showTomorrow &&
            moment(eventTimeFrom).isSame(
              moment().add(1, "day").startOf("day"),
              "day"
            )) ||
          (showWeekend && moment(eventTimeFrom).day() == 0);

        return isPriceMatched && isDateMatched;
      });

      setFilteredEvents(filtered);
      setLoading(false);
    }, 2000); // Simulated delay of 2 seconds
  }, [showFree, showPaid, showToday, showTomorrow, showWeekend]);

  const filteredResult = filteredEvents;

  const [searchText, setSearchText] = useState("");

  const handleInputChange = (e) => {
    setSearchText(e.target.value);
    onSearch(e.target.value); // Call the onSearch function with the typed text
  };

  return (
    <div className="w-full h-full  flex flex-col justify-start items-start relative bg-[#E9EDF5]">
      <div className="w-full h-full  z-10">
        <Header type="light" page="attend" />
      </div>

      <div className="w-full h-full px-2 sm:px-8 md:px-12 lg:px-16 xl:px-24 py-2 sm:py-4 md:py-6 lg:py-8 xl:py-12 2xl:py-16">
        <h1 className="font28 p-6 font-semibold text-[#14183E] font-Montserrat w-full flex justify-center items-center px-2">
          Events
        </h1>
        <div className="w-full flex items-start justify-between">
          <div>
            <h1 className="font24 font-semibold text-[#14183E] font-Montserrat w-full flex justify-start items-center px-2">
              Filters
            </h1>
          </div>
        </div>
        <div className="w-64 md:w-72 mt-2 mb-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0  flex items-center pointer-events-none">
              <SearchIcon className="w-5 h-5 text-black " />
            </div>
            <input
              placeholder="Search anything"
              className="text-gray-400 bg-transparent text-[16px] font-bold h-10 pl-10 pr-3 text-xs md:text-sm outline-none border-transparent focus:outline-none focus:border-transparent rounded-lg"
              type="text"
              id="Search anything"
              autoFocus
              value={searchText}
              onChange={(e) => {
                e.preventDefault();

                let text = e.target.value;
                setSearchText(text);
                if (text.length > 0) {
                  let filterdata = EventsData.filter((each) =>
                    each?.location?.toLowerCase().includes(text.toLowerCase())
                  );
                  setFilteredEvents(filterdata);
                } else {
                  setFilteredEvents([]);
                }
              }}
            />
          </div>
          <div className="flex items-center py-2">
            <LocationMarkerIcon className="w-5 h-5 text-black mr-2" />
            <div className="text-[16px] font-semibold text-black">
              {locationname}
            </div>
          </div>
        </div>
        <div>
          {loading ? (
            <Loading />
          ) : (
            <div>
              <div className="flex flex-col lg:flex-row h-screen w-max">
                {/* Filter Section */}
                <div className="lg:w-1/5 ">
                  <div>
                    <div className="mb-4">
                      <h2 className="text-lg font-semibold mb-2">Price</h2>
                      {/* Example checkbox */}
                      <label className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          checked={showFree}
                          onChange={() => setShowFree(!showFree)}
                          className="mr-1"
                        />
                        Free
                      </label>
                      <label className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          checked={showPaid}
                          onChange={() => setShowPaid(!showPaid)}
                          className="mr-1"
                        />
                        Paid
                      </label>
                      {/* Add more checkboxes as needed */}
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold mb-2">Date</h2>
                      {/* Example checkbox */}
                      <label className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          checked={showToday}
                          className="mr-1"
                          onChange={() => setShowToday(!showToday)}
                        />
                        Today
                      </label>
                      <label className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          checked={showTomorrow}
                          className="mr-1"
                          onChange={() => setShowTomorrow(!showTomorrow)}
                        />
                        Tomorrow
                      </label>
                      <label className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          checked={showWeekend}
                          className="mr-1"
                          onChange={() => setShowWeekend(!showWeekend)}
                        />
                        Weekend
                      </label>
                      {/* Add more checkboxes as needed */}
                    </div>
                  </div>
                </div>

                {/* Event Cards Section */}
                <div className="sm:w-[1200px] w-[370px] sm:-mt-24 lg:flex-row overflow-y-auto sm:max-h-[680px] h-[800px]">
                  <div
                    className={
                      "grid  grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-6"
                    }
                  >
                    {filteredEvents?.length == 0 ? (
                      <div className="flex flex-col">
                        <div>
                          {searchText &&
                          filteredEvents == 0 &&
                          (!showFree ||
                            !showPaid ||
                            !showToday ||
                            !showTomorrow ||
                            !showWeekend) ? (
                            <h1 className="font20 font-semibold sm:w-[950px]  text-[#14183E] font-Montserrat w-full flex justify-start items-start sm:justify-center sm:items-center">
                              No Events Found with this location.
                            </h1>
                          ) : (
                            <div>
                              {filteredEvents.length === 0 &&
                                (showFree ||
                                  showPaid ||
                                  showToday ||
                                  showTomorrow ||
                                  showWeekend) && (
                                  <h1 className="font20 font-semibold text-[#14183E] sm:w-[950px] font-Montserrat w-full flex items-start justify-start sm:justify-center sm:items-center">
                                    No Events Found.
                                  </h1>
                                )}
                            </div>
                          )}

                          {filteredEvents.length == 0 &&
                          (showFree ||
                            showPaid ||
                            showToday ||
                            showTomorrow ||
                            showWeekend) ? (
                            <h1 className="font20 font-semibold text-[#14183E] font-Montserrat w-full flex justify-start py-6 items-center px-4">
                              Other Events
                            </h1>
                          ) : searchText != "" &&
                            filteredEvents?.length == 0 ? (
                            <h1 className="font20 font-semibold text-[#14183E] font-Montserrat w-full flex justify-start py-6 items-center px-4">
                              Other Events
                            </h1>
                          ) : null}
                        </div>
                        <div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:lg:grid-cols-5 gap-6 xl:w-[1000px] lg:flex-row  h-96 ">
                            {EventsData.map((item, id) => (
                              <div
                                key={RandomNdigitnumber(10)}
                                className={`sm:w-full w-[370px]  flex justify-start items-center ${
                                  filteredResult.length === 1 ? "mx-auto" : ""
                                }`}
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
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:lg:grid-cols-5 gap-6 xl:w-[1000px] lg:flex-row  h-96 ">
                        {filteredResult.map((item, id) => (
                          <div
                            key={RandomNdigitnumber(10)}
                            className={`sm:w-full w-[370px]  flex justify-start items-center ${
                              filteredResult.length === 1 ? "mx-auto" : ""
                            }`}
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
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="w-full flex flex-col justify-center items-center py-12">
          <button className="border border-[#123B79] rounded-md px-12 py-4 font-Montserrat font-semibold text-[#123B79] flex justify-center items-center gap-2 font14 hover:bg-[#123B79] hover:text-white active:scale-95">
            See All
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendHero;
