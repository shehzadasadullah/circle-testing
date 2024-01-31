import React, { useState } from "react";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import { ThreeDots } from "react-loader-spinner";

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
            className="border-2 text-[#8392AF] border-[#E6E7EC] mt-2 p-3 w-full rounded-lg focus:border-[#007BAB] focus:outline-none"
            {...getInputProps({
              placeholder: "Add event location/address here",
            })}
          />

          <div className="shadow-md rounded-b-xl rounded-t-md">
            {loading && (
              <div
                style={{
                  padding: "10px",
                  borderRadius: "10px",
                }}
              >
                <ThreeDots
                  height="20"
                  color="#007BAB"
                  width="50"
                  radius="9"
                  ariaLabel="three-dots-loading"
                  visible={true}
                />
              </div>
            )}
            {suggestions.map((suggestion) => {
              const style = {
                color: suggestion.active ? "#fff" : "#000",
                backgroundColor: suggestion.active ? "#007BAB" : "#fff",
                padding: "10px",
                borderRadius: "10px",
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
