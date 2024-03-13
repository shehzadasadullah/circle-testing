import Image from "next/image";
import React, { useState } from "react";
import FAQComponent from "../components/FaqComponent";
import Link from "next/link";
import Header from "@/components/Common/Header";
import Footer from "@/components/Common/Footer";
import bgImage from "../public/revamp/bg-invite.png";
import basket from "../public/bgBasket.png";
import { useRouter } from "next/router";
import backgroundImage from "../public/revamp/bg-createEvent.jpg";

const FaqItem = ({ question, answer, isActive, onToggle }) => (
  <div
    onClick={onToggle}
    style={{
      border: isActive
        ? "1px solid rgba(64, 17, 124, 0.45)"
        : "1px solid rgba(255, 255, 255, 0.10)",
      background: isActive
        ? "linear-gradient(94deg, rgba(42, 28, 61, 0.60) 0.01%, rgba(144, 33, 255, 0.47) 103.3%), #070317"
        : "rgba(28, 34, 44, 0.60)",
    }}
    className={`rounded-xl p-5 flex cursor-pointer text-[#fff] flex-col justify-center items-center w-full text-start transition-all duration-500 ease-in-out`}
  >
    <div className="w-full flex justify-center items-center">
      <button className="w-full justify-between items-center flex">
        <div className="text-lg text-[#fff] w-full text-start">{question}</div>
        <div className="text-end text-[#fff] ml-5 lg:ml-0 text-2xl">
          {isActive ? "-" : "+"}
        </div>
      </button>
    </div>
    <div
      className={`w-full text-start text-[#fff] overflow-hidden transition-max-height ${
        isActive ? "mt-2 max-h-auto" : "max-h-0"
      } duration-500 ease-in-out`}
    >
      {answer}
    </div>
  </div>
);

const FAQSection = () => {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);

  const faqs = [
    {
      question: "What is a Circle?",
      answer:
        "A Circle is either a group, entity, meeting, or Event that you can create to hold a gathering, create Events and yet have a way to connect and stay connected after with anyone in the Circle more easily than other tools in the market. You can create one Circle and have multiple Events within a Circle. Or you can create separate Circles for Separate Events. Coming soon: Connecting Circles.",
    },
    {
      question: "What is Attendee Mode?",
      answer:
        "Attendee mode is the mode you’re in when you attend an Event. If you want to see who’s there, connect with people, see event details, or share your info, you should be in Attendee mode.",
    },
    {
      question: "What is Host Mode? ",
      answer:
        "Host mode is used when you’re hosting an Event and you’d like to set up a Circle, and Event, (or an Event in a Circle) and you want to have access to options that you would use when you’re hosting such as Invites, etc.",
    },
    {
      question:
        "What is the difference' not 'a difference & My Profile and My Digicard?",
      answer:
        "The Profile is your master account. You can build different digital business cards once you have an account set up on Circle.ooo. For example, if you’re a VP of Sales at work, but a Soccer Coach outside of work, you can create a digital card for each person.",
    },
    {
      question: "Will you find my Event a Sponsor?",
      answer:
        "Circle.ooo is working on finding anyone who wants help finding a Sponsor a Sponsor by matching the Sponsor’s needs with the Audience more accurately but in a way that is a win for everyone. For example, if 90% of the people at Sam’s Event are Skiers, Oakley may be a good Sponsor, especially if Oakley offers Sam’s Attendees 25% off Oakley. The goal – to make this process quicker, easier and more valuable for all the parties involved.",
    },
    {
      question: "Can I customize my Circle? ",
      answer: `Yes – you can request special features in your Circle such as a News feed, Polls, Community Calendar but there will be an extra cost for any extra development work. We are working on making these add-on’s more like plug-in modules, so we can reduce the cost dramatically for a function multiple Circles will want. Send us your ideas!`,
    },
    {
      question: " What is a Sponsor ‘Card’?  ",
      answer: `A Sponsor ‘Card’ is almost like a mini website that is simplified. It’s something a Sponsor can create once and use over and over; or can continually edit as needed. That card will be inserted into any Event they sponsor and will turn any links they input into the Card (such as ‘book a call’, ‘see our portfolio’ or ‘buy our product’ or Podcasts, social media – any link at all the Sponsor wants the Audience to connect through) into interactive buttons so people attending can tap right through.`,
    },
    {
      question: "Can two Circles hold an Event together?",
      answer: "This is something we’re working on – stay tuned!",
    },
  ];

  const handleToggle = (index) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? -1 : index));
  };

  return (
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

      <div className="w-full h-auto flex flex-col justify-center gap-12 items-center p-8 lg:p-20">
        <p
          style={{
            background:
              "linear-gradient(98deg, #FFF 17.81%, rgba(255, 255, 255, 0.00) 120.14%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
          className="text-5xl lg:text-6xl w-full text-center"
        >
          Frequently Asked Questions
        </p>
        <div className=" w-full lg:w-[90%] flex flex-col gap-5 justify-center items-center h-auto">
          {faqs.map((faq, index) => (
            <FaqItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isActive={index === activeIndex}
              onToggle={() => handleToggle(index)}
            />
          ))}
        </div>
      </div>

      {/* <div
        style={{
          background:
            "linear-gradient(94deg, rgba(42, 28, 61, 0.60) 0.01%, rgba(144, 33, 255, 0.47) 103.3%), #070317",
          // backgroundSize: "cover",
          // backgroundPosition: "center",
          // backgroundRepeat: "no-repeat",
        }}
        className="w-full h-full text-[#fff] p-5"
      >
        <div className="flex flex-col lg:flex-row justify-center items-center w-full lg:gap-5">
          <div className="w-full lg:w-[70%] flex flex-col justify-center items-center p-2 lg:p-10">
            <p className="w-full text-center text-2xl lg:text-6xl font-semibold text-[#fff]">
              Can't find the answer you're looking for?
            </p>
            <div className="w-full text-center">
              <button
                onClick={() => {
                  router.push("contact");
                }}
                className="rounded-full py-4 px-10 bg-[#F2F2F2] text-[#333] mt-8"
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      </div> */}

      <div
        class="w-full h-full p-5"
        style={{
          background:
            "linear-gradient(94deg, rgba(42, 28, 61, 0.60) 0.01%, rgba(144, 33, 255, 0.47) 103.3%), #070317",
        }}
      >
        <div className="flex flex-col lg:flex-row justify-center items-center">
          <div className="w-full lg:w-1/2 flex gap-5 lg:gap-10 justify-center items-center flex-col px-3 py-3 lg:px-10 lg:py-5">
            <p className="w-full text-center text-2xl lg:text-6xl font-semibold text-[#fff]">
              Can't find the answer you're looking for?
            </p>
            <div className="w-full text-center">
              <button
                onClick={() => {
                  router.push("contact");
                }}
                className="rounded-full py-3 px-10 bg-[#F2F2F2] text-[#333]"
              >
                Submit Request
              </button>
            </div>
          </div>
          <div className="w-full hidden lg:w-1/2 lg:flex justify-center items-center">
            <img
              src={basket.src}
              className="w-full object-contain h-full"
              alt=""
            />
          </div>
        </div>
      </div>

      <div className="w-full h-full">
        <Footer />
      </div>
    </div>
  );
};

export default FAQSection;
