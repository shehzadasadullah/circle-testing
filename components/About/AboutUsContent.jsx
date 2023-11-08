import React from "react";

const AboutUsContent = () => {
  return (
    <div className="w-full h-full px-2 sm:px-8 md:px-12 lg:px-16 xl:px-24 py-2 sm:py-4 md:py-6 lg:py-8 xl:py-12 2xl:py-16">
      <h1 className="font28 font-semibold text-[#14183E] font-Montserrat w-full flex justify-start items-center px-2">
        About Us
      </h1>
      <div className="w-full h-full my-8 flex flex-col justify-center items-start gap-4">
        <h2 className="w-full font24 font-medium font-Montserrat py-1">
          After talking to hundreds of people of all types & ages, we discovered
          most people have the same issues:
        </h2>
        <ul className="w-full h-full list-decimal list-inside pl-4 flex flex-col justify-center items-start gap-2">
          <li className="w-full font20 font-Montserrat ">
            too many contacts in their phone, many of whom they don&apos;t
            remember or are outdated.
          </li>
          <li className="w-full font20 font-Montserrat ">
            too many business cards from people they don&apos;t remember.
          </li>
          <li className="w-full font20 font-Montserrat ">
            lists of LinkedIn contacts they don&apos;t remember.
          </li>
          <li className="w-full font20 font-Montserrat ">
            when searching on LinkedIn for someone they met, many have forgotten
            the name or spelling, or aren&apos;t sure which profile is theirs.
          </li>
          <li className="w-full font20 font-Montserrat ">
            they connected with someone on LinkedIn who forgot to accept the
            connection, so they can&apos;t followup with a message.
          </li>
          <li className="w-full font20 font-Montserrat ">
            too many steps to create & invite to events.
          </li>
          <li className="w-full font20 font-Montserrat ">
            no quick, easy way to text invite to events and tap or click
            straight to all the event info.
          </li>
          <li className="w-full font20 font-Montserrat ">
            no quick, easy way to connect, exchange info and remember who you
            met at an event.
          </li>
        </ul>
        <p className="w-full font20 font-Montserrat ">
          Enter Noww.social. We are committed to solving these problems for you,
          to make inviting, accepting, finding, meeting, and contextualizing
          your contacts quicker, easier and more fun. Thanks for giving us the
          opportunity! Send us suggestions or feedback at any time here!
        </p>
      </div>
    </div>
  );
};

export default AboutUsContent;
