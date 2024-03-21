import React, { useState, useEffect, useMemo } from "react";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Header from "@/components/Common/Header";
import { useRouter } from "next/router";
import moment from "moment";
import { LuCalendarDays } from "react-icons/lu";
import { FaLocationDot } from "react-icons/fa6";
import { FaTag } from "react-icons/fa6";
import { FaClock } from "react-icons/fa";
import { LogoUrl } from "@/utils/logo";
import {
  doc,
  onSnapshot,
  getDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db, auth } from "@/firebase";
import Footer from "@/components/Common/Footer";
import { ChevronDown } from "@/icons";
import { useAuthState } from "react-firebase-hooks/auth";
import QRCode from "qrcode";
import axios from "axios";
import Loading from "@/components/Loading";
import Register from "@/components/Home/Register";
import toast from "react-simple-toasts";
import { ThreeDots } from "react-loader-spinner";
import loaderGif from "../../../public/events/Loader.gif";
import { getIdToken } from "firebase/auth";
import bgImage from "@/public/revamp/bg-createEvent.jpg";
import Head from "next/head";

// Initialize Stripe
const stripePromise = loadStripe(
  "pk_live_51MjDngGLr4LCCDW5IdOhJ7P18FVpynj3fc5R9H1GntDL1pIZO0mkGLgg08gEEvcNgv9dOyHXdxcrPK1eAkz778OL00y7Yq5Ur0"
);

//checkout form
const useOptions = () => {
  const options = useMemo(
    () => ({
      style: {
        base: {
          fontSize: "16px",
          color: "#424770",
          letterSpacing: "0.025em",
          fontFamily: "Source Code Pro, monospace",
          "::placeholder": {
            color: "#aab7c4",
          },
          border: "2px solid #EAEAEA",
        },
        invalid: {
          color: "#9e2146",
        },
      },
    }),
    []
  );

  return options;
};

