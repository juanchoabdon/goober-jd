import {
  useState,
  useEffect,
  type ChangeEvent,
  useRef,
  type MutableRefObject,
} from "react";
import { Modal } from "../components/shared/Modal";
import { PlacesAutoCompleteComponent } from "~/components/shared/PlacesAutoCompleteComponent";
import { api } from "~/utils/api";
import { type Rider } from "~/shared/types/riders";
import { type RideRequest, type RideQuote } from "~/shared/types/rides";
import {
  type PositionComplete,
  type PositionAbrev,
  type GeocodeResponse,
} from "~/shared/types/map";
import realtimeManager from "~/shared/realtimeManager";
import { center, googleMapsApiKey } from "~/shared/constants";
import { type Driver } from "~/shared/types/drivers";
import RiderForm from "~/components/rider/RiderForm";
import MapComponent from "~/components/shared/MapComponent";
import LoadingSpinner from "~/components/shared/LoadingSpinner";
import RideModal from "~/components/rider/RideModal";

const RiderPage: React.FC = () => {
  const [rider, setRider] = useState<Rider>();
  const [showGenericModal, setShowGenericModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [driver, setDriver] = useState<Driver>();
  const [rideRequest, setRideRequest] = useState<RideRequest>();
  const [riderName, setRiderName] = useState<string>("");
  const [riderEmail, setRiderEmail] = useState<string>("");
  const [isNameSubmitted, setIsNameSubmitted] = useState<boolean>(false);
  const [location, setLocation] = useState<PositionComplete>();
  const [scriptLoaded, setScriptLoaded] = useState<boolean>(false);
  const [loadingLocation, setLoadingLocation] = useState<boolean>(false);
  const [isLoadingRideRequest, setIsLoadingRideRequest] = useState(false);
  const [rideQuote, setRideQuote] = useState<RideQuote>();
  const [dropoffPosition, setDropoffPosition] = useState<PositionAbrev | null>(
    null,
  );
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isRideRequestEnabled, setIsRideRequestEnabled] =
    useState<boolean>(false);
  const [markerPosition, setMarkerPosition] = useState<PositionAbrev>({
    lat: center.lat,
    lng: center.lng,
  });
  const [userAddress, setUserAddress] = useState<string>("");
  const [dropoffAddress, setDropoffAddress] = useState<string>("");
  const signUpMutation = api.riders.signUp.useMutation();
  const rideRequestMutation = api.rides.requestRide.useMutation();
  const rideQuoteMutation = api.rides.getRideQuote.useMutation();
  const cancelRideMutation = api.rides.cancelRide.useMutation();
  const driverDetailsMutation = api.drivers.getDriverById.useMutation();

  const mapRef: MutableRefObject<google.maps.Map | null> = useRef(null);

  const handleMapLoad = (mapInstance: google.maps.Map) => {
    if (mapInstance) {
      mapRef.current = mapInstance;
      setScriptLoaded(true);
    }
  };

  useEffect(() => {
    if (userAddress && dropoffAddress) {
      if (mapRef.current) mapRef.current.setZoom(15);
      setIsRideRequestEnabled(true);
    }
  }, [userAddress, dropoffAddress]);

  const fetchAddress = (lat: number, lng: number) => {
    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${googleMapsApiKey}`,
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json() as Promise<GeocodeResponse>;
      })
      .then((data) => {
        setLoadingLocation(false);
        if (data.status === "OK" && data.results && data.results.length > 0) {
          const result = data.results[0];
          if (result?.formatted_address) {
            setUserAddress(result.formatted_address);
          }
        }
      })
      .catch((error) => {
        console.error("There was a problem fetching the user address:", error);
      });
  };

  useEffect(() => {
    if (isNameSubmitted) {
      setLoadingLocation(true);
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setLocation({ latitude, longitude });
            setMarkerPosition({ lat: latitude, lng: longitude });
            fetchAddress(latitude, longitude);
          },
          () => {
            setMarkerPosition(center);
            fetchAddress(center.lat, center.lng);
            setLocation({ latitude: center.lat, longitude: center.lng });
          },
        );
      } else {
        setMarkerPosition(center);
      }
    }
  }, [isNameSubmitted]);

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRiderName(e.target.value);
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRiderEmail(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (riderName.trim()) {
      try {
        const rider: Rider = await signUpMutation.mutateAsync({
          name: riderName,
          email: riderEmail,
        });
        setRider(rider);
        setIsNameSubmitted(true);
      } catch (error) {
        console.error("Error signing up:", error);
      }
    }
  };

  const handleConfirmClick = async () => {
    if (!dropoffPosition || !rider) {
      return;
    }
    setIsLoadingRideRequest(true);
    try {
      const rideRequest: RideRequest = await rideRequestMutation.mutateAsync({
        riderId: rider.id,
        startLocation: JSON.stringify({
          lat: markerPosition.lat,
          lng: markerPosition.lng,
          address: userAddress,
        }),
        endLocation: JSON.stringify({
          lat: dropoffPosition.lat,
          lng: dropoffPosition.lng,
          address: dropoffAddress,
        }),
      });
      setRideRequest(rideRequest);
      setIsLoadingRideRequest(false);
      subscribeToRideChanges(rideRequest.id);
    } catch (error) {
      console.error("Failed to request ride", error);
    }
  };

  const requestRideQuote = async () => {
    if (!dropoffPosition || !rider) {
      return;
    }
    try {
      const quote: RideQuote = await rideQuoteMutation.mutateAsync({
        riderId: rider.id,
        startLocation: JSON.stringify({
          lat: markerPosition.lat,
          lng: markerPosition.lng,
          address: userAddress,
        }),
        endLocation: JSON.stringify({
          lat: dropoffPosition.lat,
          lng: dropoffPosition.lng,
          address: dropoffAddress,
        }),
      });
      setShowModal(true);
      setRideQuote(quote);
    } catch (error) {
      console.error("Failed to fetch ride quote:", error);
    }
  };

  const handleCancelRide = async () => {
    if (!rideRequest) {
      return;
    }
    try {
      await cancelRideMutation.mutateAsync({
        rideId: rideRequest.id,
      });
      setShowModal(false);
    } catch (error) {
      console.error("Failed to fetch ride quote:", error);
    }
  };

  const subscribeToRideChanges = (rideId: number) => {
    realtimeManager.subscribeToRide(rideId, (payload) => {
      const rideStatus = payload?.new?.status;
      setRideRequest(payload?.new);

      if (payload?.new.driver_id) {
        getDriverDetails(payload?.new.driver_id);
      }

      if (rideStatus === "cancelled") {
        realtimeManager
          .unsubscribeFromRide(rideId)
          .then(() => {})
          .catch(() => {});
        handleRideCancelled();
      }
    });
  };

  const handleRideCancelled = () => {
    setModalMessage("The ride was cancelled.");
    setShowGenericModal(true);
    setShowModal(false);
    setRideRequest({});
  };

  const getDriverDetails = (driverId: number) => {
    driverDetailsMutation
      .mutateAsync(driverId)
      .then((driver) => {
        if (driver) {
          setDriver(driver);
        }
      })
      .catch((error) => {
        console.error("Failed Fetching Driver:", error);
      });
  };

  const resetMapAndAddresses = () => {
    setDropoffAddress("");
    setDropoffPosition(null);
  };

  const closeGenericModal = () => {
    setShowGenericModal(false);
  };

  return (
    <>
      {showGenericModal && (
        <Modal message={modalMessage} onClose={closeGenericModal} />
      )}
      {!isNameSubmitted ? (
        <RiderForm
          riderName={riderName}
          riderEmail={riderEmail}
          handleNameChange={handleNameChange}
          handleEmailChange={handleEmailChange}
          handleNameSubmit={handleSubmit}
        />
      ) : (
        <div className="h-screen w-screen">
          <div className="flex justify-between bg-blue-500 p-4 text-white">
            <h1 className="text-xl">Welcome, {riderName}</h1>
            <button>Sign Out</button>
          </div>
          <div className="relative h-[calc(100vh-50px)] w-full bg-gray-300">
            <MapComponent
              markerPosition={markerPosition}
              dropoffPosition={dropoffPosition}
              location={location}
              handleMapLoad={handleMapLoad}
            />
            <div className="absolute left-4 right-4 top-4">
              {scriptLoaded && !loadingLocation && markerPosition && (
                <PlacesAutoCompleteComponent
                  defaultValue={userAddress}
                  dropoffAddress={dropoffAddress}
                  setNewMarkerPosition={setMarkerPosition}
                  setNewUserAddress={setUserAddress}
                  userLocation={markerPosition}
                  setNewDropoffPosition={setDropoffPosition}
                  setDropoffAddress={setDropoffAddress}
                />
              )}
            </div>
            <button
              disabled={!isRideRequestEnabled}
              onClick={requestRideQuote}
              className={`absolute bottom-4 left-1/2 w-64 -translate-x-1/2 transform rounded-md p-4 font-bold text-white shadow-lg ${
                !isRideRequestEnabled
                  ? "cursor-not-allowed bg-blue-500 opacity-50"
                  : "bg-blue-500"
              }`}
            >
              Request Ride
            </button>
          </div>
        </div>
      )}
      <LoadingSpinner isVisible={loadingLocation} />

      <RideModal
        handleShowModal={() => {
          setShowModal(!showModal);
        }}
        showModal={showModal}
        rideRequest={rideRequest}
        rideQuote={rideQuote}
        isLoadingRideRequest={isLoadingRideRequest}
        driver={driver}
        handleConfirmClick={handleConfirmClick}
        handleCancelRide={handleCancelRide}
        resetMapAndAddresses={resetMapAndAddresses}
      />
    </>
  );
};

export default RiderPage;
