import React, { useEffect } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
import girlImage from "./girl-img.png";
import img from "./Profile_Picture.png";
import { useMediaQuery } from "react-responsive";
import bgImage from "../../public/revamp/bg-sec5.png";
// import AOS from "aos";
// import "aos/dist/aos.css";

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
  {
    id: 3,
    heading: "“Exceptional Recognition at ASU School of Engineering Demo Day!”",
    text: "The first judge was impressed with our app's seamless bump, namedrop profile sharing, and per-event contacts, highlighting its innovation and potential for success.",
    author: "Zack LaCanna",
    profession: "Student at ASU School of Engineering",
    image: img.src,
  },
  // Add more testimonials as needed
];

const Testimonial = () => {
  // useEffect(() => {
  //   // console.log("Initializing AOS");
  //   AOS.init({
  //     duration: 800,
  //     once: true,
  //   });

  //   const handleScroll = () => {
  //     // console.log("Scrolling...");
  //   };

  //   window.addEventListener("scroll", handleScroll);

  //   // Cleanup the event listener
  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //   };
  // }, []);

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
    xl: 80,
  };
  const isLgScreen = useMediaQuery({ query: breakpoints.lg });
  const centerSlidePercentage = isLgScreen
    ? centerSlidePercentageOptions.lg
    : centerSlidePercentageOptions.xl;
  return (
    <div
      // data-aos="fade-up"
      // data-aos-delay="50"
      // data-aos-duration="4000"
      // data-aos-easing="ease-in-out"
      // data-aos-mirror="false"
      // data-aos-once="true"
      style={{
        backgroundImage: `url(${bgImage.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      className="w-full h-auto pt-0 p-5 lg:p-20"
    >
      <h3 className="font48 font-semibold mt-10 lg:mt-0 font-Montserrat text-center pb-10">
        <p className="text-[#fff]">
          Hear what our{" "}
          <span
            style={{
              background:
                "linear-gradient(269deg, #FFF -1.77%, #9E22FF 37.99%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text", // Add the Webkit prefix for older browsers
              WebkitTextFillColor: "transparent", // Add the Webkit prefix for older browsers

              // color: "#fff",
              // textShadow:
              //   "0 0 0.1em rgba(255, 255, 255, 0.5), 0 0 0.2em rgba(255, 255, 255, 0.2), 0 0 0.3em rgba(255, 255, 255, 0.0)",
            }}
          >
            users say
          </span>
        </p>
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
                color: "white",
                padding: "10px",
                cursor: "pointer",
                zIndex: "2",
                left: "10px",
                border: "1px solid rgba(255, 255, 255, 0.20)",
                background:
                  "linear-gradient(90deg, #4532BF 5.81%, #9429FF 100%)",
                boxShadow: "0px 4px 50px 0px rgba(69, 50, 191, 0.50)",
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
                color: "white",
                padding: "10px",
                cursor: "pointer",
                zIndex: "2",
                right: "10px",
                border: "1px solid rgba(255, 255, 255, 0.20)",
                background:
                  "linear-gradient(90deg, #4532BF 5.81%, #9429FF 100%)",
                boxShadow: "0px 4px 50px 0px rgba(69, 50, 191, 0.50)",
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
            style={{
              border: "1px solid rgba(25, 112, 214, 0.30)",
              background: "rgba(28, 34, 44, 0.60)",
              boxShadow:
                "0px 13px 29px 0px rgba(0, 0, 0, 0.07), 0px 53px 53px 0px rgba(0, 0, 0, 0.06), 0px 118px 71px 0px rgba(0, 0, 0, 0.03), 0px 211px 84px 0px rgba(0, 0, 0, 0.01), 0px 329px 92px 0px rgba(0, 0, 0, 0.00)",
            }}
            className="my-4 h-auto lg:h-96 flex justify-center items-start flex-col gap-4 p-10 rounded-xl mr-10 ml-10 lg:ml-0"
            key={item.id}
          >
            <h4
              style={{
                color: "rgba(255, 255, 255, 0.80)",
              }}
              className="font24 w-full font-bold text-center md:text-start"
            >
              {item.heading}
            </h4>
            <p
              style={{
                color: "rgba(255, 255, 255, 0.80)",
              }}
              className="text-base w-full font-normal mb-4 text-center md:text-start"
            >
              {item.text}
            </p>
            <div className="flex w-full flex-col justify-center items-center lg:flex-row lg:justify-start lg:items-start">
              <img
                src={item.image}
                style={{
                  height: "60pt",
                  width: "60pt",
                  background: "rgba(255, 255, 255, 0.80)",
                }}
                className="p-2 rounded-full"
                alt=""
              />
              <div className="flex w-full justify-center items-center lg:items-start flex-col lg:ml-5 mt-3 lg:mt-0">
                <h4
                  style={{
                    color: "rgba(255, 255, 255, 0.80)",
                  }}
                  className="font24 font-bold"
                >
                  {item.author}
                </h4>
                <p
                  style={{
                    color: "rgba(255, 255, 255, 0.80)",
                  }}
                  className="text-base font-normal"
                >
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
