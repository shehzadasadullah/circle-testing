import Image from "next/image";
import React, { useState, useEffect } from "react";
import AttendeIcon from "../SvgIcons/AttendeIcon";
import FavoriteIcon from "../SvgIcons/FavoriteIcon";
import moment from "moment/moment";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";
import {
  doc,
  Timestamp,
  query,
  limit,
  onSnapshot,
  where,
} from "firebase/firestore";
import { updateDoc, setDoc, getDoc } from "firebase/firestore";
import { collection } from "firebase/firestore";
import { db } from "@/firebase";
import { deleteField } from "firebase/firestore";
import toast from "react-simple-toasts";
import Register from "../Home/Register";
import { BsHeart, BsFillHeartFill } from "react-icons/bs";
import bgImage from "../../public/revamp/bg-sec3.png";
const EventCard = ({
  image,
  title,
  time,
  description,
  attend,
  price,
  id = "",
  type = "",
  location,
  setRemoveFromFav = () => {},
}) => {
  //state
  const [isFavorite, setIsFavorite] = React.useState(false);
  //router
  const router = useRouter();

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [user] = useAuthState(auth);
  const [eventsdata, setEventsData] = useState([]);

  const [favorites, setFavorites] = useState([]);
  const getEventsData = async () => {
    // reference to the events collection
    const eventsCollectionRef = collection(db, "events");
    //current time stamp
    let curtimestamp = Timestamp.now();
    //compound query - any event which start from now in future
    const q = query(
      eventsCollectionRef,
      where("timefrom", ">=", curtimestamp),
      limit(40)
    );
    //reading the live data from firestore
    return onSnapshot(q, (querySnapshot) => {
      const Docs = [];
      querySnapshot.forEach((doc) => {
        Docs.push({ ...doc.data(), eventsDocId: doc?.id });
      });
      setEventsData(Docs || []);
    });
  };

  useEffect(() => {
    getEventsData();
  }, []);

  // useEffect(() => {
  //   // Fetch the latitude and longitude using Nominatim reverse geocoding
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch(
  //         `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
  //           location
  //         )}&format=json&limit=1`
  //       );
  //       const data = await response.json();

  //       if (data.length > 0) {
  //         const { lat, lon } = data[0];
  //         setLatitude(lat);
  //         setLongitude(lon);
  //       }
  //     } catch (error) {
  //       console.log("Error retrieving location coordinates:", error);
  //     }
  //   };

  //   fetchData();
  // }, [location]);

  useEffect(() => {
    if (user) {
      //history data
      // eslint-disable-next-line no-unused-vars

      //user data
      // eslint-disable-next-line no-unused-vars

      // favorite data
      // eslint-disable-next-line no-unused-vars
      const fav = onSnapshot(doc(db, "favorite", user?.uid), (doc) => {
        let favorArray = [];
        let firestoredata = doc.data() || {};

        if (firestoredata && Object.keys(firestoredata).length > 0) {
          Object.keys(firestoredata).map((each) => {
            favorArray.push(
              Object.assign({}, firestoredata?.[each], { id: each })
            );
          });
        }
        setFavorites(favorArray || []);
      });
    }
  }, [user]);

  const AddtoFav = (title, description, uid) => {
    let favexist = eventsdata.find((every) => {
      return every?.name == title && every?.description == description;
    });
    const currentDate = new Date().toISOString().slice(0, 10);
    const itemToAdd = {
      name: title,
      description: description,
      ticketPrice: price,
      uid: uid,
      small_image: image,
      large_image: image,
      type: type,
      attend: attend,
      timefrom: time,
    };

    const docRef = doc(db, "favorites", user?.uid);
    getDoc(docRef)
      .then((docSnapshot) => {
        if (docSnapshot.exists()) {
          // Document already exists, retrieve existing favorites data
          const existingFavorites = docSnapshot.data() || {};

          // Add the new event to the existingFavorites map with the uid as the key
          existingFavorites[uid] = itemToAdd;

          // Update the entire favorites document
          setDoc(docRef, existingFavorites)
            .then(() => {
              toast("Successfully added to favorites");
            })
            .catch((error) => {
              console.log("Error adding to favorites:", error);
            });
        } else {
          // Document does not exist, create a new one with the first favorite
          const newFavorites = { [uid]: itemToAdd };
          setDoc(docRef, newFavorites)
            .then(() => {
              toast("Successfully added to favorites");
            })
            .catch((error) => {
              console.log("Error adding to favorites:", error);
            });
        }
      })
      .catch((error) => {
        console.log("Error retrieving favorites document:", error);
      });
  };

  const RemoveFromFav = (uid) => {
    const docRef = doc(db, "favorites", user?.uid);
    getDoc(docRef)
      .then((docSnapshot) => {
        if (docSnapshot.exists()) {
          const existingFavorites = docSnapshot.data() || {};
          if (existingFavorites.hasOwnProperty(uid)) {
            // Remove the event from favorites using the uid
            delete existingFavorites[uid];
            // Update the favorites document
            setDoc(docRef, existingFavorites)
              .then(() => {
                toast("Successfully removed from favorites");
                setRemoveFromFav(true);
              })
              .catch((error) => {
                console.log("Error removing from favorites:", error);
              });
          } else {
            console.log("Event with UID not found in favorites");
          }
        } else {
          console.log("Favorites document does not exist");
        }
      })
      .catch((error) => {
        console.log("Error retrieving favorites document:", error);
      });
  };

  // Helper function to generate a unique ID for favorite items
  function generateUniqueId() {
    return Math.random().toString(36).substr(2, 9);
  }

  const [favex, setfavex] = useState([]);

  const checkIfIdExistsInFavs = async (id) => {
    if (user && user.uid) {
      // Assuming you have access to the Firebase Firestore or any other database instance

      // Replace 'uid' with the appropriate value representing the user's ID
      const uid = user?.uid;

      // Assuming you have a 'favs' collection under the user's document
      const favsDocRef = doc(db, "favorites", user?.uid);

      try {
        const docSnapshot = await getDoc(favsDocRef);
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          if (data) {
            setfavex(Object.keys(data || {})); // Extracting the IDs from the data object
            return data.hasOwnProperty(id); // Returns true if the ID exists in the map, false otherwise
          }
        }
        return false; // Returns false if the document doesn't exist or data is undefined
      } catch (error) {
        console.error("Error checking if ID exists in favs:", error);
        return false;
      }
    }
  };

  const [isInFavorites, setIsInFavorites] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const existsInFavorites = await checkIfIdExistsInFavs(id);
      setIsInFavorites(existsInFavorites);
    };

    fetchData();
  }, [id]);

  const handleToggleFavorites = async () => {
    if (isInFavorites) {
      // Remove the event ID from favorites
      // Implement the logic to remove the event ID from the "favs" collection
      // ...

      setIsInFavorites(false);
    } else {
      // Add the event ID to favorites
      // Implement the logic to add the event ID to the "favs" collection
      // ...

      setIsInFavorites(true);
    }
  };

  const [showModal, setShowModal] = useState(false);

  const handleClick = (e) => {
    e?.preventDefault();
    setShowModal(true);
  };

  return (
    <div
      className={`w-full h-full rounded-[25px] p-3 ${
        id?.length > 0 ? "cursor-pointer" : ""
      }`}
      onClick={() => {
        if (id?.length > 0) {
          if (type === "") {
            router.push(`/events/${id}`);
          } else {
            router.push(`/events/${id}?type=${type}`);
          }
        }
      }}
      style={{
        maxWidth: "100%",
        margin: "0 auto",
        border: "1px solid rgba(25, 112, 214, 0.30)",
        background: "rgba(28, 34, 44, 0.60)",
        boxShadow:
          "0px 13px 29px 0px rgba(0, 0, 0, 0.07), 0px 53px 53px 0px rgba(0, 0, 0, 0.06), 0px 118px 71px 0px rgba(0, 0, 0, 0.03), 0px 211px 84px 0px rgba(0, 0, 0, 0.01), 0px 329px 92px 0px rgba(0, 0, 0, 0.00)",
      }} // Add this style for responsiveness
    >
      <div className="w-full rounded-[25px]">
        {image ? (
          <div className="relative flex flex-col">
            <div className="w-full h-40">
              <img
                src={image}
                alt={""}
                className="w-full h-full object-fill rounded-[25px]"
              />
            </div>
            <div className="absolute p-2 mt-2 flex w-full justify-end">
              {user?.uid ? (
                <div>
                  {isInFavorites ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleFavorites();
                        RemoveFromFav(id);
                      }}
                    >
                      <div className="bg-[#fff] rounded-full p-3">
                        <BsFillHeartFill size={20} className="text-[red]" />
                      </div>
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleFavorites();
                        AddtoFav(title, description, id);
                      }}
                    >
                      <div className="bg-white rounded-full p-3">
                        <BsHeart size={20} />
                      </div>
                    </button>
                  )}
                </div>
              ) : (
                <div>
                  {isInFavorites ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClick();
                      }}
                    >
                      <div className="bg-[#fff] rounded-full p-3">
                        <BsFillHeartFill size={20} className="text-[red]" />
                      </div>
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClick();
                      }}
                    >
                      <div className="bg-white rounded-full p-3">
                        <BsHeart size={20} />
                      </div>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="relative flex flex-col">
            <div className="w-full h-40">
              <img
                src={bgImage.src}
                alt={title}
                className="w-full h-full object-fill rounded-[25px]"
              />
            </div>
            <div className="absolute p-2 mt-2 flex w-full justify-end">
              {user?.uid ? (
                <div>
                  {isInFavorites ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleFavorites();
                        RemoveFromFav(id);
                      }}
                    >
                      <div className="bg-[#fff] rounded-full p-3">
                        <BsFillHeartFill size={20} className="text-[red]" />
                      </div>
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleFavorites();
                        AddtoFav(title, description, id);
                      }}
                    >
                      <div className="bg-white rounded-full p-3">
                        <BsHeart size={20} />
                      </div>
                    </button>
                  )}
                </div>
              ) : (
                <div>
                  {isInFavorites ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClick();
                      }}
                    >
                      <div className="bg-[#fff] rounded-full p-3">
                        <BsFillHeartFill size={20} className="text-[red]" />
                      </div>
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClick();
                      }}
                    >
                      <div className="bg-white rounded-full p-3">
                        <BsHeart size={20} />
                      </div>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="w-full p-4 flex flex-col justify-start items-start gap-1.5">
        <div className="w-full flex justify-between items-start">
          <div className="w-full flex flex-col justify-start items-start gap-1">
            <div className="w-full truncate flex justify-start items-start font18 lg:font16 text-[#fff] font-semibold">
              {title}
            </div>
            <div
              style={{ color: "rgba(255, 255, 255, 0.80)" }}
              className="w-full flex justify-start items-start truncate font16 lg:font12"
            >
              {moment(time?.seconds * 1000)
                .local()
                .format("MMMM Do YYYY, h:mm:ss a")}
            </div>
          </div>
        </div>

        <div
          style={{ color: "rgba(255, 255, 255, 0.80)" }}
          className="sm:w-full w-24 truncate font16 lg:font12"
        >
          {description}
        </div>
        <div className="w-full truncate font18 font-semibold text-[#1DD9F3]">
          {type === "" && Number(price) === 0.0
            ? "Free"
            : type === "" && Number(price) !== 0.0
            ? "$" + price
            : price}
        </div>
        <div
          style={{ color: "rgba(255, 255, 255, 0.80)" }}
          className="w-full flex justify-start items-center gap-1 font16 lg:font12"
        >
          {type === "" ? (
            <>
              <AttendeIcon className="w-3 h-3" />
              <div className="">
                {attend === 0
                  ? attend + " " + "Follower"
                  : attend === 1
                  ? attend + " " + "Follower"
                  : attend + " " + "Followers"}
              </div>
            </>
          ) : (
            <>
              {" "}
              <AttendeIcon className="w-3 h-3" />
              <div className="font-semibold">{type?.toUpperCase()}</div>
            </>
          )}
        </div>
      </div>
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            zIndex: 999,
          }}
        >
          <Register showModal={showModal} setShowModal={setShowModal} />
        </div>
      )}
    </div>
  );
};

export default EventCard;
