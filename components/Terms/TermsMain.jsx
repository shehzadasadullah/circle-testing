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
            Terms And Conditions
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
            Please read these Terms of Use ("Terms", "Terms of Use") carefully
            before using the networking, events and connections applications and
            services provided at https://Circle.ooo (the Service), operated by
            Circle.ooo, Inc. Your access to and use of the Service is
            conditioned on your acceptance of and compliance with these Terms.
            These Terms apply to all visitors, users and others who access or
            use the Service.
          </p>
          <p
            style={{
              color: "rgba(255, 255, 255, 0.80)",
            }}
            className="w-full p-5 pt-0 font-bold text-center lg:text-start text-xl"
          >
            By accessing or using the Service you agree to be bound by these
            Terms. If you disagree with any part of the terms, you may not
            access the Service.
          </p>
          <p
            style={{
              color: "rgba(255, 255, 255, 0.80)",
            }}
            className="w-full font-bold p-5 text-center lg:text-start text-3xl"
          >
            Our Role in Events
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
          Events listed on Circle.ooo are organized by event hosts, not us. We
          are a third party service providing the technology for managing
          events, and are not responsible or liable:
        </p>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.80)",
          }}
          className="w-full p-5 pt-0 text-center lg:text-start text-xl"
        >
          <ul style={{ listStyleType: "disc" }} className="p-5 lg:pl-12">
            <li>For event cancellations by the host.</li>
            <li>For any content or activities related to the event.</li>
            <li>
              For the accuracy of the event information provided by the host,
              including the time and connection details.
            </li>
          </ul>
        </p>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.80)",
          }}
          className="w-full p-5 pt-0 text-center lg:text-start text-xl"
        >
          If you have an issue or question regarding any of the above, please
          promptly contact the event host. Hosts control their events, and it is
          their responsibility to inform you of any relevant terms or policies
          that apply to your use of the Service outside of these Terms, as well
          as to respond to and resolve any disputes that you may have regarding
          their events.
        </p>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.80)",
          }}
          className="w-full font-bold p-5 text-center lg:text-start text-3xl"
        >
          Content
        </p>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.80)",
          }}
          className="w-full p-5 pt-0 text-center lg:text-start text-xl"
        >
          Our Service allows you to create a Circle, create an Event, create an
          Event Passport/profile as well as share, post, link, and make
          available certain information, text, graphics, videos, or other
          material ("Content").
        </p>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.80)",
          }}
          className="w-full p-5 pt-0 text-center lg:text-start text-xl"
        >
          Subject to these Terms, you may share your opinions or other Content
          as permitted by applicable law. You agree that you are solely
          responsible for any content you post on the Service.
        </p>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.80)",
          }}
          className="w-full p-5 pt-0 text-center lg:text-start text-xl"
        >
          You further agree that unless we agree otherwise in writing, you grant
          us and applicable hosts an unrestricted, worldwide, irrevocable,
          non-exclusive and royalty-free right to use, adapt, modify, publish,
          translate, distribute and display any Content you post on the Service,
          in any form or media.
        </p>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.80)",
          }}
          className="w-full font-bold p-5 text-center lg:text-start text-3xl"
        >
          Links To Other Web Sites
        </p>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.80)",
          }}
          className="w-full p-5 pt-0 text-center lg:text-start text-xl"
        >
          Our Service may contain links to third-party web sites or services
          that are not owned or controlled by Circle.ooo, Inc.
        </p>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.80)",
          }}
          className="w-full p-5 pt-0 text-center lg:text-start text-xl"
        >
          We have no control over, and assume no responsibility for, the
          content, privacy policies, or practices of any third party web sites
          or services. You further acknowledge and agree that we shall not be
          responsible or liable, directly or indirectly, for any damage or loss
          caused or alleged to be caused by or in connection with use of or
          reliance on any such content, goods or services available on or
          through any such web sites or services.
        </p>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.80)",
          }}
          className="w-full font-bold p-5 text-center lg:text-start text-3xl"
        >
          Acceptable Use
        </p>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.80)",
          }}
          className="w-full p-5 pt-0 text-center lg:text-start text-xl"
        >
          You must not use the Service in any unlawful or fraudulent manner, or
          in a way that could damage or compromise our systems or security. And
          you must not access the Service by any means other than our publicly
          supported interfaces.
        </p>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.80)",
          }}
          className="w-full font-bold p-5 text-center lg:text-start text-3xl"
        >
          Consent
        </p>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.80)",
          }}
          className="w-full p-5 pt-0 text-center lg:text-start text-xl"
        >
          If you import people's data into Circle.ooo (names / emails), you must
          have their explicit consent to import them and send them emails.
          Violation of this policy will result in suspension of your account.
        </p>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.80)",
          }}
          className="w-full font-bold p-5 text-center lg:text-start text-3xl"
        >
          Copyright, Trademarks, and other Intellectual Property
        </p>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.80)",
          }}
          className="w-full p-5 pt-0 text-center lg:text-start text-xl"
        >
          All content and other materials available on our websites and
          presented as part of the Service, including, without limitation,
          trademarks, service marks, trade names, images, audio, text, software,
          and the “look and feel” of https://Circle.ooo and its associated
          lower-level webpages (collectively, “Site Content”) are protected by
          copyright, trademark, and other intellectual property laws. Such Site
          Content includes the website https://www.Circle.ooo, the mobile
          application/s Circle.oo and “Circle.ooo” designs, which are common law
          trademarks of Circle.ooo and Noww, Inc.
        </p>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.80)",
          }}
          className="w-full p-5 pt-0 text-center lg:text-start text-xl"
        >
          You may not reproduce, republish, distribute, display, perform,
          transmit, sell, or otherwise use any Site Content without our express
          written permission, except when such actions occur in connection with
          bona fide uses of the Service through our publicly supported
          interfaces. In this regard, users are prohibited from downloading,
          republication, retransmission, reproduction, or other use of any image
          (and other similar content) as a stand-alone file. Furthermore, Site
          Content may not be used in any manner that is likely to cause
          confusion among consumers.
        </p>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.80)",
          }}
          className="w-full font-bold p-5 text-center lg:text-start text-3xl"
        >
          Copyright Infringement
        </p>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.80)",
          }}
          className="w-full p-5 pt-0 text-center lg:text-start text-xl"
        >
          If you believe that any Site Content infringes upon your copyright,
          please notify us at support@Circle.ooo. Your notice should include (a)
          a description of the copyrighted work that you claim has been
          infringed; (b) the URL where the allegedly infringing Site Content is
          located; (c) your full name, postal address, telephone number, and
          email address; (d) a statement that you have a good faith belief that
          the use of the allegedly infringing material on the Site is not
          authorized; (e) your physical or electronic signature; and (f) a
          statement that you are the copyright owner or an authorized agent of
          the copyright owner, including any applicable United States copyright
          registration number(s).
        </p>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.80)",
          }}
          className="w-full font-bold p-5 text-center lg:text-start text-3xl"
        >
          Submissions
        </p>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.80)",
          }}
          className="w-full p-5 pt-0 text-center lg:text-start text-xl"
        >
          We welcome feedback on our Service. However, you agree that any ideas,
          suggestions, drawings, graphics, innovations, concepts,
          recommendations, or similar materials (“Submissions”) you send us are
          not confidential. You hereby assign such Submissions to us without
          compensation (or the expectation of compensation), and agree that we
          may disclose, reproduce, republish, modify, distribute, display,
          perform, transmit, sell, or otherwise use your Submissions for
          commercial or non-commercial purposes with no compensation to you. For
          any Submissions that cannot be legally assigned to us, you hereby
          grant us an unrestricted, perpetual, royalty-free, irrevocable, fully
          paid-up, and worldwide license to reproduce, republish, modify,
          distribute, display, perform, transmit, sell, or otherwise use your
          Submissions for commercial or non-commercial purposes with no
          compensation to you.
        </p>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.80)",
          }}
          className="w-full font-bold p-5 text-center lg:text-start text-3xl"
        >
          Disclaimer
        </p>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.80)",
          }}
          className="w-full p-5 pt-0 text-center lg:text-start text-xl"
        >
          YOU AGREE THAT USE OF THE SERVICE IS AT YOUR SOLE RISK. THE SERVICE IS
          PROVIDED ON AN “AS IS” AND “AS AVAILABLE” BASIS. WE EXPRESSLY DISCLAIM
          ALL WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING, WITHOUT
          LIMITATION, ANY WARRANTY OF MERCHANTABILITY, TITLE, QUIET ENJOYMENT,
          FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT. NO ADVICE OR
          INFORMATION, WHETHER ORAL OR WRITTEN, OBTAINED BY YOU FROM US OR AT OR
          THROUGH THE SERVICE SHALL CREATE ANY WARRANTY NOT EXPRESSLY MADE
          HEREIN.
        </p>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.80)",
          }}
          className="w-full p-5 pt-0 text-center lg:text-start text-xl"
        >
          WE MAKE NO WARRANTY THAT THE SERVICE WILL MEET YOUR REQUIREMENTS, BE
          ACCURATE, COMPLETE, CURRENT OR TIMELY, UNINTERRUPTED, SECURE, OR ERROR
          FREE.
        </p>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.80)",
          }}
          className="w-full p-5 pt-0 text-center lg:text-start text-xl"
        >
          YOU ARE SOLELY RESPONSIBLE FOR ANY DAMAGE TO YOUR COMPUTER, COMPUTER
          NETWORK, OR DATA (INCLUDING LOSS OF DATA) THAT RESULTS FROM YOUR
          ACCESS OR USE OF THE SERVICE. WE DO NOT WARRANT THAT THE SERVICE IS
          FREE OF DEFECTS, VIRUSES, MALFUNCTIONS, OR HARMFUL COMPONENTS THAT
          COULD DAMAGE OR ALLOW UNAUTHORIZED ACCESS TO YOUR COMPUTER, COMPUTER
          NETWORK, OR DATA.
        </p>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.80)",
          }}
          className="w-full p-5 pt-0 text-center lg:text-start text-xl"
        >
          WE ARE NOT RESPONSIBLE FOR ANY LOSS OR DAMAGE CAUSED, OR ALLEGED TO
          HAVE BEEN CAUSED, DIRECTLY OR INDIRECTLY, BY THE INFORMATION OR IDEAS
          CONTAINED, SUGGESTED, OR REFERENCED AT OR THROUGH THE SERVICE.
        </p>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.80)",
          }}
          className="w-full p-5 pt-0 text-center lg:text-start text-xl"
        >
          WE MAKE NO REPRESENTATIONS OR WARRANTIES THAT THE SERVICE IS
          APPROPRIATE OR AVAILABLE FOR USE IN ALL GEOGRAPHIC LOCATIONS. IF YOU
          ACCESS OR USE THE SERVICE FROM OUTSIDE THE UNITED STATES OF AMERICA,
          YOU ARE SOLELY RESPONSIBLE FOR COMPLIANCE WITH ALL APPLICABLE LAWS,
          INCLUDING WITHOUT LIMITATION, EXPORT AND IMPORT REGULATIONS OF OTHER
          COUNTRIES.
        </p>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.80)",
          }}
          className="w-full font-bold p-5 text-center lg:text-start text-3xl"
        >
          Limitation of Liability
        </p>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.80)",
          }}
          className="w-full p-5 pt-0 text-center lg:text-start text-xl"
        >
          NEITHER WE NOR OUR SUBSIDIARIES, OR AFFILIATES, AND RESPECTIVE
          OFFICERS, DIRECTORS, SHAREHOLDERS, EMPLOYEES, AGENTS, OR
          REPRESENTATIVES (OR THEIR RESPECTIVE SUCCESSORS AND ASSIGNS) SHALL BE
          LIABLE IN CONTRACT, TORT (INCLUDING NEGLIGENCE), OR OTHERWISE FOR ANY
          DIRECT, INDIRECT, INCIDENTAL, SPECIAL, PUNITIVE, OR CONSEQUENTIAL
          DAMAGES RESULTING FROM THE SERVICE OR THE USE, ATTEMPTED USE OR
          INABILITY TO USE THE SERVICE, INCLUDING, BUT NOT LIMITED TO, DAMAGES
          FOR LOST REVENUE, LOSS OF DATA, OR OTHER INTANGIBLES EVEN IF
          FORESEEABLE OR IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH
          DAMAGES. IN ANY EVENT, YOU AGREE THAT OUR TOTAL LIABILITY FOR DAMAGES,
          REGARDLESS OF THE FORM OF ACTION, SHALL NOT EXCEED THE ACTUAL TOTAL
          AMOUNT RECEIVED BY US FROM YOU TO ACCESS THE SERVICE. THE FOREGOING
          LIMITATIONS WILL APPLY EVEN IF THE ABOVE STATED REMEDY FAILS OF ITS
          ESSENTIAL PURPOSE. Some jurisdictions do not allow the exclusion of
          implied warranties or limitation of liability for incidental or
          consequential damages. Therefore, the exclusions set forth above may
          not apply to you.
        </p>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.80)",
          }}
          className="w-full font-bold p-5 text-center lg:text-start text-3xl"
        >
          Indemnification
        </p>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.80)",
          }}
          className="w-full p-5 pt-0 text-center lg:text-start text-xl"
        >
          You agree to indemnify, hold harmless, and release us, our
          subsidiaries, our affiliates, and our respective officers, directors,
          shareholders, employees, agents, representatives (and their respective
          successors and assigns) from and against any and all claims, damages,
          costs and expenses, including, but not limited to, reasonable
          attorney’s fees, arising from or related to your access, use,
          attempted use, inability to use, or misuse of the Service or
          noncompliance with these Terms of Use.
        </p>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.80)",
          }}
          className="w-full font-bold p-5 text-center lg:text-start text-3xl"
        >
          Export Controls and Designated Persons
        </p>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.80)",
          }}
          className="w-full p-5 pt-0 text-center lg:text-start text-xl"
        >
          The Service is operated from the United States and it is possible,
          however unlikely, that software available at or through the Service
          may be subject to United States export controls administered by the
          United States Commerce Department or sanctions programs administered
          by the United States Treasury Department. No software available at or
          through the Service may be downloaded or otherwise exported or
          re-exported (a) into (or to a national or resident of) any country
          subject to a United States or United Nation embargo or sanction; (b)
          to anyone on the United States Treasury Department’s list of Specially
          Designated Nationals and Blocked Persons (“SDN List”); (c) to anyone
          on the United States Commerce Department’s Denied Persons List or
          Entity List; or (d) to anyone subject to the same or similar
          restrictions as the foregoing. By using any software available at or
          through the Service, you represent and warrant that you are not
          located in, under the control of, or a national or resident of any
          such country or on any of the above lists or subject to such
          restrictions.
        </p>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.80)",
          }}
          className="w-full font-bold p-5 text-center lg:text-start text-3xl"
        >
          Governing Law, Jurisdiction, and Limitation of Actions
        </p>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.80)",
          }}
          className="w-full p-5 pt-0 text-center lg:text-start text-xl"
        >
          The Service is created and controlled by Noww, Inc., dba Circle.ooo
          Inc. in the State of Texas, United States of America. You agree that
          these Terms of Use will be governed by and construed in accordance
          with the laws of the State of California, without regard to its
          conflicts of law provisions. You agree that all legal proceedings
          arising out of or in connection with these Terms of Use or the Service
          must be brought in a federal or state court located in San Francisco,
          California, and that your claim(s) will be forever waived and barred
          unless filed within one year of the time in which the event(s) giving
          rise to such claim(s) began. You expressly submit to the exclusive
          jurisdiction of said courts and consent to extraterritorial service of
          process.
        </p>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.80)",
          }}
          className="w-full font-bold p-5 text-center lg:text-start text-3xl"
        >
          General Provisions
        </p>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.80)",
          }}
          className="w-full p-5 pt-0 text-center lg:text-start text-xl"
        >
          If any provision of these Terms of Use are found to be invalid or
          unenforceable, such provision shall be severed from the remainder of
          the Terms of Use, which shall remain in full force and effect. No
          waiver of any breach or default of the Terms of Use shall be deemed to
          be a waiver of any preceding or subsequent breach or default. You may
          be required to agree to additional terms and conditions to access
          particular sections or functions of the Service. We reserve the right,
          in our sole discretion and without consent or notice, to transfer,
          assign, sublicense, or pledge the Service or these Terms of Use, in
          whole or in part, to any person or entity. You may not assign,
          sublicense, or otherwise transfer in any manner any of your rights or
          obligations under the Terms of Use. The section headings used in the
          Terms of Use are for convenience only.
        </p>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.80)",
          }}
          className="w-full font-bold p-5 text-center lg:text-start text-3xl"
        >
          Termination
        </p>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.80)",
          }}
          className="w-full p-5 pt-0 text-center lg:text-start text-xl"
        >
          We may terminate or suspend access to our Service immediately, without
          prior notice or liability, for any reason whatsoever, including
          without limitation if you breach the Terms. All provisions of the
          Terms which by their nature should survive termination shall survive
          termination, including, without limitation, ownership provisions,
          warranty disclaimers, indemnity and limitations of liability.
        </p>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.80)",
          }}
          className="w-full font-bold p-5 text-center lg:text-start text-3xl"
        >
          Changes
        </p>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.80)",
          }}
          className="w-full p-5 pt-0 text-center lg:text-start text-xl"
        >
          We reserve the right, at our sole discretion, to modify or replace
          these Terms at any time. What constitutes a material change will be
          determined at our sole discretion.
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
          <span
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
            className="cursor-pointer"
          >
            Circle.ooo, 3233 W. Dallas St. Suite 1107, Houston, TX 77019,{" "}
          </span>
          <a
            style={{ textDecoration: "underline" }}
            href="http://support@circle.ooo
"
          >
            support@circle.ooo
          </a>
        </p>
      </div>
      <div className="w-full h-fll">
        <Footer />
      </div>
    </>
  );
};

export default AboutMain;
