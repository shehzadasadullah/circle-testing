import React from "react";

const SolidCircularLeftArrow = ({ className }) => {
  return (
    <svg
      width="44"
      height="44"
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="22" cy="22" r="22" fill="#999999" />
      <path
        d="M25.0904 13.33C25.2804 13.33 25.4704 13.4 25.6204 13.55C25.9104 13.84 25.9104 14.32 25.6204 14.61L19.1004 21.13C18.6204 21.61 18.6204 22.39 19.1004 22.87L25.6204 29.39C25.9104 29.68 25.9104 30.16 25.6204 30.45C25.3304 30.74 24.8504 30.74 24.5604 30.45L18.0404 23.93C17.5304 23.42 17.2404 22.73 17.2404 22C17.2404 21.27 17.5204 20.58 18.0404 20.07L24.5604 13.55C24.7104 13.41 24.9004 13.33 25.0904 13.33Z"
        fill="white"
      />
    </svg>
  );
};

export default SolidCircularLeftArrow;
