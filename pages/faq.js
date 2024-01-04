import Image from "next/image";
import React, { useState } from "react";
import FAQComponent from "../components/FaqComponent";
import Link from "next/link";
import Header from "@/components/Common/Header";
import Footer from "@/components/Common/Footer";
import bgImage from "../public/linesBG.png";
import basket from "../public/bgBasket.png";
import { useRouter } from "next/router";

const FaqItem = ({ question, answer, isActive, onToggle }) => (
  <div
    onClick={onToggle}
    className={`rounded-xl p-5 flex cursor-pointer flex-col justify-center items-center w-full text-start border-[#E0E0E0] border-[1px] ${
      isActive ? "bg-[#007BAB] text-[#fff]" : "text-[#000]"
    } transition-all duration-500 ease-in-out`}
  >
    <div className="w-full flex justify-center items-center">
      <button className="w-full justify-between items-center flex">
        <div className="text-lg w-full text-start">{question}</div>
        <div className="text-end ml-5 lg:ml-0 text-2xl">
          {isActive ? "-" : "+"}
        </div>
      </button>
    </div>
    <div
      className={`w-full text-start overflow-hidden transition-max-height ${
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
    <div className="w-full h-full bg-[#F8F9FD]">
      <div className="w-full h-full bg-[#fff]">
        <Header type="light" />
      </div>

      <div className="w-full h-auto flex flex-col justify-center gap-12 items-center p-8 lg:p-20">
        <p className="text-5xl lg:text-6xl text-[#0E0E11] w-full text-center">
          Frequently Asked <span className="font-bold">Questions</span>
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

      <div
        class="bg-cover bg-center h-96 bg-[#00384F] flex flex-col lg:flex-row justify-center items-center"
        style={{ backgroundImage: `url(${bgImage.src})` }}
      >
        <div className="w-full lg:w-1/2 flex gap-10 justify-center items-center flex-col lg:px-10 lg:py-5">
          <p className="w-full text-center text-4xl lg:text-6xl font-semibold text-[#fff]">
            Can't find the answer you're looking for?
          </p>
          <div className="w-full text-center">
            <button
              onClick={() => {
                router.push("contact");
              }}
              className="rounded-full py-3 px-5 bg-[#F2F2F2] text-[#333]"
            >
              Submit Request
            </button>
          </div>
        </div>
        <div className="w-full lg:w-1/2 hidden lg:flex justify-center items-center">
          <img src={basket.src} alt="" />
        </div>
      </div>

      <div className="w-full h-full">
        <Footer />
      </div>
    </div>
  );
};

export default FAQSection;
