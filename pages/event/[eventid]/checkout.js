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

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleMobileNumberChange = (event) => {
    setMobileNumber(event.target.value);
  };

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
      });
    }
  }, [eventid]);

  //getting attendee data from firestore
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

  //add back checkout meail and number to firstore for attendee
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

        // Navigate to another screen after a delay
        setTimeout(() => {
          router.push(`/events/${eventid}`);
        }, 30000); // Delay of 30 seconds (adjust as needed)
      }

      setIsLoading(false); // Hide loader after API call is complete
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission or show an error message.
      return;
    }
    if (elements == null) {
      return;
    }
    const card = elements.getElement(CardNumberElement);
    if (card == null) {
      return;
    }
    let userName = user?.displayName || "";

    let useremail = user?.email || "";
    let eventName = EventData?.name;
    let EventId = EventData?.uid;
    let currentUserId = user?.uid;
    let description = `${eventName} - Event Ticket Payment for ${EventId} by ${userName} - ${currentUserId}`;
    let amount = parseInt(EventData?.ticketPrice);

    // let amount =
    //   EventData?.ticketPrice != null && parseFloat(EventData?.ticketPrice) > 0.0
    //     ? `$${EventData?.ticketPrice}`
    //     : "Free";

    // Use your card Element with other Stripe.js APIs
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
      billing_details: {
        name: userName || "",
        // phone: userphone || "",
        email: useremail || "",
      },
    });

    if (error) {
      setPaymentFailed({
        state: true,
        message: error?.message || "",
      });
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
    // Rest of your form submission logic
  };

  const [errorMessage, setErrorMessage] = useState("");

  const handleCardNumberChange = (event) => {
    // Handle card number change
  };

  const handleCardExpiryChange = (event) => {
    // Handle card expiry change
  };

  const handleCardCvcChange = (event) => {
    // Handle card cvc change
  };

  const [CircleData, setCircleDtata] = useState({});
  const [qrCodeBase64, setQRCodeBase64] = useState(null);

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
      EventData?.ticketPrice >= "0.00" ? EventData?.ticketPrice : "Free";
    const name =
      creatorData?.full_name || creatorData?.display_name || "Anonymous";
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
        await axios.post("/api/ticket/", {
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
      } catch (error) {
        console.error("QR code generation error:", error);
      }
    };

    generateQRCode();
  }, []);

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
      });
    }
  }, [eventid]);

  const timestamp = EventData?.timefrom?.seconds * 1000;
  const formattedTime = moment(timestamp).local().format("LT");

  if (loading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return (
    <div>
      <div className="bg-[#F5F5F5]">
        <div className="flex flex-col">
          <div className="flex sm:flex-row flex-col">
            <div className="sm:w-3/4 w-full ">
              <div className="relative w-full flex items-center justify-center py-24">
                <div
                  className="absolute w-11/12 h-[151px] bg-white shadow-md"
                  style={{
                    filter: "drop-shadow(0px 2px 3px rgba(0, 0, 0, 0.25))",
                  }}
                >
                  <div className="px-4 py-2 bg-[#123B79] top-0 right-0 rounded-t-[6px]">
                    <div className="flex">
                      <ChevronDown className="w-4 h-4 text-white text-center" />
                      <p
                        className="absolute px-6 text-white"
                        style={{
                          fontFamily: "'Montserrat', sans-serif",
                          fontStyle: "normal",
                          fontWeight: 400,
                          fontSize: "16px",
                          lineHeight: "125%",
                          display: "flex",
                          alignItems: "flex-end",
                        }}
                      >
                        Order Summary
                      </p>
                    </div>
                  </div>
                  <div className="px-4 py-8">
                    <div className="flex gap-4">
                      <input
                        type="email"
                        placeholder="Email"
                        className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                        value={email}
                        onChange={handleEmailChange}
                      />
                      <input
                        type="tel"
                        placeholder="Mobile Number"
                        className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                        value={mobileNumber}
                        onChange={handleMobileNumberChange}
                      />
                      <button
                        className="px-4 py-2 bg-[#2373CB] text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-200"
                        onClick={() => {
                          StoreUserDetails(user?.uid);
                        }}
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="relative w-full flex items-center justify-center py-48">
                  <div
                    className="absolute w-11/12 h-[379px]  bg-white shadow-md"
                    style={{
                      filter: "drop-shadow(0px 2px 3px rgba(0, 0, 0, 0.25))",
                    }}
                  >
                    <div className="px-4 py-2 bg-[#123B79] top-0 right-0 rounded-t-[6px]">
                      <div className="flex">
                        <ChevronDown className="w-4 h-4 text-white text-center" />
                        <p
                          className="absolute px-6 text-white"
                          style={{
                            fontFamily: "'Montserrat', sans-serif",
                            fontStyle: "normal",
                            fontWeight: 400,
                            fontSize: "16px",
                            lineHeight: "125%",
                            display: "flex",
                            alignItems: "flex-end",
                          }}
                        >
                          Payment options
                        </p>
                      </div>
                    </div>
                    <div className="flex py-2">
                      <div className="w-1/3 ">
                        <div>
                          <p
                            className=" px-4 text-[#39364F]"
                            style={{
                              fontFamily: "'Montserrat', sans-serif",
                              fontStyle: "normal",
                              fontWeight: 700,
                              fontSize: "16px",
                              lineHeight: "125%",
                            }}
                          >
                            Debit/Credit Card
                          </p>
                        </div>
                        {/* Content for the first div */}
                      </div>

                      <div className="flex flex-col">
                        <div>
                          <p
                            className=" px-4 text-[#39364F]"
                            style={{
                              fontFamily: "'Montserrat', sans-serif",
                              fontStyle: "normal",
                              fontWeight: 700,
                              fontSize: "16px",
                              lineHeight: "125%",
                            }}
                          >
                            Enter Your Card Details
                          </p>
                        </div>
                        <div className="w-full h-[270px] bg-gray-200">
                          <div className="px-4 py-2">
                            <p>
                              <div className="container mx-auto p-4">
                                <form onSubmit={(event) => handleSubmit(event)}>
                                  <div className="flex flex-wrap -mx-2">
                                    <div className="w-full px-2 mb-4">
                                      <label
                                        htmlFor="nameOnCard"
                                        className="block mb-1"
                                      >
                                        Name on Card
                                      </label>
                                      <input
                                        type="text"
                                        id="nameOnCard"
                                        className="w-full px-4 py-2 border border-gray-300 rounded"
                                        value={nameOnCard}
                                        onChange={(e) =>
                                          setNameOnCard(e.target.value)
                                        }
                                      />
                                    </div>
                                    <div className="w-full px-2 mb-4">
                                      <label
                                        htmlFor="cardNumber"
                                        className="block mb-1 "
                                      >
                                        Card Number
                                      </label>
                                      <CardNumberElement
                                        id="cardNumber"
                                        className="w-full px-4 py-2 border border-gray-300 bg-white rounded"
                                        onChange={handleCardNumberChange}
                                      />
                                    </div>
                                    <div className="w-1/2 px-2 mb-4">
                                      <label
                                        htmlFor="expiry"
                                        className="block mb-1"
                                      >
                                        Expiry
                                      </label>
                                      <CardExpiryElement
                                        id="expiry"
                                        className="w-full px-4 py-2 border border-gray-300 bg-white rounded"
                                        onChange={handleCardExpiryChange}
                                      />
                                    </div>
                                    <div className="w-1/2 px-2 mb-4">
                                      <label
                                        htmlFor="cvc"
                                        className="block mb-1"
                                      >
                                        CVV
                                      </label>
                                      <CardCvcElement
                                        id="cvc"
                                        className="w-full px-4 py-2 border bg-white border-gray-300 rounded"
                                        onChange={handleCardCvcChange}
                                      />
                                    </div>
                                  </div>

                                  <div className="py-2">
                                    <button
                                      type="submit"
                                      className="bg-[#2372CB] text-white px-4 py-2 rounded"
                                    >
                                      Make Payment
                                    </button>
                                  </div>
                                </form>
                                <div>{errorMessage}</div>
                              </div>
                            </p>
                          </div>
                          {/* Content for the second div */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full flex items-start justify-between px-12 py-6">
                <div className="flex flex-col">
                  <h2
                    className=" px-4 text-[#999999]"
                    style={{
                      fontFamily: "'Montserrat', sans-serif",
                      fontStyle: "normal",
                      fontWeight: 400,
                      fontSize: "12px",
                      lineHeight: "125%",
                    }}
                  >
                    Note
                  </h2>

                  <ol className="list-decimal px-6  py-4">
                    <li className="mb-2 text-[12px] leading-5 text-[#999999]">
                      <p
                        className=" px-4 text-[#999999]"
                        style={{
                          fontFamily: "'Montserrat', sans-serif",
                          fontStyle: "normal",
                          fontWeight: 400,
                          fontSize: "12px",
                          lineHeight: "125%",
                        }}
                      >
                        Registrations/Tickets once booked cannot be exchanged,
                        cancelled or refunded.
                      </p>
                    </li>
                    <li className="mb-2 text-[12px] leading-5 text-[#999999]">
                      <p
                        className=" px-4 text-[#999999]"
                        style={{
                          fontFamily: "'Montserrat', sans-serif",
                          fontStyle: "normal",
                          fontWeight: 400,
                          fontSize: "12px",
                          lineHeight: "125%",
                        }}
                      >
                        In case of Credit/Debit Card bookings, the Credit/Debit
                        Card and Card holder must be present at the ticket
                        counter while collecting the ticket(s).
                      </p>
                    </li>
                  </ol>
                  <p
                    className=" px-4 text-[#999999]"
                    style={{
                      fontFamily: "'Montserrat', sans-serif",
                      fontStyle: "normal",
                      fontWeight: 400,
                      fontSize: "12px",
                      lineHeight: "125%",
                    }}
                  >
                    © Circle Pvt. Ltd. Privacy Policy | Contact Us
                  </p>
                </div>
              </div>
            </div>
            <div className="sm:w-1/4 w-full relative py-6">
              <div
                className="absolute h-[430px] sm:w-11/12 sm:px-0 px-4"
                style={{
                  background: "#FBFBFB",
                  boxShadow: "0px 2px 3px rgba(0, 0, 0, 0.25)",
                }}
              >
                <div className="flex justify-between items-start  xl:mt-2">
                  <div className="w-full flex items-start  justify-start text-[20px] font-semibold  text-[#17161A]">
                    <p
                      className="absolute px-4"
                      style={{
                        fontFamily: "'Montserrat', sans-serif",
                        fontStyle: "normal",
                        fontWeight: 400,
                        fontSize: "16px",
                        lineHeight: "125%",
                        display: "flex",
                        alignItems: "flex-end",
                        color: "rgba(0, 0, 0, 0.5)",
                      }}
                    >
                      Order Summary
                    </p>
                  </div>

                  <div className="xl:mr-6">
                    <div className="flex flex-col text-center">
                      <p class="font-montserrat font-bold text-3xl leading-5 text-center text-blue-900">
                        1
                      </p>
                      <p className="font-montserrat font-semibold text-xs leading-[22px] text-center text-blue-900">
                        Ticket
                      </p>
                    </div>
                  </div>
                </div>
                <div className="w-full h-full flex flex-col items-start justify-start -mt-6">
                  <div>
                    <div style={{ width: "342px", height: "230px" }}>
                      <div className="flex flex-row items-start justify-start px-4 py-4">
                        <div style={{ width: "54px", height: "57px" }}>
                          <img
                            src={"/nowwlogo.svg"}
                            className="w-full h-full "
                          />
                        </div>
                      </div>
                      <div className="w-full truncate flex items-start justify-start font-normal text-[20px] text-[#000] px-4 ">
                        <p
                          className=" font-bold leading-[22px] text-[20px] text-center text-blue-900"
                          style={{
                            fontFamily: "'Montserrat', sans-serif",
                          }}
                        >
                          {EventData?.name}
                        </p>
                      </div>

                      <div className="w-full flex items-start justify-start  truncate text-[18px] px-4 py-2">
                        <p
                          className=" font-normal text-base leading-[23px] text-gray-600"
                          style={{
                            fontFamily: "'Montserrat', sans-serif",
                          }}
                        >
                          {EventData?.location}
                        </p>
                      </div>

                      <div className="w-full flex items-start justify-start  truncate text-[15px]  px-4 ">
                        <p
                          className="font-normal  leading-[23px] text-[#39364F]"
                          style={{
                            fontFamily: "'Montserrat', sans-serif",
                          }}
                        >
                          Cover for One($free) : 1 tickets
                        </p>
                      </div>

                      <div className="w-full flex items-start justify-start  truncate text-[15px]  px-4 py-2 ">
                        <div className="flex flex-col">
                          <p
                            className="font-normal  leading-[23px] text-[#39364F]"
                            style={{
                              fontFamily: "'Montserrat', sans-serif",
                            }}
                          >
                            {moment(
                              new Date(EventData?.timefrom?.seconds * 1000)
                            ).format("dddd, MMM D")}
                          </p>
                          <p
                            className="font-normal  leading-[23px] text-[#39364F]"
                            style={{
                              fontFamily: "'Montserrat', sans-serif",
                            }}
                          >
                            {formattedTime}
                          </p>
                        </div>
                      </div>

                      {/* <div className="w-full flex items-start justify-start font-normal text-[16px] text-[#000] xl:ml-6 xl:mt-4">
                                {EventData.description}
                              </div> */}
                    </div>
                    <div className="w-full my-4">
                      <hr className="custom-dotted-line" />
                    </div>
                    <div
                      style={{ width: "342px", height: "100px" }}
                      className="w-full flex flex-col items-center justify-start"
                    >
                      <div className="w-full flex flex-row items-start justify-between">
                        <div className="w-full flex items-start justify-between px-4">
                          <p
                            className="font-normal  leading-[23px] text-[#39364F]"
                            style={{
                              fontFamily: "'Montserrat', sans-serif",
                            }}
                          >
                            Subtotal
                          </p>

                          <p className="text-blue-900 font-bold">
                            $ {EventData?.ticketPrice}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="w-full">
                      <button className="px-32 flex items-center justify-between py-2 bg-green-500 text-white font-semibold rounded-md ">
                        <span className="w-full flex items-center justify-center">
                          <span className="mr-2">Payable:</span>
                          <span>${EventData?.ticketPrice}</span>
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex flex-col sm:py-36">
                    <h2
                      className=" text-[#999999]"
                      style={{
                        fontFamily: "'Montserrat', sans-serif",
                        fontStyle: "normal",
                        fontWeight: 400,
                        fontSize: "12px",
                        lineHeight: "125%",
                      }}
                    >
                      As safe as it gets
                    </h2>
                    <img src="/payment.png" />
                  </div>
                </div>
                {/* Content of the responsive div */}
              </div>
            </div>
          </div>
          {showFreeModal && (
            <div className="fixed z-10 inset-0 overflow-y-auto">
              <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div
                  className="fixed inset-0 transition-opacity"
                  aria-hidden="true"
                >
                  <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>

                <span
                  className="hidden sm:inline-block sm:align-middle sm:h-screen"
                  aria-hidden="true"
                >
                  &#8203;
                </span>

                <div
                  className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6"
                  style={{ width: "420px", height: "551px" }}
                >
                  <div
                    className="fixed inset-0 transition-opacity"
                    aria-hidden="true"
                  >
                    <div className="flex justify-between items-center  xl:mt-2">
                      <div className="w-full flex items-center  ml-12 justify-center text-[20px] font-semibold  text-[#17161A]"></div>

                      <button
                        onClick={() => {
                          router.push(`/events/${eventid}`);
                        }}
                        className="xl:mr-6"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="text-[#17161A] cursor-pointer w-6 h-6"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M11.414 10l4.293-4.293a1 1 0 0 0-1.414-1.414L10 8.586 5.707 4.293a1 1 0 1 0-1.414 1.414L8.586 10l-4.293 4.293a1 1 0 1 0 1.414 1.414L10 11.414l4.293 4.293a1 1 0 0 0 1.414-1.414L11.414 10z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className=" w-full h-full flex flex-col items-center justify-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                      <div style={{ width: "100", height: "100" }}>
                        <svg
                          width="100"
                          height="100"
                          viewBox="0 0 100 100"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M96.4812 49.9979C98.0256 48.1995 99.1078 46.0514 99.6341 43.74C100.16 41.4286 100.115 39.0238 99.5011 36.734C98.8875 34.4443 97.7245 32.3388 96.113 30.6003C94.5015 28.8618 92.4902 27.5427 90.2534 26.7575C90.6917 24.4277 90.5549 22.0262 89.8548 19.7613C89.1548 17.4964 87.9127 15.4365 86.2363 13.7603C84.5599 12.0841 82.4999 10.8423 80.2349 10.1425C77.9699 9.44278 75.5683 9.30626 73.2386 9.74482C72.454 7.50759 71.1352 5.49569 69.3966 3.88379C67.6581 2.27189 65.5524 1.10872 63.2623 0.495259C60.9722 -0.118203 58.567 -0.163409 56.2555 0.363565C53.944 0.890539 51.7961 1.97377 49.9982 3.5192C48.1997 1.97483 46.0517 0.892578 43.7403 0.366332C41.4289 -0.159914 39.024 -0.114262 36.7342 0.499326C34.4445 1.11291 32.339 2.27591 30.6005 3.88741C28.862 5.49892 27.5429 7.51027 26.7577 9.74698C24.4281 9.30913 22.0268 9.44627 19.7622 10.1465C17.4976 10.8467 15.438 12.0888 13.7621 13.7652C12.0862 15.4415 10.8446 17.5014 10.1449 19.7662C9.44529 22.031 9.30878 24.4323 9.74722 26.7618C7.51051 27.547 5.49915 28.8661 3.88765 30.6046C2.27614 32.3431 1.11314 34.4486 0.499551 36.7383C-0.114037 39.0281 -0.159696 41.433 0.36655 43.7444C0.892796 46.0557 1.97507 48.2038 3.51943 50.0022C1.9746 51.8006 0.891994 53.9489 0.365598 56.2605C-0.160798 58.5721 -0.115099 60.9773 0.498757 63.2672C1.11261 65.5572 2.27606 67.6627 3.88812 69.4011C5.50018 71.1395 7.51216 72.4582 9.74939 73.2427C9.31057 75.5723 9.44693 77.9737 10.1466 80.2386C10.8464 82.5036 12.0883 84.5635 13.7646 86.2396C15.441 87.9157 17.501 89.1574 19.766 89.8568C22.0311 90.5562 24.4325 90.6923 26.7621 90.2532C27.5473 92.4899 28.8663 94.5013 30.6049 96.1128C32.3434 97.7243 34.4488 98.8873 36.7386 99.5008C39.0283 100.114 41.4332 100.16 43.7446 99.6338C46.056 99.1076 48.2041 98.0253 50.0025 96.481C51.8009 98.0258 53.9491 99.1084 56.2607 99.6348C58.5724 100.161 60.9775 100.115 63.2675 99.5016C65.5574 98.8878 67.663 97.7243 69.4013 96.1123C71.1397 94.5002 72.4584 92.4882 73.243 90.251C75.5726 90.6897 77.9741 90.5533 80.239 89.8535C82.504 89.1538 84.564 87.9119 86.2402 86.2357C87.9165 84.5594 89.1584 82.4994 89.8581 80.2345C90.5579 77.9695 90.6943 75.568 90.2556 73.2384C92.4925 72.4533 94.504 71.1343 96.1156 69.3957C97.7272 67.6571 98.8901 65.5515 99.5035 63.2616C100.117 60.9717 100.162 58.5667 99.6356 56.2553C99.1089 53.9439 98.0262 51.796 96.4812 49.9979Z"
                            fill="#18C07A"
                          />
                          <path
                            d="M41.0246 69.0843L27.1301 55.1985C26.6028 54.6703 26.3066 53.9545 26.3066 53.2082C26.3066 52.4618 26.6028 51.746 27.1301 51.2178L28.8182 49.5276C29.3464 49.0003 30.0622 48.7041 30.8085 48.7041C31.5549 48.7041 32.2707 49.0003 32.7989 49.5276L42.899 59.6212L66.6855 34.3439C67.1973 33.8008 67.9037 33.483 68.6496 33.4602C69.3956 33.4375 70.12 33.7116 70.664 34.2225L72.3976 35.8585C72.9413 36.3705 73.2595 37.0773 73.2822 37.8238C73.305 38.5702 73.0304 39.2951 72.5189 39.8392L45.0724 69.0214C44.814 69.2968 44.5028 69.5175 44.1574 69.6702C43.812 69.823 43.4394 69.9047 43.0618 69.9106C42.6842 69.9164 42.3092 69.8463 41.9593 69.7044C41.6093 69.5624 41.2914 69.3515 41.0246 69.0843Z"
                            fill="white"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="mt-3 text-center sm:mt-12">
                      <h3 className="leading-6 font-bold text-[26px] text-[#1E232C] ">
                        Successful
                      </h3>
                      <div className="mt-2 text-center sm:mt-6">
                        <p
                          className="text-[15px] text-[#8391A1] font-medium  xl:w-[300px] xl:h-[46px]"
                          style={{ lineHeight: "150%" }}
                        >
                          Your Event Registration is successfully confirm to
                          view ticket click here
                        </p>
                      </div>
                    </div>
                    <div className="mt-5 sm:mt-6 z-10">
                      <button
                        type="button"
                        style={{ width: "318px", height: "66px" }}
                        className="w-full flex items-center  justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#2373CB] text-[16px] font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                        onClick={() => {
                          setShowFreeModal(false);
                          setShowTicketModal(true);
                        }}
                      >
                        View Your Ticket
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {showticketModal && (
            <div className="fixed z-10 inset-0 overflow-y-auto">
              <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div
                  className="fixed inset-0 transition-opacity"
                  aria-hidden="true"
                >
                  <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>

                <span
                  className="hidden sm:inline-block sm:align-middle sm:h-screen"
                  aria-hidden="true"
                >
                  &#8203;
                </span>

                <div
                  className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6"
                  style={{ width: "420px", height: "650px" }}
                >
                  <div
                    className="fixed inset-0 transition-opacity"
                    aria-hidden="true"
                  >
                    <div className="flex justify-between items-center  xl:mt-2">
                      <div className="w-full flex items-center  ml-12 justify-center text-[20px] font-semibold  text-[#17161A]">
                        Your Coupon
                      </div>

                      <button
                        onClick={() => {
                          router.push(`/events/${eventid}`);
                        }}
                        className="xl:mr-6"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="text-[#17161A] cursor-pointer w-6 h-6"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M11.414 10l4.293-4.293a1 1 0 0 0-1.414-1.414L10 8.586 5.707 4.293a1 1 0 1 0-1.414 1.414L8.586 10l-4.293 4.293a1 1 0 1 0 1.414 1.414L10 11.414l4.293 4.293a1 1 0 0 0 1.414-1.414L11.414 10z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="w-full h-full flex flex-col items-center justify-start -mt-6">
                    <div className="mt-3 text-center sm:mt-12">
                      <div
                        style={{ width: "342px", height: "230px" }}
                        className="shadow-xl shadow=[#C4C4C4]"
                      >
                        <div className="flex flex-row items-start justify-around mt-6">
                          <div style={{ width: "84px", height: "87px" }}>
                            <img
                              src={"/nowwlogo.svg"}
                              className="w-full h-full "
                            />
                          </div>
                          <div className="h-24 w-24">
                            {qrCodeBase64 ? (
                              <img src={qrCodeBase64} alt="QR Code w-8 h-8" />
                            ) : (
                              <p>Loading QR code...</p>
                            )}
                          </div>
                        </div>
                        <div className="w-full truncate flex items-start justify-start font-normal text-[20px] text-[#000] px-4 py-4">
                          {EventData.name}
                        </div>

                        <div className="w-full flex items-start justify-start  truncate text-[18px] text-[#000] px-4">
                          {EventData?.description}
                        </div>
                        {/* <div className="w-full flex items-start justify-start font-normal text-[16px] text-[#000] xl:ml-6 xl:mt-4">
                                {EventData.description}
                              </div> */}
                      </div>
                      <div className="w-full my-4">
                        <hr className="custom-dotted-line" />
                      </div>
                      <div
                        style={{ width: "342px", height: "200px" }}
                        className="w-full flex flex-col items-center justify-center shadow-xl shadow=[#C4C4C4]"
                      >
                        <div className="w-full flex flex-row items-start justify-between">
                          <div className="w-full flex flex-col items-start justify-start font-medium text-[15px] text-[#8391A1] xl:ml-6 xl:mt-6">
                            Event Date{" "}
                            <p className="text-[15px] font-bold text-[#17161A] whitespace-nowrap">
                              {moment(
                                new Date(EventData?.timefrom?.seconds * 1000)
                              ).format("dddd, MMM D")}
                            </p>
                          </div>
                          <div className="w-full flex flex-col items-center justify-center font-medium text-[15px] text-[#8391A1] xl:ml-6 xl:mt-6">
                            Price{" "}
                            <p className="ml-2 text-[15px] font-bold text-[#17161A] whitespace-nowrap">
                              {EventData.ticketPrice == null
                                ? "Free"
                                : EventData.ticketPrice}
                            </p>
                          </div>
                        </div>
                        {/* <div className="w-full flex flex-row items-start justify-between">
                                <div className="w-full flex flex-col items-start justify-start font-semibold text-[15px] text-[#17161A] xl:ml-6 xl:mt-6">
                                  Event Date{" "}
                                  <div>
                                    {moment(
                                      new Date(
                                        EventData?.timefrom?.seconds * 1000
                                      )
                                    ).format("dddd, MMM D, YYYY")}
                                  </div>
                                </div>
                                <div className="w-full flex flex-col items-start justify-start font-semibold text-[15px] text-[#17161A] xl:ml-6 xl:mt-6">
                                  Price
                                  <div>
                                    {EventData.ticketPrice == null
                                      ? "Free"
                                      : EventData.ticketPrice}
                                  </div>
                                </div>
                              </div> */}
                        <div className="w-full flex flex-row items-start justify-between">
                          <div className="w-full flex flex-col items-start justify-start font-medium text-[15px] text-[#8391A1] xl:ml-6 xl:mt-6">
                            Name{" "}
                            <p className="text-[15px] font-bold text-[#17161A] whitespace-nowrap">
                              {creatorData?.full_name}
                            </p>
                          </div>
                          <div className="w-full flex flex-col items-center justify-center font-medium text-[15px] text-[#8391A1] xl:ml-6 xl:mt-6">
                            Gate Closes{" "}
                            <p className="ml-2 text-[15px] font-bold text-[#17161A] whitespace-nowrap">
                              {formattedTime}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      className="z-10 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded my-10"
                      onClick={() => {
                        user?.uid != undefined ? EmailMe() : setShowModal(true);
                      }}
                    >
                      Email me
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="sm:mt-16 mt-[540px]">
        <Footer />
      </div>
    </div>
  );
};

const Checkout = () => {
  const [user] = useAuthState(auth);

  const [showModal, setShowModal] = useState(false);

  const handleClick = (e) => {
    e?.preventDefault();
    setShowModal(true);
  };

  return (
    <div>
      <div className="flex flex-col">
        <div className="w-full h-full">
          <Header type="light" page="about" />
        </div>

        <Elements stripe={stripePromise}>
          <MyForm />
        </Elements>
      </div>
      {showModal && (
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
      )}
    </div>
  );
};

export default Checkout;
