import React, { useState, useContext, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { HeartIcon } from "@/icons";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import FacebookIcon from "@/components/SvgIcons/FacebookIcon";
import { LinkedinIcon } from "@/components/SvgIcons";

const ContactSection2 = () => {
  const [name, setName] = useState("");
  const [lastname, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [errorName, setErrorName] = useState(false);
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorPhone, setErrorPhone] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [errorSubject, setErrorSubject] = useState(false);
  const formRef = useRef(null);
  const [submited, setSubmitted] = useState(false);

  useEffect(() => {
    setErrorName(false);
    setSubmitted(false);
    setErrorEmail(false);
    setErrorMessage(false);
    setErrorSubject(false);
    setErrorPhone(false);
  }, []);

  const formSubmit = async (e) => {
    let state = true;
    e.preventDefault();

    name.length >= 3
      ? setErrorName(false)
      : (setErrorName(true), (state = false));

    phone.length >= 10
      ? setErrorPhone(false)
      : (setErrorPhone(true), (state = false));

    const checkemail = email.trim();
    const emailRegex =
      /^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    email.length > 0
      ? emailRegex.test(checkemail)
        ? setErrorEmail(false)
        : (setErrorEmail(true), (state = false))
      : (setErrorEmail(true), (state = false));

    message.length > 5
      ? setErrorMessage(false)
      : (setErrorMessage(true), (state = false));

    subject.length > 3
      ? setErrorSubject(false)
      : (setErrorSubject(true), (state = false));

    setSubmitted(true);
    setName("");
    setEmail("");
    setPhone("");
    setSubject("");
    setMessage("");
  };
  return (
    <div
      style={{
        width: "100%",
        height: "1230px",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",

          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
        }}
      ></div>
      <div
        className="flex justify-between items-center text-sm lg:text-base font-Roboto font-medium sm:mt-60 mt-48"
        style={{
          position: "absolute",

          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          color: "white",

          textAlign: "center",
        }}
      >
        <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24 flex flex-wrap items-start justify-between">
          <div className="w-full sm:w-1/4  mb-8 sm:mb-0">
            {/* Address section */}
            <div className=" w-full  flex items-center justify-center flex-col sm:w-full mb-8 sm:mb-0">
              <div className="flex items-center mr-4">
                <div className="mr-2 bg-gray-200 px-2 py-2 rounded-[10px]">
                  <img src="/location.png" className="w-4 h-4" />
                </div>
                <div
                  className="font-normal text-2xl text-black"
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 500,
                    lineHeight: "125%",
                    display: "flex",
                    alignItems: "flex-end",
                  }}
                >
                  Address
                </div>
              </div>
              <div
                className="text-black py-4 text-[16px] w-full flex items-center justify-center"
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 500,
                  lineHeight: "125%",
                  display: "flex",
                  alignItems: "flex-end",
                }}
              >
                3233 W. Dallas St, Suite 1107
              </div>
              <div
                className="text-black w-full text-[16px]  flex items-center justify-center"
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 500,
                  fontSize: "16px",
                  lineHeight: "125%",
                  display: "flex",
                  alignItems: "flex-end",
                }}
              >
                Houston, TX 77019
              </div>
            </div>
          </div>
          <div className="w-full sm:w-1/4  mb-8 sm:mb-0">
            <div className="flex flex-col w-full  items-center justify-center sm:w-full mb-8 sm:mb-0">
              <div className="flex items-center mr-4">
                <div className="mr-2 bg-gray-200 px-2 py-2 rounded-[10px]">
                  <img src="/phone.png" className="w-4 h-4" />
                </div>
                <div
                  className="font-normal text-2xl text-black"
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 500,
                    lineHeight: "125%",
                    display: "flex",
                    alignItems: "flex-end",
                  }}
                >
                  Contact
                </div>
              </div>
              {/* <div
                className=" flex items-center justify-center px-4 sm:px-8 text-black py-4 text-[16px] w-full "
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 400,
                  fontSize: "16px",
                  lineHeight: "125%",
                  display: "flex",
                  alignItems: "flex-end",
                }}
              >
                832-622-5979
              </div> */}
              <div
                className="px-4 sm:px-8 text-black w-full text-[16px]  flex items-center justify-center "
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 400,
                  fontSize: "16px",
                  lineHeight: "125%",
                  display: "flex",
                  alignItems: "flex-end",
                }}
              >
                <a href="mailto:support@circle.ooo" target="_blank">
                  support@circle.ooo
                </a>
              </div>
            </div>
            {/* Contact section */}
          </div>
          <div className="w-full sm:w-1/4  mb-8 sm:mb-0">
            {/* Follow Us section */}
            <div className="flex flex-col w-full sm:w-full flex items-center justify-center mb-8 sm:mb-0">
              <div className="flex items-center">
                <div
                  className="mr-2 bg
