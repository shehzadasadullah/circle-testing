import React, { useContext, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Create_Event_Popup } from "@/context/context";
import CreateEventPopup from "../Common/CreateEventPopup";
import HeroSection from "./HeroSection";
import InviteToApp from "./InviteToApp";
import EventTabs from "./EventTabs";
import Testimonial from "./Testimonials";
import ProfileComp from "./ProfileComp";
import Features from "./Features";
import EventsNearMe from "./Events/EventsNearMe";
import PremiumEvents from "./Events/PremiumEvents";
import RestEvents from "./Events/RestEvents";
import Footer from "../Common/Footer";
import { ThreeCircles } from "react-loader-spinner";
import loaderGif from "../../public/events/Loader.gif";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ScrollToTopButton from "../ScrollToTop/ScrollToTopButton";

//Main Container Component to contain all the sections of the homepage
const HomePage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);
  //context
  const [createEventPopup, setCreateEventPopup] =
    useContext(Create_Event_Popup);

  return (
    <>
      <ToastContainer />
      {loading ? (
        <div className="flex w-screen h-screen justify-center items-center">
          {/* <ThreeCircles
            height="100"
            width="100"
            color="#4fa94d"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
            ariaLabel="three-circles-rotating"
            outerCircleColor="#7592FF"
            innerCircleColor="#5BEEDC"
            middleCircleColor="#D6DEFF"
          /> */}
          <img src={loaderGif.src} alt="Loader" />
        </div>
      ) : (
        <>
          <div className="w-full h-full relative">
            <HeroSection />
            <EventTabs />
            <ProfileComp />
            <Features />
            <Testimonial />
            {/* <EventsNearMe /> */}
            {/* <PremiumEvents />
      <RestEvents /> */}
            <InviteToApp />
            <Footer />
            {createEventPopup && (
              <CreateEventPopup
                createEventPopup={createEventPopup}
                setCreateEventPopup={setCreateEventPopup}
              />
            )}
            <ScrollToTopButton />
          </div>
        </>
      )}
    </>
  );
};

export default HomePage;
