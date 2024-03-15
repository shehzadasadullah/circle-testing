import React from "react";
import Header from "../Common/Header";
import Footer from "../Common/Footer";
import bgImage from "../../public/revamp/bg-new.png";

const AboutMain = () => {
  return (
    <>
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
          <Header type="dark" />
        </div>
        <div className="w-full lg:p-10 lg:pb-0 mt-10 p-5 pb-0 flex justify-center items-center flex-col">
          <h1
            style={{
              background:
                "linear-gradient(99deg, #FFF 49.91%, rgba(255, 255, 255, 0.00) 112.45%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
            className="w-full text-center text-5xl lg:text-7xl font-bold"
          >
            Privacy Policy
          </h1>
          <p
            style={{
              color: "rgba(255, 255, 255, 0.80)",
            }}
            className="w-full text-center mt-4"
          >
            Last updated: 14 March 2024
          </p>
          <p
            style={{
              color: "rgba(255, 255, 255, 0.80)",
            }}
            className="w-full p-5 mt-5 text-center lg:text-start text-xl"
          >
            Noww, Inc., dba Circle.ooo, Inc. ("us", "we", or "our") operates as
            Circle.ooo (the "Service"). This page informs you of our policies
            regarding the collection, use and disclosure of Personal Information
            we receive from users of the Service. We use your Personal
            Information only for providing and improving the Service. By using
            the Service, you agree to the collection and use of information in
            accordance with this policy.
          </p>
          <p
            style={{
              color: "rgba(255, 255, 255, 0.80)",
            }}
            className="w-full font-bold p-5 text-center lg:text-start text-3xl"
          >
            Information Collection And Use
          </p>
        </div>
      </div>
      <div className="w-full bg-[#05020F] lg:p-10 lg:pt-0 pt-0 p-5 flex justify-center items-center flex-col">
        <p
          style={{
            color: "rgba(255, 255, 255, 0.80)",
          }}
          className="w-full p-5 pt-0 text-center lg:text-start text-xl"
        >
          While using our Service, we may ask you to provide us with certain
          personally identifiable information that can be used to contact or
          identify you. Personally identifiable information may include, but is
          not limited to your name and email address ("Personal Information").
        </p>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.80)",
          }}
          className="w-full p-5 pt-0 text-center lg:text-start text-xl"
        >
          We may share your personal data with third-parties to provide
          necessary services, including:
          <ul style={{ listStyleType: "disc" }} className="p-5 pb-0 lg:pl-12">
            <li>
              If you are the host of an event, we will share your personal data
              with your guests.
            </li>
            <li>
              When you register for an event, we will share your personal data
              with the event host.
            </li>
            <li>
              When you purchase ticket for an event, we will share relevant
              information with Stripe, our payment processor.
            </li>
          </ul>
        </p>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.80)",
          }}
          className="w-full p-5 pt-0 text-center lg:text-start text-xl"
        >
          We make it clear to you throughout the Service when we share your
          personal data with third-parties. We have no control over, and are not
          responsible or liable for the ways those third-parties use your
          personal data.
        </p>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.80)",
          }}
          className="w-full p-5 pt-0 text-center lg:text-start text-xl"
        >
          Any information shared from our short code SMS program will not be
          shared with any third-parties for marketing or other reasons.
        </p>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.80)",
          }}
          className="w-full font-bold p-5 text-center lg:text-start text-3xl"
        >
          Log Data
        </p>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.80)",
          }}
          className="w-full p-5 pt-0 text-center lg:text-start text-xl"
        >
          Like many site operators, we collect information that your browser
          sends whenever you visit our Service ("Log Data"). This Log Data may
          include information such as your computer's Internet Protocol ("IP")
          address, browser type, browser version, the pages of our Service that
          you visit, the time and date of your visit, the time spent on those
          pages and other statistics. In addition, we may use third party
          services such as Google Analytics that collect data about your visit.
        </p>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.80)",
          }}
          className="w-full font-bold p-5 text-center lg:text-start text-3xl"
        >
          Cookies
        </p>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.80)",
          }}
          className="w-full p-5 pt-0 text-center lg:text-start text-xl"
        >
          Cookies are files with small amount of data, which may include an
          anonymous unique identifier. Cookies are sent to your browser from a
          web site and stored on your computer's hard drive.
        </p>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.80)",
          }}
          className="w-full p-5 pt-0 text-center lg:text-start text-xl"
        >
          Like many sites, we use "cookies" to collect information. You can
          instruct your browser to refuse all cookies or to indicate when a
          cookie is being sent. However, if you do not accept cookies, you may
          not be able to use some portions of our Service.
        </p>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.80)",
          }}
          className="w-full font-bold p-5 text-center lg:text-start text-3xl"
        >
          Security
        </p>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.80)",
          }}
          className="w-full p-5 pt-0 text-center lg:text-start text-xl"
        >
          The security of your Personal Information is important to us, but
          remember that no method of transmission over the Internet, or method
          of electronic storage, is 100% secure. While we use commercially
          acceptable means to protect your Personal Information, we cannot
          guarantee its absolute security.
        </p>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.80)",
          }}
          className="w-full font-bold p-5 text-center lg:text-start text-3xl"
        >
          Data Retention
        </p>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.80)",
          }}
          className="w-full p-5 pt-0 text-center lg:text-start text-xl"
        >
          We retain your personal data in order to provide a consistent service.
          We retain different types of data for different lengths depending on
          the type of data and what it is used for. We will retain your Personal
          Information for the period necessary to fulfill obligations to the
          law.
        </p>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.80)",
          }}
          className="w-full font-bold p-5 text-center lg:text-start text-3xl"
        >
          Third-Party Web Sites and Applications
        </p>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.80)",
          }}
          className="w-full p-5 pt-0 text-center lg:text-start text-xl"
        >
          The Service contains links to third-party web sites and applications.
          Clicking on these links may allow those third parties to collect data
          about you. We do not control such web sites and applications and are
          not responsible for how they collect or use your data.
        </p>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.80)",
          }}
          className="w-full font-bold p-5 text-center lg:text-start text-3xl"
        >
          Google and YouTube
        </p>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.80)",
          }}
          className="w-full p-5 pt-0 text-center lg:text-start text-xl"
        >
          We use the Google and YouTube and other APIs to embed videos, upload
          videos to YouTube, and pull other associated data. Accordingly, we
          comply with{" "}
          <a
            href="https://www.youtube.com/t/terms"
            style={{ textDecoration: "underline" }}
          >
            YouTube's Terms of Service
          </a>{" "}
          and{" "}
          <a
            style={{ textDecoration: "underline" }}
            href="https://policies.google.com/privacy"
          >
            Google's Privacy Policy
          </a>
          .
        </p>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.80)",
          }}
          className="w-full p-5 pt-0 text-center lg:text-start text-xl"
        >
          Circle.ooo's use and transfer to any other app of information received
          from Google APIs will adhere to{" "}
          <a
            href="https://developers.google.com/terms/api-services-user-data-policy#additional_requirements_for_specific_api_scopes"
            style={{ textDecoration: "underline" }}
          >
            Google API Services User Data Policy
          </a>
          , including the Limited Use requirements
        </p>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.80)",
          }}
          className="w-full font-bold p-5 text-center lg:text-start text-3xl"
        >
          Your Rights
        </p>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.80)",
          }}
          className="w-full p-5 pt-0 text-center lg:text-start text-xl"
        >
          Where and when required by the law, you have the right to request
          access, correction or erasure of your personal data. We may need to
          request information from you to confirm your identity.
        </p>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.80)",
          }}
          className="w-full p-5 pt-0 text-center lg:text-start text-xl"
        >
          If while using the Service, you grant us access to any external
          account of yours, for example your Zoom account, you may revoke such
          access at any time and we will delete the associated data.
        </p>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.80)",
          }}
          className="w-full font-bold p-5 text-center lg:text-start text-3xl"
        >
          Changes To This Privacy Policy
        </p>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.80)",
          }}
          className="w-full p-5 pt-0 text-center lg:text-start text-xl"
        >
          This Privacy Policy is effective as of the date above and will remain
          in effect except with respect to any changes in its provisions in the
          future, which will be in effect immediately after being posted on this
          page.
        </p>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.80)",
          }}
          className="w-full p-5 pt-0 text-center lg:text-start text-xl"
        >
          We reserve the right to update or change our Privacy Policy at any
          time and you should check this Privacy Policy periodically. Your
          continued use of the Service after we post any modifications to the
          Privacy Policy on this page will constitute your acknowledgment of the
          modifications and your consent to abide and be bound by the modified
          Privacy Policy.
        </p>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.80)",
          }}
          className="w-full p-5 pt-0 text-center lg:text-start text-xl"
        >
          If we make any material changes to this Privacy Policy, we will notify
          you either through the email address you have provided us, or by
          placing a prominent notice on our website.
        </p>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.80)",
          }}
          className="w-full font-bold p-5 text-center lg:text-start text-3xl"
        >
          Contact Us
        </p>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.80)",
          }}
          className="w-full p-5 pt-0 text-center lg:text-start text-xl"
        >
          If you have any questions about this Privacy Policy, please email us
          at{" "}
          <a
            href="mailto:support@circle.ooo"
            style={{ textDecoration: "underline" }}
          >
            support@circle.ooo
          </a>
          .
        </p>
      </div>
      <div className="w-full h-fll">
        <Footer />
      </div>
    </>
  );
};

export default AboutMain;
