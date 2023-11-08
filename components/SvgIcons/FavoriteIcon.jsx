import React from "react";

const FavoriteIcon = ({ className }) => {
  return (
    <svg
      width="42"
      height="42"
      viewBox="0 0 42 42"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M21.0007 29.5708L19.6715 28.3608C14.9507 24.08 11.834 21.2475 11.834 17.7917C11.834 14.9592 14.0523 12.75 16.8757 12.75C18.4707 12.75 20.0015 13.4925 21.0007 14.6567C21.9998 13.4925 23.5307 12.75 25.1257 12.75C27.949 12.75 30.1673 14.9592 30.1673 17.7917C30.1673 21.2475 27.0507 24.08 22.3298 28.3608L21.0007 29.5708Z"
        fill="currentColor"
      />
      <circle cx="21" cy="21" r="20" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
};

export default FavoriteIcon;
