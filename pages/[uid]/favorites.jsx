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
  doc,
} from "firebase/firestore";
import moment from "moment/moment";
import { getDocs } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";
import { AttendeIcon } from "@/components/SvgIcons";
import Header from "@/components/Common/Header";
import Footer from "@/components/Common/Footer";
import { useRouter } from "next/router";
import loaderGif from "../../public/events/Loader.gif";
import bgImage from "../../public/revamp/bg-new.png";

const Favorites = () => {
  const router = useRouter();
  const [EventsData, setEventsData] = useState([]);
  const [user] = useAuthState(auth);
  const [removeFromFav, setRemoveFromFav] = useState(false);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    setLoader(true);
    const fetchMapData = async () => {
      if (user) {
        const querySnapshot = await getDocs(collection(db, "favorites"));
        const data = querySnapshot.docs
          .filter((doc) => doc.id === user.uid)
          .map((doc) => doc.data());
        setEventsData(data?.[0]);
        setLoader(false);
      }
    };

    fetchMapData();
    setRemoveFromFav(false);
  }, [user, removeFromFav]);

  return (
    <>
      {/* {loader ? (
        <>
          <>
            <div className="flex bg-[#E9EDF5] w-screen h-screen justify-center items-center">
              <img src={loaderGif.src} alt="Loader" />
            </div>
          </>
        </>
      ) : (
        <> */}
      <div
        style={{
          backgroundImage: `url(${bgImage.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        className="w-full h-full"
      >
        <div className="w-full h-full">
          <Header type="dark" />
        </div>
        <div className=" w-full h-full flex flex-col justify-center items-center p-10">
          <h3
            style={{
              background:
                "linear-gradient(99deg, #FFF 49.91%, rgba(255, 255, 255, 0.00) 112.45%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
            className="text-5xl font-bold w-full flex justify-center items-center"
          >
            Favorite Events
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 py-10">
            {(EventsData || {}) && Object.keys(EventsData || {}).length > 0 && (
              <>
                {Object.keys(EventsData || {}).map((item, id) => (
                  <div
                    key={id}
                    // onClick={() => {
                    //   router.push(`/events/${EventsData?.[item]?.uid}`);
                    // }}
                  >
                    <EventCard
                      image={EventsData?.[item]?.large_image || ""}
                      title={EventsData?.[item]?.name || ""}
                      time={EventsData?.[item]?.timefrom}
                      description={EventsData?.[item]?.description || ""}
                      attend={EventsData?.[item]?.attend?.length || 0}
                      price={
                        EventsData?.[item]?.ticketPrice ||
                        EventsData?.[item]?.ticketprice ||
                        0
                      }
                      id={
                        EventsData?.[item]?.uid ||
                        EventsData?.[item]?.eventsDocId ||
                        ""
                      }
                      location={EventsData?.[item]?.location || ""}
                      setRemoveFromFav={setRemoveFromFav}
                      type={EventsData?.[item]?.type || ""}
                    />
                  </div>
                  // <div key={id} className="w-full">
                  //   <div
                  //     className={`cursor-pointer rounded-md shadow-md bg-white ${
                  //       id?.length > 0 ? "cursor-pointer" : ""
                  //     }`}
                  //     onClick={() => {
                  //       router.push(`/events/${EventsData?.[item]?.uid}`);
                  //     }}
                  //   >
                  //     <div className="w-full h-[135px] rounded-t-md">
                  //       <img
                  //         src={EventsData?.[item]?.small_image}
                  //         alt=""
                  //         className="w-full h-full"
                  //       />
                  //     </div>
                  //     <div className="p-4 flex flex-col justify-start items-start gap-1.5">
                  //       <div className="flex justify-between items-start">
                  //         <div className="flex flex-col justify-start items-start gap-1">
                  //           <div className="truncate text-xl text-black font-semibold">
                  //             {EventsData?.[item]?.name}
                  //           </div>
                  //         </div>
                  //       </div>
                  //       <div className="w-full flex justify-start items-start truncate font12 text-[#123B79]">
                  //         {moment(
                  //           EventsData?.[item]?.timefrom?.seconds * 1000
                  //         ).format("MMMM Do YYYY, h:mm:ss a")}
                  //       </div>
                  //       <div className="w-full truncate font12 font-light">
                  //         {EventsData?.[item]?.description}
                  //       </div>

                  //       <div className="truncate text-lg font-semibold text-[#F14105]">
                  //         ${" "}
                  //         {EventsData?.[item]?.ticketPrice == 0
                  //           ? "Free"
                  //           : EventsData?.[item]?.ticketPrice}
                  //       </div>
                  //       <div className="flex justify-start items-center gap-1 text-sm">
                  //         <AttendeIcon className="w-3 h-3" />
                  //         <div>{`${EventsData?.[item]?.attend} Followers`}</div>
                  //       </div>
                  //     </div>
                  //   </div>
                  // </div>
                ))}
              </>
            )}
          </div>
          {(EventsData || {}) && Object.keys(EventsData || {}).length === 0 && (
            <>
              <div className="flex w-full text-xl justify-center items-center">
                <p className="w-full text-[#fff] text-center">
                  No Favorite Events Found!
                </p>
              </div>
            </>
          )}
        </div>
      </div>
      {/* </>
      )} */}

      <div className="w-full h-full">
        <Footer />
      </div>
    </>
  );
};

export default Favorites;
