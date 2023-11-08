import EventCard from "@/components/SmallComps/EventCard";
import { FilledPlayIcon, SolidCircularLeftArrow } from "@/components/SvgIcons";
import { RandomNdigitnumber } from "@/utils/function";
import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import {
  collection,
  query,
  limit,
  onSnapshot,
  where,
} from "firebase/firestore";
import { db } from "@/firebase";

const PremiumEvents = () => {
  //state
  const [index, setIndex] = useState(0);
  const [width, setWidth] = useState(280);
  const SliderRef = useRef(null);
  const CarouselRef = useRef(null);

  useLayoutEffect(() => {
    const sliderWidth = SliderRef.current.offsetWidth;
    setWidth(sliderWidth);
    const maxSlides = Math.floor(sliderWidth / 296); // Assuming each slide is 280px wide with 16px margin
    const newIndex = Math.min(index, maxSlides - 1);
    setIndex(newIndex);
  }, []);

  const [EventsData, setEventsData] = useState([]);

  //function to get events Data from firestore
  const getEventsData = async () => {
    // reference to the events collection
    const eventsCollectionRef = collection(db, "events");
    //current time stamp

    //compound query - any event which start from now in future
    const q = query(
      eventsCollectionRef,
      where("ticketPrice", ">", "0.00"),
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

  return (
    <div
      className="bg-[#2373CB] px-2 sm:px-8 md:px-12 lg:px-16 xl:px-24 2xl:px-32 py-2 sm:py-4 md:py-6 lg:py-8 xl:py-12 2xl:py-16 w-full h-full flex flex-col justify-center items-center bg-no-repeat bg-cover bg-center"
      style={{ backgroundImage: "url(/backgroundVectorwhite.svg)" }}
    >
      <div className="w-full flex justify-statr items-center gap-2">
        <span className="text-[#DB2B42]">
          <FilledPlayIcon className="w-10 h-10" />
        </span>
        <h3 className="font28 font-semibold text-white font-Montserrat w-full flex justify-start items-center">
          Premium Events
        </h3>
      </div>
      <div
        ref={SliderRef}
        className=" w-full h-[300px] my-4 gap-4 flex flex-row justify-start items-center relative"
      >
        <div
          ref={CarouselRef}
          className="absolute top-0 left-0 right-0 bottom-0 flex justify-start items-center  duration-500 overflow-hidden h-[300px]"
          style={{
            width: SliderRef?.current?.clientWidth || width || 280,
            transform: `translateX(calc(- ${index * (280 + 16)}px))`,
            transition: "transform 1s ease-in-out",
          }}
        >
          <div
            className="w-full h-full flex flex-row justify-start items-center gap-4"
            style={{
              width: 280 * EventsData?.length + (EventsData?.length - 1) * 16,
            }}
          >
            {(EventsData || []).map((item, id) => {
              return (
                <div
                  key={RandomNdigitnumber(10)}
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
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div
          className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1/2 w-10 h-10 flex justify-center items-center cursor-pointer shadow-md rounded-full"
          onClick={() => {
            //previous button click
            const slideWidth = 280;
            let totalSlidesLetgth =
              slideWidth * EventsData.length + (EventsData?.length - 1) * 16;
            if (index > 0) {
              let currleft = CarouselRef?.current.scrollLeft;
              let newleft = currleft - (slideWidth + 16);
              if (totalSlidesLetgth - currleft >= slideWidth) {
                setIndex((prevIndex) => prevIndex - 1);
                CarouselRef.current.scrollLeft = newleft;
              } else {
                setIndex(0);
                CarouselRef.current.scrollLeft = 0;
              }
            } else {
              setIndex(0);
              CarouselRef.current.scrollLeft = 0;
            }
          }}
        >
          <SolidCircularLeftArrow className="w-10 h-10" />
        </div>
        <div
          className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-1/2 w-10 h-10 flex justify-center items-center cursor-pointer shadow-md rounded-full"
          onClick={() => {
            //next button click
            const slideWidth = 280;
            const numberofCards = Math.round(
              SliderRef?.current?.clientWidth / (slideWidth + 16)
            );
            const totalSlidesLength =
              slideWidth * EventsData.length + (EventsData?.length - 1) * 16;

            if (index < EventsData.length - numberofCards) {
              let currLeft = CarouselRef?.current.scrollLeft;
              let newLeft = currLeft + (slideWidth + 88) * numberofCards;

              if (totalSlidesLength - currLeft >= slideWidth * numberofCards) {
                setIndex((prevIndex) => prevIndex + 1);
                CarouselRef.current.scrollLeft = newLeft;
              } else {
                setIndex(0);
                CarouselRef.current.scrollLeft = 0;
              }
            } else {
              setIndex(0);
              CarouselRef.current.scrollLeft = 0;
            }
          }}
        >
          <SolidCircularLeftArrow className="w-10 h-10 rotate-180" />
        </div>
      </div>
    </div>
  );
};

export default PremiumEvents;
