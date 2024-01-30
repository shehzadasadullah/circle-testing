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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThreeDots } from "react-loader-spinner";
import loaderGif from "../../../public/events/Loader.gif";

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
        toast.success("Transaction Successful!");
        // Navigate to another screen after a delay
        setTimeout(() => {
          router.push(`/events/${eventid}`);
        }, 1000); // Delay of 30 seconds (adjust as needed)
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
        toast.error("Please Enter Valid Checkout Email!");
        setPaymentLoader(false);
        return false;
      }
    } else {
      toast.error("Please Enter Checkout Email!");
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
        toast.error("Please Enter Valid Checkout Phone Number!");
        setPaymentLoader(false);
        return false;
      }
    } else {
      toast.error("Please Enter Checkout Phone Number!");
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
          toast.error("Stripe Error, Please try again!");
          setPaymentLoader(false);
          return;
        }
        if (elements == null) {
          toast.error("Stripe Error, Please try again!");
          setPaymentLoader(false);
          return;
        }
        if (card == null) {
          toast.error("Stripe Card Error, Please try again!");
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
          toast.error("Error:" + " " + error.message);
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

  return (
    <>
      {loader1 === false &&
      loader2 === false &&
      loader3 === false &&
      loader4 === false &&
      loader5 === false &&
      loader6 === false ? (
        <>
          <div className="w-full h-auto flex gap-10 flex-col lg:flex-row justify-start items-start p-5 lg:p-20">
            {/* Left */}
            <div className="w-full lg:w-2/3 flex flex-col justify-center items-center rounded-xl">
              <div className="flex flex-col justify-center items-center w-full rounded-xl">
                <div
                  style={{
                    boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
                  }}
                  className="w-full flex flex-col rounded-xl justify-center rounded-xl items-center bg-white"
                >
                  <div className="flex w-full justify-between p-4 bg-[#F9F9F9] rounded-t-xl items-center">
                    <h1 className="font-semibold text-xl text-[#242424]">
                      Checkout Details
                    </h1>
                    <ChevronDown className="w-4 h-4 text-[#000] font-bold" />
                  </div>
                  <div className="flex w-full gap-5 flex-col lg:flex-row justify-center lg:justify-between items-center px-4 py-6">
                    <input
                      className="w-full py-3 px-5 rounded-xl border border-[#D9DBDF] border-[1px] focus:border-[#007BAB] focus:border-[1px] outline-none"
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
                      className="w-full py-3 px-5 rounded-xl border border-[#D9DBDF] border-[1px] focus:border-[#007BAB] focus:border-[1px] outline-none"
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
                  {/* <div className="w-full px-4 pb-6 flex justify-center items-center">
              <button
                className="w-full py-2 rounded-full bg-[#007BAB] text-white border border-2 border-[#007BAB] font-semibold hover:border-[#007BAB] hover:text-[#007BAB] hover:bg-transparent"
                id="button"
                type="submit"
              >
                Continue
              </button>
            </div> */}
                </div>

                <div
                  style={{
                    boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
                  }}
                  className="w-full flex mt-8 flex-col rounded-xl justify-center rounded-xl items-center bg-white"
                >
                  <div className="flex w-full justify-between p-4 bg-[#F9F9F9] rounded-t-xl items-center">
                    <h1 className="font-semibold text-xl text-[#242424]">
                      Payment Options
                    </h1>
                    <ChevronDown className="w-4 h-4 text-[#000] font-bold" />
                  </div>
                  <div className="flex w-full gap-5 flex-col justify-center items-center px-4 py-6">
                    <div className="w-full flex justify-center lg:justify-start items-center flex-col">
                      <p className="font-semibold text-[18px] w-full">
                        Debit/Credit Card
                      </p>
                      <p className="text-[#828282] text-[14px] w-full">
                        Enter Your Card Detail
                      </p>
                    </div>
                    <CardNumberElement
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      className="w-full mt-6 py-3 px-5 rounded-xl border border-[#D9DBDF] border-[1px] focus:border-[#007BAB] focus:border-[1px] outline-none"
                      value={cardNumber}
                      onChange={handleCardNumberChangeNew}
                      maxLength={19}
                      placeholder="Card Number"
                    />

                    <input
                      type="text"
                      id="cardName"
                      className="w-full py-2 px-5 rounded-xl border border-[#D9DBDF] border-[1px] focus:border-[#007BAB] focus:border-[1px] outline-none"
                      name="cardName"
                      value={cardName}
                      onChange={handleCardNameChange}
                      placeholder="Name on Card (Optional)"
                    />

                    <div className="flex gap-x-5 mb-5 flex-col lg:flex-row justify-center lg:justify-between items-center w-full">
                      <CardExpiryElement
                        type="text"
                        className="w-full py-3 px-5 rounded-xl border border-[#D9DBDF] border-[1px] focus:border-[#007BAB] focus:border-[1px] outline-none"
                        id="expiry"
                        name="expiryDate"
                        value={expiryDate}
                        onChange={handleExpiryDateChange}
                        maxLength={5}
                        placeholder="Expiry (MM/YY)"
                      />

                      <CardCvcElement
                        type="text"
                        id="cvc"
                        className="w-full py-3 mt-5 lg:mt-0 px-5 rounded-xl border border-[#D9DBDF] border-[1px] focus:border-[#007BAB] focus:border-[1px] outline-none"
                        name="cvc"
                        value={cvc}
                        onChange={handleCvcChange}
                        maxLength={3}
                        placeholder="CVV"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="w-full lg:w-1/3 flex flex-col justify-start h-full items-center">
              <div className="flex flex-col justify-center items-center w-full rounded-xl">
                <div
                  style={{
                    boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
                  }}
                  className="w-full flex flex-col rounded-xl justify-center rounded-xl items-center bg-white"
                >
                  <div className="flex w-full justify-start p-4 bg-[#F9F9F9] rounded-t-xl items-center">
                    <h1 className="font-semibold w-full text-xl text-[#242424]">
                      Order Summary
                    </h1>
                  </div>
                  <div className="flex w-full gap-5 flex-col justify-start items-center px-6 py-6">
                    <div className="flex justify-start w-full items-center rounded-xl">
                      <img
                        src={EventData.large_image}
                        alt=""
                        className="object-contain rounded-xl lg:h-40"
                      />
                    </div>
                    <p className="text-[#007BAB] w-full text-xl font-semibold">
                      {EventData.name}
                    </p>
                    <div className="flex flex-row text-[#BDBDBD] justify-start w-full items-center">
                      <LuCalendarDays size={20} />
                      <p className="font-Montserrat ml-3">
                        {moment(EventData?.timefrom?.seconds * 1000)
                          .local()
                          .format("LL")}
                      </p>
                    </div>

                    <div className="flex flex-row text-[#BDBDBD] justify-start w-full items-center">
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

                    <div className="flex flex-row text-[#BDBDBD] justify-start w-full items-center">
                      <FaLocationDot size={20} />
                      <p className="font-Montserrat ml-3">
                        {EventData?.location}
                      </p>
                    </div>

                    <div className="flex flex-row text-[#BDBDBD] justify-start w-full items-center">
                      <FaTag size={20} />
                      <p className="font-Montserrat ml-3">
                        {EventData?.ticketPrice === "0.00" ? "FREE" : "PAID"}
                      </p>
                    </div>

                    <p className="w-full border-[#D9DBDF] border-b-2"></p>

                    <div className="w-full flex justify-center items-center">
                      <button
                        onClick={handleSubmit}
                        disabled={paymentLoader === true}
                        className="w-full py-2 rounded-full bg-[#23C55E] text-white border border-2 border-[#23C55E] font-semibold"
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
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex w-screen h-screen justify-center items-center">
            <img src={loaderGif.src} alt="Loader" className="mt-[-10%]" />
          </div>
        </>
      )}
    </>
  );
};

const Checkout = () => {
  return (
    <>
      <div>
        <div className="flex flex-col bg-[#F8F9FD]">
          <ToastContainer />
          <div className="w-full h-full bg-[#fff]">
            <Header type="light" />
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
