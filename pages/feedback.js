import React, { useState, useEffect } from "react";
import Header from "@/components/Common/Header";
import Footer from "@/components/Common/Footer";
import { useRouter } from "next/router";
import backgroundImage from "../public/revamp/bg-createEvent.jpg";
import Head from "next/head";
import { ThreeDots } from "react-loader-spinner";
import { doc, onSnapshot } from "firebase/firestore";
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

const Feedback = () => {
  const router = useRouter();
  // const { emojiID } = router.query;
  // const { eventID } = router.query;
  const [selectedEmoji, setSelectedEmoji] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [feedbackLoader, setFeedbackLoader] = useState(false);
  const [circleAccessToken, setCircleAccessToken] = useState("");
  const [eventData, setEventData] = useState("");
  const [creatorData, setCreatorData] = useState("");
  const [user] = useAuthState(auth);

  useEffect(() => {
    const getIdTokenForUser = async () => {
      if (user) {
        try {
          const idToken = await getIdToken(user);
          setCircleAccessToken(idToken);
          console.log("CIRCLE ACCESS TOKEN: ", idToken);
        } catch (error) {
          console.error("Error getting ID token:", error);
        }
      }
    };
    getIdTokenForUser();
  }, [user]);

  //get all events
  useEffect(() => {
    const eventID = "kEgQWtP7GAbC7HIez9sf";
    const eventRef = doc(db, "events", eventID);

    return onSnapshot(eventRef, async (docQuery) => {
      if (docQuery.exists()) {
        setEventData(docQuery?.data() || {});
        console.log("EVENT DATA: ", docQuery?.data());
        // Reference of creator
        const creatorRef = docQuery?.data()?.creator;
        onSnapshot(creatorRef, (docVal) => {
          if (docVal?.exists()) {
            setCreatorData(docVal?.data() || {});
            console.log("CREATOR DATA: ", docVal?.data());
          }
        });
      }
    });
  }, []);

  const handleFeedback = () => {
    setFeedbackLoader(true);
    if (selectedEmoji === 0) {
      toast("Please Select One Emoji!");
    } else {
      toast(
        "(Dummy Feedback) Rating: " + selectedEmoji + ", Review: " + feedback
      );
    }
    setFeedbackLoader(false);
  };

  return (
    <>
      <Head>
        <title>CIRCLE - Feedback</title>
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

        <div className="w-full h-auto flex flex-col lg:flex-row justify-center gap-4 items-start p-8 lg:p-16">
          {/* Left Side */}
          <div
            style={{
              border: "1px solid rgba(255, 255, 255, 0.20)",
              background: "rgba(255, 255, 255, 0.10)",
              backdropFilter: "blur(40px)",
            }}
            className="flex flex-col justify-center lg:justify-start items-center w-full lg:w-3/5 rounded-xl"
          >
            <div className="border-b-2 border-[#fff] border-opacity-10 flex flex-col justify-center lg:justify-start items-center w-full p-5">
              <p className="w-full text-[#fff] text-center lg:text-left font-semibold text-3xl">
                We appreciate your feedback!
              </p>
              <p className="text-[#fff] w-full text-center lg:text-left mt-4">
                Your feedback shapes the future! Let us know what you thought of
                this event. Your insights will help us create even better
                experiences.
              </p>
            </div>
            <div className="flex flex-col justify-center items-center w-full p-5">
              <div className="flex w-full flex gap-2 flex-wrap justify-center lg:justify-start items-center mb-4">
                <div
                  style={{
                    background:
                      selectedEmoji === 5
                        ? "#9E22FF"
                        : "linear-gradient(149deg, rgba(255, 255, 255, 0.20) 0.71%, rgba(255, 255, 255, 0.10) 98.8%)",
                  }}
                  onClick={() =>
                    setSelectedEmoji((prevSelected) =>
                      prevSelected === 5 ? 0 : 5
                    )
                  }
                  className="p-3 rounded-xl cursor-pointer"
                >
                  <img
                    src="https://files.zmurl.com/email/star-5.png"
                    alt=""
                    className="object-contain h-12"
                  />
                </div>
                <div
                  style={{
                    background:
                      selectedEmoji === 4
                        ? "#9E22FF"
                        : "linear-gradient(149deg, rgba(255, 255, 255, 0.20) 0.71%, rgba(255, 255, 255, 0.10) 98.8%)",
                  }}
                  onClick={() =>
                    setSelectedEmoji((prevSelected) =>
                      prevSelected === 4 ? 0 : 4
                    )
                  }
                  className="p-3 rounded-xl cursor-pointer"
                >
                  <img
                    src="https://files.zmurl.com/email/star-4.png"
                    alt=""
                    className="object-contain h-12"
                  />
                </div>
                <div
                  style={{
                    background:
                      selectedEmoji === 3
                        ? "#9E22FF"
                        : "linear-gradient(149deg, rgba(255, 255, 255, 0.20) 0.71%, rgba(255, 255, 255, 0.10) 98.8%)",
                  }}
                  onClick={() =>
                    setSelectedEmoji((prevSelected) =>
                      prevSelected === 3 ? 0 : 3
                    )
                  }
                  className="p-3 rounded-xl cursor-pointer"
                >
                  <img
                    src="https://files.zmurl.com/email/star-3.png"
                    alt=""
                    className="object-contain h-12"
                  />
                </div>
                <div
                  style={{
                    background:
                      selectedEmoji === 2
                        ? "#9E22FF"
                        : "linear-gradient(149deg, rgba(255, 255, 255, 0.20) 0.71%, rgba(255, 255, 255, 0.10) 98.8%)",
                  }}
                  onClick={() =>
                    setSelectedEmoji((prevSelected) =>
                      prevSelected === 2 ? 0 : 2
                    )
                  }
                  className="p-3 rounded-xl cursor-pointer"
                >
                  <img
                    src="https://files.zmurl.com/email/star-2.png"
                    alt=""
                    className="object-contain h-12"
                  />
                </div>
                <div
                  style={{
                    background:
                      selectedEmoji === 1
                        ? "#9E22FF"
                        : "linear-gradient(149deg, rgba(255, 255, 255, 0.20) 0.71%, rgba(255, 255, 255, 0.10) 98.8%)",
                  }}
                  onClick={() =>
                    setSelectedEmoji((prevSelected) =>
                      prevSelected === 1 ? 0 : 1
                    )
                  }
                  className="p-3 rounded-xl cursor-pointer"
                >
                  <img
                    src="https://files.zmurl.com/email/star-1.png"
                    alt=""
                    className="object-contain h-12"
                  />
                </div>
              </div>
              <div className="w-full flex justify-center items-center flex-col">
                <div className="mb-4 w-full h-auto">
                  <label
                    htmlFor="feedback"
                    className="hidden lg:block text-[#fff] font-bold text-[16px] ml-1"
                  >
                    Feedback
                    <span className="text-red-600"> *</span>
                  </label>
                  <textarea
                    id="feedback"
                    style={{
                      background: "rgba(255, 255, 255, 0.10)",
                    }}
                    className="h-[80pt] border-[0.5px] border-opacity-10 border-[#fff] focus:border-[0.5px] focus:border-opacity-60 text-[#fff] lg:mt-2 p-3 w-full rounded-lg focus:outline-none"
                    placeholder="Type your feedback here"
                    value={feedback}
                    onChange={(e) => {
                      setFeedback(e.target.value);
                    }}
                  ></textarea>
                </div>
                <div className="w-full flex h-auto text-center">
                  <button
                    onClick={() => {
                      if (user === null) {
                        toast("Please login to submit review!");
                      } else {
                        handleFeedback();
                      }
                    }}
                    type="submit"
                    disabled={feedbackLoader === true}
                    style={{
                      borderRadius: "8px",
                      background:
                        "linear-gradient(90deg, #4532BF 5.81%, #9429FF 100%)",
                      boxShadow: "0px 1px 2px 0px rgba(82, 88, 102, 0.06)",
                    }}
                    className={`text-white w-full font-semibold py-5 rounded-lg`}
                  >
                    {feedbackLoader === true ? (
                      <>
                        <div className="flex justify-center items-center w-full">
                          <ThreeDots
                            height="24"
                            color="#fff"
                            width="50"
                            radius="9"
                            ariaLabel="three-dots-loading"
                            visible={true}
                          />
                        </div>
                      </>
                    ) : (
                      "Submit Review"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side */}

          <div className="flex flex-col justify-center gap-y-4 items-center w-full lg:w-2/5 rounded-xl">
            <div
              style={{
                border: "1px solid rgba(255, 255, 255, 0.20)",
                background: "rgba(255, 255, 255, 0.10)",
                backdropFilter: "blur(40px)",
              }}
              className="flex flex-col justify-start items-center w-full p-5 rounded-xl"
            >
              <p className="text-[#fff] w-full text-left font-bold text-lg">
                Event Details:
              </p>

              <p className="text-[#fff] w-full text-left font-bold mt-5 text-lg">
                {eventData.name}
              </p>

              <div className="flex flex-row text-[#fff] mt-3 justify-start w-full items-center">
                <LuCalendarDays size={30} />
                <p className="font-Montserrat ml-3">
                  {moment(eventData?.timefrom?.seconds * 1000)
                    .local()
                    .format("LL") +
                    " - " +
                    moment(eventData?.timeto?.seconds * 1000)
                      .local()
                      .format("LL")}
                </p>
              </div>

              <div className="flex flex-row text-[#fff] mt-3 justify-start w-full items-center">
                <FaClock size={30} />
                <p className="font-Montserrat ml-3">
                  {moment(eventData?.timefrom?.seconds * 1000)
                    .local()
                    .format("LT")}{" "}
                  -{" "}
                  {moment(eventData?.timeto?.seconds * 1000)
                    .local()
                    .format("LT")}
                </p>
              </div>

              <div className="flex flex-row text-[#fff] mt-3 justify-start w-full items-center">
                <FaLocationDot
                  onClick={() => {
                    const generateGoogleMapsUrl = (locationText) => {
                      const encodedLocation = encodeURIComponent(locationText);
                      return `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
                    };

                    const locationText = eventData?.location;
                    const googleMapsUrl = generateGoogleMapsUrl(locationText);
                    window.open(googleMapsUrl, "_blank");
                  }}
                  className="cursor-pointer"
                  size={30}
                />
                <p
                  onClick={() => {
                    const generateGoogleMapsUrl = (locationText) => {
                      const encodedLocation = encodeURIComponent(locationText);
                      return `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
                    };

                    const locationText = eventData?.location;
                    const googleMapsUrl = generateGoogleMapsUrl(locationText);
                    window.open(googleMapsUrl, "_blank");
                  }}
                  className="font-Montserrat ml-3 cursor-pointer"
                >
                  {eventData?.location}
                </p>
              </div>

              <div className="flex flex-row text-[#fff] mt-3 justify-start w-full items-center">
                <FaTag size={30} />
                <p className="font-Montserrat ml-3">
                  {eventData?.ticketPrice === "0.00" ? "FREE" : "PAID"}
                </p>
              </div>

              <div className="flex text-base w-full justify-start items-center flex-row mt-5 border-dashed border-t-2 border-[#fff] border-opacity-20">
                <div className="rounded-full bg-white border-2 w-20 h-20 mt-5">
                  <img
                    src={
                      creatorData?.photo_url || eventData?.creator?.creatorimage
                        ? creatorData?.photo_url ||
                          eventData?.creator?.creatorimage
                        : img.src
                    }
                    className="rounded-full w-full h-full object-cover"
                    alt=""
                  />
                </div>
                <div className="flex ml-3 flex-col justify-start items-start mt-3">
                  <p className="font-normal text-[#fff]">Hosted By:</p>
                  <p className="font-bold text-[#fff]">
                    {creatorData?.full_name ||
                      creatorData?.display_name ||
                      creatorData?.displayName ||
                      eventData?.organizer ||
                      eventData?.creator?.creator ||
                      "Anonymous"}
                  </p>
                </div>
              </div>
            </div>
            <div
              style={{
                border: "1px solid rgba(255, 255, 255, 0.20)",
                background: "rgba(255, 255, 255, 0.10)",
                backdropFilter: "blur(40px)",
              }}
              className="flex flex-col justify-center items-center w-full p-5 lg:p-[2px] xl:p-[9px] rounded-xl"
            >
              <div className="flex w-full flex-row justify-center items-center gap-x-6">
                <div
                  onClick={() =>
                    window.open(
                      "https://www.facebook.com/Circledot.ooo",
                      "_blank"
                    )
                  }
                  style={{
                    background: "rgba(255, 255, 255, 0.10)",
                  }}
                  className="h-12 cursor-pointer w-12 rounded-full flex items-center justify-center"
                >
                  <img src="/facebook.png" alt="" className="h-6 w-6" />
                </div>
                <div
                  onClick={() =>
                    window.open(
                      "https://www.linkedin.com/company/circledotooo/",
                      "_blank"
                    )
                  }
                  style={{
                    background: "rgba(255, 255, 255, 0.10)",
                  }}
                  className="h-12 cursor-pointer w-12 rounded-full flex items-center justify-center"
                >
                  <img src="/linkedin.png" alt="" className="h-6 w-6" />
                </div>
                <div
                  onClick={() =>
                    window.open(
                      "https://www.instagram.com/circledot.ooo/",
                      "_blank"
                    )
                  }
                  style={{
                    background: "rgba(255, 255, 255, 0.10)",
                  }}
                  className="h-12 cursor-pointer w-12 rounded-full flex items-center justify-center"
                >
                  <img src="/instagram.png" alt="" className="h-6 w-6" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full h-full">
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Feedback;