gray-200 px-2 py-2 rounded-[10px]"
                >
                  <img src="/thumbsup.png" className="w-4 h-4" />
                </div>
                <div
                  className="font-normal text-2xl text-black"
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 500,
                    lineHeight: "125%",
                    display: "flex",
                    alignItems: "flex-end",
                  }}
                >
                  Follow Us
                </div>
              </div>
              <div className="px-4 sm:px-8 text-[16px] w-full  flex items-center justify-center">
                <div className="flex justify-center items-center mt-8">
                  <div className="flex space-x-4">
                    <a
                      href="/https://www.facebook.com/Noww.Social"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className="bg-black rounded-full p-2">
                        <FacebookIcon className="w-4 h-4" color="#B5DAFC" />
                      </div>
                    </a>
                    <a
                      href="https://www.instagram.com/noww.social/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className="bg-black rounded-full p-2">
                        <FaInstagram color="#B5DAFC" />
                      </div>
                    </a>
                    <a
                      href="https://www.linkedin.com/company/circledotooo/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className="bg-black rounded-full p-2">
                        <LinkedinIcon className="w-4 h-4" color="#B5DAFC" />
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full sm:w-1/4 ">
            <div className="flex flex-col w-full  flex items-center justify-center ">
              <div className="flex items-center mr-4">
                <div className="mr-2 bg-gray-200 px-2 py-2 rounded-[10px]">
                  <img src="/like.png" className="w-4 h-4" />
                </div>
                <div
                  className="font-normal text-2xl text-black"
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 500,
                    lineHeight: "125%",
                    display: "flex",
                    alignItems: "flex-end",
                  }}
                >
                  Get in touch
                </div>
              </div>
              <div
                className="text-black text-center font-normal py-2 w-[300px] sm:w-auto text-[16px]  flex items-center justify-center"
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 400,
                  fontSize: "16px",
                  lineHeight: 2,
                }}
              >
                Let us know your feedback and we promise we read it. You are the
                future of Noww....thanks for visiting!
              </div>
            </div>
            {/* Get in touch section */}
          </div>
        </div>
        <div className="w-full flex items-center justify-center py-12 ">
          <div className="w-3/4  sm:px-4 lg:px-6  flex items-center justify-center bg-white">
            <div className=" px-8  py-5">
              {/* contact form */}
              <div className="   py-5 ">
                <form
                  onSubmit={formSubmit}
                  ref={formRef}
                  id="form-contact"
                  method="post"
                  // action="https://wishu-app.com/api/contact"
                  name="contactform"
                >
                  {/* <input
                  name="__RequestVerificationToken"
                  type="hidden"
                  value="MCUmRf8f1F9H0e2rlk-hDz8yxg2AvjAd7maMAvtSxz_SImM6nDxV8V1-wcYWO3NBpJgpJ_elVXigPD-ryTWAylBzkhWfLNjUo9ouQ9h3ia81"
                /> */}
                  <div className="sm:grid grid-cols-2 gap-16">
                    <div className="col-start-1 col-span-1">
                      <label
                        className="flex items-start justify-start  text-gray-little text-base md:text-lg lg:text-xl xl:text-xl font-normal font-roboto text-black"
                        style={{
                          fontFamily: "'Montserrat', sans-serif",
                          fontStyle: "normal",
                          fontWeight: 500,

                          lineHeight: "125%",
                          display: "flex",
                          alignItems: "flex-end",
                        }}
                      >
                        First Name
                      </label>

                      <input
                        type="text"
                        id="name"
                        placeholder="Your Name"
                        name="name"
                        style={{
                          fontFamily: "'Montserrat', sans-serif",
                          fontStyle: "normal",
                          fontWeight: 400,
                          fontSize: "16px",
                          lineHeight: "125%",
                          display: "flex",
                          alignItems: "flex-end",
                        }}
                        className="border border-black rounded-[20px] h-11 px-6 mt-2 w-full text-sm md:text-base lg:text-lg xl:text-xl flex items-center  focus:border-gray-little focus:outline-none focus:rounded-xl font-GothamBook"
                        value={name}
                        onChange={(e) => {
                          e.preventDefault();
                          setName(e.target.value);
                        }}
                      />
                      {errorName && (
                        <div className="text-red-medium px-2">
                          Please give valid name name should be 3 or more
                          charecter long
                        </div>
                      )}
                    </div>

                    <div className=" col-start-2 col-span-1">
                      <label
                        className="flex items-start justify-start  text-gray-little text-base md:text-lg lg:text-xl xl:text-xl font-normal font-roboto text-black"
                        style={{
                          fontFamily: "'Montserrat', sans-serif",
                          fontStyle: "normal",
                          fontWeight: 500,
                          lineHeight: "125%",
                          display: "flex",
                          alignItems: "flex-end",
                        }}
                      >
                        Last Name
                      </label>

                      <input
                        type="email"
                        id="last name"
                        name="last name"
                        placeholder="Your Last Name"
                        className="border border-black rounded-[20px] h-11 px-6 mt-2 w-full text-sm md:text-base lg:text-lg xl:text-xl flex items-center  focus:border-gray-little focus:outline-none focus:rounded-xl font-GothamBook"
                        style={{
                          fontFamily: "'Montserrat', sans-serif",
                          fontStyle: "normal",
                          fontWeight: 400,
                          fontSize: "16px",
                          lineHeight: "125%",
                          display: "flex",
                          alignItems: "flex-end",
                        }}
                        value={lastname}
                        onChange={(e) => {
                          e.preventDefault();
                          setLastName(e.target.value);
                        }}
                      />
                      {errorEmail && (
                        <div className="text-red-medium px-2">
                          Please give valid email
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="sm:grid grid-cols-2 gap-16 py-6">
                    <div className="col-start-1 col-span-1">
                      <label
                        className="flex items-start justify-start  text-gray-little text-base md:text-lg lg:text-xl xl:text-xl font-normal font-roboto text-black"
                        style={{
                          fontFamily: "'Montserrat', sans-serif",
                          fontStyle: "normal",
                          fontWeight: 500,

                          lineHeight: "125%",
                          display: "flex",
                          alignItems: "flex-end",
                        }}
                      >
                        E-mail
                      </label>

                      <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Your Email"
                        style={{
                          fontFamily: "'Montserrat', sans-serif",
                          fontStyle: "normal",
                          fontWeight: 400,
                          fontSize: "16px",
                          lineHeight: "125%",
                          display: "flex",
                          alignItems: "flex-end",
                        }}
                        className="border border-black rounded-[20px] h-11 px-6 mt-2 w-full text-sm md:text-base lg:text-lg xl:text-xl flex items-center  focus:border-gray-little focus:outline-none focus:rounded-xl font-GothamBook"
                        value={email}
                        onChange={(e) => {
                          e.preventDefault();
                          setEmail(e.target.value);
                        }}
                      />
                      {errorEmail && (
                        <div className="text-red-medium px-2">
                          Please give valid email
                        </div>
                      )}
                    </div>

                    <div className=" col-start-2 col-span-1">
                      <label
                        style={{
                          fontFamily: "'Montserrat', sans-serif",
                          fontStyle: "normal",
                          fontWeight: 500,

                          lineHeight: "125%",
                          display: "flex",
                          alignItems: "flex-end",
                        }}
                        className="flex items-start justify-start  text-gray-little text-base md:text-lg lg:text-xl xl:text-xl font-normal font-roboto text-black"
                      >
                        Phone
                      </label>

                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        style={{
                          fontFamily: "'Montserrat', sans-serif",
                          fontStyle: "normal",
                          fontWeight: 400,
                          fontSize: "16px",
                          lineHeight: "125%",
                          display: "flex",
                          alignItems: "flex-end",
                        }}
                        placeholder="Your Phone Number"
                        className="border border-black rounded-[20px] h-11 px-6 mt-2 w-full text-sm md:text-base lg:text-lg xl:text-xl flex items-center focus:border-gray-little focus:outline-none focus:rounded-xl font-GothamBook"
                        value={phone}
                        onChange={(e) => {
                          e.preventDefault();
                          setPhone(e.target.value);
                        }}
                      />

                      {errorPhone && (
                        <div className="text-red-medium px-2">
                          Please give valid phone number
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      style={{
                        fontFamily: "'Montserrat', sans-serif",
                        fontStyle: "normal",
                        fontWeight: 500,

                        lineHeight: "125%",
                        display: "flex",
                        alignItems: "flex-end",
                      }}
                      className="flex items-start justify-start  text-gray-little text-base md:text-lg lg:text-xl xl:text-xl font-normal font-roboto text-black"
                    >
                      Your message
                    </label>
                    <textarea
                      id="body"
                      name="body"
                      style={{
                        fontFamily: "'Montserrat', sans-serif",
                        fontStyle: "normal",
                        fontWeight: 400,
                        fontSize: "16px",
                        lineHeight: "125%",
                        display: "flex",
                        alignItems: "flex-end",
                      }}
                      placeholder="Your message"
                      className="mt-4 min-h-[40px] max-h-[140px] appearance-none block w-full border border-black rounded-[20px] p-4 px-4 text-sm md:text-base lg:text-lg xl:text-xl  focus:border-gray-little focus:outline-none focus:rounded-[20px]  font-GothamBook"
                      value={message}
                      onChange={(e) => {
                        e.preventDefault();
                        setMessage(e.target.value);
                      }}
                    ></textarea>

                    {errorMessage && (
                      <div className="text-red-medium px-2">
                        Please give valid message, message should be greater
                        than 5 charecter
                      </div>
                    )}
                  </div>

                  {submited && (
                    <div className=" py-3 my-2 bg-[#ff8533] text-white font-bold font-GothamBook flex justify-center items-center text-[20px]">
                      Rest assured, we&apos;ll be in touch!
                    </div>
                  )}
                  <div className="mt-4 flex justify-center items-center py-4 ">
                    <button
                      type="submit"
                      className="border-2 border-[#0B1A90]  text-[#0B1A90] px-6 py-2 sm:px-12 sm:py-2 text-sm md:text-base xl:text-lg rounded-[10px] hover:bg-green-dark hover:border-green-dark font-GothamMedium font-semibold text-center flex justify-center items-center font-medium font-roboto"
                    >
                      Send
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rest of the code */}
    </div>
  );
};

export default ContactSection2;
