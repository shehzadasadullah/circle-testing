import React from "react";
import ContactSection1 from "../components/contact/ContactSection1";
import ContactSection2 from "../components/contact/ContactSection2";
import Footer from "@/components/Common/Footer";

const contact = () => {
  return (
    <div className="bg-[#E9EDF5]">
      <ContactSection1 />
      <div>
        <ContactSection2 />
      </div>
      <div className="sm:-mt-60 mt-72">
        <Footer />
      </div>
    </div>
  );
};

export default contact;
