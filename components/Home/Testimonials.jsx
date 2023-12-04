import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
import girlImage from "./girl-img.png";
import img from "./Profile_Picture.png";
import { useMediaQuery } from "react-responsive";
import AOS from "aos";
import "aos/dist/aos.css";
AOS.init();

const testimonials = [
  {
    id: 1,
    heading: "“The best event creators”",
    text: "Circle has an easy way of capturing guest registrations with one tap - fantastic usability. And still had excellent data points to know who was coming, how to serve them, and what Sponsors may be appropriate for the event",
    author: "Ariana Smetana",
    profession: "CEO AccelQ.digital",
    image: img.src,
  },
  {
    id: 2,
    heading: "“New Era of Event Management”",
    text: "Circle.ooo is pioneering a new era of event management and  networking through individualized contacts per event attended and instant profile sharing through bumping phones.",
    author: "Zack LaCanna",
    profession: "Mobile App Developer",
    image: img.src,
  },
  // Add more testimonials as needed
];

const Testimonial = () => {
  const breakpoints = {
    sm: "(max-width: 640px)",
    md: "(max-width: 768px)",
    lg: "(max-width: 1024px)",
    xl: "(max-width: 1280px)",
  };

  const centerSlidePercentageOptions = {
    sm: 100,
    md: 100, // Default value for medium-sized screens
    lg: 100,
    xl: 40,
  };
  const isLgScreen = useMediaQuery({ query: breakpoints.lg });
  const centerSlidePercentage = isLgScreen
    ? centerSlidePercentageOptions.lg
    : centerSlidePercentageOptions.xl;
  return (
    <div
      data-aos="fade-up"
      data-aos-delay="50"
      data-aos-duration="1000"
      data-aos-easing="ease-in-out"
      data-aos-mirror="false"
      data-aos-once="true"
      className="bg-white w-full h-auto pt-0 p-5 lg:p-20"
    >
      <h3 className="font48 font-semibold mt-10 lg:mt-0 font-Montserrat text-center pb-10">
        Hear what our users say
      </h3>
      <Carousel
        showArrows={true}
        showThumbs={false}
        centerMode={true}
        centerSlidePercentage={centerSlidePercentage}
        showStatus={false}
        showIndicators={false}
        autoPlay={true}
        infiniteLoop={true}
        stopOnHover={true}
        renderArrowPrev={(onClickHandler, hasPrev) =>
          hasPrev && (
            <button
              style={{
                position: "absolute",
                top: "50%",
                transform: "translateY(-50%)",
                backgroundColor: "#F0F5FB",
                color: "black",
                padding: "10px",
                cursor: "pointer",
                zIndex: "2",
                left: "10px",
              }}
              className="rounded-full"
              onClick={onClickHandler}
            >
              <IoIosArrowBack size={30} />
            </button>
          )
        }
        renderArrowNext={(onClickHandler, hasNext) =>
          hasNext && (
            <button
              style={{
                position: "absolute",
                top: "50%",
                transform: "translateY(-50%)",
                backgroundColor: "#F0F5FB",
                color: "black",
                padding: "10px",
                cursor: "pointer",
                zIndex: "2",
                right: "10px",
              }}
              className="rounded-full"
              onClick={onClickHandler}
            >
              <IoIosArrowForward size={30} />
            </button>
          )
        }
      >
        {testimonials.map((item) => (
          <div
            className="border-[#EFF0F6] cursor-pointer shadow-lg border-2 flex justify-center items-start flex-col gap-4 p-10 rounded-lg mr-10 ml-10 lg:ml-0"
            key={item.id}
          >
            <h4 className="font24 w-full font-bold text-center md:text-start">
              {item.heading}
            </h4>
            <p className="text-base w-full font-normal text-[#6F6C90] mb-4 text-center md:text-start">
              {item.text}
            </p>
            <div className="flex w-full flex-col justify-center items-center lg:flex-row lg:justify-start lg:items-start">
              <img
                src={item.image}
                style={{ height: "50pt", width: "55pt" }}
                className="bg-[#fff] rounded-full"
                alt=""
              />
              <div className="flex w-full justify-center items-center lg:items-start flex-col lg:ml-5 mt-3 lg:mt-0">
                <h4 className="font24 font-bold">{item.author}</h4>
                <p className="text-base font-normal text-[#6F6C90]">
                  {item.profession}
                </p>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default Testimonial;
