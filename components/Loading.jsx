import Image from 'next/image';
import { LogoIcon } from './SvgIcons';

const Loading = ({
  className,
  screen = 'full',
  logo = false,
  text = true,
  textClass = '',
}) => {
  return (
    <div
      className={`fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50`}
    >
      <div
        className={`flex flex-col justify-center items-center w-full ${
          screen == 'full' ? 'min-h-screen' : ''
        }`}
      >
       
        {/* {text && (
          <div
            className={`font-semibold text-base md:text-lg lg:text-xl py-4 ${textClass}`}
          >
            Processing...
          </div>
        )} */}
        <div>
        {/* <LogoIcon className="w-20 h-20" /> */}
          <svg
            className={`animate-spin h-24 w-24 text-main-light ${className}`}
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-100"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Loading;
