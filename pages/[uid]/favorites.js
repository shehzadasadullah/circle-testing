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

const Favorites = () => {
  const router = useRouter();
  const [EventsData, setEventsData] = useState([]);
  const [user] = useAuthState(auth);

  useEffect(() => {
    const fetchMapData = async () => {
      if (user) {
        const querySnapshot = await getDocs(collection(db, "favorites"));
        const data = querySnapshot.docs
          .filter((doc) => doc.id === user.uid)
          .map((doc) => doc.data());
        setEventsData(data?.[0]);
      }
    };

    fetchMapData();
  }, [user]);

  return (
    <div>
      <div className="w-full h-full">
        <Header type="light" />
      </div>

      <div className="bg-[#E9EDF5] px-2 sm:px-8 md:px-12 lg:px-16 xl:px-24 2xl:px-32 py-2 sm:py-4 lg:py-8 w-full h-full flex flex-col justify-center items-center ">
        <h3 className="font28 font-semibold text-[#14183E] font-Montserrat w-full flex justify-start items-center px-2">
          Favorite Events
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 py-4">
          {(EventsData || {}) && Object.keys(EventsData || {}).length > 0 && (
            <>
              {Object.keys(EventsData || {}).map((item, id) => (
                <div key={id} className="w-full">
                  <div
                    className={`cursor-pointer rounded-md shadow-md bg-white ${
                      id?.length > 0 ? "cursor-pointer" : ""
                    }`}
                    onClick={() => {
                      router.push(`/events/${EventsData?.[item]?.uid}`);
                    }}
                  >
                    <div className="w-full h-[135px] rounded-t-md">
                      <img
                        src={EventsData?.[item]?.small_image}
                        alt=""
                        className="w-full h-full"
                      />
                    </div>
                    <div className="p-4 flex flex-col justify-start items-start gap-1.5">
                      <div className="flex justify-between items-start">
                        <div className="flex flex-col justify-start items-start gap-1">
                          <div className="truncate text-xl text-black font-semibold">
                            {EventsData?.[item]?.name}
                          </div>
                        </div>
                      </div>
                      <div className="w-full flex justify-start items-start truncate font12 text-[#123B79]">
                        {moment(
                          EventsData?.[item]?.timefrom?.seconds * 1000
                        ).format("MMMM Do YYYY, h:mm:ss a")}
                      </div>
                      <div className="w-full truncate font12 font-light">
                        {EventsData?.[item]?.description}
                      </div>

                      <div className="truncate text-lg font-semibold text-[#F14105]">
                        ${" "}
                        {EventsData?.[item]?.ticketPrice == 0
                          ? "Free"
                          : EventsData?.[item]?.ticketPrice}
                      </div>
                      <div className="flex justify-start items-center gap-1 text-sm">
                        <AttendeIcon className="w-3 h-3" />
                        <div>{`${EventsData?.[item]?.attend} Followers`}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Favorites;
