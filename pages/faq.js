import Image from "next/image";
import React, { useState } from "react";
import FAQComponent from "../components/FaqComponent";
import Link from "next/link";
import Header from "@/components/Common/Header";
import Footer from "@/components/Common/Footer";

const FAQSection = () => {
  const [active, setActive] = useState(null);
  const faqs_left = [
    {
      id: 1,
      header: "What is a Circle?",
      text: `A Circle is either a group, entity, meeting, or Event that you can create to hold a gathering, create Events and yet have a way to connect and stay connected after with anyone in the Circle more easily than other tools in the market.  You can create one Circle and have multiple Events within a Circle.  Or you can create separate Circles for Separate Events.  Coming soon:  Connecting Circles.`,
    },
    {
      id: 2,
      header: "What is Attendee Mode?",
      text: `Attendee mode is the mode you’re in when you attend an Event.  If you want to see who’s there, connect with people, see event details, or share your info, you should be in Attendee mode.`,
    },
    {
      id: 3,
      header: "What is Host Mode? ",
      text: "Host mode is used when you’re hosting an Event and you’d like to set up a Circle, and Event, (or an Event in a Circle) and you want to have access to options that you would use when you’re hosting such as Invites, etc.",
    },
    {
      id: 4,
      header:
        "What is the difference between the Profile and the Business Card in the App?",
      text: "The Profile is your master account.  You can build different digital business cards once you have an account set up on Circle.ooo.  For example, if you’re a VP of Sales at work, but a Soccer Coach outside of work, you can create a digital card for each person.",
    },
    {
      id: 5,
      header: "Will you find my Event a Sponsor?",
      text: "Circle.ooo is working on finding anyone who wants help finding a Sponsor a Sponsor by matching the Sponsor’s needs with the Audience more accurately but in a way that is a win for everyone.  For example, if 90% of the people at Sam’s Event are Skiers, Oakley may be a good Sponsor, especially if Oakley offers Sam’s Attendees 25% off Oakely.  The goal – to make this process quicker, easier and more valuable for all the parties involved.",
    },
  ];
  const faqs_right = [
    {
      id: 6,
      header: "Can I customize my Circle? ",
      text: `Yes – you can request special features in your Circle such as a Newsfeed, Polls, Community Calendar but there will be an extra cost for any extra development work.  We are working on making these add-on’s more like plug-in modules, so we can reduce the cost dramatically for a function multiple Circles will want.  Send us your ideas!`,
    },
    {
      id: 7,
      header: " What is a Sponsor ‘Card’?  ",
      text: `A Sponsor ‘Card’ is almost like a mini website that is simplified.  It’s something a Sponsor can create once and use over and over; or can continually edit as needed.  That card will be inserted into any Event they sponsor and will turn any links they input into the Card (such as ‘book a call’, ‘see our portfolio’ or ‘buy our product’ or Podcasts, social media – any link at all the Sponsor wants the Audience to connect through) into interactive buttons so people attending can tap right through.`,
    },
    {
      id: 8,
      header: "Do you share my Data?",
      text: "While Circle.ooo does gather Data from its users, we are committed to sharing aggregate data in most cases so as to protect user privacy or give users a chance to opt in or out.  In addition, in Settings, the User can change data sharing permissions at any time.   Keep in mind data that is shared is primarily to provide the User with more improved offers such as 25% off coffee at Starbucks for a coffee drinker.  Finally, at this time Circle.ooo is not using User data to target ads individually to Users.",
    },
    {
      id: 9,
      header: "Can two Circles hold one Event?",
      text: "This is something we’re working on – stay tuned!",
    },
    {
      id: 10,
      header: "How do we reach you? ",
      text: "You can email support@circle.ooo and coming soon:  live chat and a phone line for all inquiries.  Bear with us – we’re a Startup.  But we LOVE our customers, and we want things to be EASY for you.  So, trust that everything we do will revolve around you.  Thx for being with us! ",
    },
  ];

  const handleToggle = (index) => {
    if (active === index) {
      setActive(null);
    } else {
      setActive(index);
    }
  };

  return (
    <div>
      <div className="w-full h-full">
        <Header type="light" />
      </div>
      <div className="w-full h-full px-2 sm:px-4 md:px-12 lg:px-20 xl:px-32 py-2 sm:py-4 md:py-8 lg:py-12 relative">
        <div className="w-full bg-white flex flex-col lg:flex-col lg:gap-10 xl:gap-16 justify-center lg:justify-center items-center lg:items-start my-4 sm:my-8 lg:my-12">
          <div className="font48 text-black font-semibold text-center w-full capitalize whitespace-pre-line">
            <div className=" items-center justify-center">
              <div className="z-20 bg-white w-full flex items-center justify-center text-black text-[44px] font-bold font-sans">
                Frequently Asked Questions
              </div>
            </div>
          </div>
          <div className="w-full h-full ">
            {faqs_left.map((faq, index) => {
              return (
                <FAQComponent
                  key={index}
                  active={active}
                  faq={faq}
                  handleToggle={handleToggle}
                />
              );
            })}
          </div>
          <div className="w-full h-full ">
            {faqs_right.map((faq, index) => {
              return (
                <FAQComponent
                  key={index}
                  active={active}
                  faq={faq}
                  handleToggle={handleToggle}
                />
              );
            })}
          </div>
        </div>
        <div className="z-10 mx-2 sm:mx-4 md:mx-6 lg:mx-10 xl:mx-14 flex flex-col justify-center items-center py-4 md:py-4 lg:py-10 xl:py-14 rounded-lg shadow-box bg-[#F9F6FF] my-6">
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold my-4">
            Can’t find the answers you are looking for?
          </p>
          <p
            className=" text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl my-4 bg-green-100 py-2 px-6 underline"
            style={{ borderRadius: 15 }}
          >
            <Link className="underline" href="/contact">
              Submit a request
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FAQSection;
