import React, { useState } from "react";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import { ThreeDots } from "react-loader-spinner";
import bgImage from "../../public/revamp/bg-createEvent.jpg";

const LocationSearchInput = ({ onSelect, location, setEventLocation }) => {
  const handleChange = (value) => {
    console.log(value);
    setEventLocation(value);
  };

  const handleSelect = async (value) => {
    const results = await geocodeByAddress(value);
    const latLng = await getLatLng(results[0]);
    onSelect(value, latLng);
  };

  return (
    <PlacesAutocomplete
      value={location}
      onChange={handleChange}
      onSelect={handleSelect}
    >
      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
        <div>
          <input
            style={{
              background: "rgba(255, 255, 255, 0.10)",
            }}
            className="border-[0.5px] border-opacity-20 border-[#fff] focus:border-[0.5px] focus:border-opacity-60 text-[#fff] mt-2 p-3 w-full rounded-lg focus:outline-none"
            {...getInputProps({
              placeholder: "Add event location/address here",
            })}
          />

          <div
            style={{
              backgroundImage: `url(${bgImage.src})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
            className="shadow-md rounded-b-lg rounded-t-lg"
          >
            {loading && (
              <div
                style={{
                  padding: "10px",
                  borderRadius: "0.5rem",
                }}
              >
                <ThreeDots
                  height="20"
                  color="#fff"
                  width="50"
                  radius="9"
                  ariaLabel="three-dots-loading"
                  visible={true}
                />
              </div>
            )}
            {suggestions.map((suggestion) => {
              const style = {
                color: suggestion.active ? "#fff" : "#fff",
                backgroundColor: suggestion.active
                  ? "rgba(255,255,255,0.20)"
                  : "transparent",
                padding: "10px",
                borderRadius: "0.5rem",
                cursor: "pointer",
              };

              return (
                <div
                  key={suggestion.placeId}
                  {...getSuggestionItemProps(suggestion, {
                    style,
                  })}
                >
                  {suggestion.description}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </PlacesAutocomplete>
  );
};

export default LocationSearchInput;