const MyForm = () => {
  const router = useRouter();
  const { eventid } = router.query;
  const [nameOnCard, setNameOnCard] = useState("");
  const [EventData, setEventData] = useState({});
  const [creatorData, setCreatorData] = useState({});
  const [showticketModal, setShowTicketModal] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const options = useOptions();
  const [user] = useAuthState(auth);
  const [showFreeModal, setShowFreeModal] = useState(false);
  const [attendeList, setAttendeList] = useState({});
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [loading, setIsLoading] = useState(false);
  const [CircleData, setCircleDtata] = useState({});
  const [qrCodeBase64, setQRCodeBase64] = useState(null);
  const [userData, setUserData] = useState("");
  const [checkoutEmail, setCheckoutEmail] = useState("");
  const [checkoutPhoneNumber, setCheckoutPhoneNumber] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvc, setCvc] = useState("");
  const timestamp = EventData?.timefrom?.seconds * 1000;
  const formattedTime = moment(timestamp).local().format("LT");
  const [paymentLoader, setPaymentLoader] = useState(false);
  const [loader1, setLoader1] = useState(true);
  const [loader2, setLoader2] = useState(true);
  const [loader3, setLoader3] = useState(true);
  const [loader4, setLoader4] = useState(true);
  const [loader5, setLoader5] = useState(true);
  const [loader6, setLoader6] = useState(true);
  const [circleAccessToken, setCircleAccessToken] = useState("");

  ///getting event details
  useEffect(() => {
    if (eventid?.length > 0) {
      // Reference of event
      const eventRef = doc(db, "events", eventid);

      return onSnapshot(eventRef, async (docquery) => {
        if (docquery.exists()) {
          setEventData(docquery?.data() || {});

          // Reference of creator

          const attendesData = docquery?.data()?.attendees || [];
          let attendees_list_temp_array = [];

          if (attendesData?.length > 0) {
            attendesData?.map((item) => {
              attendees_list_temp_array.push(item?.id);
            });
          }
          setAttendeList(attendees_list_temp_array || []);

          // Snapshot for circleRef
        }
        setLoader1(false);
      });
    }
  }, [eventid]);

  //getting attendee data from fireStore
  const AttendeesData = async () => {
    try {
      // Define the path to the event document
      const eventRef = doc(db, "events", eventid);
      // Create a reference to the /Users/123 document
      const userRef = doc(db, "Users", user?.uid);
      // Update the attendee array using arrayUnion to append the user reference
      await updateDoc(eventRef, {
        attendees: arrayUnion(userRef),
      });
      console.log("Attendee data pushed successfully!");
    } catch (error) {
      console.error("Error pushing attendee data:", error);
    }
  };

  //add back checkout email and number to fireStore for attendee
  const StoreUserDetails = async () => {
    try {
      const userRef = doc(db, "Users", user?.uid);
      const userDoc = await getDoc(userRef);
      // Document already exists, update the additional fields
      await updateDoc(userRef, {
        checkoutemail: email,
        checkoutmobilenumber: mobileNumber,
      });
    } catch (error) {
      console.error(error);
      // Add any additional error handling or logging here
    }
  };

  useEffect(() => {
    const getIdTokenForUser = async () => {
      if (user) {
        try {
          const idToken = await getIdToken(user);
          setCircleAccessToken(idToken);
          console.log("ACCESS TOKEN: ", idToken);
        } catch (error) {
          console.error("Error getting ID token:", error);
        }
      }
    };
    console.log("USER DATA", user);
    getIdTokenForUser();
  }, [user]);

  const MakePayment = async (body) => {
    const headers = {
      "Content-Type": "application/json",
    };
    try {
      setIsLoading(true); // Show loader before making the API call

      // Make the API call
      const response = await fetch(`/api/payment`, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data?.errorStatus == 500) {
        let message = data.message || "";
        let parsedError = JSON.parse(message);
        console.error("state", "error", parsedError?.code);
      }

      if (data?.paymentIntentConfirm?.status === "succeeded") {
        // Show the free modal
        AttendeesData();
        setShowFreeModal(true);
        console.log("state", "Transaction Successful");
        toast("Transaction Successful!");
        try {
          var myHeaders = new Headers();
          myHeaders.append("accessToken", circleAccessToken);

          var requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow",
          };

          fetch(
            `https://api.circle.ooo/api/circle/email/event?eventId=${eventid}&emailType=ATTEND-EVENT-MAIL`,
            requestOptions
          )
            .then((response) => response.text())
            .then((result) => console.log("MAIL RESULT:", result))
            .catch((error) => console.log("error", error));
        } catch (error) {
          console.log(error);
        }
        // Navigate to another screen after a delay
        setTimeout(() => {
          router.push(`/events/${eventid}`);
        }, 3000); // Delay of 30 seconds (adjust as needed)
      }

      setIsLoading(false); // Hide loader after API call is complete
    } catch (error) {
      console.log(error);
    }
  };

  const checkEmail = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Example usage
    const isValidEmail = emailRegex.test(checkoutEmail);
    if (checkoutEmail !== "") {
      if (isValidEmail) {
        return true;
      } else {
        toast("Please Enter Valid Checkout Email!");
        setPaymentLoader(false);
        return false;
      }
    } else {
      toast("Please Enter Checkout Email!");
      setPaymentLoader(false);
      return false;
    }
  };

  const checkPhone = () => {
    const phoneNumberRegex = /^[+]?[0-9-() ]{8,20}$/;

    // Example usage
    const isValidPhoneNumber = phoneNumberRegex.test(checkoutPhoneNumber);
    if (checkoutPhoneNumber !== "") {
      if (isValidPhoneNumber) {
        return true;
      } else {
        toast("Please Enter Valid Checkout Phone Number!");
        setPaymentLoader(false);
        return false;
      }
    } else {
      toast("Please Enter Checkout Phone Number!");
      setPaymentLoader(false);
      return false;
    }
  };

  const handleSubmit = async (event) => {
    setPaymentLoader(true);
    event.preventDefault();

    if (checkEmail() === true) {
      if (checkPhone() === true) {
        try {
          const userRef = doc(db, "Users", user?.uid);
          const userDoc = await getDoc(userRef);
          // Document already exists, update the additional fields
          await updateDoc(userRef, {
            checkoutemail: checkoutEmail,
            checkoutmobilenumber: checkoutPhoneNumber,
          });
        } catch (error) {
          console.error(error);
        }

        let userName = user?.displayName || "";
        let userEmail = user?.email || "";
        let eventName = EventData?.name;
        let EventId = EventData?.uid;
        let currentUserId = user?.uid;
        let description = `${eventName} - Event Ticket Payment for ${EventId} by ${userName} - ${currentUserId}`;
        let amount = parseInt(EventData?.ticketPrice);
        const card = elements.getElement(CardNumberElement);

        if (!stripe || !elements) {
          toast("Stripe Error, Please try again!");
          setPaymentLoader(false);
          return;
        }
        if (elements == null) {
          toast("Stripe Error, Please try again!");
          setPaymentLoader(false);
          return;
        }
        if (card == null) {
          toast("Stripe Card Error, Please try again!");
          setPaymentLoader(false);
          return;
        }

        // Use your card Element with other Stripe.js APIs
        const { error, paymentMethod } = await stripe.createPaymentMethod({
          type: "card",
          card,
          billing_details: {
            name: userName || "",
            email: userEmail || "",
          },
        });

        if (error) {
          toast("Error:" + " " + error.message);
          setPaymentLoader(false);
        } else {
          let paymentDetails = {
            amount: amount * 100,
            currency: "USD",
            description: description,
          };
          let body = {
            paymentMethod,
            paymentDetails,
          };
          MakePayment(body);
        }
      }
    }
  };

  useEffect(() => {
    if (eventid?.length > 0) {
      // Reference of event
      const eventRef = doc(db, "events", eventid);

      return onSnapshot(eventRef, async (docquery) => {
        if (docquery.exists()) {
          setEventData(docquery?.data() || {});

          // Reference of creator
          const creatorRef = docquery?.data()?.creator;
          const circleRef = docquery?.data()?.circle_id;

          // Snapshot for circleRef
          if (circleRef) {
            const circleRefSnapshot = await getDoc(circleRef);
            if (circleRefSnapshot.exists()) {
              const circleData = circleRefSnapshot.data();
              setCircleDtata(circleData);

              // Update state or do something with circleData
            }
          }
        }
        setLoader2(false);
      });
    }
  }, [eventid]);

  // /email ticket to me
  const EmailMe = async () => {
    // Set loading state to true
    setIsLoading(true);

    const eventId = EventData?.uid;
    const circleId = CircleData?.id || "JfHpj2gfm4viA7RBPJ8z";
    const currentUserId = user?.uid;
    const creatorId = creatorData?.uid;
    const eventName = EventData?.name;
    const eventAddress = EventData?.location;
    const eventdate = moment(EventData?.timefrom?.seconds * 1000)
      .local()
      .format("LLLL");
    const price =
      EventData?.ticketPrice !== "0.00" ? EventData?.ticketPrice : "Free";
    const name =
      creatorData?.full_name ||
      creatorData?.display_name ||
      creatorData?.displayName ||
      "Anonymous";
    const eventtime = formattedTime;
    const email = user?.email;

    try {
      // Start generating QR code and await the result
      let dataUrl = await GenerateQr(
        eventId,
        circleId,
        currentUserId,
        creatorId
      );

      if (dataUrl) {
        let msgbody = {
          logo: LogoUrl,
          qrcode: dataUrl,
          eventname: eventName,
          eventaddress: eventAddress,
          eventdate: eventdate,
          price: price,
          name: name,
          eventtime: eventtime,
        };

        // Make the API call to send the email
        await axios.post("https://api.circle.ooo/ticket/", {
          usersdata: email,
          bodymessage: msgbody,
        });

        // Email sent successfully, set loading state to false
        setIsLoading(false);

        // Optionally, perform any success actions or display a success message
        console.log("Email sent successfully!");
      }
    } catch (error) {
      // Error occurred, set loading state to false
      setIsLoading(false);

      // Display or handle the error as needed
      console.error("An error occurred while sending the email:", error);
    }
  };

  //generation dynamic link qr code
  const GenerateQr = async (eventId, circleId, currentUserId, creatorId) => {
    try {
      const link = `https://nowwsocial.page.link?id=events_${eventId}_${circleId}_${currentUserId}_${creatorId}`;
      let id = `events_${eventId}_${circleId}_${currentUserId}_${creatorId}`;

      let response = await axios.post("/api/database/getdynamiclink", {
        id: id,
        link: link,
      });

      let dynamicLink = response.data.shortLink;

      const qrCodeDataURL = await QRCode.toDataURL(dynamicLink);

      let dataUrl = qrCodeDataURL.split(",")[1];
      return dataUrl;
    } catch (error) {
      console.error("state", "QR code generation error:", error);
      return "";
    }
  };

  useEffect(() => {
    const generateQRCode = async (
      eventId,
      circleId,
      currentUserId,
      creatorId
    ) => {
      try {
        const link = `https://nowwsocial.page.link?id=events_${eventId}_${circleId}_${currentUserId}_${creatorId}`;
        let id = `events_${eventId}_${circleId}_${currentUserId}_${creatorId}`;
        let response = await axios.post("/api/database/getdynamiclink", {
          id: id,
          link: link,
        });
        let dynamicLink = response.data.shortLink;

        const qrCodeDataURL = await QRCode.toDataURL(dynamicLink);
        setQRCodeBase64(qrCodeDataURL);
        setLoader3(false);
      } catch (error) {
        console.error("QR code generation error:", error);
        setLoader3(false);
      }
    };

    generateQRCode();
  }, []);

  // Get event details
  useEffect(() => {
    if (eventid?.length > 0) {
      // Reference of event
      const eventRef = doc(db, "events", eventid);

      return onSnapshot(eventRef, async (docquery) => {
        if (docquery.exists()) {
          setEventData(docquery?.data() || {});

          // Reference of creator
          const creatorRef = docquery?.data()?.creator;
          const circleRef = docquery?.data()?.circle_id;

          onSnapshot(creatorRef, (docval) => {
            if (docval?.exists()) {
              setCreatorData(docval?.data() || {});
            }
          });

          // Snapshot for circleRef
        }
        setLoader4(false);
      });
    }
  }, [eventid]);

  // Get User Details

  useEffect(() => {
    if (user && user?.uid) {
      // Reference of event
      const userRef = doc(db, "Users", user?.uid);

      return onSnapshot(userRef, async (docquery) => {
        if (docquery.exists()) {
          setUserData(docquery.data());
        }
        setLoader5(false);
      });
    }
  }, [user]);

  useEffect(() => {
    if (userData !== "") {
      setCheckoutEmail(userData?.checkoutemail);
      setCheckoutPhoneNumber(userData?.checkoutmobilenumber);
      setLoader6(false);
    }
  }, [userData]);

  // handle card details

  const handleCardNumberChangeNew = (e) => {
    // let input = e.target.value.replace(/\D/g, "");
    // input = input.replace(/(\d{4})/g, "$1 ").trim();
    // setCardNumber(input);
  };

  const handleCardNameChange = (e) => {
    setCardName(e.target.value);
  };

  const handleExpiryDateChange = (e) => {
    // let input = e.target.value.replace(/\D/g, "");
    // input = input.replace(/(\d{2})(\d{2})/g, "$1/$2").trim();
    // setExpiryDate(input);
  };

  const handleCvcChange = (e) => {
    // setCvc(e.target.value.replace(/\D/g, ""));
  };

  const inputStyle = {
    color: "#fff",
    ":-webkit-autofill": {
      color: "#fff",
    },
    "::placeholder": {
      color: "#969CA8",
    },
  };

  return (
    <>
      <Head>
        <title>CIRCLE - Checkout</title>
        <meta
          name="description"
          content="Circle.ooo ❤️'s our customers! Events: beautiful, fast & simple for all."
        />
        <meta
          property="og:image"
          content="https://firebasestorage.googleapis.com/v0/b/noww-d5ce2.appspot.com/o/circles%2FbannerCircle.png?alt=media&token=c951bb6c-8c98-4e3f-9a30-40b6a5ec65d5"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* {loader1 === false &&
      loader2 === false &&
      loader3 === false &&
      loader4 === false &&
      loader5 === false &&
      loader6 === false ? (
        <> */}
      <div className="w-full h-auto flex gap-10 flex-col lg:flex-row justify-start items-start p-5 lg:p-20 lg:pt-10">
        {/* Left */}
        <div className="w-full lg:w-2/3 flex flex-col justify-center items-center rounded-xl">
          <div className="flex flex-col justify-center items-center w-full rounded-xl">
            <div
              style={{
                border: "1px solid rgba(255, 255, 255, 0.16)",
                background:
                  "linear-gradient(149deg, rgba(255, 255, 255, 0.20) 0.71%, rgba(255, 255, 255, 0.10) 98.8%)",
                backdropFilter: "blur(40px)",
              }}
              className="w-full flex flex-col rounded-xl justify-center rounded-xl items-center"
            >
              <div className="flex w-full justify-between items-center p-4 rounded-xl">
                <h1 className="font-semibold text-xl text-[#fff] w-full text-center lg:text-start">
                  Checkout Details
                </h1>
                <ChevronDown className="w-4 h-4 text-[#fff] text-opacity-70 font-bold" />
              </div>
              <div className="flex w-full gap-5 flex-col lg:flex-row justify-center lg:justify-between items-center px-4 py-6">
                <input
                  style={{
                    background: "rgba(255, 255, 255, 0.10)",
                  }}
                  className="p-3 border-[0.5px] border-opacity-20 border-[#fff] focus:border-[0.5px] focus:border-opacity-60 text-[#fff] w-full rounded-lg focus:outline-none"
                  id="email"
                  type="email"
                  value={checkoutEmail}
                  onChange={(e) => {
                    setCheckoutEmail(e.target.value);
                  }}
                  placeholder="Checkout Email"
                  required
                />
                <input
                  style={{
                    background: "rgba(255, 255, 255, 0.10)",
                  }}
                  className="p-3 border-[0.5px] border-opacity-20 border-[#fff] focus:border-[0.5px] focus:border-opacity-60 text-[#fff] w-full rounded-lg focus:outline-none"
                  id="number"
                  type="text"
                  value={checkoutPhoneNumber}
                  onChange={(e) => {
                    setCheckoutPhoneNumber(e.target.value);
                  }}
                  placeholder="Checkout Phone Number"
                  required
                />
              </div>
            </div>

            <div
              style={{
                border: "1px solid rgba(255, 255, 255, 0.16)",
                background:
                  "linear-gradient(149deg, rgba(255, 255, 255, 0.20) 0.71%, rgba(255, 255, 255, 0.10) 98.8%)",
                backdropFilter: "blur(40px)",
              }}
              className="w-full flex mt-8 flex-col rounded-xl justify-center rounded-xl items-center"
            >
              <div className="flex w-full justify-between p-4 rounded-xl items-center">
                <h1 className="font-semibold text-xl text-[#fff] w-full text-center lg:text-start">
                  Payment Options
                </h1>
                <ChevronDown className="w-4 h-4 text-[#fff] text-opacity-70 font-bold" />
              </div>
              <div className="flex w-full gap-5 flex-col justify-center items-center px-4 py-6">
                <div className="w-full flex justify-center lg:justify-start items-center flex-col">
                  <p className="font-semibold text-[#fff] text-[18px] w-full">
                    Debit/Credit Card
                  </p>
                  <p className="text-[#fff] text-opacity-80 text-[14px] w-full">
                    Enter Your Card Detail
                  </p>
                </div>
                <CardNumberElement
                  options={{
                    style: {
                      base: inputStyle,
                    },
                  }}
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  className="p-4 bg-[#fff] bg-opacity-10 border-[0.5px] border-opacity-20 border-[#fff] focus:border-[0.5px] focus:border-opacity-60 text-[#fff] w-full rounded-lg focus:outline-none"
                  value={cardNumber}
                  onChange={handleCardNumberChangeNew}
                  maxLength={19}
                  placeholder="Card Number"
                />

                <input
                  type="text"
                  id="cardName"
                  style={{
                    background: "rgba(255, 255, 255, 0.10)",
                  }}
                  className="p-3 border-[0.5px] border-opacity-20 border-[#fff] text-[#fff] w-full rounded-lg focus:outline-none"
                  name="cardName"
                  value={cardName}
                  onChange={handleCardNameChange}
                  placeholder="Name on Card (Optional)"
                />

                <div className="flex gap-x-5 mb-5 flex-col lg:flex-row justify-center lg:justify-between items-center w-full">
                  <CardExpiryElement
                    options={{
                      style: {
                        base: inputStyle,
                      },
                    }}
                    type="text"
                    className="p-4 bg-[#fff] bg-opacity-10 border-[0.5px] border-opacity-20 border-[#fff] focus:border-[0.5px] focus:border-opacity-60 text-[#fff] w-full rounded-lg focus:outline-none"
                    id="expiry"
                    name="expiryDate"
                    value={expiryDate}
                    onChange={handleExpiryDateChange}
                    maxLength={5}
                    placeholder="Expiry (MM/YY)"
                  />

                  <CardCvcElement
                    options={{
                      style: {
                        base: inputStyle,
                      },
                    }}
                    type="text"
                    id="cvc"
                    className="p-4 mt-5 lg:mt-0 bg-[#fff] bg-opacity-10 border-[0.5px] border-opacity-20 border-[#fff] focus:border-[0.5px] focus:border-opacity-60 text-[#fff] w-full rounded-lg focus:outline-none"
                    name="cvc"
                    value={cvc}
                    onChange={handleCvcChange}
                    maxLength={3}
                    placeholder="CVV"
                  />
                </div>
              </div>
            </div>

            <div
              style={{
                border: "1px solid rgba(25, 112, 214, 0.30)",
                background: "rgba(32, 29, 47, 0.60)",
              }}
              className="w-full flex mt-8 flex-col rounded-xl justify-center rounded-xl items-center"
            >
              <div className="flex w-full justify-center flex-col p-4 rounded-xl items-center">
                <h1 className="font-semibold text-xl text-[#fff] w-full text-center lg:text-start">
                  Note
                </h1>
                <div className="flex w-full justify-start items-center flex-col mt-4">
                  <p className="text-[#fff] text-opacity-80 w-full text-start">
                    1. Registrations/Tickets once booked cannot be exchanged,
                    cancelled or refunded
                  </p>
                  <p className="text-[#fff] text-opacity-80 mt-2 w-full text-start">
                    2. In case of Credit/Debit Card bookings, the Credit/Debit
                    Card and Card holder must be present at the ticket counter
                    while collecting the ticket(s).
                  </p>
                  <p className="text-[#fff] text-opacity-80 mt-2 w-full text-start">
                    © Circle.ooo Pvt. Ltd.{" "}
                    <span
                      onClick={() => {
                        router.push("/privacy-policy");
                      }}
                      className="cursor-pointer font-semibold underline"
                    >
                      Privacy Policy
                    </span>{" "}
                    |{" "}
                    <span
                      onClick={() => {
                        router.push("/contact");
                      }}
                      className="cursor-pointer font-semibold underline"
                    >
                      Contact Us
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="w-full lg:w-1/3 flex flex-col justify-start h-full items-center mt-[-2%] lg:mt-0">
          <div className="flex flex-col justify-center items-center w-full rounded-xl">
            <div
              style={{
                border: "1px solid rgba(255, 255, 255, 0.16)",
                background:
                  "linear-gradient(149deg, rgba(255, 255, 255, 0.20) 0.71%, rgba(255, 255, 255, 0.10) 98.8%)",
                backdropFilter: "blur(40px)",
              }}
              className="w-full flex flex-col rounded-xl justify-center rounded-xl items-center"
            >
              <div className="flex w-full justify-start p-4 rounded-xl items-center">
                <h1 className="font-semibold w-full text-center lg:text-start text-xl text-[#fff]">
                  Order Summary
                </h1>
              </div>
              <div className="flex w-full gap-2 flex-col justify-start items-center px-6 py-6">
                <div className="flex justify-start w-full items-center rounded-xl mt-[-6%] lg:mt-[-2%]">
                  <img
                    src={EventData.large_image}
                    alt=""
                    className="object-contain rounded-xl lg:h-40"
                  />
                </div>
                <p className="w-full text-2xl font-semibold text-start">
                  <span
                    style={{
                      background:
                        "linear-gradient(269deg, #FFF -1.77%, #9E22FF 37.99%)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {EventData.name}
                  </span>
                </p>
                <div className="flex flex-row text-[#fff] text-opacity-80 justify-start w-full items-center">
                  <LuCalendarDays size={20} />
                  <p className="font-Montserrat ml-3">
                    {moment(EventData?.timefrom?.seconds * 1000)
                      .local()
                      .format("LL") +
                      " - " +
                      moment(EventData?.timeto?.seconds * 1000)
                        .local()
                        .format("LL")}
                  </p>
                </div>

                <div className="flex flex-row text-[#fff] text-opacity-80 justify-start w-full items-center">
                  <FaClock size={20} />
                  <p className="font-Montserrat ml-3">
                    {moment(EventData?.timefrom?.seconds * 1000)
                      .local()
                      .format("LT")}{" "}
                    -{" "}
                    {moment(EventData?.timeto?.seconds * 1000)
                      .local()
                      .format("LT")}
                  </p>
                </div>

                <div className="flex flex-row text-[#fff] text-opacity-80 justify-start w-full items-center">
                  <FaLocationDot size={20} />
                  <p
                    onClick={() => {
                      const generateGoogleMapsUrl = (locationText) => {
                        const encodedLocation =
                          encodeURIComponent(locationText);
                        return `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
                      };

                      const locationText = EventData?.location;
                      const googleMapsUrl = generateGoogleMapsUrl(locationText);
                      window.open(googleMapsUrl, "_blank");
                    }}
                    className="font-Montserrat ml-3 cursor-pointer"
                  >
                    {EventData?.location}
                  </p>
                </div>

                <div className="flex flex-row text-[#fff] text-opacity-80 justify-start w-full items-center">
                  <FaTag size={20} />
                  <p className="font-Montserrat ml-3">
                    {EventData?.ticketPrice === "0.00" ? "FREE" : "PAID"}
                  </p>
                </div>

                <p className="w-full border-[#fff] border-opacity-10 border-b-2 mt-3 mb-3"></p>

                <div className="w-full flex justify-center items-center">
                  <button
                    onClick={handleSubmit}
                    disabled={paymentLoader === true}
                    className="w-full py-2 rounded-full bg-[#109641] text-white border border-[1px] border-[#fff] border-opacity-20 font-semibold"
                    id="button"
                    type="submit"
                  >
                    {paymentLoader === true ? (
                      <>
                        <div className="flex justify-center items-center w-full">
                          <ThreeDots
                            height="25"
                            color="#fff"
                            width="50"
                            radius="9"
                            ariaLabel="three-dots-loading"
                            visible={true}
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <p>Make Payment - ${EventData.ticketPrice}</p>
                      </>
                    )}
                  </button>
                </div>
              </div>
              {/*  */}
            </div>
            <div
              style={{
                border: "1px solid rgba(25, 112, 214, 0.30)",
                background: "rgba(32, 29, 47, 0.60)",
              }}
              className="w-full flex mt-8 flex-col rounded-xl justify-center rounded-xl items-center"
            >
              <div className="flex w-full justify-center flex-col p-4 rounded-xl items-center">
                <p className="font-semibold text-[#fff] w-full text-center lg:text-start">
                  As safe as it gets
                </p>
                <div className="flex-wrap flex gap-6 w-full justify-center lg:justify-start items-center mt-4">
                  <svg
                    width="90"
                    height="30"
                    viewBox="0 0 90 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M22.4416 29.2606H14.6732L8.84784 6.38297C8.57135 5.3306 7.98427 4.40025 7.1207 3.96176C4.96555 2.85982 2.59072 1.98284 0 1.54054V0.659752H12.5142C14.2414 0.659752 15.5368 1.98284 15.7526 3.51946L18.7752 20.0219L26.5397 0.659752H34.0922L22.4416 29.2606ZM38.41 29.2606H31.0734L37.1146 0.659752H44.4512L38.41 29.2606ZM53.9429 8.58293C54.1588 7.0425 55.4542 6.16171 56.9654 6.16171C59.3403 5.94056 61.9272 6.38286 64.0861 7.48099L65.3815 1.32309C63.2226 0.442301 60.8477 0 58.6926 0C51.5719 0 46.3904 3.96164 46.3904 9.4599C46.3904 13.6427 50.0606 15.8389 52.6514 17.162C55.4542 18.4813 56.5336 19.3621 56.3178 20.6814C56.3178 22.6603 54.1588 23.5411 52.0037 23.5411C49.4129 23.5411 46.8222 22.8814 44.4512 21.7795L43.1558 27.9412C45.7465 29.0393 48.5494 29.4816 51.1401 29.4816C59.1244 29.699 64.0861 25.7412 64.0861 19.8006C64.0861 12.3196 53.9429 11.8811 53.9429 8.58293ZM89.7627 29.2606L83.9374 0.659752H77.6803C76.3849 0.659752 75.0895 1.54054 74.6577 2.85982L63.8706 29.2606H71.4231L72.9306 25.0816H82.2102L83.0738 29.2606H89.7627ZM78.7595 8.36184L80.9147 19.141H74.8735L78.7595 8.36184Z"
                      fill="#172B85"
                    />
                  </svg>
                  <svg
                    width="54"
                    height="32"
                    viewBox="0 0 54 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M27.2907 28.0002C24.4809 30.3686 20.8361 31.7984 16.8534 31.7984C7.96673 31.7984 0.762695 24.6801 0.762695 15.8992C0.762695 7.11831 7.96673 0 16.8534 0C20.8361 0 24.4809 1.42978 27.2907 3.79821C30.1005 1.42978 33.7452 0 37.728 0C46.6146 0 53.8186 7.11831 53.8186 15.8992C53.8186 24.6801 46.6146 31.7984 37.728 31.7984C33.7452 31.7984 30.1005 30.3686 27.2907 28.0002Z"
                      fill="#ED0006"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M27.291 28.0003C30.7507 25.0841 32.9445 20.7448 32.9445 15.8992C32.9445 11.0536 30.7507 6.7143 27.291 3.79809C30.1008 1.42973 33.7455 0 37.7282 0C46.6148 0 53.8189 7.11831 53.8189 15.8992C53.8189 24.6801 46.6148 31.7984 37.7282 31.7984C33.7455 31.7984 30.1008 30.3687 27.291 28.0003Z"
                      fill="#F9A000"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M27.2906 28.0001C30.7503 25.0839 32.944 20.7447 32.944 15.8991C32.944 11.0536 30.7503 6.7143 27.2906 3.7981C23.8309 6.7143 21.6372 11.0536 21.6372 15.8991C21.6372 20.7447 23.8309 25.0839 27.2906 28.0001Z"
                      fill="#FF5E00"
                    />
                  </svg>
                  <svg
                    width="74"
                    height="30"
                    viewBox="0 0 74 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M34.1696 23.2909V14.5528H38.6796C40.5276 14.5528 42.0874 13.9335 43.359 12.7123L43.6642 12.4026C45.987 9.87407 45.8344 5.93502 43.359 3.59567C42.1214 2.35718 40.4259 1.68634 38.6796 1.72074H31.4399V23.2909H34.1696ZM34.1699 11.9034V4.36929H38.7484C39.7319 4.36929 40.6646 4.74771 41.3598 5.43576C42.8351 6.88065 42.869 9.28881 41.4446 10.7853C40.7493 11.525 39.7658 11.9378 38.7484 11.9034H34.1699ZM56.3973 9.68449C55.2274 8.60082 53.6337 8.05039 51.6161 8.05039C49.0221 8.05039 47.0723 9.01365 45.7837 10.923L48.1913 12.4539C49.0729 11.1466 50.2767 10.4929 51.8026 10.4929C52.769 10.4929 53.7015 10.8542 54.4306 11.5078C55.1427 12.1271 55.5496 13.0215 55.5496 13.9676V14.604C54.4984 14.0192 53.1759 13.7096 51.5483 13.7096C49.6494 13.7096 48.1235 14.1568 46.9875 15.0684C45.8515 15.9801 45.2751 17.1842 45.2751 18.7151C45.2412 20.1084 45.8346 21.4329 46.8858 22.3273C47.9539 23.2906 49.3103 23.7722 50.904 23.7722C52.786 23.7722 54.278 22.9294 55.4139 21.2436H55.5326V23.2906H58.1436V14.1912C58.1436 12.2819 57.5672 10.7682 56.3973 9.68449ZM48.9885 20.5726C48.4289 20.1598 48.0898 19.4889 48.0898 18.7665C48.0898 17.958 48.4628 17.2872 49.192 16.7539C49.9381 16.2207 50.8708 15.9455 51.973 15.9455C53.4992 15.9283 54.6862 16.2723 55.534 16.9603C55.534 18.13 55.0762 19.1449 54.1775 20.0049C53.3635 20.8306 52.2613 21.295 51.1082 21.295C50.3451 21.3122 49.599 21.0542 48.9885 20.5726ZM64.0097 29.7755L73.1313 8.53214H70.1642L65.9425 19.128H65.8917L61.5682 8.53214H58.6012L64.5862 22.3446L61.1952 29.7755H64.0097Z"
                      fill="white"
                    />
                    <path
                      d="M24.7459 12.661C24.7459 11.8182 24.6781 10.9753 24.5425 10.1497H13.0303V14.9144H19.6256C19.3543 16.4453 18.4727 17.8214 17.1842 18.6814V21.7776H21.1176C23.4235 19.6275 24.7459 16.4453 24.7459 12.661Z"
                      fill="#4285F4"
                    />
                    <path
                      d="M13.0307 24.7703C16.3199 24.7703 19.1005 23.6695 21.1181 21.7773L17.1846 18.6811C16.0826 19.438 14.6753 19.868 13.0307 19.868C9.84326 19.868 7.14747 17.6835 6.18106 14.7593H2.12891V17.9587C4.19737 22.1386 8.41907 24.7703 13.0307 24.7703Z"
                      fill="#34A853"
                    />
                    <path
                      d="M6.1816 14.7596C5.67288 13.2287 5.67288 11.5601 6.1816 10.012V6.82983H2.1288C0.382196 10.3217 0.382196 14.4499 2.1288 17.9418L6.1816 14.7596Z"
                      fill="#FBBC04"
                    />
                    <path
                      d="M13.0307 4.90307C14.7771 4.86867 16.4556 5.53951 17.7102 6.76079L21.2029 3.21736C18.9818 1.11882 16.0656 -0.0336536 13.0307 0.00074861C8.41907 0.00074861 4.19737 2.64972 2.12891 6.82959L6.18106 10.029C7.14747 7.08761 9.84326 4.90307 13.0307 4.90307Z"
                      fill="#EA4335"
                    />
                  </svg>
                  <svg
                    width="75"
                    height="31"
                    viewBox="0 0 75 31"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M68.9926 20.1813H66.9667C66.5473 20.1813 66.1978 19.9037 66.1978 19.5567C66.1978 19.1404 66.5473 18.9322 66.9667 18.9322H70.6689L71.5078 17.0599H66.9667C65.0807 17.0599 64.0321 18.1688 64.0321 19.6261C64.0321 21.0835 65.0807 22.0536 66.6871 22.0536H68.713C69.1324 22.0536 69.482 22.3311 69.482 22.6781C69.482 23.0251 69.2023 23.3027 68.713 23.3027H64.2418V25.1749H68.713C70.599 25.1749 71.6476 24.066 71.6476 22.5393C71.6476 21.0126 70.6689 20.1813 68.9926 20.1813ZM60.8192 20.1813H58.7934C58.3739 20.1813 58.0244 19.9037 58.0244 19.5567C58.0244 19.1404 58.3739 18.9322 58.7934 18.9322H62.4956L63.3344 17.0599H58.7934C56.9073 17.0599 55.8602 18.1688 55.8602 19.6261C55.8602 21.0835 56.9073 22.0536 58.5152 22.0536H60.5411C60.9605 22.0536 61.31 22.3311 61.31 22.6781C61.31 23.0251 61.0304 23.3027 60.5411 23.3027H56.0699V25.1749H60.5411C62.4271 25.1749 63.4743 24.066 63.4743 22.5393C63.5442 21.0141 62.5669 20.1813 60.8192 20.1813ZM47.8965 25.2429H54.8829V23.3706H50.1321V22.0536H54.813V20.1813H50.1321V18.8642H54.8829V16.992H47.8965V25.2443V25.2429ZM43.5651 20.5283H41.2596V18.8642H43.5651C44.1943 18.8642 44.5438 19.2806 44.5438 19.697C44.5438 20.1828 44.1943 20.5297 43.5651 20.5297M46.778 19.6276C46.778 18.0329 45.6595 16.992 43.8433 16.992H39.0226V25.2443H41.2582V22.402H42.0971L44.6123 25.2443H47.2673L44.5424 22.2632C45.9391 21.9162 46.778 20.9461 46.778 19.6276ZM34.8325 20.6685H32.4571V18.8657H34.8325C35.4617 18.8657 35.8112 19.282 35.8112 19.7678C35.8112 20.2536 35.5316 20.67 34.8325 20.67M35.1121 16.9949H30.2914V25.2472H32.527V22.5422H35.1121C36.9982 22.5422 38.1167 21.3639 38.1167 19.7678C38.0468 18.1038 36.9297 16.9934 35.1121 16.9934M29.8734 16.9934H27.0101L24.9144 19.4902L22.7487 16.9934H19.814L23.5162 21.0849L19.7441 25.2458H22.6074L24.843 22.6102L27.0786 25.2458H30.0118L26.2397 21.0155L29.872 16.9934H29.8734ZM12.4795 25.2458H19.4645V23.3735H14.6438V22.0564H19.3247V20.1842H14.6438V18.8671H19.4645V16.9949H12.4795V25.2472V25.2458ZM68.1537 11.4432L64.7311 6.45099H61.9363V14.634H64.1719V9.43213L67.6644 14.6325H70.3194V6.45099H68.1537V11.4446V11.4432ZM55.2994 11.1656L56.4864 8.39119L57.6734 11.1656H55.298H55.2994ZM55.0198 6.44954L51.3875 14.7019H53.8328L54.5319 13.0378H58.3739L59.073 14.7019H61.5882L57.886 6.45099H55.0213L55.0198 6.44954ZM47.7552 10.6104V10.4716C47.7552 9.22394 48.4543 8.39119 49.851 8.39119H52.2963V6.38159H49.6413C46.9163 6.38159 45.5196 8.11505 45.5196 10.4037V10.5425C45.5196 13.1087 47.1261 14.5646 49.5714 14.5646H50.3404L51.2477 12.6923H49.9209C48.5941 12.7617 47.7552 11.9983 47.7552 10.6119M42.167 14.634H44.4026V6.45099H42.167V14.634ZM37.8356 9.9179H35.5301V8.25384H37.8356C38.4648 8.25384 38.8143 8.67022 38.8143 9.0866C38.8143 9.57237 38.4648 9.91935 37.8356 9.91935M41.0485 9.0866C41.0485 7.49193 39.9299 6.45099 38.1153 6.45099H33.2945V14.7033H35.5301V11.7916H36.369L38.8842 14.6354H41.6092L38.8158 11.6543C40.2125 11.3767 41.0514 10.3372 41.0514 9.08804M24.8444 14.6354H31.8294V12.7631H27.0786V11.4461H31.6896V9.57381H27.0786V8.25673H31.8294V6.45099H24.8444V14.634V14.6354ZM17.7896 11.5834L15.9021 6.45099H12.4795V14.634H14.6452V8.73961L16.8109 14.634H18.7668L20.9325 8.73961V14.634H23.1681V6.45099H19.6756L17.7896 11.582V11.5834ZM5.77421 11.167L6.96119 8.39263L8.14816 11.167H5.77276H5.77421ZM5.49313 6.45099L1.86084 14.634H4.30615L5.00523 12.9699H8.84724L9.54632 14.634H12.0615L8.35788 6.45099H5.49313Z"
                      fill="#006FCF"
                    />
                  </svg>
                  <svg
                    width="73"
                    height="31"
                    viewBox="0 0 73 31"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M13.5993 4.63716C12.7552 5.6429 11.4046 6.43616 10.054 6.32284C9.88521 4.96296 10.5464 3.51809 11.3202 2.62567C12.1643 1.5916 13.6415 0.855001 14.8373 0.79834C14.978 2.21488 14.4294 3.60309 13.5993 4.63716ZM14.8233 6.59219C13.6335 6.52324 12.5478 6.95248 11.6709 7.2992C11.1066 7.52231 10.6287 7.71125 10.2651 7.71125C9.85713 7.71125 9.35952 7.51221 8.80082 7.28873C8.06874 6.9959 7.23177 6.66112 6.35406 6.67718C4.34226 6.70551 2.47114 7.85291 1.44414 9.68024C-0.666146 13.3349 0.895464 18.7461 2.9354 21.7208C3.93427 23.194 5.1301 24.8088 6.70578 24.7522C7.39898 24.7258 7.89763 24.5128 8.41369 24.2923C9.00781 24.0385 9.625 23.7748 10.5887 23.7748C11.519 23.7748 12.1092 24.0316 12.6757 24.2781C13.2144 24.5126 13.7318 24.7377 14.4998 24.7239C16.1317 24.6955 17.1587 23.2507 18.1576 21.7775C19.2355 20.1963 19.7092 18.6532 19.7811 18.419L19.7895 18.3919C19.7878 18.3902 19.7745 18.3841 19.751 18.3732C19.3906 18.2071 16.6365 16.9376 16.61 13.5332C16.5835 10.6757 18.7946 9.22797 19.1427 9.00007C19.1639 8.9862 19.1781 8.97685 19.1846 8.97197C17.7777 6.8755 15.583 6.64885 14.8233 6.59219ZM26.1203 24.5679V2.48407H34.3504C38.5991 2.48407 41.5676 5.43046 41.5676 9.73673C41.5676 14.043 38.5428 17.0177 34.2378 17.0177H29.5249V24.5679H26.1203ZM29.5248 5.37378H33.4499C36.4043 5.37378 38.0925 6.9603 38.0925 9.75087C38.0925 12.5414 36.4043 14.1421 33.4358 14.1421H29.5248V5.37378ZM52.8086 21.9188C51.9082 23.647 49.9245 24.7377 47.7861 24.7377C44.6207 24.7377 42.4119 22.8395 42.4119 19.9781C42.4119 17.1451 44.5504 15.516 48.5036 15.2752L52.7523 15.0203V13.802C52.7523 12.003 51.5846 11.0256 49.5025 11.0256C47.7861 11.0256 46.534 11.918 46.2808 13.2779H43.2138C43.3123 10.4165 45.9853 8.33421 49.601 8.33421C53.498 8.33421 56.0303 10.3882 56.0303 13.5754V24.5677H52.8789V21.9188H52.8086ZM48.7004 22.117C46.8855 22.117 45.7319 21.2387 45.7319 19.893C45.7319 18.5048 46.8433 17.6974 48.9677 17.5699L52.7521 17.3291V18.5756C52.7521 20.6438 51.0076 22.117 48.7004 22.117ZM66.4831 25.4323C65.1185 29.2994 63.5569 30.5743 60.2367 30.5743C59.9835 30.5743 59.1393 30.546 58.9424 30.4893V27.8404C59.1534 27.8687 59.6739 27.8971 59.9412 27.8971C61.4466 27.8971 62.2907 27.2596 62.8112 25.6023L63.1207 24.6249L57.3526 8.54719H60.912L64.9215 21.5935H64.9919L69.0014 8.54719H72.4623L66.4831 25.4323Z"
                      fill="white"
                    />
                  </svg>
                  <svg
                    width="136"
                    height="33"
                    viewBox="0 0 136 33"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M50.8202 7.9097H43.3677C42.8579 7.9097 42.4241 8.26768 42.3443 8.75489L39.3303 27.2335C39.2774 27.5612 39.5092 27.8681 39.8481 27.9197C39.8799 27.9244 39.9123 27.927 39.9451 27.927H43.503C44.0133 27.927 44.4471 27.568 44.5263 27.0808L45.3395 22.0967C45.4182 21.61 45.852 21.2509 46.3618 21.2504H48.7211C53.6305 21.2504 56.4635 18.9535 57.2035 14.4013C57.537 12.4098 57.2175 10.8449 56.2534 9.74912C55.1939 8.54594 53.3153 7.90918 50.8212 7.90918L50.8202 7.9097ZM51.6797 14.6587C51.2723 17.2443 49.2288 17.2443 47.2532 17.2443H46.1285L46.9174 12.4155C46.9654 12.1237 47.2252 11.9085 47.5307 11.9085H48.0459C49.3915 11.9085 50.6612 11.9085 51.317 12.6505C51.7083 13.0929 51.8279 13.7505 51.6786 14.6587H51.6797ZM73.0973 14.5754H69.5287C69.2231 14.5754 68.9628 14.7906 68.9154 15.0824L68.7575 16.0474L68.508 15.6978C67.7352 14.6134 66.0123 14.2513 64.2927 14.2513C60.349 14.2513 56.9803 17.1396 56.3245 21.191C55.9834 23.2118 56.4684 25.1445 57.654 26.492C58.7415 27.7311 60.2978 28.2475 62.149 28.2475C65.3269 28.2475 67.0885 26.2721 67.0885 26.2721L66.9295 27.2309C66.8751 27.5586 67.1063 27.8666 67.4447 27.9187C67.4771 27.9239 67.5094 27.926 67.5417 27.926H70.7563C71.2666 27.926 71.7004 27.567 71.7797 27.0797L73.7084 15.2689C73.7628 14.9427 73.5327 14.6353 73.1954 14.5832C73.163 14.578 73.1301 14.5754 73.0973 14.5754ZM68.1227 21.2916C67.7783 23.2628 66.16 24.5864 64.096 24.5864C63.0597 24.5864 62.2314 24.2649 61.6995 23.6557C61.1719 23.0507 60.9715 22.1899 61.1396 21.2311C61.4613 19.2766 63.1066 17.9098 65.1388 17.9098C66.1525 17.9098 66.9759 18.2354 67.5186 18.8498C68.0623 19.4704 68.2779 20.3364 68.1221 21.2911L68.1227 21.2916ZM92.1043 14.5754H88.5179C88.1747 14.5759 87.8535 14.7406 87.6605 15.0146L82.7145 22.0597L80.6176 15.2898C80.4856 14.8656 80.082 14.5754 79.6239 14.5754H76.0995C75.7562 14.5743 75.4776 14.8427 75.4765 15.1746C75.4765 15.2413 75.4878 15.307 75.5099 15.37L79.4601 26.579L75.7465 31.6481C75.5477 31.9185 75.6134 32.2937 75.8931 32.4854C75.9982 32.5579 76.1243 32.5964 76.2531 32.5964H79.8352C80.1747 32.5964 80.4926 32.4365 80.6861 32.1665L92.6141 15.518C92.8097 15.2455 92.7397 14.8713 92.4578 14.6822C92.3538 14.6124 92.2304 14.5748 92.1038 14.5748L92.1043 14.5754Z"
                      fill="#253B80"
                    />
                    <path
                      d="M103.978 7.90973H96.5245C96.0152 7.90973 95.5814 8.26824 95.5022 8.75493L92.4881 27.2335C92.4348 27.5607 92.6654 27.8677 93.0033 27.9192C93.0357 27.9239 93.068 27.9265 93.1003 27.9265H96.9255C97.2822 27.9265 97.5851 27.6749 97.6406 27.3346L98.4958 22.0967C98.5745 21.61 99.0083 21.251 99.5181 21.2504H101.876C106.787 21.2504 109.619 18.9535 110.36 14.4014C110.694 12.4098 110.373 10.845 109.409 9.74915C108.351 8.54597 106.473 7.90921 103.979 7.90921L103.978 7.90973ZM104.838 14.6588C104.431 17.2444 102.388 17.2444 100.411 17.2444H99.2875L100.077 12.4155C100.124 12.1237 100.384 11.9085 100.69 11.9085H101.205C102.549 11.9085 103.82 11.9085 104.476 12.6505C104.867 13.0929 104.986 13.7505 104.837 14.6588H104.838ZM126.254 14.5754H122.688C122.382 14.5744 122.122 14.7901 122.075 15.0824L121.918 16.0475L121.667 15.6978C120.894 14.6134 119.172 14.2513 117.453 14.2513C113.509 14.2513 110.142 17.1396 109.486 21.191C109.146 23.2118 109.628 25.1445 110.814 26.492C111.904 27.7311 113.458 28.2475 115.309 28.2475C118.487 28.2475 120.249 26.2721 120.249 26.2721L120.09 27.2309C120.035 27.5587 120.266 27.8666 120.605 27.9187C120.638 27.9239 120.671 27.9265 120.704 27.926H123.917C124.427 27.926 124.86 27.567 124.94 27.0798L126.87 15.269C126.922 14.9407 126.689 14.6332 126.349 14.5827C126.318 14.578 126.286 14.5754 126.254 14.5759V14.5754ZM121.279 21.2916C120.937 23.2629 119.317 24.5864 117.253 24.5864C116.219 24.5864 115.388 24.2649 114.856 23.6558C114.329 23.0508 114.13 22.19 114.296 21.2312C114.62 19.2766 116.263 17.9098 118.296 17.9098C119.309 17.9098 120.133 18.2355 120.675 18.8498C121.221 19.4704 121.437 20.3365 121.279 21.2911L121.279 21.2916ZM130.461 8.41675L127.402 27.2335C127.349 27.5607 127.58 27.8677 127.918 27.9192C127.95 27.9239 127.982 27.9265 128.015 27.9265H131.09C131.601 27.9265 132.034 27.568 132.113 27.0803L135.129 8.60277C135.183 8.27501 134.951 7.96757 134.612 7.91599C134.581 7.9113 134.549 7.90869 134.517 7.90869H131.073C130.767 7.90973 130.508 8.12494 130.461 8.41675H130.461Z"
                      fill="#179BD7"
                    />
                    <path
                      d="M8.38074 31.5176L8.95089 28.017L7.68124 27.9883H1.61914L5.83173 2.15987C5.8576 1.99678 6.0031 1.87641 6.17394 1.87745H16.3958C19.7893 1.87745 22.1308 2.56006 23.3536 3.9081C23.927 4.54017 24.2918 5.2009 24.4686 5.92781C24.6539 6.69067 24.6572 7.60204 24.4761 8.71403L24.4632 8.79532V9.50764L25.0366 9.82185C25.4741 10.036 25.8675 10.3263 26.1974 10.6775C26.6878 11.2178 27.0046 11.9051 27.1388 12.7196C27.2773 13.5575 27.2315 14.5543 27.0046 15.6824C26.7433 16.9805 26.3202 18.1112 25.7495 19.0361C25.2457 19.8652 24.5683 20.5827 23.761 21.1434C23.0027 21.6639 22.1012 22.0589 21.0826 22.3122C20.0954 22.5607 18.9696 22.6863 17.735 22.6863H16.9396C16.3705 22.6863 15.8181 22.8843 15.3843 23.2397C14.951 23.5987 14.6638 24.0943 14.5738 24.6388L14.514 24.954L13.5073 31.1236L13.4615 31.3503C13.4496 31.4222 13.4286 31.4576 13.3984 31.4821C13.3688 31.5056 13.3322 31.5186 13.2939 31.5191H8.38235L8.38074 31.5176Z"
                      fill="#253B80"
                    />
                    <path
                      d="M25.5787 8.87744C25.548 9.06607 25.5135 9.25887 25.4741 9.45688C24.1263 16.1491 19.5144 18.4606 13.6242 18.4606H10.6252C9.90473 18.4606 9.29792 18.9666 9.18583 19.6534L7.6505 29.0693L7.21561 31.7383C7.14933 32.1432 7.43494 32.5231 7.85367 32.5871C7.89301 32.5934 7.93289 32.596 7.97331 32.596H13.2923C13.9222 32.596 14.4574 32.1536 14.5565 31.5528L14.6088 31.2917L15.6101 25.1466L15.6742 24.8095C15.7723 24.2066 16.3085 23.7642 16.9385 23.7642H17.7339C22.8874 23.7642 26.9216 21.7414 28.1007 15.887C28.5933 13.4416 28.3384 11.3995 27.0348 9.96337C26.6214 9.51889 26.1284 9.15153 25.5787 8.87796V8.87744Z"
                      fill="#179BD7"
                    />
                    <path
                      d="M24.1692 8.33328C23.7386 8.21291 23.301 8.11912 22.858 8.0519C21.9834 7.92215 21.099 7.85962 20.2142 7.86535H12.2023C11.5723 7.86535 11.0361 8.30879 10.9391 8.91064L9.23459 19.3484L9.18555 19.6527C9.29548 18.9659 9.9066 18.4594 10.625 18.46H13.6239C19.5141 18.46 24.1255 16.1469 25.4738 9.45621C25.5143 9.2582 25.5482 9.0654 25.5784 8.87677C25.2227 8.69648 24.8519 8.54536 24.4699 8.42499C24.3696 8.39269 24.2694 8.36246 24.1681 8.33328H24.1692Z"
                      fill="#222D65"
                    />
                    <path
                      d="M10.9389 8.91053C11.0348 8.30816 11.5716 7.8642 12.2021 7.86628H20.2139C21.1629 7.86628 22.0489 7.92621 22.8578 8.05283C23.4047 8.1362 23.9447 8.26022 24.4718 8.42488C24.8695 8.55255 25.2392 8.70314 25.5803 8.87666C25.9812 6.40361 25.5771 4.72 24.1942 3.19531C22.6686 1.51691 19.917 0.79834 16.3963 0.79834H6.17445C5.45502 0.79834 4.84175 1.30431 4.73074 1.99214L0.472877 28.0868C0.396892 28.5501 0.724005 28.9852 1.20309 29.0586C1.24836 29.0654 1.29362 29.0691 1.33943 29.0691H7.64997L9.23433 19.3488L10.9389 8.91105V8.91053Z"
                      fill="#253B80"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* </>
      ) : (
        <>
          <div className="flex w-screen h-screen justify-center items-center">
            <img src={loaderGif.src} alt="Loader" className="mt-[-10%]" />
          </div>
        </>
      )} */}
    </>
  );
};

const Checkout = () => {
  return (
    <>
      <div>
        <div
          style={{
            backgroundImage: `url(${bgImage.src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
          className="flex flex-col"
        >
          <div className="w-full h-full">
            <Header type="dark" />
          </div>

          <Elements stripe={stripePromise}>
            <MyForm />
          </Elements>

          <div className="w-full h-full">
            <Footer />
          </div>
        </div>
        {/* {showModal && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            zIndex: 999,
          }}
        >
          <Register showModal={showModal} setShowModal={setShowModal} />
        </div>
      )} */}
      </div>
    </>
  );
};

export default Checkout;
