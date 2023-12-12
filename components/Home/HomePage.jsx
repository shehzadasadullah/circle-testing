import React, { useContext, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Create_Event_Popup } from "@/context/context";
import CreateEventPopup from "../Common/CreateEventPopup";
const HeroSection = dynamic(import("./HeroSection"), { ssr: false });
const InviteToApp = dynamic(import("./InviteToApp"), { ssr: false });
const EventTabs = dynamic(import("./EventTabs"), { ssr: false });
const Testimonial = dynamic(import("./Testimonials"), { ssr: false });
const ProfileComp = dynamic(import("./ProfileComp"), { ssr: false });
const Features = dynamic(import("./Features"), { ssr: false });
const EventsNearMe = dynamic(import("./Events/EventsNearMe"), { ssr: false });
const PremiumEvents = dynamic(import("./Events/PremiumEvents"), { ssr: false });
const RestEvents = dynamic(import("./Events/RestEvents"), { ssr: false });
const Footer = dynamic(import("../Common/Footer"), { ssr: false });
import { ThreeCircles } from "react-loader-spinner";
import loaderGif from "../../public/events/Loader.gif";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//Main Container Component to contain all the sections of the homepage
const HomePage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 4000);
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
            <ProfileComp />
            <Features />
            <EventTabs />
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
          </div>
        </>
      )}
    </>
  );
};

export default HomePage;
