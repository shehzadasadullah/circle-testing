import React, { useRef } from "react";
import { ChevronDown } from "@/icons";

const FAQComponent = (props) => {
  const contentEl = useRef();
  const { active, faq, handleToggle } = props;
  const { header, id, text } = faq;
  return (
    <div
      className={`border-b border-[#CBCBCB] w-full py-2 cursor-pointer ${
        active === id ? "bg-[#F1EFFC]" : ""
      }`}
    >
      <div className=" w-full">
        <div
          className={`flex justify-between items-center px-3 py-4 ${
            active === id ? "active" : ""
          } `}
          onClick={() => {
            handleToggle(id);
          }}
        >
          <h5
            className={`${
              active == id ? "" : ""
            } text-black font16 font-medium `}
          >
            {header}
          </h5>
          <ChevronDown
            className={`w-4 h-4 ${
              active === id ? "rotate-180" : "rotate-0"
            } duration-300`}
          />
        </div>
      </div>
      <div
        ref={contentEl}
        className={`relative overflow-hidden ${active === id ? "show" : ""}`}
        style={
          active === id
            ? {
                height: contentEl?.current?.scrollHeight,
                transition: "height 0.35s ease",
              }
            : { height: "0px", transition: "height 0.35s ease" }
        }
      >
        <div className="px-4 my-2">
          <div
            className="mb-0 font14 font-normal font-inter text-[#7C7C7C]"
            style={{ lineHeight: "28px" }}
          >
            {text}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQComponent;
