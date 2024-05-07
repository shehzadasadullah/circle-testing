import EventCard from "@/components/SmallComps/EventCard";
import { RightArrowIcon } from "@/components/SvgIcons";
import { RandomNdigitnumber } from "@/utils/function";
import moment from "moment/moment";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { db } from "@/firebase";
import {
  collection,
  doc,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
} from "firebase/firestore";

const RestEvents = ({
  image,
  title,
  time,
  description,
  attend,
  price,
  id = "",
}) => {
  const router = useRouter();
  let EventNearMeListData = [
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
  const WeeklyEventData = [
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
  ];

  const [weeklyevents, setWeeklyevents] = useState([]);

  const getEventsData = async () => {
    // reference to the events collection
    const eventsCollectionRef = collection(db, "events");
    const currentDate = new Date();
    const nextWeekDate = new Date();
    nextWeekDate.setDate(currentDate.getDate() + 7);

    const q = query(
      eventsCollectionRef,
      where("timefrom", ">=", currentDate),
      where("timefrom", "<=", nextWeekDate),
      orderBy("timefrom"),
      limit(40)
    );

    return onSnapshot(q, (querySnapshot) => {
      const docs = [];
      querySnapshot.forEach((doc) => {
        docs.push({ ...doc.data(), eventId: doc.id });
      });
      setWeeklyevents(docs);
      // setWeeklyevents(docs);
    });
  };

  useEffect(() => {
    getEventsData();
  }, []);

  const [EventsData, setEventsData] = useState([]);

  const getFreeEventsData = async () => {
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
    getFreeEventsData();
  }, []);

  //function to get nearest sunday date from current date
  const NearestSundayDate = () => {
    const today = new Date(); // create a new Date object for today's date
    let day = today.getDay(); // current day of the week (0-6)
    const nearestSunday = new Date(today); // create a new Date object with today's date
    nearestSunday.setDate(today.getDate() + (7 - day)); // set the date to the nearest Sunday
    const nearestStaurday = new Date(nearestSunday);
    nearestStaurday.setDate(nearestStaurday.getDate() - 1);

    return [nearestStaurday, nearestSunday];
  };

  const EventTHisWeekComponent = () => {
    let Today = new Date();
    let Tomorrow = new Date();
    Tomorrow.setDate(Tomorrow.getDate() + 1);
    let weekends = NearestSundayDate();

    return (
      <div className=" w-full h-full flex flex-row justify-start items-center flex-wrap gap-4 py-4 px-4 font-Montserrat">
        <button
          className="px-4 py-1 border border-[#AFAFAF] rounded-md flex flex-col justify-center items-start gap-1.5 w-[174px]"
          onClick={filterToday}
        >
          <span className="font20 text-[#F14105] font-semibold">Today</span>
          <span className="font12 text-[#666666]">
            {moment(Today).format("ddd, DD MMM")}
          </span>
        </button>
        <button
          className="px-4 py-1 border border-[#AFAFAF] rounded-md flex flex-col justify-center items-start gap-1.5 w-[174px]"
          onClick={filterTomorrow}
        >
          <span className="font20 text-[#F14105] font-semibold">Tomorrow</span>
          <span className="font12 text-[#666666]">
            {moment(Tomorrow).format("ddd, DD MMM")}
          </span>
        </button>
        <button
          className="px-4 py-1 border border-[#AFAFAF] rounded-md flex flex-col justify-center items-start gap-1.5 w-[174px]"
          onClick={filterWeekend}
        >
          <span className="font20 text-[#F14105] font-semibold">Weekend</span>
          <span className="font12 text-[#666666] flex ">
            {`${moment(Tomorrow).format("DD")} - ${moment(Tomorrow).format(
              "DD MMM"
            )}`}
          </span>
        </button>
      </div>
    );
  };

  const [filteredEvents, setFilteredEvents] = useState(weeklyevents);

  const [filterclick, setfilterclick] = useState("");

  const today = moment();
  const tomorrow = moment().add(1, "day");

  // Filter events for "Today"
  // const filterToday = () => {
  //   setfilterclick("today");
  //   const filtered = events.filter((event) => event.date.isSame(today, "day"));
  //   setFilteredEvents(filtered);
  // };
  const filterToday = () => {
    setfilterclick("today");
    const filtered = weeklyevents.filter((event) => {
      const eventTimeFrom = moment(event?.timefrom?.seconds * 1000);
      const isSameDay = moment(eventTimeFrom).isSame(today, "day");
      return isSameDay;
    });

    setFilteredEvents(filtered);
  };
  // Filter events for "Tomorrow"
  const filterTomorrow = () => {
    setfilterclick("tomorrow");
    const filtered = weeklyevents.filter((event) => {
      const eventTimeFrom = moment(event?.timefrom?.seconds * 1000);
      const isSameDay = moment(eventTimeFrom).isSame(tomorrow, "day");
      return isSameDay;
    });

    setFilteredEvents(filtered);
  };

  // Filter events for "Weekend"
  const filterWeekend = () => {
    setfilterclick("weekend");
    const filtered = weeklyevents.filter((event) => {
      const eventTimeFrom = moment(event?.timefrom?.seconds * 1000);
      const dayOfWeek = eventTimeFrom.day();
      return dayOfWeek >= 4 || dayOfWeek == 0; // Saturday (6) or Sunday (0)
    });

    setFilteredEvents(filtered);
  };

  // const filterWeekend = () => {
  //   setfilterclick("weekend");
  //   const filtered = events.filter(
  //     (event) =>
  //       event.date.isSame(tomorrow, "day") ||
  //       event.date.isSame(tomorrow.add(1, "day"), "day")
  //   );
  //   setFilteredEvents(filtered);
  // };

  return (
    <div className="bg-[#E9EDF5] px-2 sm:px-8 md:px-12 lg:px-16 xl:px-24 2xl:px-32 py-2 sm:py-4 md:py-6 lg:py-8 xl:py-12 2xl:py-16 w-full h-full flex flex-col justify-center items-center gap-4 md:gap-8">
      <div className="w-full flex flex-col justify-start items-start">
        <div className="w-full flex flex-row justify-between items-center">
          <h3 className="font28 font-semibold text-[#14183E] font-Montserrat w-full flex justify-start items-center px-2">
            Free Event for Limited Time
          </h3>
          <div
            className="sm:font16 font20 flex justify-center items-center gap-1 text-[#F14105] whitespace-nowrap cursor-pointer"
            onClick={() => {
              router.push(`/events`);
            }}
          >
            See All <RightArrowIcon className="w-2.5 h-2.5" />
          </div>
        </div>

        <div className="w-full h-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:lg:grid-cols-5 gap-4 py-4">
          {(EventsData || [])
            .filter((item) => {
              return item.ticketPrice == "0.00" || !item.ticketPrice;
            })
            .slice(0, 8) // Add .slice(0, 8) to select only the first 8 events
            .map((item, id) => {
              return (
                <div
                  key={RandomNdigitnumber(10)}
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/events/${item?.eventsDocId}`);
                  }}
                  className="w-full flex justify-center items-center"
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
              );
            })}
        </div>
      </div>
      <div className="w-full flex flex-col justify-start items-start">
        <h3 className="font28 font-semibold text-[#14183E] font-Montserrat w-full flex justify-start items-center px-2">
          Event this week
        </h3>
        <div className="w-full h-full">{EventTHisWeekComponent()}</div>
      </div>
      <div className="w-full flex flex-col justify-start items-start">
        <div className="w-full flex flex-row justify-between items-center">
          <h3 className="font28 font-semibold text-[#14183E] font-Montserrat w-full flex justify-start items-center px-2">
            Weekly Events
          </h3>
          <div
            className="font12 flex justify-center items-center gap-1 text-[#F14105] whitespace-nowrap cursor-pointer"
            onClick={() => {
              setfilterclick("");
            }}
          >
            See All <RightArrowIcon className="w-2.5 h-2.5" />
          </div>
        </div>

        <div className=" w-full h-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:lg:grid-cols-5 gap-4 py-4">
          {(filterclick == "" ? weeklyevents : filteredEvents || []).map(
            (item, id) => {
              return (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/events/${item?.uid}`);
                  }}
                  key={RandomNdigitnumber(10)}
                  className=" cursor-pointer w-full flex justify-center items-center"
                >
                  <EventCard
                    image={item.large_image || ""}
                    title={item.name || ""}
                    time={item.timefrom}
                    description={item.description || ""}
                    attend={item.attendees?.length || 0}
                    price={item.ticketPrice || 0}
                    id={item?.eventsDocId || ""}
                  />
                </div>
              );
            }
          )}
        </div>
      </div>
      <div
        className="w-full flex flex-col justify-center items-center py-6"
        onClick={(e) => {
          e.stopPropagation();

          router.push("/events");
        }}
      >
        <button className="border border-[#123B79] rounded-md px-12 py-4 font-Montserrat font-semibold text-[#123B79] flex justify-center items-center gap-2 font14 hover:bg-[#123B79] hover:text-white active:scale-95">
          See All
        </button>
      </div>
      <div
        className="w-full h-full my-2 flex flex-col md:flex-row justify-between item-end md:items-stretch gap-4 overflow-hidden bg-no-repeat bg-cover bg-center rounded-md"
        style={{ backgroundImage: "url(/newbackground.png)" }}
      >
        <div className="w-full md:w-3/5 h-full  p-4 md:p-6 lg:p-8 xl:p-10 2xl:p-12 ">
          <div className="w-3/4 h-full font42 font-semibold py-2">
            Circle Is Available For All Devices
          </div>
          <div className="font16 w-full h-full font-light font-Montserrat py-2">
            Connect effortlessly at the event with a personalized digital
            business card!
          </div>
          <div className="font16 w-full h-full font-light font-Montserrat py-2">
            Register now to explore who else will be there and use Circle, the
            user-friendly app for all devices. Sign up today for a free digital
            business card and unlock networking success!
          </div>
          <div className="font18 w-full font-Montserrat font-medium py-2">
            Download Now On
          </div>
          <div className="flex justify-start items-center gap-4 py-2">
            <Link href="/" className="active:scale-95">
              <Image
                src={"/app_store_img.svg"}
                alt="app store download button"
                className="w-[139px] h-[48px] rounded-md object-cover"
                width={173}
                height={65}
              />
            </Link>
            <Link href="/" className="active:scale-95">
              <Image
                src={"/Play_store_img.svg"}
                alt="play store download button"
                className="w-[146px] h-[49px] rounded-md object-cover"
                width={195}
                height={60}
              />
            </Link>
          </div>
        </div>
        <div
          className="w-full md:w-2/5 flex justify-start items-end relative"
          //   style={{ height: "calc(100%)" }}
        >
          <Image
            className="w-[380px] md:w-full xl:w-3/4 aspect-auto object-contain md:object-cover flex justify-start items-center"
            src="/circlenew.png"
            alt="Circle_image"
            width={498}
            height={650}
          />
        </div>
      </div>
    </div>
  );
};

export default RestEvents;
