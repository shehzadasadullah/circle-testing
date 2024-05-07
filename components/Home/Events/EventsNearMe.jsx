import EventCard from "@/components/SmallComps/EventCard";
import { RandomNdigitnumber } from "@/utils/function";
import React, { useState, useEffect } from "react";
import { db } from "@/firebase";
import {
  collection,
  query,
  where,
  Timestamp,
  limit,
  onSnapshot,
} from "firebase/firestore";

const EventsNearMe = () => {
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

  const [EventsData, setEventsData] = useState([]);

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

  useEffect(() => {
    // Get device's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setDeviceLocation({ latitude, longitude });
        },
        (error) => {
          console.log("Error retrieving device location:", error);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, []);

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
  return (
    <div className="bg-[#E9EDF5] px-2 sm:px-8 md:px-12 lg:px-16 xl:px-24 2xl:px-32 py-2 sm:py-4  w-full h-full flex flex-col justify-center items-center ">
      <h3 className="font28 font-semibold text-[#14183E] font-Montserrat w-full flex justify-start items-center px-2">
        Events Near Me
      </h3>
      <div className=" w-full h-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:lg:grid-cols-5 gap-4 py-4">
        {(EventsData || [])
          .filter((item) => {
            const distance = calculateDistance(
              item?.Coords?._lat,
              item?.Coords?._long,
              deviceLocation?.latitude,
              deviceLocation?.longitude
            );
            const maxDistance = 10; // Set the desired radius for nearby events (e.g., 10 kilometers)
            return distance <= maxDistance;
          })
          .map((item, id) => {
            return (
              <div
                key={RandomNdigitnumber(10)}
                className="w-full flex justify-center items-center"
              >
                <EventCard
                  eventsdata={item || []}
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
          })}
      </div>
    </div>
  );
};

export default EventsNearMe;
