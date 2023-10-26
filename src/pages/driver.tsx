import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { Modal } from "../components/shared/Modal";
import { api } from "~/utils/api";
import { type Driver, type DriverFormData } from "~/shared/types/drivers";
import { type PositionComplete } from "~/shared/types/map";
import realtimeManager from "~/shared/realtimeManager";
import { type RideRequest } from "~/shared/types/rides";
import DriverRegistrationForm from "~/components/driver/DriverRegisterForm";
import TabNavigation from "~/components/driver/Navigation";
import LocationRequest from "~/components/shared/LocationRequest";
import DriverHeader from "~/components/driver/DriverHeader";
import CompletedRides from "~/components/driver/CompletedRides";
import AvailableRides from "~/components/driver/AvailableRides";
import Onboarding from "~/components/driver/onboarding/Onboarding";

const DriverPage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [driver, setDriver] = useState<Driver>();
  const [isRegistered, setIsRegistered] = useState(false);
  const [totalProfit, setTotalProfit] = useState<string>();
  const [, setCurrentPosition] = useState<PositionComplete | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [availableRide, setAvailableRide] = useState<RideRequest | null>();
  const [acceptedRide, setAcceptedRide] = useState<RideRequest | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [locationGranted, setLocationGranted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formData, setFormData] = useState<DriverFormData>({
    name: "",
    plate: "",
    carModel: "",
    email: "",
  });
  const [currentTab, setCurrentTab] = useState<"available" | "completed">(
    "available",
  );
  const [completedRides, setCompletedRides] = useState<RideRequest[]>([]);
  const driverSignupMutation = api.drivers.createDriver.useMutation();
  const driverUpdateLocationMutation =
    api.drivers.updateDriverLocation.useMutation();
  const driverUpdateStatusMutation =
    api.drivers.updateDriverStatus.useMutation();
  const acceptRideMutation = api.rides.acceptRide.useMutation();
  const changeRideStatusMutation = api.rides.changeRideStatus.useMutation();
  const listDriverFinishedRidesMutation =
    api.rides.getFinishedRidesByDriver.useMutation();
  const cancelRideMutation = api.rides.cancelRide.useMutation();
  const getDriverProfitsMutation = api.rides.getTotalDriverProfit.useMutation();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const driver: Driver = await driverSignupMutation.mutateAsync({
        name: formData.name,
        email: formData.email,
        plate: formData.plate,
        car_model: formData.carModel,
        current_location: null,
        status: "unavailable",
      });
      setDriver(driver);
      requestLocation(driver.id)
        .then(() => {
          setIsRegistered(true);
        })
        .catch((error) => {
          console.error("Failed to request location", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };

  const updateDriverLocation = (
    currentLocation: PositionComplete,
    driverId: number,
  ) => {
    driverUpdateLocationMutation
      .mutateAsync({
        driverId: driverId,
        currentLocation: JSON.stringify(currentLocation),
      })
      .then((data) => {
        console.log("updating location success");
      })
      .catch((e) => {
        console.error("Error updateding location", e);
      });
  };

  const fetchDriverProfits = () => {
    if (!driver) {
      return;
    }
    getDriverProfitsMutation
      .mutateAsync(driver.id)
      .then(({ totalProfit }) => {
        setTotalProfit(totalProfit);
      })
      .catch((e) => {
        console.error("Error getting profits", e);
      });
  };

  const updateDriverStatus = (status: string) => {
    if (!driver) {
      return;
    }
    driverUpdateStatusMutation
      .mutateAsync({
        driverId: driver?.id,
        status: status,
      })
      .then((data) => {
        console.log("updating status success");
      })
      .catch((e) => {
        console.error("Error updating status", e);
      });
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (isActive) {
      intervalId = setInterval(() => {
        if (driver) {
          requestLocation(driver?.id)
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            .then(() => {})
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            .catch(() => {});
        }
      }, 2000);
    } else if (intervalId) {
      clearInterval(intervalId);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isActive]);

  const requestLocation = async (driverId: number) => {
    return new Promise<void>((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const currentLocation: PositionComplete = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            updateDriverLocation(currentLocation, driverId);
            setCurrentPosition(currentLocation);
            setLocationGranted(true);
            resolve();
          },
          (error) => {
            setLocationGranted(false);
            setIsRegistered(true);
            reject(error);
          },
        );
      } else {
        setLocationGranted(false);
        setIsRegistered(true);
        reject(new Error("Geolocation is not supported by this browser."));
      }
    });
  };

  const listCompletedRides = () => {
    if (!driver) {
      return;
    }
    listDriverFinishedRidesMutation
      .mutateAsync(driver.id)
      .then((completedRides) => {
        setCompletedRides(completedRides);
      })
      .catch(() => {
        console.error("Failed Fetching Rides");
      });
  };

  const acceptRide = (ride: RideRequest) => {
    if (!driver) {
      return;
    }
    acceptRideMutation
      .mutateAsync({
        rideId: ride.id,
        driverId: driver?.id,
      })
      .then((ride) => {
        setAcceptedRide(ride);
        subscribeToRideChanges(ride.id);
      })
      .catch((error: Error) => {
        console.error("Failed Fetching Driver:", error);
      });
  };

  const subscribeToRideChanges = (rideId: number) => {
    realtimeManager.subscribeToRide(rideId, (payload) => {
      const rideStatus = payload?.new?.status;
      setAcceptedRide({
        ...payload?.new,
        rider_name: acceptedRide?.rider_name,
      });

      if (rideStatus === "cancelled") {
        realtimeManager
          .unsubscribeFromRide(rideId)
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          .then(() => {})
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          .catch(() => {});
        handleCancelRide();
      }

      if (rideStatus === "finished") {
        fetchDriverProfits();
        setAcceptedRide(null);
        const boldEarnings = `<strong>$${payload.new.driver_profit}</strong>`;
        setModalMessage(`The ride was finished. You earned ${boldEarnings}.`);
        setShowModal(true);
        setAvailableRide(null);
        realtimeManager
          .unsubscribeFromRide(rideId)
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          .then(() => {})
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          .catch(() => {});
      }
    });
  };

  const subscribeToReceiveRides = () => {
    if (!driver) {
      return;
    }
    realtimeManager.subscribeToDriverRequests(driver?.id, (payload) => {
      console.log(payload);
      if (payload.new.driver_id === driver.id) {
        setAvailableRide(payload.new);
      }
    });
  };

  const declineRide = () => {
    setAvailableRide(null);
  };

  const cancelRide = async () => {
    if (!acceptedRide) {
      return;
    }
    try {
      await cancelRideMutation.mutateAsync({
        rideId: acceptedRide.id,
      });
    } catch (error) {
      console.error("Failed to fetch ride quote:", error);
    }
  };

  const handleCancelRide = () => {
    setAcceptedRide(null);
    setModalMessage("The ride was cancelled.");
    setShowModal(true);
  };

  const changeRideStatus = (status: string) => {
    if (!acceptedRide) {
      return;
    }
    changeRideStatusMutation
      .mutateAsync({
        status,
        rideId: acceptedRide.id,
      })
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      .then(() => {})
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      .catch(() => {});
  };

  const confirmFinishRide = () => {
    if (acceptedRide) {
      changeRideStatus("finished");
    }
  };

  return (
    <>
      {showModal && <Modal message={modalMessage} onClose={closeModal} />}
      {!isRegistered ? (
        <Onboarding />
      ) : // <DriverRegistrationForm
      //   // eslint-disable-next-line @typescript-eslint/no-misused-promises
      //   handleRegister={handleRegister}
      //   handleInputChange={handleInputChange}
      //   formData={formData}
      //   isLoading={isLoading}
      // />
      !locationGranted ? (
        <LocationRequest />
      ) : (
        <div className="conainer mx-auto">
          <DriverHeader
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
            driver={driver}
            isActive={isActive}
            setIsActive={setIsActive}
            totalProfit={totalProfit}
            updateDriverStatus={updateDriverStatus}
            subscribeToReceiveRides={subscribeToReceiveRides}
          />
          <div>
            {!acceptedRide && (
              <TabNavigation
                currentTab={currentTab}
                setCurrentTab={setCurrentTab}
                listCompletedRides={listCompletedRides}
              />
            )}
            <div className="mx-auto p-4">
              {currentTab === "available" ? (
                <AvailableRides
                  isActive={isActive}
                  acceptedRide={acceptedRide}
                  availableRide={availableRide}
                  acceptRide={acceptRide}
                  declineRide={declineRide}
                  // eslint-disable-next-line @typescript-eslint/no-misused-promises
                  cancelRide={cancelRide}
                  confirmFinishRide={confirmFinishRide}
                  changeRideStatus={changeRideStatus}
                  subscribeToReceiveRides={subscribeToReceiveRides}
                />
              ) : (
                <CompletedRides completedRides={completedRides} />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DriverPage;
