import React, { useState, useEffect } from "react";
import Header from "@/components/Common/Header";
import Footer from "@/components/Common/Footer";
import { useRouter } from "next/router";
import backgroundImage from "@/public/revamp/bg-createEvent.jpg";
import Head from "next/head";
import { RandomNdigitnumber } from "@/utils/function";
import { RotatingLines } from "react-loader-spinner";
import { ThreeDots } from "react-loader-spinner";
import {
  doc,
  onSnapshot,
  collection,
  query,
  where,
  limit,
  orderBy,
} from "firebase/firestore";
import { db } from "@/firebase";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getIdToken } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";
import toast from "react-simple-toasts";
import { LuCalendarDays } from "react-icons/lu";
import { FaLocationDot } from "react-icons/fa6";
import { FaTag } from "react-icons/fa6";
import { FaClock } from "react-icons/fa";
import img from "@/public/Profile_Picture.png";
import moment from "moment";
import loaderGif from "@/public/events/Loader.gif";
import EventCard from "@/components/SmallComps/EventCard";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import barCode from "@/public/scan-barcode.png";
import linkedIn from "@/public/create_digicard/linkedIn.png";
import profile from "@/public/create_digicard/Profile.png";
import scan from "@/public/create_digicard/scan.png";
import upload from "@/public/create_digicard/uploadImage.png";
import { MuiTelInput } from "mui-tel-input";
import { Dialog } from "@headlessui/react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

