import React, { useRef, useState, useEffect } from "react";
import RightArrowIcon from "../SvgIcons/RightArrowIcon";
import { BsPlusCircle } from "react-icons/bs";
import { AiOutlineMinusCircle } from "react-icons/ai";

const DropDownComponent = (props) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpansion = () => {
    setExpanded(!expanded);
  };

  const [showItems, setShowItems] = useState(false);

  const contentEl = useRef();
  const { handleToggle, item, selectedDropdown, id } = props;
  const { title, description, image_path } = item;
  useEffect(() => {
    // Use a timeout to gradually show each item with a delay
    const showItemTimeout = setTimeout(() => {
      setShowItems(true);
    }, 100);

    // Clean up the timeout when the component unmounts
    return () => clearTimeout(showItemTimeout);
  }, [selectedDropdown]);
  return (
    <>
      <div
        style={
          {
            // opacity: showItems ? "1" : "0",
            // transition: "opacity 0.5s ease",
          }
        }
        className={`w-full h-auto py-5 cursor-pointer relative rounded-xl ${
          selectedDropdown === title ? "bg-[#007BAB]" : "bg-[#F0F4FB]"
        }`}
        onClick={() => {
          handleToggle(id);
        }}
      >
        <div className="w-full h-auto">
          <div
            className={`flex justify-between items-center px-3 ${
              selectedDropdown === title ? "text-white" : "text-[#000]"
            } `}
          >
            <div className="flex justify-start items-center">
              {image_path && (
                <img src={image_path} alt="Image" style={{ height: "20pt" }} />
              )}
              <h5 className={`font24 font-medium ml-2`}>{title}</h5>
            </div>
            <div
            // className={` duration-500 transition-all ease-in-out`}
            // style={{ transitionDuration: "0.5s" }}
            >
              {selectedDropdown === title ? (
                <AiOutlineMinusCircle size={20} />
              ) : (
                <BsPlusCircle size={20} />
              )}
            </div>
          </div>
        </div>

        <div
          ref={contentEl}
          className={`relative w-full h-auto overflow-hidden ${
            selectedDropdown === title ? "show" : ""
          } `}
          style={
            selectedDropdown === title
              ? {
                  height: contentEl?.current?.scrollHeight,
                  // transition: "height 0.35s ease",
                }
              : {
                  maxHeight: "0px",
                  // transition: "height 0.35s ease"
                }
          }
        >
          <div className="w-full px-5 mt-3">
            <div className="font14 text-white font-Poppins font-light">
              {description}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DropDownComponent;
