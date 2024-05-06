import React, { useState } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { BiSolidNavigation } from "react-icons/bi";
import { IoCall } from "react-icons/io5";
import fb from "@/public/FacebookFill.png";
import ln from "@/public/LinkedinFill.png";
import ins from "@/public/InstagramFill.svg";
import Header from "@/components/Common/Header";
import Footer from "@/components/Common/Footer";
import { useRouter } from "next/router";
import toast from "react-simple-toasts";
import { MdEmail } from "react-icons/md";
import { ThreeDots } from "react-loader-spinner";
import bgImage from "@/public/revamp/bg-new.png";
import { IoShareSocialSharp } from "react-icons/io5";
import bgImageSecond from "@/public/revamp/bg-sec5.png";
import { MuiTelInput } from "mui-tel-input";

const contact = () => {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailLoader, setEmailLoader] = useState(false);

  const handleSubmit = (e) => {
    setEmailLoader(true);
    e.preventDefault();

    const nameRegex = /^[A-Za-z]+$/;
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const phoneRegex = /^[+]{1}(?:[0-9\-\\(\\)\\/.]\s?){6,15}[0-9]{1}$/;

    if (!nameRegex.test(firstName)) {
      toast("Please enter a valid first name!");
      setEmailLoader(false);
    } else if (!nameRegex.test(lastName)) {
      toast("Please enter a valid last name!");
      setEmailLoader(false);
    } else if (!emailRegex.test(email)) {
      toast("Please enter valid email!");
      setEmailLoader(false);
    } else if (phoneNumber === "") {
      toast("Please enter valid phone number!");
      setEmailLoader(false);
    } else if (!phoneRegex.test(phoneNumber)) {
      toast("Please enter valid phone number!");
      setEmailLoader(false);
    } else {
      // console.log("FORM DATA: ", {
      //   firstName: firstName,
      //   lastName: lastName,
      //   email: email,
      //   phone: phoneNumber,
      //   message: message,
      // });
      try {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
          firstName: firstName,
          lastName: lastName,
          email: email,
          phoneNumber: phoneNumber,
          message: message,
        });

        var requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        };

        fetch("https://api.circle.ooo/contact-us", requestOptions)
          .then((response) => response.json())
          .then((result) => {
            console.log(result);
            if (result.result === true) {
              toast(
                "Form submitted successfully, we will be in touch with you soon!"
              );
              setFirstName("");
              setLastName("");
              setPhoneNumber("");
              setMessage("");
              setEmail("");
            } else {
              toast(result.message);
            }
            setEmailLoader(false);
          })
          .catch((error) => {
            console.log("error", error);
            toast(error.message);
            setEmailLoader(false);
          });
      } catch (error) {
        console.log(error);
        toast(error.message);
        setEmailLoader(false);
      }
    }
  };
  return (
    <>
      <Head>
        <title>CIRCLE - Contact Us</title>
        <meta
          name="description"
          content="Circle.ooo ❤️'s our customers! Events: beautiful, fast & simple for all."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        style={{
          backgroundImage: `url(${bgImage.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        className="w-full h-full"
      >
        <div className="w-full">
          <Header type="dark" page="contact" />
        </div>
        <div className="flex mt-5 flex-col justify-center items-center w-full p-5 lg:p-12">
          <div
            style={{
              fill: "rgba(7, 3, 23, 0.60)",
              // background:
              //   "linear-gradient(180deg, rgba(217, 217, 217, 0.00) 0%, rgba(115, 173, 195, 0.15) 53.03%, rgba(16, 154, 207, 0.31) 100%)",
              backdropFilter: "blur(50.5px)",
              boxShadow:
                "0px 13px 29px 0px rgba(0, 0, 0, 0.07), 0px 53px 53px 0px rgba(0, 0, 0, 0.06), 0px 118px 71px 0px rgba(0, 0, 0, 0.03), 0px 211px 84px 0px rgba(0, 0, 0, 0.01), 0px 329px 92px 0px rgba(0, 0, 0, 0.00)",
            }}
            className="w-full flex flex-col p-5 lg:p-10 justify-center items-center rounded-xl"
          >
            <p className="w-full text-center mt-8">
              <span className="text-[#fff] text-6xl">Get in touch with</span>
            </p>
            <p
              style={{
                background:
                  "linear-gradient(100deg, #FFF 17.43%, rgba(255, 255, 255, 0.00) 110.91%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text", // Add the Webkit prefix for older browsers
                WebkitTextFillColor: "transparent", // Add the Webkit prefix for older browsers
              }}
              className="w-full text-center lg:mt-3"
            >
              <span className="text-6xl">us for more information</span>
            </p>
            <p className="w-full text-center mt-5 text-[#F8F9FD]">
              Have questions or need more details? We're here to help! Don't
              hesitate to reach out to us for any additional information
            </p>
          </div>

          <div className="flex justify-center items-center w-full p-5 mt-[-5%] lg:mt-[15%] lg:p-8 xl:p-12">
            <div className="w-full lg:mt-[-15%] z-10 h-auto lg:px-20 py-5 lg:py-0 flex flex-col lg:flex-row justify-center lg:justify-between items-center gap-5 lg:gap-0">
              <div
                style={{
                  border: "1px solid rgba(25, 112, 214, 0.30)",
                  background: "rgba(28, 34, 44, 0.60)",
                  boxShadow: "0px 12px 80px 0px rgba(0, 0, 0, 0.06)",
                }}
                className="flex flex-col h-52 w-full lg:w-[30%] justify-center lg:justify-start justify-center lg:items-start p-5 rounded-xl"
              >
                <div className="w-full flex justify-center lg:justify-start items-center">
                  <div
                    onClick={() => {
                      const generateGoogleMapsUrl = (locationText) => {
                        const encodedLocation =
                          encodeURIComponent(locationText);
                        return `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
                      };

                      const locationText =
                        "3233 W. Dallas St, Suite 1107 Houston, Tx 77019";
                      const googleMapsUrl = generateGoogleMapsUrl(locationText);
                      window.open(googleMapsUrl, "_blank");
                    }}
                    style={{
                      background:
                        "linear-gradient(90deg, #4532BF 5.81%, #9429FF 100%)",
                    }}
                    className="h-12 w-12 cursor-pointer flex justify-center items-center rounded-full"
                  >
                    <BiSolidNavigation size={25} color="#fff" />
                  </div>
                </div>
                <p
                  onClick={() => {
                    const generateGoogleMapsUrl = (locationText) => {
                      const encodedLocation = encodeURIComponent(locationText);
                      return `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
                    };

                    const locationText =
                      "3233 W. Dallas St, Suite 1107 Houston, Tx 77019";
                    const googleMapsUrl = generateGoogleMapsUrl(locationText);
                    window.open(googleMapsUrl, "_blank");
                  }}
                  className="text-[#fff] cursor-pointer w-full text-center lg:text-start font-bold text-lg mt-5"
                >
                  Address
                </p>
                <p
                  onClick={() => {
                    const generateGoogleMapsUrl = (locationText) => {
                      const encodedLocation = encodeURIComponent(locationText);
                      return `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
                    };

                    const locationText =
                      "3233 W. Dallas St, Suite 1107 Houston, Tx 77019";
                    const googleMapsUrl = generateGoogleMapsUrl(locationText);
                    window.open(googleMapsUrl, "_blank");
                  }}
                  style={{
                    color: "rgba(255, 255, 255, 0.80)",
                  }}
                  className="cursor-pointer w-full text-center lg:text-start mt-4"
                >
                  3233 W. Dallas St, Suite 1107 Houston, Tx 77019
                </p>
              </div>

              <div
                style={{
                  border: "1px solid rgba(25, 112, 214, 0.30)",
                  background: "rgba(28, 34, 44, 0.60)",
                  boxShadow: "0px 12px 80px 0px rgba(0, 0, 0, 0.06)",
                }}
                className="flex flex-col h-52 w-full lg:w-[30%] justify-center lg:justify-start justify-center lg:items-start p-5 rounded-xl"
              >
                <div className="w-full flex justify-center lg:justify-start items-center">
                  <a
                    style={{
                      textDecoration: "none",
                    }}
                    href="mailto:support@circle.ooo"
                  >
                    <div
                      style={{
                        background:
                          "linear-gradient(90deg, #4532BF 5.81%, #9429FF 100%)",
                      }}
                      className="h-12 w-12 flex justify-center items-center rounded-full"
                    >
                      <MdEmail size={25} color="#fff" />
                    </div>
                  </a>
                </div>
                <p className="text-[#fff] w-full text-center lg:text-start font-bold text-lg mt-5">
                  Contact
                </p>
                <p
                  style={{
                    color: "rgba(255, 255, 255, 0.80)",
                  }}
                  className="w-full text-center lg:text-start mt-4"
                >
                  <a href="mailto:support@circle.ooo">Support@circle.ooo</a>
                </p>
              </div>

              <div
                style={{
                  border: "1px solid rgba(25, 112, 214, 0.30)",
                  background: "rgba(28, 34, 44, 0.60)",
                  boxShadow: "0px 12px 80px 0px rgba(0, 0, 0, 0.06)",
                }}
                className="flex flex-col h-52 w-full lg:w-[30%] justify-center lg:justify-start justify-center lg:items-start p-5 rounded-xl"
              >
                <div className="w-full flex justify-center lg:justify-start items-center">
                  <div
                    style={{
                      background:
                        "linear-gradient(90deg, #4532BF 5.81%, #9429FF 100%)",
                    }}
                    className="h-12 w-12 flex justify-center items-center rounded-full"
                  >
                    <IoShareSocialSharp size={25} color="#fff" />
                  </div>
                </div>
                <p className="text-[#fff] font-bold w-full text-center lg:text-start text-lg mt-5">
                  Follow Us
                </p>

                <div className="flex flex-row justify-center lg:justify-start items-center lg:items-start gap-x-2 mt-4">
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
        </div>
      </div>

      <div
        style={{
          backgroundImage: `url(${bgImageSecond.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        className="w-full h-full mt-[-10%] lg:mt-0"
      >
        <div className="flex flex-col justify-center items-center w-full p-5 lg:p-12 shadow-xl">
          <p className="w-full text-center mt-8">
            <span className="text-[#fff] text-6xl">Reach out to us</span>
          </p>
          <form
            className="flex w-full lg:w-[70%] xl:w-[50%] flex-col justify-center items-center p-5 lg:p-10"
            onSubmit={(e) => handleSubmit(e)}
          >
            <div className="mb-4 mt-4 w-full flex flex-col lg:flex-row justify-center lg:justify-between items-center gap-5">
              <input
                style={{
                  background: "rgba(28, 34, 44, 0.60)",
                }}
                className="w-full text-[#fff] border border-opacity-20 border-[#fff] border-[0.5px] py-3 px-5 rounded-2xl outline-none"
                id="fName"
                type="text"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                }}
                placeholder="First name"
                required
              />
              <input
                style={{
                  background: "rgba(28, 34, 44, 0.60)",
                }}
                className="w-full text-[#fff] border border-opacity-20 border-[#fff] border-[0.5px] py-3 px-5 rounded-2xl outline-none"
                id="lName"
                type="text"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                }}
                placeholder="Last name"
                required
              />
            </div>
            <div className="mb-4 w-full flex justify-center items-center">
              <input
                style={{
                  background: "rgba(28, 34, 44, 0.60)",
                }}
                className="w-full text-[#fff] border border-opacity-20 border-[#fff] border-[0.5px] py-3 px-5 rounded-2xl outline-none"
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                placeholder="Email"
                required
              />
            </div>
            <div className="mb-4 w-full flex justify-center items-center">
              <MuiTelInput
                value={phoneNumber}
                defaultCountry="US"
                onChange={(value) => {
                  setPhoneNumber(value);
                  console.log(value);
                }}
                sx={{
                  "& .MuiInputBase-root": {
                    color: "white",
                    border: "none",
                  },
                  "& .MuiIconButton-label": { color: "white" },
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "none !important",
                  },
                  "& .MuiButtonBase-root": {
                    color: "white",
                    border: "none",
                  },
                  width: "100%",
                  background: "rgba(28, 34, 44, 0.60)",
                  border: "0.5px solid rgba(255, 255, 255, 0.20)",
                  borderRadius: "1rem",
                }}
              />
            </div>
            <div className="mb-4 w-full flex justify-center items-center">
              <textarea
                style={{
                  background: "rgba(28, 34, 44, 0.60)",
                }}
                className="w-full h-40 text-[#fff] border border-opacity-20 border-[#fff] border-[0.5px] py-3 px-5 rounded-2xl outline-none"
                id="message"
                type="text"
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                }}
                placeholder="Message..."
                required
              />
            </div>
            <div className="mb-4 w-full flex justify-center items-center">
              <button
                disabled={emailLoader}
                style={{
                  border: "1px solid rgba(255, 255, 255, 0.20)",
                  background:
                    "linear-gradient(90deg, #4532BF 5.81%, #9429FF 100%)",
                }}
                className="w-full py-3 rounded-full text-white font-semibold"
                id="button"
                type="submit"
              >
                {emailLoader === true ? (
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
                  "Submit"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="w-full">
        <Footer />
      </div>
    </>
  );
};

export default contact;