const CreateDigiCard = () => {
  const router = useRouter();
  const storage = getStorage();
  const { userID } = router.query;
  const { code } = router.query;
  const [circleAccessToken, setCircleAccessToken] = useState("");
  const [user] = useAuthState(auth);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [newAvatarUrl, setNewAvatarUrl] = useState("");
  const [openImageCropper, setOpenImageCropper] = useState(false);
  const [cropImageLoader, setCropImageLoader] = useState(false);
  const [cropper, setCropper] = useState(null);
  const [selectedLogo, setSelectedLogo] = useState(null);
  const [selectedLogoURL, setSelectedLogoURL] = useState(null);
  const [newAvatarUrlFront, setNewAvatarUrlFront] = useState("");
  const [openImageCropperFront, setOpenImageCropperFront] = useState(false);
  const [cropImageLoaderFront, setCropImageLoaderFront] = useState(false);
  const [cropperFront, setCropperFront] = useState(null);
  const [selectedLogoFront, setSelectedLogoFront] = useState(null);
  const [selectedLogoURLFront, setSelectedLogoURLFront] = useState(null);
  const [newAvatarUrlBack, setNewAvatarUrlBack] = useState("");
  const [openImageCropperBack, setOpenImageCropperBack] = useState(false);
  const [cropImageLoaderBack, setCropImageLoaderBack] = useState(false);
  const [cropperBack, setCropperBack] = useState(null);
  const [selectedLogoBack, setSelectedLogoBack] = useState(null);
  const [selectedLogoURLBack, setSelectedLogoURLBack] = useState(null);
  const [importFromLinkedInLoader, setImportFromLinkedInLoader] =
    useState(false);

  useEffect(() => {
    const getIdTokenForUser = async () => {
      if (user) {
        try {
          const idToken = await getIdToken(user);
          setCircleAccessToken(idToken);
        } catch (error) {
          toast(error.message);
        }
      }
    };
    getIdTokenForUser();
  }, [user]);

  const handleLogoChange = async (e) => {
    // const file = e.target.files[0];
    if (e.target.files) {
      setNewAvatarUrl(URL.createObjectURL(e.target.files[0]));
      setOpenImageCropper(true);
    }
  };

  const handleFrontSide = async (e) => {
    // const file = e.target.files[0];
    if (e.target.files) {
      setNewAvatarUrlFront(URL.createObjectURL(e.target.files[0]));
      setOpenImageCropperFront(true);
    }
  };

  const handleBackSide = async (e) => {
    // const file = e.target.files[0];
    if (e.target.files) {
      setNewAvatarUrlBack(URL.createObjectURL(e.target.files[0]));
      setOpenImageCropperBack(true);
    }
  };

  const getCropData = async () => {
    if (cropper) {
      setCropImageLoader(true);
      const file = await fetch(cropper.getCroppedCanvas().toDataURL())
        .then((res) => res.blob())
        .then((blob) => {
          return new File([blob], "image.png", { type: "image/png" });
        });
      if (file) {
        const uploadURL = await uploadImage(file);
        if (uploadURL) {
          console.log("FILE: ", file);
          setSelectedLogo(file);
          setSelectedLogoURL(uploadURL);
          setCropImageLoader(false);
          setOpenImageCropper(false);
        }
      }
    }
  };

  const getCropDataFront = async () => {
    if (cropperFront) {
      setCropImageLoaderFront(true);
      const file = await fetch(cropperFront.getCroppedCanvas().toDataURL())
        .then((res) => res.blob())
        .then((blob) => {
          return new File([blob], "image.png", { type: "image/png" });
        });
      if (file) {
        const uploadURL = await uploadImage(file);
        if (uploadURL) {
          console.log("FILE: ", file);
          setSelectedLogoFront(file);
          setSelectedLogoURLFront(uploadURL);
          setCropImageLoaderFront(false);
          setOpenImageCropperFront(false);
        }
      }
    }
  };

  const getCropDataBack = async () => {
    if (cropperBack) {
      setCropImageLoaderBack(true);
      const file = await fetch(cropperBack.getCroppedCanvas().toDataURL())
        .then((res) => res.blob())
        .then((blob) => {
          return new File([blob], "image.png", { type: "image/png" });
        });
      if (file) {
        const uploadURL = await uploadImage(file);
        if (uploadURL) {
          console.log("FILE: ", file);
          setSelectedLogoBack(file);
          setSelectedLogoURLBack(uploadURL);
          setCropImageLoaderBack(false);
          setOpenImageCropperBack(false);
        }
      }
    }
  };

  const uploadImage = async (file) => {
    const randomID = generateRandomID();
    const storageRef = ref(storage, "users/uploads/" + randomID);
    await uploadBytes(storageRef, file);
    console.log("Image uploaded successfully.");
    const downloadURL = await getDownloadURL(storageRef);
    console.log("URL of the uploaded image:", downloadURL);
    return downloadURL;
  };

  function generateRandomID() {
    return Math.random().toString(36).substring(2, 10);
  }

  const handleLoginLinkedIn = () => {
    const clientId = "86imx6ec1qvuky";
    const redirectUri = `https://circle-testing.vercel.app/digicard/create-digicard?userID=${userID}`;
    const scope = "r_liteprofile r_emailaddress";
    const authorizationUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
    setImportFromLinkedInLoader(true);
    localStorage.setItem("linkedInLoader", "true");
    router.push(authorizationUrl);
  };

  const fetchLinkedInAccessToken = async () => {
    const clientSecret = "GCq8hptJTVE4ieqE";
    const clientId = "86imx6ec1qvuky";
    const redirectUri = `https://circle-testing.vercel.app/digicard/create-digicard?userID=${userID}`;
    const tokenUrl = `https://www.linkedin.com/oauth/v2/accessToken?grant_type=authorization_code&client_id=${clientId}&client_secret=${clientSecret}&redirect_uri=${redirectUri}&code=${code}`;

    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        redirect: "follow",
      };

      await fetch(tokenUrl, requestOptions)
        .then((response) => response.json())
        .then((result) => console.log("RESULT: ", result))
        .catch((error) => console.error(error));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const loader = localStorage.getItem("linkedInLoader");
    if (loader && loader === "true" && loader !== "null" && loader !== null) {
      setImportFromLinkedInLoader(true);
      if (code) {
        console.log("CODE: ", code);
        fetchLinkedInAccessToken();
      }
    }
  }, [code]);

  return (
    <>
      <Head>
        <title>CIRCLE - CREATE DIGICARD</title>
        <meta
          name="description"
          content="Circle.ooo ❤️'s our customers! Events: beautiful, fast & simple for all."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div
        style={{
          backgroundImage: `url(${backgroundImage.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        className="w-full h-full"
      >
        {/* Upload Image */}
        <Dialog
          open={openImageCropper}
          onClose={() => setOpenImageCropper(false)}
          className="relative z-50"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <div className="fixed inset-0 w-screen overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Dialog.Panel
                style={{
                  borderRadius: "16px",
                  border: "1px solid rgba(255, 255, 255, 0.16)",
                  background:
                    "linear-gradient(149deg, rgba(255, 255, 255, 0.20) 0.71%, rgba(255, 255, 255, 0.10) 98.8%)",
                  backdropFilter: "blur(40px)",
                }}
                className="w-full md:w-1/2 xl:w-1/3 h-auto rounded-xl shadow-xl"
              >
                <Dialog.Title
                  className={`flex w-full items-center justify-between p-3 flex-row border-b-2`}
                >
                  <p className="font-bold text-lg text-[#fff]">Crop Image</p>
                  <button
                    type="button"
                    className="box-content rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
                    onClick={() => setOpenImageCropper(false)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      className="h-6 w-6 text-[#fff]"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </Dialog.Title>
                <div className="relative p-4 flex flex-col justify-center items-center w-full">
                  <Cropper
                    src={newAvatarUrl}
                    initialAspectRatio={4 / 5}
                    minCropBoxHeight={100}
                    minCropBoxWidth={100}
                    guides={false}
                    checkOrientation={false}
                    responsive={true}
                    onInitialized={(instance) => {
                      setCropper(instance);
                    }}
                  />
                </div>
                <Dialog.Title
                  className={`flex w-full items-center justify-center p-3 flex-row border-t-2`}
                >
                  <button
                    onClick={getCropData}
                    type="submit"
                    disabled={cropImageLoader === true}
                    style={{
                      borderRadius: "8px",
                      background:
                        "linear-gradient(90deg, #4532BF 5.81%, #9429FF 100%)",
                      boxShadow: "0px 1px 2px 0px rgba(82, 88, 102, 0.06)",
                    }}
                    className={`text-white w-full py-5 rounded-lg`}
                  >
                    {cropImageLoader === true ? (
                      <>
                        <div className="flex justify-center items-center w-full">
                          <ThreeDots
                            height="20"
                            color="#fff"
                            width="50"
                            radius="9"
                            ariaLabel="three-dots-loading"
                            visible={true}
                          />
                        </div>
                      </>
                    ) : (
                      "Crop Image"
                    )}
                  </button>
                </Dialog.Title>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>

        {/* Upload Front Side Image */}
        <Dialog
          open={openImageCropperFront}
          onClose={() => setOpenImageCropperFront(false)}
          className="relative z-50"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <div className="fixed inset-0 w-screen overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Dialog.Panel
                style={{
                  borderRadius: "16px",
                  border: "1px solid rgba(255, 255, 255, 0.16)",
                  background:
                    "linear-gradient(149deg, rgba(255, 255, 255, 0.20) 0.71%, rgba(255, 255, 255, 0.10) 98.8%)",
                  backdropFilter: "blur(40px)",
                }}
                className="w-full md:w-1/2 xl:w-1/3 h-auto rounded-xl shadow-xl"
              >
                <Dialog.Title
                  className={`flex w-full items-center justify-between p-3 flex-row border-b-2`}
                >
                  <p className="font-bold text-lg text-[#fff]">Crop Image</p>
                  <button
                    type="button"
                    className="box-content rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
                    onClick={() => setOpenImageCropperFront(false)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      className="h-6 w-6 text-[#fff]"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </Dialog.Title>
                <div className="relative p-4 flex flex-col justify-center items-center w-full">
                  <Cropper
                    src={newAvatarUrlFront}
                    initialAspectRatio={16 / 9}
                    minCropBoxHeight={100}
                    minCropBoxWidth={100}
                    guides={false}
                    checkOrientation={false}
                    responsive={true}
                    onInitialized={(instance) => {
                      setCropperFront(instance);
                    }}
                  />
                </div>
                <Dialog.Title
                  className={`flex w-full items-center justify-center p-3 flex-row border-t-2`}
                >
                  <button
                    onClick={getCropDataFront}
                    type="submit"
                    disabled={cropImageLoaderFront === true}
                    style={{
                      borderRadius: "8px",
                      background:
                        "linear-gradient(90deg, #4532BF 5.81%, #9429FF 100%)",
                      boxShadow: "0px 1px 2px 0px rgba(82, 88, 102, 0.06)",
                    }}
                    className={`text-white w-full py-5 rounded-lg`}
                  >
                    {cropImageLoaderFront === true ? (
                      <>
                        <div className="flex justify-center items-center w-full">
                          <ThreeDots
                            height="20"
                            color="#fff"
                            width="50"
                            radius="9"
                            ariaLabel="three-dots-loading"
                            visible={true}
                          />
                        </div>
                      </>
                    ) : (
                      "Crop Image"
                    )}
                  </button>
                </Dialog.Title>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>

        {/* Upload Back Side Image */}
        <Dialog
          open={openImageCropperBack}
          onClose={() => setOpenImageCropperBack(false)}
          className="relative z-50"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <div className="fixed inset-0 w-screen overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Dialog.Panel
                style={{
                  borderRadius: "16px",
                  border: "1px solid rgba(255, 255, 255, 0.16)",
                  background:
                    "linear-gradient(149deg, rgba(255, 255, 255, 0.20) 0.71%, rgba(255, 255, 255, 0.10) 98.8%)",
                  backdropFilter: "blur(40px)",
                }}
                className="w-full md:w-1/2 xl:w-1/3 h-auto rounded-xl shadow-xl"
              >
                <Dialog.Title
                  className={`flex w-full items-center justify-between p-3 flex-row border-b-2`}
                >
                  <p className="font-bold text-lg text-[#fff]">Crop Image</p>
                  <button
                    type="button"
                    className="box-content rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
                    onClick={() => setOpenImageCropperBack(false)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      className="h-6 w-6 text-[#fff]"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </Dialog.Title>
                <div className="relative p-4 flex flex-col justify-center items-center w-full">
                  <Cropper
                    src={newAvatarUrlBack}
                    initialAspectRatio={16 / 9}
                    minCropBoxHeight={100}
                    minCropBoxWidth={100}
                    guides={false}
                    checkOrientation={false}
                    responsive={true}
                    onInitialized={(instance) => {
                      setCropperBack(instance);
                    }}
                  />
                </div>
                <Dialog.Title
                  className={`flex w-full items-center justify-center p-3 flex-row border-t-2`}
                >
                  <button
                    onClick={getCropDataBack}
                    type="submit"
                    disabled={cropImageLoaderBack === true}
                    style={{
                      borderRadius: "8px",
                      background:
                        "linear-gradient(90deg, #4532BF 5.81%, #9429FF 100%)",
                      boxShadow: "0px 1px 2px 0px rgba(82, 88, 102, 0.06)",
                    }}
                    className={`text-white w-full py-5 rounded-lg`}
                  >
                    {cropImageLoaderBack === true ? (
                      <>
                        <div className="flex justify-center items-center w-full">
                          <ThreeDots
                            height="20"
                            color="#fff"
                            width="50"
                            radius="9"
                            ariaLabel="three-dots-loading"
                            visible={true}
                          />
                        </div>
                      </>
                    ) : (
                      "Crop Image"
                    )}
                  </button>
                </Dialog.Title>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
        <div className="w-full h-full">
          <Header type="dark" />
        </div>

        {/* {digiCardLoader ? (
          <div className="flex w-full justify-center items-center p-10">
            <img src={loaderGif.src} alt="Loader" />
          </div>
        ) : (
          <> */}
        <div className="w-full h-auto flex flex-col justify-center items-center p-8 xl:p-16">
          <div
            style={{
              borderRadius: "16px",
              border: "1px solid rgba(255, 255, 255, 0.20)",
              background: "rgba(255, 255, 255, 0.12)",
              backdropFilter: "blur(40px)",
            }}
            className="flex justify-center flex-col items-center w-full"
          >
            <div
              style={{
                borderRadius: "24px 24px 0px 0px",
                borderBottom: "1px solid rgba(255, 255, 255, 0.10)",
              }}
              className="flex justify-center xl:justify-start flex-row items-center w-full p-8 gap-5"
            >
              <p className="text-4xl text-white font-semibold w-full text-center xl:text-start">
                Add DigiCard
              </p>
            </div>
            <div className="flex justify-start flex-col lg:flex-row items-start w-full p-8 gap-3">
              <div className="flex flex-col justify-start items-center w-full lg:w-2/5">
                <div className="w-full flex flex-col justify-center items-center lg:border-r-[1px] lg:border-[#fff] lg:border-opacity-20">
                  {selectedLogo !== null ? (
                    <>
                      <div className="w-28 h-28 rounded-2xl">
                        <img
                          src={URL.createObjectURL(selectedLogo)}
                          alt=""
                          className="w-full h-full object-contain rounded-2xl"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-28 h-28 rounded-full">
                        <img
                          src={profile.src}
                          alt=""
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                    </>
                  )}
                  <label className="w-10 cursor-pointer h-10 mr-[-30%] sm:mr-[-12%] mt-[-12%] sm:mt-[-5%] relative">
                    <input
                      type="file"
                      accept=".png, .jpg, .jpeg, .gif"
                      className="hidden"
                      onChange={handleLogoChange}
                    />
                    <img
                      src={upload.src}
                      alt=""
                      className="object-contain w-full h-full"
                    />
                  </label>
                  <p className="text-white w-full text-center font-semibold text-xl mt-2">
                    Scan Business Card
                  </p>
                  <div className="flex mt-3 justify-center items-center w-full flex-col gap-2">
                    <div className="flex mt-2 justify-center items-center w-full flex-col lg:flex-row gap-2">
                      <label className="w-full cursor-pointer rounded-xl w-full lg:w-2/5 py-3 bg-[#9E22FF]">
                        <input
                          type="file"
                          accept=".png, .jpg, .jpeg, .gif"
                          className="hidden"
                          onChange={handleFrontSide}
                        />
                        <div className="flex flex-row justify-center items-center gap-2">
                          {selectedLogoFront !== null ? (
                            <>
                              <div className="w-10 h-6">
                                <img
                                  src={URL.createObjectURL(selectedLogoFront)}
                                  alt=""
                                  className="w-full h-full object-contain"
                                />
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="w-6 h-6">
                                <img
                                  src={scan.src}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </>
                          )}
                          <p className="text-[#FDFDFD]">Front Side</p>
                        </div>
                      </label>
                      <label className="w-full cursor-pointer rounded-xl w-full lg:w-2/5 py-3 bg-[#9E22FF]">
                        <input
                          type="file"
                          accept=".png, .jpg, .jpeg, .gif"
                          className="hidden"
                          onChange={handleBackSide}
                        />
                        <div className="flex flex-row justify-center items-center gap-2">
                          {selectedLogoBack !== null ? (
                            <>
                              <div className="w-10 h-6">
                                <img
                                  src={URL.createObjectURL(selectedLogoBack)}
                                  alt=""
                                  className="w-full h-full object-contain"
                                />
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="w-6 h-6">
                                <img
                                  src={scan.src}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </>
                          )}
                          <p className="text-[#FDFDFD]">Back Side</p>
                        </div>
                      </label>
                    </div>
                    <div className="flex w-full lg:mt-2 justify-center items-center">
                      <button
                        disabled={importFromLinkedInLoader && true}
                        onClick={handleLoginLinkedIn}
                        className="rounded-xl w-full lg:w-[82%] py-3 bg-[#fff] flex flex-row justify-center items-center gap-2"
                      >
                        <img src={linkedIn.src} alt="" className="w-6 h-6" />
                        {importFromLinkedInLoader ? (
                          <>
                            <ThreeDots
                              height="20"
                              color="#006699"
                              width="50"
                              radius="9"
                              ariaLabel="three-dots-loading"
                              visible={true}
                            />
                          </>
                        ) : (
                          <>
                            <div className="font-semibold text-center text-[#006699]">
                              Import From LinkedIn
                            </div>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-start items-center lg:px-5 w-full lg:w-3/5">
                <div className="w-full text-center lg:text-start text-xl text-white font-semibold mb-4">
                  Profile Information
                </div>
                <div className="flex w-full flex-col lg:flex-row justify-center items-center gap-4 mb-4">
                  <div className="w-full">
                    <input
                      type="text"
                      placeholder="Full Name"
                      style={{
                        borderRadius: "10px",
                        border: "0.5px solid rgba(255, 255, 255, 0.06)",
                        background: "rgba(255, 255, 255, 0.10)",
                      }}
                      className="w-full p-3 focus:outline-none text-white"
                    />
                  </div>
                  <div className="w-full">
                    <input
                      type="email"
                      placeholder="Email"
                      style={{
                        borderRadius: "10px",
                        border: "0.5px solid rgba(255, 255, 255, 0.06)",
                        background: "rgba(255, 255, 255, 0.10)",
                      }}
                      className="w-full p-3 focus:outline-none text-white"
                    />
                  </div>
                </div>
                <div className="flex w-full flex-col lg:flex-row justify-center items-center gap-4 mb-4">
                  <div className="w-full">
                    <MuiTelInput
                      value={phoneNumber}
                      defaultCountry="US"
                      onChange={(value) => {
                        setPhoneNumber(value);
                      }}
                      sx={{
                        "& .MuiInputBase-root": {
                          color: "white",
                          border: "none",
                        },
                        "& .MuiInputBase-input": {
                          padding: "0.75rem",
                        },
                        "& .MuiIconButton-label": { color: "white" },
                        "& .MuiOutlinedInput-notchedOutline": {
                          border: "none !important",
                        },
                        "& .MuiButtonBase-root": {
                          color: "white",
                          border: "none",
                        },
                        width: "100%",
                        background: "rgba(255, 255, 255, 0.10)",
                        border: "0.5px solid rgba(255, 255, 255, 0.06)",
                        borderRadius: "10px",
                      }}
                    />
                  </div>
                  <div className="w-full">
                    <input
                      type="text"
                      placeholder="Name Your DigiCard"
                      style={{
                        borderRadius: "10px",
                        border: "0.5px solid rgba(255, 255, 255, 0.06)",
                        background: "rgba(255, 255, 255, 0.10)",
                      }}
                      className="w-full p-3 focus:outline-none text-white"
                    />
                  </div>
                </div>
                <div className="flex w-full flex-row justify-center items-center mb-4">
                  <div className="w-full">
                    <input
                      type="text"
                      placeholder="Add your LinkedIn URL"
                      style={{
                        borderRadius: "10px",
                        border: "0.5px solid rgba(255, 255, 255, 0.06)",
                        background: "rgba(255, 255, 255, 0.10)",
                      }}
                      className="w-full p-3 focus:outline-none text-white"
                    />
                  </div>
                </div>
                <div className="flex w-full flex-row justify-center items-center mb-4">
                  <div className="w-full">
                    <input
                      type="text"
                      placeholder="Where you work"
                      style={{
                        borderRadius: "10px",
                        border: "0.5px solid rgba(255, 255, 255, 0.06)",
                        background: "rgba(255, 255, 255, 0.10)",
                      }}
                      className="w-full p-3 focus:outline-none text-white"
                    />
                  </div>
                </div>
                <div className="flex w-full flex-row justify-center items-center mb-4">
                  <div className="w-full">
                    <input
                      type="text"
                      placeholder="Job title"
                      style={{
                        borderRadius: "10px",
                        border: "0.5px solid rgba(255, 255, 255, 0.06)",
                        background: "rgba(255, 255, 255, 0.10)",
                      }}
                      className="w-full p-3 focus:outline-none text-white"
                    />
                  </div>
                </div>
                <div className="flex w-full flex-row justify-center items-center mb-4">
                  <div className="w-full">
                    <input
                      type="text"
                      placeholder="Your company address"
                      style={{
                        borderRadius: "10px",
                        border: "0.5px solid rgba(255, 255, 255, 0.06)",
                        background: "rgba(255, 255, 255, 0.10)",
                      }}
                      className="w-full p-3 focus:outline-none text-white"
                    />
                  </div>
                </div>
                <div className="flex w-full flex-row justify-center items-center mb-4">
                  <div className="w-full">
                    <button
                      style={{
                        borderRadius: "10px",
                        border: "0.69px solid rgba(255, 255, 255, 0.20)",
                        background:
                          "linear-gradient(90deg, #4532BF 5.81%, #9429FF 100%)",
                      }}
                      className="p-3 text-white font-semibold w-full"
                    >
                      Add My DigiCard
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* </>
        )} */}

        <div className="w-full h-full">
          <Footer />
        </div>
      </div>
    </>
  );
};

export default CreateDigiCard;
