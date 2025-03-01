import React, { useState, Fragment, useEffect } from "react";
import Header from "../Common/Header";
import Footer from "../Common/Footer";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import {
  getFirestore,
  doc,
  setDoc,
  updateDoc,
  arrayUnion,
  GeoPoint,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { addDoc } from "firebase/firestore";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { auth } from "../../firebase";
import { getAuth, getIdToken } from "firebase/auth";
import { Timestamp } from "firebase/firestore";
import moment from "moment";
import { DateTime } from "luxon";
import toast from "react-simple-toasts";
import { useAuthState } from "react-firebase-hooks/auth";
import { SketchPicker } from "react-color";
import Modal from "react-modal";
import { Dialog } from "@headlessui/react";
import { ThreeDots } from "react-loader-spinner";
import loaderGif from "../../public/events/Loader.gif";
import { useRouter } from "next/router";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import { FaCheckCircle } from "react-icons/fa";
import LocationSearchInput from "../Location/LocationSearchInput";
import { Head } from "next/document";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import bgImage from "../../public/revamp/bg-createEvent.jpg";
import circleImage from "../../public/revamp/circle.png";
import noIntegration from "../../public/revamp/error.png";
import img1 from "@/public/Invite_Images/1.jpg";
import img2 from "@/public/Invite_Images/2.jpg";
import img3 from "@/public/Invite_Images/3.jpg";
import img4 from "@/public/Invite_Images/4.jpg";
import img5 from "@/public/Invite_Images/5.jpg";
import img6 from "@/public/Invite_Images/6.jpg";
import img7 from "@/public/Invite_Images/7.jpg";
import img8 from "@/public/Invite_Images/8.jpg";
import img9 from "@/public/Invite_Images/9.jpg";
import img10 from "@/public/Invite_Images/10.jpg";
import img11 from "@/public/Invite_Images/11.jpg";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const CreateEvent = () => {
  const router = useRouter();
  const todayDate = dayjs();
  const fonts = [
    "Abril Fatface",
    "Aclonica",
    "Alegreya Sans",
    "Architects Daughter",
    "Archivo",
    "Archivo Narrow",
    "Bebas Neue",
    "Bitter",
    "Bree Serif",
    "Bungee",
    "Cabin",
    "Cairo",
    "Coda",
    "Comfortaa",
    "Comic Neue",
    "Cousine",
    "Croissant One",
    "Faster One",
    "Forum",
    "Great Vibes",
    "Heebo",
    "Inconsolata",
    "Josefin Slab",
    "Lato",
    "Libre Baskerville",
    "Lobster",
    "Lora",
    "Merriweather",
    "Montserrat",
    "Mukta",
    "Nunito",
    "Offside",
    "Open Sans",
    "Oswald",
    "Overlock",
    "Pacifico",
    "Playfair Display",
    "Poppins",
    "Raleway",
    "Roboto",
    "Roboto Mono",
    "Source Sans Pro",
    "Space Mono",
    "Spicy Rice",
    "Squada One",
    "Sue Ellen Francisco",
    "Trade Winds",
    "Ubuntu",
    "Varela",
    "Vollkorn",
    "Work Sans",
    "Zilla Slab",
  ];
  const [user] = useAuthState(auth);
  const storage = getStorage();
  const [searchText, setSearchText] = useState("");
  const [searchTextHosts, setSearchTextHosts] = useState("");
  const [filteredFonts, setFilteredFonts] = useState(fonts);
  const [selectedLogo, setSelectedLogo] = useState(null);
  const [selectedLogoURL, setSelectedLogoURL] = useState(null);
  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventWebsite, setEventWebsite] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventSponsorShip, setEventSponsorShip] = useState("");
  const [isOnExhibitors, setIsOnExhibitors] = useState(false);
  const [isOnSponsorship, setIsOnSponsorship] = useState(false);
  const [isOnPrice, setIsOnPrice] = useState(false);
  const [deviceLocation, setDeviceLocation] = useState("");
  const [eventTicketPrice, setEventTicketPrice] = useState("");
  const [eventMaximumTickets, setEventMaximumTickets] = useState("");
  const [startDateTime, setStartDateTime] = useState(dayjs().add(20, "minute"));
  const [endDateTime, setEndDateTime] = useState(dayjs().add(20, "minute"));
  const [outputFormattedStartDateTime, setOutputFormattedStartDateTime] =
    useState("");
  const [outputStartDateTimeTimestamp, setOutputStartDateTimeTimestamp] =
    useState("");
  const [outputFormattedEndDateTime, setOutputFormattedEndDateTime] =
    useState("");
  const [outputEndDateTimeTimestamp, setOutputEndDateTimeTimestamp] =
    useState("");
  const [circleData, setCircleData] = useState([]);
  const [circleLogo, setCircleLogo] = useState("");
  const [circleLogoUrl, setCircleLogoUrl] = useState("");
  const [circleColor, setCircleColor] = useState("");
  const [circleFont, setCircleFont] = useState("");
  const [circleName, setCircleName] = useState("");
  const [circleDescription, setCircleDescription] = useState("");
  const [circleDataRef, setCircleDataRef] = useState("");
  let [isOpen, setIsOpen] = useState(false);
  const [circleCreationLoader, setCircleCreationLoader] = useState(false);
  const [allUsersData, setAllUsersData] = useState([]);
  const [coHostsList, setCoHostsList] = useState([]);
  const [selectedCoHosts, setSelectedCoHosts] = useState([]);
  const [createEventLoader, setCreateEventLoader] = useState(false);
  const [eventPublishLoader, setEventPublishLoader] = useState(false);
  const [fetchCircleDataLoader, setFetchCircleDataLoader] = useState(true);
  const [fetchAllUserLoader, setFetchAllUserLoader] = useState(true);
  const [fetchCoHostsLoader, setFetchCoHostsLoader] = useState(true);
  const [circleAccessToken, setCircleAccessToken] = useState("");
  const [thirdPartyIntegrations, setThirdPartyIntegrations] = useState([]);
  const [eventID, setEventID] = useState("");
  const [thirdPartyCheckboxSelected, setThirdPartyCheckboxSelected] = useState(
    []
  );
  const [locationCords, setLocationCords] = useState(null);
  const [openImageCropper, setOpenImageCropper] = useState(false);
  const [cropImageLoader, setCropImageLoader] = useState(false);
  const [cropper, setCropper] = useState(null);
  const [newAvatarUrl, setNewAvatarUrl] = useState("");

  const handleSelect = (address, latLng) => {
    console.log("Selected address:", address);
    console.log("Selected coordinates:", new GeoPoint(latLng.lat, latLng.lng));
    setEventLocation(address);
    setLocationCords(new GeoPoint(latLng.lat, latLng.lng));
  };

  useEffect(() => {
    const getIdTokenForUser = async () => {
      if (user) {
        try {
          const idToken = await getIdToken(user);
          setCircleAccessToken(idToken);
        } catch (error) {
          console.error("Error getting ID token:", error);
        }
      }
    };
    console.log("USER DATA", user);
    getIdTokenForUser();
  }, [user]);

  const getThirdPartyIntegrations = async () => {
    var myHeaders = new Headers();
    myHeaders.append("accessToken", circleAccessToken);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    await fetch(
      "https://api.circle.ooo/api/circle/third-party/get-by-type",
      requestOptions
    )
      .then((response) => response.json())
      .then((res) => {
        if (res.result) {
          const tempArray = res?.data.reduce((acc, fl) => {
            if (fl.Type === "THIRD_PARTY") {
              acc = acc.concat(fl.Integration);
            }
            return acc;
          }, []);
          setThirdPartyIntegrations(tempArray);
        } else {
          toast("Something went wrong with the integrations!");
        }
      })
      .catch((error) => console.log("error", error));
  };

  useEffect(() => {
    if (user && circleAccessToken !== "") getThirdPartyIntegrations();
  }, [user, circleAccessToken]);

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

  const toggleSwitchExhibitors = () => {
    setIsOnExhibitors(!isOnExhibitors);
  };

  const toggleSwitchSponsorship = () => {
    setIsOnSponsorship(!isOnSponsorship);
  };

  const toggleSwitchPrice = () => {
    setIsOnPrice(!isOnPrice);
  };

  useEffect(() => {
    const images = [
      img1.src,
      img2.src,
      img3.src,
      img4.src,
      img5.src,
      img6.src,
      img7.src,
      img8.src,
      img9.src,
      img10.src,
      img11.src,
    ];

    const randomIndex = Math.floor(Math.random() * images.length);
    const selectedImageIndex = images[randomIndex];

    const fetchImage = async (selectedImage) => {
      console.log("Selected Image: ", selectedImage);
      const response = await fetch(selectedImage);
      console.log("Response: ", response);
      const blob = await response.blob();
      console.log("Blob: ", blob);
      const mimetype = blob.type;
      console.log("TYPE: ", mimetype);
      const file = new File([blob], "image.png", { type: mimetype });
      if (file) {
        const uploadURL = await uploadImage(file);
        if (uploadURL) {
          console.log("FILE: ", file);
          setSelectedLogo(file);
          setSelectedLogoURL(uploadURL);
        }
      }
    };

    fetchImage(selectedImageIndex);
  }, []);

  const handleLogoChange = async (e) => {
    // const file = e.target.files[0];
    if (e.target.files) {
      setNewAvatarUrl(URL.createObjectURL(e.target.files[0]));
      setOpenImageCropper(true);
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

  const handleLogoChangeCircle = async (e) => {
    const file = e.target.files[0];
    setCircleLogo(file);
    const uploadURL = await uploadImage(file);
    setCircleLogoUrl(uploadURL);
  };

  useEffect(() => {
    if (!isOnSponsorship) {
      setEventSponsorShip("");
    }
  }, [isOnSponsorship]);

  const handleSearch = (e) => {
    const text = e.target.value;
    setSearchText(text);
    const filtered = fonts.filter((fonts) =>
      fonts.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredFonts(filtered);
  };

  const handleSearchHosts = (e) => {
    const text = e.target.value;
    setSearchTextHosts(text);
    const coHostsMap = new Map();
    allUsersData.forEach((item) => {
      if (
        item?.full_name_insensitive &&
        item.full_name_insensitive !== "" &&
        item.full_name_insensitive.toLowerCase().includes(text.toLowerCase())
      ) {
        coHostsMap.set(item.full_name_insensitive, item);
      }
    });
    const filtered = Array.from(coHostsMap.values());
    setCoHostsList(filtered);
  };

  function handleOptionSelectFonts(selectedOption) {
    setCircleFont(selectedOption);
  }

  const preventSpaceKeyPropagation = (e) => {
    if (e.key === " ") {
      e.stopPropagation();
    }
  };

  const convertToTimestampStartDateTime = () => {
    const formattedString = dayjs(startDateTime.$d).format("YYYY-MM-DDTHH:mm");
    const inputDateObj = DateTime.fromISO(formattedString);

    if (inputDateObj.isValid) {
      // Determine the user's locale and timezone
      const userLocale = navigator.language;
      const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      // Format the date and time using user's locale and timezone
      const formattedDate = inputDateObj.setZone(userTimezone).toLocaleString({
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        timeZoneName: "short",
        hour12: true,
      });

      // Get the timestamp
      const timestamp = inputDateObj.toMillis();

      setOutputFormattedStartDateTime(`Formatted Date: ${formattedDate}`);
      setOutputStartDateTimeTimestamp(`Timestamp: ${timestamp}`);
      // return formattedDate;

      // Convert milliseconds to seconds and nanoseconds
      const seconds = Math.floor(inputDateObj.toMillis() / 1000);
      const nanoseconds = (inputDateObj.toMillis() % 1000) * 1000000;

      // Create and return a Firestore Timestamp object
      console.log(
        "START DATE TIMESTAMP: ",
        new Timestamp(seconds, nanoseconds)
      );
      return new Timestamp(seconds, nanoseconds);
    } else {
      toast("Invalid Date!");
      setOutputFormattedStartDateTime("Invalid Date");
      setOutputStartDateTimeTimestamp("");
      return false;
    }
  };

  const convertToTimestampEndDateTime = () => {
    const formattedString = dayjs(endDateTime.$d).format("YYYY-MM-DDTHH:mm");
    const inputDateObj = DateTime.fromISO(formattedString);

    if (inputDateObj.isValid) {
      // Determine the user's locale and timezone
      const userLocale = navigator.language;
      const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      // Format the date and time using user's locale and timezone
      const formattedDate = inputDateObj.setZone(userTimezone).toLocaleString({
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        timeZoneName: "short",
        hour12: true,
      });

      // Get the timestamp
      const timestamp = inputDateObj.toMillis();

      setOutputFormattedEndDateTime(`Formatted Date: ${formattedDate}`);
      setOutputEndDateTimeTimestamp(`Timestamp: ${timestamp}`);

      // Convert milliseconds to seconds and nanoseconds
      const seconds = Math.floor(inputDateObj.toMillis() / 1000);
      const nanoseconds = (inputDateObj.toMillis() % 1000) * 1000000;

      // Create and return a Firestore Timestamp object
      console.log("END DATE TIMESTAMP: ", new Timestamp(seconds, nanoseconds));
      return new Timestamp(seconds, nanoseconds);
      // return formattedDate;
    } else {
      toast("Invalid Date!");
      setOutputFormattedEndDateTime("Invalid Date");
      setOutputEndDateTimeTimestamp("");
      return false;
    }
  };

  const checkStartAndEndDateTime = () => {
    const formattedStringStart = dayjs(startDateTime.$d).format(
      "YYYY-MM-DDTHH:mm"
    );
    const formattedStringEnd = dayjs(endDateTime.$d).format("YYYY-MM-DDTHH:mm");
    const startObj = DateTime.fromISO(formattedStringStart);
    const endObj = DateTime.fromISO(formattedStringEnd);

    if (startObj.isValid && endObj.isValid) {
      if (startObj.equals(endObj)) {
        if (startObj <= endObj) {
          toast("Start and end time cannot be the same!");
          setCreateEventLoader(false);
          return false;
        } else {
          return true;
        }
      } else if (startObj > endObj) {
        toast("Start time must be earlier than end time!");
        setCreateEventLoader(false);
        return false;
      } else {
        return true;
      }
    } else {
      toast("Invalid Date!");
      setCreateEventLoader(false);
      return false;
    }
  };

  const validateWebsite = () => {
    if (eventWebsite !== "") {
      // Regular expression to match a URL with optional http(s) and proper domain name
      const urlPattern =
        /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$/i;

      if (!urlPattern.test(eventWebsite)) {
        toast("Website URL is Invalid!");
        setCreateEventLoader(false);
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  };

  const paidPriceCheck = () => {
    if (isOnPrice) {
      if (eventTicketPrice === "" || eventMaximumTickets === "") {
        // console.log("Called 5");
        toast("Price data is missing!");
        setCreateEventLoader(false);
        return false;
      } else if (Number(eventMaximumTickets) < 1) {
        toast("Maximum Tickets can't be less than 1");
        setCreateEventLoader(false);
        return false;
      } else if (Number(eventTicketPrice) < 1) {
        toast("Ticket Price can't be less than $1");
        setCreateEventLoader(false);
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  };

  useEffect(() => {
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            // console.log(latitude, longitude);
            setDeviceLocation([latitude, longitude]);
          },
          (error) => {
            console.log("Error retrieving device location:", error);
          }
        );
      } else {
        console.log("Geolocation is not supported by this browser.");
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  const getCircleData = async () => {
    let userRefPath = null;
    if (user) {
      const userUID = user.uid;
      const userRef = doc(db, "Users", userUID);
      userRefPath = userRef;
      console.log("User document reference: ", userRefPath);

      // Create a query that filters documents where the 'creator' field matches the user reference
      const circleCollectionRef = collection(db, "circles");
      const q = query(circleCollectionRef, where("creator", "==", userRefPath));

      // Fetch the documents that match the query
      try {
        const querySnapshot = await getDocs(q);
        const matchingCircles = [];
        querySnapshot.forEach((doc) => {
          // Retrieve data for each matching document
          const circleData = doc.data();
          console.log("Circle Reference:", doc.ref);
          setCircleDataRef(doc.ref);
          matchingCircles.push(circleData);
        });
        setCircleData(matchingCircles);
        console.log("Matching circle:", matchingCircles);
        setFetchCircleDataLoader(false);
      } catch (error) {
        console.error("Error fetching documents:", error);
        setFetchCircleDataLoader(false);
        toast("Error fetching circle data!");
      }
    }
  };

  useEffect(() => {
    getCircleData();
  }, [user, isOpen]);

  const handleColorChange = (selectedColor) => {
    // toast(
    //   <div style={{ color: selectedColor.hex }}>
    //     Color Selected: {selectedColor.hex}
    //   </div>
    // );
    const { r, g, b, a } = selectedColor.rgb;

    // Convert RGBA values to hexadecimal and concatenate them
    const hexColor = `#${r.toString(16).padStart(2, "0")}${g
      .toString(16)
      .padStart(2, "0")}${b.toString(16).padStart(2, "0")}${Math.round(a * 255)
      .toString(16)
      .padStart(2, "0")}`;

    // Convert the concatenated hexadecimal string to an integer
    const colorValue = parseInt(hexColor.replace("#", "0x"), 16);

    // Update the color in the Firebase database
    // const docRef = doc(firebaseDB, 'yourCollection', documentId); // Replace with your collection and document ID
    // updateDoc(docRef, { color: colorValue });

    // Update the local state with the selected color
    console.log(colorValue);
    setCircleColor(colorValue);
  };

  const circleCreationTimeStamp = () => {
    const currentDateTime = DateTime.now();
    const seconds = Math.floor(currentDateTime.toMillis() / 1000);
    const nanoseconds = (currentDateTime.toMillis() % 1000) * 1000000;
    const timestamp = new Timestamp(seconds, nanoseconds);
    return timestamp;
  };

  const handleCircleCreation = async () => {
    setCircleCreationLoader(true);
    if (circleLogo === "") {
      toast("Please Choose Circle Logo!");
    } else if (circleName === "") {
      toast("Please Enter Circle Name!");
    } else if (circleDescription === "") {
      toast("Please Enter Circle Description!");
    } else if (circleFont === "") {
      toast("Please Select Circle Font!");
    } else if (circleColor === "") {
      toast("Please Select Circle Color!");
    } else {
      let userRefPath = null;
      if (user) {
        const userUID = user.uid;
        const userRef = doc(db, "Users", userUID);
        userRefPath = userRef;
        console.log("User document reference: ", userRef);
      }
      const circeData = {
        circle_color: circleColor,
        circle_font: circleFont.toString(),
        circle_name: circleName.toString(),
        created_time: circleCreationTimeStamp(),
        creator: userRefPath,
        description: circleDescription.toString(),
        id: "",
        logo_url: circleLogoUrl.toString(),
      };

      try {
        const circleCollectionRef = collection(db, "circles");
        const docRef = await addDoc(circleCollectionRef, circeData);
        console.log("Circle added with ID: ", docRef.id);
        const docRefUpdate = doc(db, "circles", docRef.id);
        const updatedData = {
          id: docRef.id,
        };
        try {
          await updateDoc(docRefUpdate, updatedData);
          console.log("Document successfully updated");
          toast("Circle Added Successfully!");
          setCircleCreationLoader(false);
          setIsOpen(false);
        } catch (error) {
          console.error("Error updating document: ", error);
          toast("Something went wrong!");
          setCircleCreationLoader(false);
        }
        setCircleCreationLoader(false);
        setIsOpen(false);
      } catch (error) {
        console.error("Error adding event: ", error);
        toast("Something went wrong!");
        setCircleCreationLoader(false);
      }
    }
    setCircleCreationLoader(false);
  };

  const [selectedCircleId, setSelectedCircleId] = useState(null);

  const handleCircleSelection = async (circleId) => {
    setSelectedCircleId(circleId);
    console.log("Selected Circle: ", circleId);
    const circleCollectionRef = collection(db, "circles");
    const q = query(circleCollectionRef, where("id", "==", circleId));

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        console.log("CIRCLE DATAAAAA: ", doc.data());
        // return doc.ref;
      });
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  const handleCreateEvent = async () => {
    setCreateEventLoader(true);
    const specialCharacterRegex = /[!@#$%^&*(),.?":{}|<>]/;
    if (circleData.length === 0) {
      toast("Please create circle in order to create event!");
    }
    // else if (!selectedLogo) {
    //   toast("Please Upload Event Photo!");
    // }
    else if (selectedCircleId === null) {
      toast("Please Select Circle!");
    } else if (eventTitle === "") {
      toast("Please Input Event Title!");
    } else if (eventDescription === "") {
      toast("Please Input Event Description!");
    } else if (startDateTime === null) {
      toast("Please Select Event Start Time!");
    } else if (endDateTime === null) {
      toast("Please Select Event End Time!");
    } else if (eventLocation === "") {
      toast("Please Input Event Location!");
    } else {
      console.log("ELSE CALLED");
      if (
        startDateTime &&
        endDateTime &&
        // selectedLogo &&
        eventTitle !== "" &&
        eventDescription !== "" &&
        eventLocation !== ""
      ) {
        if (specialCharacterRegex.test(eventTitle)) {
          toast("Please Enter a Valid Event Title!");
          setCreateEventLoader(false);
        } else {
          console.log("Called 0");
          if (isOnSponsorship && eventSponsorShip === "") {
            toast("Sponsorship package is missing!");
            setCreateEventLoader(false);
            console.log("Called 1");
          } else {
            console.log("Called 2");
            if (checkStartAndEndDateTime() === true) {
              console.log("Called 3");
              if (validateWebsite() === true) {
                console.log("Called 4");

                if (paidPriceCheck() === true) {
                  console.log("Called 5");
                  let userRefPath = null;
                  if (user) {
                    const userUID = user.uid;
                    const userRef = doc(db, "Users", userUID);
                    userRefPath = userRef;
                    console.log("User document reference: ", userRef);
                  }
                  const coHostsData = await fetchUserReferencesForCoHosts(
                    selectedCoHosts
                  );
                  const circleRef = await fetchUserReferencesForCircle(
                    selectedCircleId
                  );
                  const eventData = {
                    name: eventTitle,
                    search_name: eventTitle.toLowerCase(),
                    description: eventDescription,
                    hyperlink: eventWebsite,
                    location: eventLocation,
                    timefrom: convertToTimestampStartDateTime(),
                    timeto: convertToTimestampEndDateTime(),
                    small_image: selectedLogoURL !== null && selectedLogoURL,
                    large_image: selectedLogoURL !== null && selectedLogoURL,
                    Coords: locationCords || new GeoPoint("0.0", "0.0"),
                    attendees: arrayUnion(userRefPath),
                    checkedin: [],
                    maxTicket: isOnPrice ? Number(eventMaximumTickets) : 0,
                    ticketPrice: isOnPrice ? eventTicketPrice : "0.00",
                    isexhibitionallowed: isOnExhibitors ? "true" : "false",
                    sponsorship: eventSponsorShip,
                    creator: userRefPath,
                    circle_id: circleRef,
                    co_host: coHostsData,
                  };
                  console.log(eventData);
                  try {
                    const eventsCollectionRef = collection(db, "events"); // 'events' is the name of your Firestore collection
                    const docRef = await addDoc(eventsCollectionRef, eventData);
                    console.log("Event added with ID: ", docRef.id);
                    setEventID(docRef.id);
                    // Assuming you have a reference to your Firestore document using a docRef
                    const docRefUpdate = doc(db, "events", docRef.id); // Replace with your actual document ID
                    // Create an object with the fields you want to update
                    const updatedData = {
                      // Include the fields you want to update and their new values
                      uid: docRef.id,
                    };

                    // Event Mail

                    try {
                      var myHeaders = new Headers();
                      myHeaders.append("accessToken", circleAccessToken);

                      var requestOptions = {
                        method: "GET",
                        headers: myHeaders,
                        redirect: "follow",
                      };

                      fetch(
                        `https://api.circle.ooo/api/circle/email/event?eventId=${docRef.id}&emailType=CREATE-EVENT-MAIL`,
                        requestOptions
                      )
                        .then((response) => response.text())
                        .then((result) => console.log("MAIL RESULT:", result))
                        .catch((error) => console.log("error", error));
                    } catch (error) {
                      console.log(error);
                    }

                    // Update the document
                    try {
                      await updateDoc(docRefUpdate, updatedData);
                      console.log("Document successfully updated");
                      toast("Event Created Successfully!");
                      setCreateEventLoader(false);
                      if (thirdPartyCheckboxSelected.length === 0) {
                        setTimeout(() => {
                          router.push(`/events/${docRef.id}`);
                        }, 3000);
                      }
                    } catch (error) {
                      console.error("Error updating document: ", error);
                      toast("Something went wrong!");
                      setCreateEventLoader(false);
                    }

                    // Post event to third party platforms

                    async function postDataToThirdParty(
                      docRefId,
                      thirdPartyCheckboxSelected,
                      circleAccessToken,
                      retry = 0
                    ) {
                      setEventPublishLoader(true);
                      if (retry > 2) {
                        // Limiting retries to avoid infinite recursion
                        thirdPartyCheckboxSelected.map((item) => {
                          toast(
                            `Max retries reached. Aborting Event Publishing - ${item}.`
                          );
                        });
                        setEventPublishLoader(false);
                        setTimeout(() => {
                          router.push(`/events/${docRef.id}`);
                        }, 5000);
                        return;
                      }

                      try {
                        const myHeaders = new Headers();
                        myHeaders.append("Content-Type", "application/json");
                        myHeaders.append("accessToken", circleAccessToken); // Include accessToken in the headers

                        const dataToPost = {
                          eventId: docRefId,
                          platforms: thirdPartyCheckboxSelected,
                        };

                        const requestOptions = {
                          method: "POST",
                          headers: myHeaders,
                          body: JSON.stringify(dataToPost),
                          redirect: "follow",
                        };

                        const response = await fetch(
                          "https://api.circle.ooo/api/circle/third-party/publish",
                          requestOptions
                        );

                        if (!response.ok) {
                          throw new Error(
                            `HTTP error! Status: ${response.status}`
                          );
                        }

                        const result = await response.json();
                        const allSuccessful = result.every(
                          (item) => item.result === true
                        ); // Check if all results are true

                        result.forEach((item) => {
                          if (item.result === true) {
                            toast(
                              `${item.integration.toUpperCase()} - ${item.message.toUpperCase()}`
                            );
                          } else if (item.result === false) {
                            // toast(`${item.integration.toUpperCase()} - ${item.message.toUpperCase()}`);
                            // Recall the API with platforms from the response payload
                            postDataToThirdParty(
                              docRefId,
                              [item.integration],
                              circleAccessToken,
                              retry + 1
                            );
                          }
                        });

                        if (allSuccessful) {
                          // Redirect the user to another page
                          setEventPublishLoader(false);
                          setTimeout(() => {
                            router.push(`/events/${docRef.id}`);
                          }, 3000);
                        }
                      } catch (error) {
                        setEventPublishLoader(false);
                        console.error(
                          "Error posting event to third-party platforms:",
                          error
                        );
                        toast("Error posting event to third-party platforms!");
                      }
                    }

                    // Call this function when you want to post data to third-party platforms
                    if (thirdPartyCheckboxSelected.length > 0) {
                      postDataToThirdParty(
                        docRef.id,
                        thirdPartyCheckboxSelected,
                        circleAccessToken
                      );
                    }

                    // if (thirdPartyCheckboxSelected.length > 0) {
                    //   try {
                    //     const myHeaders = new Headers();
                    //     myHeaders.append("Content-Type", "application/json");
                    //     myHeaders.append("accessToken", circleAccessToken); // Include accessToken in the headers

                    //     const dataToPost = {
                    //       eventId: docRef.id,
                    //       platforms: thirdPartyCheckboxSelected,
                    //     };

                    //     const requestOptions = {
                    //       method: "POST",
                    //       headers: myHeaders,
                    //       body: JSON.stringify(dataToPost),
                    //       redirect: "follow",
                    //     };

                    //     const response = await fetch(
                    //       "https://api.circle.ooo/api/circle/third-party/publish",
                    //       requestOptions
                    //     );

                    //     if (!response.ok) {
                    //       throw new Error(
                    //         `HTTP error! Status: ${response.status}`
                    //       );
                    //     }

                    //     const result = await response.json();
                    //     if (result) {
                    //       result
                    //         .filter((items) => items.result === true)
                    //         .map((item) => {
                    //           toast(
                    //             `${item?.integration?.toUpperCase()} - ${item?.message?.toUpperCase()}`
                    //           );
                    //         });
                    //       result
                    //         .filter((items) => items.result === false)
                    //         .map((item) => {
                    //           toast(
                    //             `${item?.integration?.toUpperCase()} - ${item?.message?.toUpperCase()}`
                    //           );
                    //         });
                    //     }
                    //     // console.log("THIRD PARTY RESULT", result);
                    //   } catch (error) {
                    //     console.error(
                    //       "Error posting event to third-party platforms:",
                    //       error
                    //     );
                    //     toast("Error posting event to third-party platforms!");
                    //   }
                    // }
                  } catch (error) {
                    console.error("Error adding event: ", error);
                    toast("Something went wrong!");
                    setCreateEventLoader(false);
                  }
                }
              }
            }
          }
        }
      } else {
        setCreateEventLoader(false);
        toast("Input Fields Missing!");
      }
    }
    setCreateEventLoader(false);
  };

  const fetchAllUsers = async () => {
    const usersCollectionRef = collection(db, "Users");

    try {
      const querySnapshot = await getDocs(usersCollectionRef);
      const allUsers = [];
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        allUsers.push(userData);
      });
      console.log("All Users:", allUsers);
      setAllUsersData(allUsers);
      setFetchAllUserLoader(false);
    } catch (error) {
      console.error("Error fetching user documents:", error);
      setFetchAllUserLoader(false);
      toast("Error fetching all users data!");
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, [user]);

  useEffect(() => {
    setCoHostsList(allUsersData);
    setFetchCoHostsLoader(false);
  }, [allUsersData]);

  const toggleCoHostSelection = (item) => {
    setSelectedCoHosts((prevSelectedItems) => {
      if (prevSelectedItems.includes(item)) {
        return prevSelectedItems.filter(
          (selectedItem) => selectedItem !== item
        );
      } else {
        return [...prevSelectedItems, item];
      }
    });
  };

  const fetchUserReferencesForCoHosts = async (coHostNames) => {
    const usersCollectionRef = collection(db, "Users");
    const userReferencesMap = new Map();
    for (const coHostName of coHostNames) {
      const q = query(
        usersCollectionRef,
        where("full_name_insensitive", "==", coHostName)
      );

      try {
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          if (!userReferencesMap.has(coHostName)) {
            userReferencesMap.set(coHostName, doc.ref);
          }
        });
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    }

    const userReferences = Array.from(userReferencesMap.values());
    return userReferences;
  };

  const fetchUserReferencesForCircle = async (circleId) => {
    const circleCollectionRef = collection(db, "circles");
    const q = query(circleCollectionRef, where("id", "==", circleId));
    let ref = "";
    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        console.log("CIRCLE DATAAAAA: ", doc.ref);
        ref = doc.ref;
      });
    } catch (error) {
      console.error("Error fetching documents:", error);
    }

    return ref;
  };

  // const handleThirdPartyPost = (platform) => {
  //   if (eventID === "") {
  //     toast("Event is not created yet, Please create an event first!");
  //   } else {
  //     setThirdPartyLoader(true);
  //     console.log("PLATfORM: ", platform);

  //     try {
  //       var myHeaders = new Headers();
  //       myHeaders.append("accessToken", circleAccessToken);

  //       var requestOptions = {
  //         method: "GET",
  //         headers: myHeaders,
  //         redirect: "follow",
  //       };

  //       fetch(
  //         `https://api.circle.ooo/api/circle/third-party/publish?eventId=${eventID}&platform=${platform}`,
  //         requestOptions
  //       )
  //         .then((response) => response.json())
  //         .then((result) => {
  //           console.log(result);
  //           if (result.result) {
  //             toast(`Event Published on ${platform} Successfully!`);
  //             setThirdPartyLoader(false);
  //             setIsThirdPartyEventPosted(platform);
  //           } else {
  //             toast("Something went wrong while publishing event");
  //             setThirdPartyLoader(false);
  //             setIsThirdPartyEventPosted("");
  //           }
  //         })
  //         .catch((error) => {
  //           setThirdPartyLoader(false);
  //           setIsThirdPartyEventPosted("");
  //           toast("Something went wrong while publishing event");
  //         });
  //     } catch (error) {
  //       setThirdPartyLoader(false);
  //       setIsThirdPartyEventPosted("");
  //       toast("Something went wrong while publishing event");
  //     }
  //   }
  // };

  const handleCheckboxChange = (integrationType) => {
    // Check if the integration type is already selected
    if (thirdPartyCheckboxSelected.includes(integrationType)) {
      // If selected, remove it from the array
      setThirdPartyCheckboxSelected((prevSelected) =>
        prevSelected.filter((item) => item !== integrationType)
      );
    } else {
      // If not selected, add it to the array
      setThirdPartyCheckboxSelected((prevSelected) => [
        ...prevSelected,
        integrationType,
      ]);
    }
  };

  return (
    <>
      {/* {fetchAllUserLoader === false &&
      fetchCircleDataLoader === false &&
      fetchCoHostsLoader === false ? ( */}
      {/* <> */}
      {/* <ToastContainer /> */}
      <div
        style={{
          backgroundImage: `url(${bgImage.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        className="w-full h-full"
      >
        <Dialog
          open={isOpen}
          onClose={() => setIsOpen(false)}
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
                className="w-full md:w-1/2 xl:w-1/3 h-auto shadow-xl"
              >
                <Dialog.Title
                  className={`flex w-full items-center justify-between p-3 flex-row border-b-2`}
                >
                  <p className="font-bold text-lg text-[#fff]">Create Circle</p>
                  <button
                    type="button"
                    className="box-content rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
                    onClick={() => setIsOpen(false)}
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
                <div className="relative p-4 flex flex-col w-full">
                  <div className="flex items-center w-full">
                    {circleLogo && (
                      <img
                        src={URL.createObjectURL(circleLogo)}
                        alt="Selected Logo"
                        style={{ height: "50pt" }}
                        className="border-2 rounded-full mr-5"
                      />
                    )}
                    <label
                      style={{
                        borderRadius: "8px",
                        background:
                          "linear-gradient(90deg, #4532BF 5.81%, #9429FF 100%)",
                        boxShadow: "0px 1px 2px 0px rgba(82, 88, 102, 0.06)",
                      }}
                      className="text-[#fff] font-bold py-2 px-4 cursor-pointer"
                    >
                      Upload Circle Logo
                      <input
                        type="file"
                        accept=".png, .jpg, .jpeg, .gif"
                        className="hidden"
                        onChange={handleLogoChangeCircle}
                      />
                    </label>
                  </div>
                  <div className="mb-4 mt-4 w-full h-auto">
                    <label
                      htmlFor="circleName"
                      className="block text-[#fff] font-bold text-[16px] ml-1"
                    >
                      Circle Name
                      <span className="text-red-600"> *</span>
                    </label>
                    <input
                      type="text"
                      id="circleName"
                      style={{
                        background: "rgba(255, 255, 255, 0.10)",
                      }}
                      className="border-[0.5px] border-opacity-20 border-[#fff] focus:border-[0.5px] focus:border-opacity-60 text-[#fff] mt-2 p-3 w-full rounded-lg focus:outline-none"
                      placeholder="Enter your circle name"
                      value={circleName}
                      onChange={(e) => {
                        setCircleName(e.target.value);
                      }}
                    />
                  </div>
                  <div className="mb-4 w-full h-auto">
                    <label
                      htmlFor="circleDescription"
                      className="block text-[#fff] font-bold text-[16px] ml-1"
                    >
                      Circle Description
                      <span className="text-red-600"> *</span>
                    </label>
                    <textarea
                      id="circleDescription"
                      style={{
                        background: "rgba(255, 255, 255, 0.10)",
                      }}
                      className="h-[80pt] border-[0.5px] border-opacity-20 border-[#fff] focus:border-[0.5px] focus:border-opacity-60 text-[#fff] mt-2 p-3 w-full rounded-lg focus:outline-none"
                      placeholder="Add your circle description here"
                      value={circleDescription}
                      onChange={(e) => {
                        setCircleDescription(e.target.value);
                      }}
                    ></textarea>
                  </div>
                  <div className="mb-4 w-full h-auto">
                    <Menu
                      as="div"
                      className="relative inline-block text-left w-full"
                    >
                      <div>
                        <label
                          htmlFor="circleFonts"
                          className="block text-[#fff] font-bold text-[16px] ml-1"
                        >
                          Circle Font
                          <span className="text-red-600"> *</span>
                        </label>
                        <Menu.Button
                          id="circleFonts"
                          style={{
                            background: "rgba(255, 255, 255, 0.10)",
                          }}
                          className="inline-flex w-full justify-between mt-2 gap-x-1.5 rounded-lg px-3 py-4 text-sm text-[#fff] shadow-sm ring-1 ring-inset ring-gray-300 ring-opacity-20 hover:bg-gray-50"
                        >
                          {circleFont === "" ? "Select Font" : circleFont}

                          <ChevronDownIcon
                            className="-mr-1 h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                        </Menu.Button>
                      </div>

                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute h-60 overflow-auto w-full left-0 z-10 mt-2 w-full origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <div
                            style={{
                              backgroundImage: `url(${bgImage.src})`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                              backgroundRepeat: "no-repeat",
                            }}
                            className="py-1"
                          >
                            <div className="px-4 py-2">
                              <input
                                type="text"
                                placeholder="Search Fonts"
                                style={{
                                  background: "rgba(255, 255, 255, 0.10)",
                                }}
                                className="text-[#fff] border-[0.5px] border-opacity-20 border-[#fff] focus:border-[0.5px] focus:border-opacity-60 mt-2 p-3 w-full rounded-lg focus:outline-none"
                                value={searchText}
                                onChange={(e) => {
                                  handleSearch(e);
                                }}
                                onKeyDown={preventSpaceKeyPropagation}
                              />
                            </div>
                            {filteredFonts.map((item, index) => (
                              <Menu.Item key={index}>
                                {({ active }) => (
                                  <a
                                    onClick={() =>
                                      handleOptionSelectFonts(item)
                                    }
                                    className={classNames(
                                      active
                                        ? "bg-[#fff] bg-opacity-20"
                                        : "bg-transparent",
                                      "block px-4 py-2 text-sm cursor-pointer text-[#fff]"
                                    )}
                                  >
                                    {item}
                                  </a>
                                )}
                              </Menu.Item>
                            ))}
                          </div>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                  <div className="mb-4 w-full h-auto flex flex-col">
                    <label
                      htmlFor="circleColor"
                      className="block text-[#fff] font-bold text-[16px] ml-1"
                    >
                      Circle Color
                      <span className="text-red-600"> *</span>
                    </label>
                    <SketchPicker
                      className="mt-2"
                      color={circleColor}
                      onChange={handleColorChange}
                      styles={{
                        default: {
                          picker: {
                            width: "96%",
                            background: "rgba(255, 255, 255, 0.10)",
                          },
                        },
                      }}
                    />
                  </div>
                </div>
                <Dialog.Title
                  className={`flex w-full items-center justify-end p-3 flex-row border-t-2`}
                >
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className={`bg-[#EB5757] text-white py-2 px-4 rounded-lg`}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    disabled={circleCreationLoader === true}
                    onClick={handleCircleCreation}
                    style={{
                      background:
                        "linear-gradient(90deg, #4532BF 5.81%, #9429FF 100%)",
                      boxShadow: "0px 1px 2px 0px rgba(82, 88, 102, 0.06)",
                    }}
                    className={`ml-2 text-white py-2 px-4 rounded-lg`}
                  >
                    Create Circle
                  </button>
                </Dialog.Title>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
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
                    // style={{ height: 400, width: 400 }}
                    // initialAspectRatio={16 / 9}
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
        <Header type="dark" />
        <div className="w-full h-auto p-4 lg:p-10">
          <div className="flex flex-col w-full h-auto lg:flex-row justify-start items-start">
            <div
              style={{
                borderRadius: "16px",
                border: "1px solid rgba(255, 255, 255, 0.16)",
                background:
                  "linear-gradient(149deg, rgba(255, 255, 255, 0.20) 0.71%, rgba(255, 255, 255, 0.10) 98.8%)",
                backdropFilter: "blur(40px)",
              }}
              className="w-full lg:w-8/12 h-auto pt-10 pb-10 p-2 lg:p-10 lg:pb-0 lg:pt-5"
            >
              <div className="flex w-full justify-center lg:justify-start items-center lg:items-start flex-col">
                <h3 className="font-bold w-full text-center lg:text-left font48 text-[#fff]">
                  Create Event
                </h3>
                <p className="font24 w-full text-[#fff] text-center lg:text-left font-normal text-base mt-2">
                  Add all your event details, create new tickets, and set up
                  recurring events
                </p>
              </div>
              <div className="flex justify-start items-start flex-col mt-4">
                <div className="flex lg:flex-row flex-col justify-center lg:justify-start items-center w-full">
                  {selectedLogo && (
                    <img
                      src={URL.createObjectURL(selectedLogo)}
                      alt="Selected Logo"
                      className=" rounded-xl h-48 md:mr-5"
                    />
                  )}
                  <label
                    style={{
                      borderRadius: "8px",
                      background:
                        "linear-gradient(90deg, #4532BF 5.81%, #9429FF 100%)",
                      boxShadow: "0px 1px 2px 0px rgba(82, 88, 102, 0.06)",
                    }}
                    className="text-[#fff] font-bold mt-3 lg:mt-0 py-2 px-4 cursor-pointer"
                  >
                    Upload Event Photo
                    <input
                      type="file"
                      accept=".png, .jpg, .jpeg, .gif"
                      className="hidden"
                      onChange={handleLogoChange}
                    />
                  </label>
                </div>
                <div className="mb-4 mt-4 w-full lg:w-[90%] h-auto">
                  <label
                    htmlFor="eventTitle"
                    className="block text-[#fff] font-bold text-[16px] ml-1"
                  >
                    Your Circle
                    <span className="text-red-600"> *</span>
                  </label>
                  {circleData.length > 0 ? (
                    <>
                      <div className="flex justify-start mt-2 items-center flex-wrap gap-2 w-full">
                        {circleData.map((item) => {
                          const isSelected = item.id === selectedCircleId;

                          return (
                            <div
                              key={item.id}
                              className="rounded-full border-2 w-20 h-20 relative"
                            >
                              <img
                                src={item.logo_url}
                                className="rounded-full w-full h-full object-cover"
                                alt="Logo Image"
                                onClick={() => handleCircleSelection(item.id)}
                                style={{ cursor: "pointer" }}
                                title={item.circle_name}
                              />
                              {isSelected && (
                                <span
                                  style={{
                                    background:
                                      "linear-gradient(90deg, #4532BF 5.81%, #9429FF 100%)",
                                    boxShadow:
                                      "0px 1px 2px 0px rgba(82, 88, 102, 0.06)",
                                  }}
                                  className="rounded-full flex justify-center items-center success-icon h-8 w-8 border-none absolute top-0 right-0 font-bold"
                                >
                                  <FaCheckCircle
                                    color="#fff"
                                    className="text-3xl p-[3px]"
                                  />
                                </span>
                              )}
                              <input
                                type="radio"
                                value={item.id}
                                checked={isSelected}
                                onChange={() => handleCircleSelection(item.id)}
                                className="hidden"
                              />
                            </div>
                          );
                        })}
                      </div>
                    </>
                  ) : fetchCircleDataLoader ? (
                    <>
                      <div className="flex mt-4 w-full justify-start items-center">
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
                    <>
                      <div
                        style={{
                          borderRadius: "16px",
                          border: "1px solid rgba(255, 255, 255, 0.20)",
                          background: "rgba(255, 255, 255, 0.12)",
                          backdropFilter: "blur(40px)",
                        }}
                        className="flex justify-center items-center mt-2 mb-4 flex-row w-full p-5"
                      >
                        <div className="hidden lg:flex justify-center items-center">
                          <img
                            src={circleImage.src}
                            className="object-contain p-2 bg-[#000] rounded-full"
                            alt=""
                          />
                        </div>
                        <div className="flex w-full flex-col justify-center items-center">
                          <p className="text-white w-full text-center text-lg font-semibold">
                            You haven't created any circle, please create circle
                            to continue <span className="text-red-600"> *</span>
                          </p>
                          <button
                            style={{
                              borderRadius: "8px",
                              background:
                                "linear-gradient(90deg, #4532BF 5.81%, #9429FF 100%)",
                              boxShadow:
                                "0px 1px 2px 0px rgba(82, 88, 102, 0.06)",
                            }}
                            type="button"
                            onClick={() => setIsOpen(true)}
                            className={`mt-3 text-white font-semibold w-[80%] py-3 rounded-lg`}
                          >
                            Create Circle
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div className="mb-4 w-full lg:w-[90%] h-auto">
                  <label
                    htmlFor="eventTitle"
                    className="block text-[#fff] font-bold text-[16px] ml-1"
                  >
                    Event Title
                    <span className="text-red-600"> *</span>
                  </label>
                  <input
                    type="text"
                    id="eventTitle"
                    style={{
                      background: "rgba(255, 255, 255, 0.10)",
                    }}
                    className="mt-2 p-3 border-[0.5px] border-opacity-20 border-[#fff] focus:border-[0.5px] focus:border-opacity-60 text-[#fff] w-full rounded-lg focus:outline-none"
                    placeholder="Enter your event title"
                    value={eventTitle}
                    onChange={(e) => {
                      setEventTitle(e.target.value);
                    }}
                  />
                </div>
                <div className="mb-4 w-full lg:w-[90%] h-auto">
                  <label
                    htmlFor="description"
                    className="block text-[#fff] font-bold text-[16px] ml-1"
                  >
                    Description
                    <span className="text-red-600"> *</span>
                  </label>
                  <textarea
                    id="description"
                    style={{
                      background: "rgba(255, 255, 255, 0.10)",
                    }}
                    className="mt-2 p-3 h-[80pt] border-[0.5px] border-opacity-20 border-[#fff] focus:border-[0.5px] focus:border-opacity-60 text-[#fff] w-full rounded-lg focus:outline-none"
                    placeholder="Tell attendees about your event"
                    value={eventDescription}
                    onChange={(e) => {
                      setEventDescription(e.target.value);
                    }}
                  ></textarea>
                </div>
                <div className="mb-4 w-full lg:w-[90%] h-auto">
                  <Menu
                    as="div"
                    className="relative inline-block text-left w-full"
                  >
                    <div>
                      <label
                        htmlFor="circleFonts"
                        className="block text-[#fff] font-bold text-[16px] ml-1"
                      >
                        Add Co Hosts (Optional)
                      </label>
                      <Menu.Button
                        id="circleFonts"
                        style={{
                          background: "rgba(255, 255, 255, 0.10)",
                        }}
                        className="inline-flex w-full justify-between mt-2 gap-x-1.5 rounded-lg px-3 py-4 text-sm text-[#fff] shadow-sm ring-1 ring-inset ring-gray-300 ring-opacity-20 hover:bg-gray-50"
                      >
                        <div className="w-full flex justify-start text-start items-center">
                          {selectedCoHosts.length === 0
                            ? "Select Co Hosts"
                            : selectedCoHosts.join(", ").toUpperCase()}
                        </div>

                        <ChevronDownIcon
                          className="-mr-1 h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </Menu.Button>
                    </div>

                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute h-60 overflow-auto w-full left-0 z-50 mt-2 w-full origin-top-right rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div
                          style={{
                            backgroundImage: `url(${bgImage.src})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                          }}
                          className="py-1"
                        >
                          <div className="px-4 py-2">
                            <input
                              type="text"
                              placeholder="Search Hosts"
                              style={{
                                background: "rgba(255, 255, 255, 0.10)",
                              }}
                              className="text-[#fff] border-[0.5px] border-opacity-20 border-[#fff] focus:border-[0.5px] focus:border-opacity-60 mt-2 p-3 w-full rounded-lg focus:outline-none"
                              value={searchTextHosts}
                              onChange={(e) => {
                                handleSearchHosts(e);
                              }}
                              onKeyDown={preventSpaceKeyPropagation}
                            />
                          </div>
                          {coHostsList
                            ?.filter(
                              (items) =>
                                items.full_name_insensitive &&
                                items.full_name_insensitive !== undefined &&
                                items.full_name_insensitive !== ""
                            )
                            .sort((a, b) =>
                              a.full_name_insensitive.localeCompare(
                                b.full_name_insensitive
                              )
                            )
                            .map((item, index) => (
                              <div className="py-1">
                                <Menu.Item key={index}>
                                  {({ active }) => (
                                    <>
                                      <div
                                        className={`${
                                          selectedCoHosts.length > 0 &&
                                          selectedCoHosts.includes(
                                            item.full_name_insensitive
                                          )
                                            ? "bg-[#fff] bg-opacity-20"
                                            : "bg-transparent"
                                        } flex justify-between items-center flex-row`}
                                      >
                                        <div
                                          className={classNames(
                                            selectedCoHosts.length > 0 &&
                                              selectedCoHosts.includes(
                                                item.full_name_insensitive
                                              )
                                              ? "text-white font-semibold"
                                              : "text-white",
                                            "block px-4 py-2 text-sm cursor-pointer"
                                          )}
                                        >
                                          {item?.full_name_insensitive
                                            ? item?.full_name_insensitive?.toUpperCase()
                                            : item?.full_name?.toUpperCase()}
                                        </div>
                                        {selectedCoHosts.length > 0 &&
                                        selectedCoHosts.includes(
                                          item.full_name_insensitive
                                        ) ? (
                                          <div
                                            style={{
                                              background:
                                                "linear-gradient(90deg, #4532BF 5.81%, #9429FF 100%)",
                                              boxShadow:
                                                "0px 1px 2px 0px rgba(82, 88, 102, 0.06)",
                                            }}
                                            className="rounded-full mr-10 px-3 text-[#fff] cursor-pointer"
                                            onClick={() =>
                                              toggleCoHostSelection(
                                                item.full_name_insensitive
                                              )
                                            }
                                          >
                                            Remove
                                          </div>
                                        ) : (
                                          <div
                                            style={{
                                              background:
                                                "linear-gradient(90deg, #4532BF 5.81%, #9429FF 100%)",
                                              boxShadow:
                                                "0px 1px 2px 0px rgba(82, 88, 102, 0.06)",
                                            }}
                                            className="rounded-full mr-10 text-white px-3 cursor-pointer"
                                            onClick={() =>
                                              toggleCoHostSelection(
                                                item.full_name_insensitive
                                              )
                                            }
                                          >
                                            Add
                                          </div>
                                        )}
                                      </div>
                                    </>
                                  )}
                                </Menu.Item>
                              </div>
                            ))}
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
                <div className="mb-4 w-full lg:w-[90%] h-auto">
                  <label
                    htmlFor="hyperlink"
                    className="block text-[#fff] font-bold text-[16px] ml-1"
                  >
                    Website/Hyperlink (Optional)
                  </label>
                  <input
                    type="text"
                    id="hyperlink"
                    style={{
                      background: "rgba(255, 255, 255, 0.10)",
                    }}
                    className="text-[#fff] border-[0.5px] border-opacity-20 border-[#fff] focus:border-[0.5px] focus:border-opacity-60 mt-2 p-3 w-full rounded-lg focus:outline-none"
                    placeholder="Add website/hyperlink"
                    value={eventWebsite}
                    onChange={(e) => {
                      setEventWebsite(e.target.value);
                    }}
                  ></input>
                </div>
                <div className="flex justify-start lg:justify-between items-start lg:flex-row flex-col gap-4 w-full lg:w-[90%] mb-4 h-auto">
                  <div className="w-full">
                    <label
                      htmlFor="forDateStart"
                      className="block text-[#fff] font-bold text-[16px] ml-1"
                    >
                      Event Start Date & Time
                      <span className="text-red-600"> *</span>
                    </label>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateTimePicker
                        sx={{
                          "& .MuiInputBase-root": {
                            color: "white",
                            border: "none",
                          },
                          "& .MuiIconButton-label": { color: "white" },
                          "& .MuiOutlinedInput-notchedOutline": {
                            border: "none !important",
                          },
                          "& .MuiButtonBase-root": {
                            color: "white",
                            border: "none",
                          },
                          marginTop: 1,
                          width: "100%",
                          background: "rgba(255, 255, 255, 0.10)",
                          border: "0.5px solid rgba(255, 255, 255, 0.20)",
                          borderRadius: "0.5rem",
                        }}
                        value={startDateTime}
                        onChange={(newValue) => setStartDateTime(newValue)}
                        disablePast
                      />
                    </LocalizationProvider>
                  </div>
                  <div className="w-full">
                    <label
                      htmlFor="forDateEnd"
                      className="block text-[#fff] font-bold text-[16px] ml-1"
                    >
                      Event End Date & Time
                      <span className="text-red-600"> *</span>
                    </label>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateTimePicker
                        value={endDateTime}
                        sx={{
                          "& .MuiInputBase-root": {
                            color: "white",
                            border: "none",
                          },
                          "& .MuiIconButton-label": { color: "white" },
                          "& .MuiOutlinedInput-notchedOutline": {
                            border: "none !important",
                          },
                          "& .MuiButtonBase-root": {
                            color: "white",
                            border: "none",
                          },
                          marginTop: 1,
                          width: "100%",
                          background: "rgba(255, 255, 255, 0.10)",
                          border: "0.5px solid rgba(255, 255, 255, 0.20)",
                          borderRadius: "0.5rem",
                        }}
                        onChange={(newValue) => setEndDateTime(newValue)}
                        disablePast
                      />
                    </LocalizationProvider>
                  </div>
                </div>
                <div className="mb-4 w-full lg:w-[90%] h-auto">
                  <label
                    htmlFor="location"
                    className="block text-[#fff] font-bold text-[16px] ml-1"
                  >
                    Location/Address
                    <span className="text-red-600"> *</span>
                  </label>
                  <LocationSearchInput
                    onSelect={handleSelect}
                    location={eventLocation}
                    setEventLocation={setEventLocation}
                  />
                </div>
                {/* <div
                  style={{
                    borderRadius: "16px",
                    border: "1px solid rgba(255, 255, 255, 0.16)",
                    background:
                      "linear-gradient(149deg, rgba(255, 255, 255, 0.20) 0.71%, rgba(255, 255, 255, 0.10) 98.8%)",
                    backdropFilter: "blur(40px)",
                  }}
                  className="lg:flex hidden mb-4 w-[90%] h-auto flex-col justify-center items-center rounded-lg p-5"
                > */}
                <div className="w-full lg:flex hidden lg:w-[90%] h-auto mb-4 text-center">
                  <button
                    onClick={handleCreateEvent}
                    type="submit"
                    disabled={
                      createEventLoader === true || eventPublishLoader === true
                    }
                    style={{
                      borderRadius: "8px",
                      background:
                        "linear-gradient(90deg, #4532BF 5.81%, #9429FF 100%)",
                      boxShadow: "0px 1px 2px 0px rgba(82, 88, 102, 0.06)",
                    }}
                    className={`text-white w-full py-5 rounded-lg`}
                  >
                    {createEventLoader === true ||
                    eventPublishLoader === true ? (
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
                      "Create Event"
                    )}
                  </button>
                </div>
                {/* </div> */}
              </div>
            </div>

            <div className="w-full lg:w-4/12 h-auto flex flex-col justify-center items-center mt-5 lg:mt-0 lg:pt-10 lg:p-10">
              <div
                style={{
                  borderRadius: "16px",
                  border: "1px solid rgba(255, 255, 255, 0.16)",
                  background:
                    "linear-gradient(149deg, rgba(255, 255, 255, 0.20) 0.71%, rgba(255, 255, 255, 0.10) 98.8%)",
                  backdropFilter: "blur(40px)",
                }}
                className="flex w-full h-auto flex-col justify-start items-start rounded-lg p-10 lg:mt-[-10%]"
              >
                <div className="text-[#fff] w-full h-auto border-b-2 border-[#E0E0E0] pb-5 font-semibold text-lg">
                  <p
                    onClick={() => {
                      console.log(thirdPartyCheckboxSelected);
                    }}
                  >
                    Third Party Platforms
                  </p>
                </div>
                {thirdPartyIntegrations.length > 0 &&
                  thirdPartyIntegrations?.map((item) => (
                    <>
                      <div className="flex justify-between items-center text-[#fff] font-semibold flex-row w-full h-auto mt-2">
                        <div>{item.integrationType}</div>
                        <input
                          type="checkbox"
                          className="h-6 w-6 cursor-pointer text-[#fff]"
                          onChange={() =>
                            handleCheckboxChange(
                              item.integrationType.toString().toUpperCase()
                            )
                          }
                          checked={thirdPartyCheckboxSelected.includes(
                            item.integrationType
                          )}
                        />
                      </div>
                    </>
                  ))}
                {thirdPartyIntegrations.length === 0 && (
                  <>
                    <div className="flex mt-3 justify-center flex-col items-center w-full">
                      <img
                        src={noIntegration.src}
                        alt=""
                        className="object-contain mt-3 h-[80px] w-full"
                      />
                      <div className="font-semibold text-[#fff] mt-3">
                        No Integrations found
                      </div>
                      <button
                        onClick={() => {
                          router.push("/settings");
                        }}
                        style={{
                          borderRadius: "8px",
                          background:
                            "linear-gradient(90deg, #4532BF 5.81%, #9429FF 100%)",
                          boxShadow: "0px 1px 2px 0px rgba(82, 88, 102, 0.06)",
                        }}
                        className={`mt-3 py-2 font-bold w-full cursor-pointer text-[#fff]`}
                      >
                        <div className="flex justify-center items-center">
                          Go to Settings
                        </div>
                      </button>
                    </div>
                  </>
                )}
              </div>
              <div
                style={{
                  borderRadius: "16px",
                  border: "1px solid rgba(255, 255, 255, 0.16)",
                  background:
                    "linear-gradient(149deg, rgba(255, 255, 255, 0.20) 0.71%, rgba(255, 255, 255, 0.10) 98.8%)",
                  backdropFilter: "blur(40px)",
                }}
                className="flex bg-[#fff] mt-5 w-full h-auto flex-col justify-start items-start rounded-lg p-10"
              >
                <div className="text-[#fff] w-full h-auto border-b-2 border-[#E0E0E0] pb-5 font-semibold text-lg">
                  <p>Features</p>
                </div>
                <div className="flex justify-between text-[#fff] flex-row w-full h-auto mt-5">
                  <div>Open for Exhibitors</div>
                  <div>
                    <label
                      style={{
                        background: isOnExhibitors
                          ? "linear-gradient(90deg, #4532BF 5.81%, #9429FF 100%)"
                          : "#E2E2E2",
                      }}
                      className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer`}
                    >
                      <input
                        type="checkbox"
                        className="absolute h-0 w-0 opacity-0"
                        onChange={toggleSwitchExhibitors}
                        checked={isOnExhibitors}
                      />
                      <span
                        className={`${
                          isOnExhibitors ? "translate-x-6" : "translate-x-1"
                        } inline-block w-4 h-4 transform translate-x-0.5 bg-white rounded-full transition-transform duration-200 ease-in-out`}
                      ></span>
                    </label>
                  </div>
                </div>
                <div className="flex justify-between text-[#fff] flex-row w-full h-auto mt-2">
                  <div>Open for Sponsorship</div>
                  <div>
                    <label
                      style={{
                        background: isOnSponsorship
                          ? "linear-gradient(90deg, #4532BF 5.81%, #9429FF 100%)"
                          : "#E2E2E2",
                      }}
                      className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer`}
                    >
                      <input
                        type="checkbox"
                        className="absolute h-0 w-0 opacity-0"
                        onChange={toggleSwitchSponsorship}
                        checked={isOnSponsorship}
                      />
                      <span
                        className={`${
                          isOnSponsorship ? "translate-x-6" : "translate-x-1"
                        } inline-block w-4 h-4 transform translate-x-0.5 bg-white rounded-full transition-transform duration-200 ease-in-out`}
                      ></span>
                    </label>
                  </div>
                </div>
                {isOnSponsorship && (
                  <div className="flex w-full justify-center items-center h-auto mt-2">
                    <input
                      type="text"
                      id="sponsorship"
                      style={{
                        background: "rgba(255, 255, 255, 0.10)",
                      }}
                      className="text-[#fff] border-[0.5px] border-opacity-20 border-[#fff] focus:border-[0.5px] focus:border-opacity-60 mt-2 p-3 w-full rounded-lg focus:outline-none"
                      placeholder="Eg. Title sponsor, Food Sponsor"
                      value={eventSponsorShip}
                      onChange={(e) => {
                        setEventSponsorShip(e.target.value);
                      }}
                    ></input>
                  </div>
                )}
                <div className="flex justify-between text-[#fff] flex-row w-full h-auto mt-2">
                  <div className="font-bold">
                    Ticket Price {isOnPrice ? "(Paid)" : "(Free)"}
                  </div>
                  <div>
                    <label
                      style={{
                        background: isOnPrice
                          ? "linear-gradient(90deg, #4532BF 5.81%, #9429FF 100%)"
                          : "#E2E2E2",
                      }}
                      className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer`}
                    >
                      <input
                        type="checkbox"
                        className="absolute h-0 w-0 opacity-0"
                        onChange={toggleSwitchPrice}
                        checked={isOnPrice}
                      />
                      <span
                        className={`${
                          isOnPrice ? "translate-x-6" : "translate-x-1"
                        } inline-block w-4 h-4 transform translate-x-0.5 bg-white rounded-full transition-transform duration-200 ease-in-out`}
                      ></span>
                    </label>
                  </div>
                </div>
                {isOnPrice && (
                  <div className="flex w-full flex-col justify-center items-center h-auto mt-2">
                    <input
                      type="text"
                      inputMode="numeric"
                      id="maximumTicket"
                      style={{
                        background: "rgba(255, 255, 255, 0.10)",
                      }}
                      className="border-[0.5px] border-opacity-20 border-[#fff] focus:border-[0.5px] focus:border-opacity-60 text-[#fff] mt-2 p-3 w-full rounded-lg focus:outline-none"
                      placeholder="Maximum Tickets"
                      value={eventMaximumTickets}
                      onChange={(e) => {
                        const numericValue = e.target.value.replace(/\D/g, "");

                        if (e.target.value !== numericValue) {
                          e.target.value = numericValue;
                        } else {
                          setEventMaximumTickets(numericValue);
                        }
                      }}
                    ></input>
                    <div className="relative w-full">
                      <span className="absolute inset-y-0 left-0 pl-3 pt-2 text-[#fff] font18 font-bold flex items-center">
                        $
                      </span>
                      <input
                        type="text"
                        inputMode="numeric"
                        id="ticketPrice"
                        style={{
                          background: "rgba(255, 255, 255, 0.10)",
                        }}
                        className="border-[0.5px] border-opacity-20 border-[#fff] focus:border-[0.5px] focus:border-opacity-60 pl-10 text-[#fff] mt-2 p-3 w-full rounded-lg focus:outline-none"
                        placeholder="Ticket Price"
                        value={eventTicketPrice}
                        onChange={(e) => {
                          setEventTicketPrice(e.target.value);
                        }}
                      ></input>
                    </div>
                  </div>
                )}
              </div>
              <div
                style={{
                  borderRadius: "16px",
                  border: "1px solid rgba(255, 255, 255, 0.16)",
                  background:
                    "linear-gradient(149deg, rgba(255, 255, 255, 0.20) 0.71%, rgba(255, 255, 255, 0.10) 98.8%)",
                  backdropFilter: "blur(40px)",
                }}
                className="flex lg:hidden mt-5 mb-2 w-full h-auto flex-col justify-center items-center rounded-lg p-5"
              >
                <div className="w-full text-center">
                  <button
                    onClick={handleCreateEvent}
                    type="submit"
                    disabled={
                      createEventLoader === true || eventPublishLoader === true
                    }
                    style={{
                      borderRadius: "8px",
                      background:
                        "linear-gradient(90deg, #4532BF 5.81%, #9429FF 100%)",
                      boxShadow: "0px 1px 2px 0px rgba(82, 88, 102, 0.06)",
                    }}
                    className={`text-white w-full py-5 rounded-lg`}
                  >
                    {createEventLoader === true ||
                    eventPublishLoader === true ? (
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
                      "Create Event"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
      {/* </> */}
      {/*  ) : (
         <>
           <div className="flex w-screen h-screen justify-center items-center">
             <img src={loaderGif.src} alt="Loader" />
           </div>
         </>
       )} */}
    </>
  );
};

export default CreateEvent;
