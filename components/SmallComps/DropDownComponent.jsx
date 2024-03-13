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
        style={{
          // opacity: showItems ? "1" : "0",
          // transition: "opacity 0.5s ease",
          background:
            selectedDropdown === title
              ? "linear-gradient(94deg, rgba(42, 28, 61, 0.60) 0.01%, rgba(144, 33, 255, 0.47) 103.3%)"
              : "rgba(28, 34, 44, 0.60)",
          border:
            selectedDropdown === title
              ? "1px solid rgba(64, 17, 124, 0.45)"
              : "",
        }}
        className={`w-full h-auto py-5 cursor-pointer relative rounded-xl`}
        onClick={() => {
          handleToggle(id);
        }}
      >
        <div className="w-full h-auto">
          <div className={`flex justify-between items-center px-3 text-[#fff]`}>
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
                <AiOutlineMinusCircle color="#fff" size={20} />
              ) : (
                <BsPlusCircle color="#fff" size={20} />
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
