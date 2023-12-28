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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdEmail } from "react-icons/md";

const contact = () => {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const nameRegex = /^[A-Za-z]+$/;
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const numberRegex =
      /^(\+\d{1,2}\s?)?(\()?[2-9]\d{2}(\))?[-.\s]?[2-9]\d{2}[-.\s]?\d{4}$/;

    if (!nameRegex.test(firstName)) {
      toast.error("Please enter a valid first name!");
    } else if (!nameRegex.test(lastName)) {
      toast.error("Please enter a valid last name!");
    } else if (!emailRegex.test(email)) {
      toast.error("Please enter valid email!");
    } else if (!numberRegex.test(phoneNumber)) {
      toast.error("Please enter valid phone number!");
    } else {
      console.log("FORM DATA: ", {
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phoneNumber,
        message: message,
      });
      toast.success(
        "Form submitted successfully, we will be in touch with you soon!"
      );
      setFirstName("");
      setLastName("");
      setPhoneNumber("");
      setMessage("");
      setEmail("");
    }
  };
  return (
    <>
      <ToastContainer />
      <Head>
        <title>CIRCLE - Contact Us</title>
        <meta name="description" content="Simple Description of Circle app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="bg-[#fff] w-full h-full">
        <div className="w-full">
          <Header type="light" page="contact" />
        </div>
        <div className="h-auto w-full">
          <div className="flex flex-col justify-center items-center w-full p-5 lg:p-12">
            <div
              style={{
                background:
                  "linear-gradient(180deg, rgba(217, 217, 217, 0.00) 0%, rgba(115, 173, 195, 0.15) 53.03%, rgba(16, 154, 207, 0.31) 100%)",
                backdropFilter: "blur(50.5px)",
              }}
              className="w-full flex flex-col p-5 lg:p-10 justify-center items-center rounded-xl"
            >
              <p className="w-full text-center">
                <span className="text-[#0E0E11] text-6xl">Get in touch</span>
                <span className="text-[#878A92] text-6xl">{" with"}</span>
              </p>
              <p className="w-full text-center lg:mt-3">
                <span className="text-[#878A92] text-6xl">{"us for "}</span>
                <span className="text-[#0E0E11] text-6xl">
                  more information
                </span>
              </p>
              <p className="w-full text-center mt-5 text-[#3B3C45]">
                Have questions or need more details? We're here to help! Don't
                hesitate to
              </p>
              <p className="w-full text-center text-[#3B3C45] mb-[10%]">
                reach out to us for any additional information
              </p>
            </div>
          </div>

          <div className="flex justify-center items-center w-full p-5 mt-[-10%] lg:mt-0 lg:p-8 xl:p-12">
            <div className="w-full lg:mt-[-15%] z-10 h-auto lg:px-20 py-5 lg:py-0 flex flex-col lg:flex-row justify-center lg:justify-between items-center gap-5 lg:gap-0">
              <div className="flex border-[1px] lg:border-0 border-[#C0E3F1] flex-col h-52 w-full lg:w-[30%] justify-center lg:justify-start justify-center lg:items-start p-5 bg-[#fff] lg:shadow-lg rounded-xl">
                <div className="w-full flex justify-center lg:justify-start items-center">
                  <div
                    onClick={() => {
                      const generateGoogleMapsUrl = (locationText) => {
                        const encodedLocation =
                          encodeURIComponent(locationText);
                        return `https://www.google.com/maps/place/${encodedLocation}`;
                      };

                      const locationText =
                        "3233 W. Dallas St, Suite 1107 Houston, Tx 77019";
                      const googleMapsUrl = generateGoogleMapsUrl(locationText);
                      window.open(googleMapsUrl, "_blank");
                    }}
                    className="h-12 w-12 cursor-pointer flex justify-center items-center rounded-full bg-[#007BAB]"
                  >
                    <BiSolidNavigation size={25} color="#fff" />
                  </div>
                </div>
                <p
                  onClick={() => {
                    const generateGoogleMapsUrl = (locationText) => {
                      const encodedLocation = encodeURIComponent(locationText);
                      return `https://www.google.com/maps/place/${encodedLocation}`;
                    };

                    const locationText =
                      "3233 W. Dallas St, Suite 1107 Houston, Tx 77019";
                    const googleMapsUrl = generateGoogleMapsUrl(locationText);
                    window.open(googleMapsUrl, "_blank");
                  }}
                  className="text-[#170F49] cursor-pointer w-full text-center lg:text-start font-bold text-lg mt-5"
                >
                  Address
                </p>
                <p
                  onClick={() => {
                    const generateGoogleMapsUrl = (locationText) => {
                      const encodedLocation = encodeURIComponent(locationText);
                      return `https://www.google.com/maps/place/${encodedLocation}`;
                    };

                    const locationText =
                      "3233 W. Dallas St, Suite 1107 Houston, Tx 77019";
                    const googleMapsUrl = generateGoogleMapsUrl(locationText);
                    window.open(googleMapsUrl, "_blank");
                  }}
                  className="text-[#6F6C90] cursor-pointer w-full text-center lg:text-start mt-4"
                >
                  3233 W. Dallas St, Suite 1107 Houston, Tx 77019
                </p>
              </div>

              <div className="flex border-[1px] lg:border-0 border-[#C0E3F1] flex-col h-52 w-full lg:w-[30%] justify-center lg:justify-start justify-center lg:items-start p-5 bg-[#fff] lg:shadow-lg rounded-xl">
                <div className="w-full flex justify-center lg:justify-start items-center">
                  <div className="h-12 w-12 flex justify-center items-center rounded-full bg-[#007BAB]">
                    <MdEmail size={25} color="#fff" />
                  </div>
                </div>
                <p className="text-[#170F49] w-full text-center lg:text-start font-bold text-lg mt-5">
                  Contact
                </p>
                <p className="text-[#6F6C90] w-full text-center lg:text-start mt-4">
                  <a href="mailto:support@circle.ooo">Support@circle.ooo</a>
                </p>
              </div>

              <div className="flex border-[1px] lg:border-0 border-[#C0E3F1] flex-col h-52 w-full lg:w-[30%] justify-center lg:justify-start justify-center lg:items-start p-5 bg-[#fff] lg:shadow-lg rounded-xl">
                <div className="w-full flex justify-center lg:justify-start items-center">
                  <div className="h-12 w-12 flex justify-center items-center rounded-full bg-[#007BAB]">
                    <BiSolidNavigation size={25} color="#fff" />
                  </div>
                </div>
                <p className="text-[#170F49] font-bold w-full text-center lg:text-start text-lg mt-5">
                  Follow Us
                </p>

                <div className="flex flex-row justify-center lg:justify-start items-center lg:items-start gap-x-5 mt-4">
                  <div
                    onClick={() =>
                      window.open(
                        "https://www.facebook.com/Circledot.ooo",
                        "_blank"
                      )
                    }
                    className="h-12 cursor-pointer w-12 rounded-full bg-[#F5F5F7] flex items-center justify-center"
                  >
                    <img src={fb.src} alt="" />
                  </div>
                  <div
                    onClick={() =>
                      window.open(
                        "https://www.linkedin.com/company/circledotooo/",
                        "_blank"
                      )
                    }
                    className="h-12 cursor-pointer w-12 rounded-full bg-[#F5F5F7] flex items-center justify-center"
                  >
                    <img src={ln.src} alt="" />
                  </div>
                  <div
                    onClick={() =>
                      window.open(
                        "https://www.instagram.com/circledot.ooo/",
                        "_blank"
                      )
                    }
                    className="h-12 cursor-pointer w-12 rounded-full bg-[#F5F5F7] flex items-center justify-center"
                  >
                    <img src={ins.src} alt="" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              background:
                "linear-gradient(90deg, rgba(217, 217, 217, 0.00) 0%, rgba(0, 123, 171, 0.20) 53.03%, rgba(217, 217, 217, 0.00) 100%)",
              backdropFilter: "blur(50.5px)",
            }}
            className="flex flex-col justify-center mt-[-5%] lg:mt-10 items-center w-full p-5 lg:p-12 shadow-xl"
          >
            <form
              className="flex w-full lg:w-[70%] xl:w-[50%] flex-col justify-center items-center p-5 lg:p-10"
              onSubmit={(e) => handleSubmit(e)}
            >
              <div className="mb-4 mt-4 w-full flex flex-col lg:flex-row justify-center lg:justify-between items-center gap-5">
                <input
                  className="w-full py-3 px-5 rounded-2xl border border-transparent border-2 focus:border-[#007BAB] focus:border-2 outline-none"
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
                  className="w-full py-3 px-5 rounded-2xl border border-transparent border-2 focus:border-[#007BAB] focus:border-2 outline-none"
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
                  className="w-full py-3 px-5 rounded-2xl border border-transparent border-2 focus:border-[#007BAB] focus:border-2 outline-none"
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
                <input
                  className="w-full py-3 px-5 rounded-2xl border border-transparent border-2 focus:border-[#007BAB] focus:border-2 outline-none"
                  id="number"
                  type="text"
                  inputMode="number"
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                  }}
                  placeholder="Phone Number"
                  required
                />
              </div>
              <div className="mb-4 w-full flex justify-center items-center">
                <textarea
                  className="w-full h-40 py-3 px-5 rounded-2xl border border-transparent border-2 focus:border-[#007BAB] focus:border-2 outline-none"
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
                  className="w-full py-3 rounded-full bg-[#007BAB] text-white border border-2 border-[#007BAB] font-semibold hover:border-[#007BAB] hover:text-[#007BAB] hover:bg-transparent"
                  id="button"
                  type="submit"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="w-full">
          <Footer />
        </div>
      </div>
    </>
  );
};

export default contact;
