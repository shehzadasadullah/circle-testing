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
            Security
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
            className="w-full font-bold p-5 mt-5 text-center text-xl"
          >
            This page serves as a summary/overview of security procedures that
            we employ with the Circle.ooo company and product.
          </p>
          <p
            style={{
              color: "rgba(255, 255, 255, 0.80)",
            }}
            className="w-full font-bold p-5 text-center lg:text-start text-3xl"
          >
            Payments
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
          Payments are processed via Stripe who is a fully PCI-compliant service
          provider. They are certified with PCI DSS v3.2.1 compliance.
        </p>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.80)",
          }}
          className="w-full p-5 pt-0 text-center lg:text-start text-xl"
        >
          Circle.ooo does not process or store any payment information, however
          may institute in-app or in-profile purchasing at any time at which
          time we will employ standard industry protections for your data such
          that it is secured.
        </p>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.80)",
          }}
          className="w-full font-bold p-5 text-center lg:text-start text-3xl"
        >
          Privacy
        </p>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.80)",
          }}
          className="w-full p-5 pt-0 text-center lg:text-start text-xl"
        >
          Circle.ooo does not share or sell any of your data with other sources
          other than the Event Host which may share your data with Sponsor/s.
          You can read more information about your privacy protections at
          Circle.ooo/privacy.
        </p>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.80)",
          }}
          className="w-full font-bold p-5 text-center lg:text-start text-3xl"
        >
          Infrastructure
        </p>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.80)",
          }}
          className="w-full p-5 pt-0 text-center lg:text-start text-xl"
        >
          We use GCP / Google Cloud to host our mobile application technical
          infrastructure and Amazon AWS ECS + EC2 to host our progressive web
          application technical infrastructure and servers. Amazon AWS has the
          following compliance PCI-DSS Level 1 Service Provider, ISO 27001
          certified, and SAS-70 Type II and SSAE16.
        </p>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.80)",
          }}
          className="w-full font-bold p-5 text-center lg:text-start text-3xl"
        >
          Development Process
        </p>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.80)",
          }}
          className="w-full p-5 pt-0 text-center lg:text-start text-xl"
        >
          We employ both internal and external testing and validation of our
          development process.
        </p>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.80)",
          }}
          className="w-full p-5 pt-0 text-center lg:text-start text-xl"
        >
          Our application and code is scanned for static and dynamic code
          vulnerabilities. All engineers receive training and guidance regarding
          best in industry level security practices.
        </p>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.80)",
          }}
          className="w-full font-bold p-5 text-center lg:text-start text-3xl"
        >
          Incident Response
        </p>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.80)",
          }}
          className="w-full p-5 pt-0 text-center lg:text-start text-xl"
        >
          All engineers are trained in incident response. We have systems
          monitoring the performance and reliability of our servers 24x7.
        </p>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.80)",
          }}
          className="w-full p-5 pt-0 text-center lg:text-start text-xl"
        >
          Engineers serve rotating on-call rotations and are able to respond to
          incidents in a timely manner.
        </p>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.80)",
          }}
          className="w-full font-bold p-5 text-center lg:text-start text-3xl"
        >
          SOC Compliance In Progress
        </p>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.80)",
          }}
          className="w-full p-5 pt-0 text-center lg:text-start text-xl"
        >
          We have not yet begun the process of SOC Compliance audit however this
          has been added to our implementation roadmap and as such, we will
          update this page when the audit is in process and/or has been
          completed.
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
          If you have questions or have found a suspected vulnerability, you can
          contact us at{" "}
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
