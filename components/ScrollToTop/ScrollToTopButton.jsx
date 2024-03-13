// ScrollToTopButton.js

import React, { useState, useEffect } from "react";
import { ArrowUp } from "react-feather"; // You can use any icon library you prefer

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Add an event listener to track the scroll position
    const handleScroll = () => {
      const scrollTop = window.scrollY;

      // Set visibility based on scroll position
      setIsVisible(scrollTop > 300);
    };

    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener when the component is unmounted
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    // Scroll to the top of the page smoothly
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      style={{
        border: "1px solid rgba(255, 255, 255, 0.20)",
        background: "linear-gradient(90deg, #4532BF 5.81%, #9429FF 100%)",
        boxShadow: "0px 4px 50px 0px rgba(69, 50, 191, 0.50)",
      }}
      className={`fixed bottom-10 right-10 text-white transform hover:scale-125 rounded-full p-2 cursor-pointer opacity-0 transition duration-700 ease-in-out ${
        isVisible ? "opacity-100" : ""
      }`}
      onClick={scrollToTop}
    >
      <ArrowUp size={30} />
    </button>
  );
};

export default ScrollToTopButton;
