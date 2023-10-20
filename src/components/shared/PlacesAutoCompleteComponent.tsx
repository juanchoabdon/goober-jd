import { useState, useEffect } from "react";

import { getGeocode, getLatLng } from "use-places-autocomplete";

import usePlacesAutocomplete from "use-places-autocomplete";

type PlacesAutoCompleteComponentProps = {
  setNewMarkerPosition: (position: { lat: number; lng: number }) => void;
  setNewUserAddress: (address: string) => void;
  setNewDropoffPosition: (position: { lat: number; lng: number }) => void;
  userLocation: { lat: number; lng: number };
  defaultValue?: string;
  setDropoffAddress: (address: string) => void;
  dropoffAddress?: string;
};

export const PlacesAutoCompleteComponent: React.FC<
  PlacesAutoCompleteComponentProps
> = ({
  setNewMarkerPosition,
  setNewUserAddress,
  setNewDropoffPosition,
  userLocation,
  defaultValue,
  setDropoffAddress,
  dropoffAddress,
}) => {
  const {
    ready: pickupReady,
    suggestions: pickupSuggestions,
    setValue: setPickupValue,
    clearSuggestions: clearPickupSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      location: new google.maps.LatLng(userLocation.lat, userLocation.lng),
      radius: 1000,
    },
  });

  const {
    ready: dropoffReady,
    suggestions: dropoffSuggestions,
    setValue: setDropoffValue,
    clearSuggestions: clearDropoffSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      location: new google.maps.LatLng(userLocation.lat, userLocation.lng),
      radius: 1000,
    },
  });

  const [pickupInputValue, setPickupInputValue] = useState("");
  const [dropoffInputValue, setDropoffInputValue] = useState("");

  useEffect(() => {
    if (defaultValue) setPickupInputValue(defaultValue);
    if (dropoffAddress) setDropoffInputValue(dropoffAddress);
  }, [defaultValue, dropoffAddress]);

  const handleSuggestionClick = (description: string, isPickup = true) => {
    if (isPickup) {
      setPickupValue(description, false);
      clearPickupSuggestions();
    } else {
      setDropoffValue(description, false);
      clearDropoffSuggestions();
    }
    getGeocode({ address: description })
      .then((results) => {
        if (!results[0]) {
          throw new Error("No geocode results found");
        }
        return getLatLng(results[0]);
      })
      .then(({ lat, lng }) => {
        if (isPickup) {
          setNewUserAddress(description);
          setNewMarkerPosition({ lat, lng });
        } else {
          setDropoffAddress(description);
          setNewDropoffPosition({ lat, lng });
        }
      })
      .catch((error) => {
        console.error("Error fetching geocode data:", error);
      });
  };

  return (
    <>
      <input
        type="text"
        placeholder="Pickup"
        disabled={!pickupReady}
        className="mb-2 w-full rounded-md p-2 shadow-lg"
        value={pickupInputValue}
        onChange={(e) => {
          setPickupInputValue(e.target.value);
          setPickupValue(e.target.value, true);
        }}
      />
      <div>
        {pickupSuggestions?.status === "OK" &&
          pickupSuggestions?.data?.map(({ place_id, description }) => (
            <div
              key={place_id}
              onClick={() => handleSuggestionClick(description)}
              className="cursor-pointer border-b border-gray-200 bg-white p-2 hover:bg-gray-100"
            >
              {description}
            </div>
          ))}
      </div>
      <input
        type="text"
        placeholder="Dropoff"
        disabled={!dropoffReady}
        className="w-full rounded-md p-2 shadow-lg"
        value={dropoffInputValue}
        onChange={(e) => {
          setDropoffInputValue(e.target.value);
          setDropoffValue(e.target.value, true);
        }}
      />
      <div>
        {dropoffSuggestions?.status === "OK" &&
          dropoffSuggestions?.data?.map(({ place_id, description }) => (
            <div
              key={place_id}
              onClick={() => handleSuggestionClick(description, false)}
              className="cursor-pointer border-b border-gray-200 bg-white p-2 hover:bg-gray-100"
            >
              {description}
            </div>
          ))}
      </div>
    </>
  );
};
