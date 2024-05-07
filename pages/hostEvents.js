import React, { useState, useEffect } from "react";
import Header from "@/components/Common/Header";
import Footer from "@/components/Common/Footer";
import { useRouter } from "next/router";
import backgroundImage from "../public/revamp/bg-createEvent.jpg";
import Head from "next/head";
import { RandomNdigitnumber } from "@/utils/function";
import { RotatingLines } from "react-loader-spinner";
import { ThreeDots } from "react-loader-spinner";
import {
  doc,
  onSnapshot,
  collection,
  query,
  where,
  limit,
  orderBy,
} from "firebase/firestore";
import { db } from "@/firebase";
import { getIdToken } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";
import toast from "react-simple-toasts";
import { LuCalendarDays } from "react-icons/lu";
import { FaLocationDot } from "react-icons/fa6";
import { FaTag } from "react-icons/fa6";
import { FaClock } from "react-icons/fa";
import img from "@/public/Profile_Picture.png";
import moment from "moment";
import loaderGif from "@/public/events/Loader.gif";
import EventCard from "@/components/SmallComps/EventCard";

const HostEvents = () => {
  const router = useRouter();
  const { userID } = router.query;
  const [userRef, setUserRef] = useState("");
  const [EventsData, setEventsData] = useState([]);
  const [allEventsLimit, setAllEventsLimit] = useState(20);
  const [allEventsLoader, setAllEventsLoader] = useState(true);
  const [showMoreLoader, setShowMoreLoader] = useState(true);
  const [circleAccessToken, setCircleAccessToken] = useState("");
  const [user] = useAuthState(auth);

  useEffect(() => {
    const getIdTokenForUser = async () => {
      if (user) {
        try {
          const idToken = await getIdToken(user);
          setCircleAccessToken(idToken);
        } catch (error) {
          toast(error.message);
        }
      }
    };
    console.log("USER ID: ", userID);
    getIdTokenForUser();
  }, [user]);

  // create user ref and get events
  const getEventsData = async (limitNum) => {
    setAllEventsLoader(true);
    setShowMoreLoader(true); // show more issue page fluctuation
    const ref = doc(db, "Users", userID);
    setUserRef(ref);
    const eventsCollectionRef = collection(db, "events");
    const q = query(
      eventsCollectionRef,
      where("creator", "==", ref),
      orderBy("timefrom", "desc"),
      limit(limitNum)
    );
    return onSnapshot(q, (querySnapshot) => {
      const Docs = [];
      querySnapshot.forEach((doc) => {
        Docs.push({ ...doc.data(), eventsDocId: doc?.id });
      });
      console.log("EVENTS: ", Docs);
      setEventsData(Docs || []);
      setAllEventsLoader(false);
    });
  };

  useEffect(() => {
    if (userID) {
      getEventsData(allEventsLimit);
    }
  }, [userID]);

  return (
    <>
      <Head>
        <title>CIRCLE - MY EVENTS</title>
        <meta
          name="description"
          content="Circle.ooo ❤️'s our customers! Events: beautiful, fast & simple for all."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div
        style={{
          backgroundImage: `url(${backgroundImage.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        className="w-full h-full"
      >
        <div className="w-full h-full">
          <Header type="dark" />
        </div>

        {/* {allEventsLoader ? (
          <div className="flex w-full justify-center items-center p-10">
            <img src={loaderGif.src} alt="Loader" />
          </div>
        ) : ( */}
        {/* <> */}
        <div className="w-full h-auto flex flex-col justify-center gap-4 items-center p-8 lg:p-16">
          <h3 className="text-5xl lg:text-7xl font-bold w-full flex justify-center items-center">
            <span
              style={{
                background:
                  "linear-gradient(269deg, #FFF -1.77%, #9E22FF 37.99%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
              className="w-full text-center"
            >
              My Events
            </span>
          </h3>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:lg:grid-cols-5 gap-6 lg:flex-row">
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
            <div className="flex justify-center w-full items-center mt-4">
              <RotatingLines
                strokeColor="#fff"
                strokeWidth="5"
                animationDuration="0.75"
                width="40"
                visible={true}
              />
            </div>
          )}
          {EventsData.length <= 0 && !allEventsLoader && (
            <div className="flex justify-center w-full text-center items-center mt-10 text-white">
              No Events Found!
            </div>
          )}
          {EventsData.length > 0 &&
            !allEventsLoader &&
            EventsData.length >= allEventsLimit && (
              <div className="w-full flex justify-center items-center flex-row">
                <button
                  onClick={() => {
                    if (EventsData.length < allEventsLimit) {
                      toast("All events fetched!");
                    }
                    setAllEventsLimit(allEventsLimit + 12);
                    getEventsData(allEventsLimit + 12);
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
              </div>
            )}
        </div>
        {/* </> */}
        {/* )} */}

        <div className="w-full h-full">
          <Footer />
        </div>
      </div>
    </>
  );
};

export default HostEvents;
