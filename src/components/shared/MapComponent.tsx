import React from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  Polyline,
} from "@react-google-maps/api";
import { type PositionAbrev, type PositionComplete } from "~/shared/types/map";
import {
  containerStyle,
  mapOptions,
  googleMapsApiKey,
} from "~/shared/constants";

interface MapComponentProps {
  markerPosition: PositionAbrev;
  dropoffPosition?: PositionAbrev | null;
  location?: PositionComplete;
  handleMapLoad: (mapInstance: google.maps.Map) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({
  markerPosition,
  dropoffPosition,
  location,
  handleMapLoad,
}) => {
  return (
    <>
      {googleMapsApiKey && (
        <LoadScript googleMapsApiKey={googleMapsApiKey} libraries={["places"]}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={markerPosition}
            zoom={18}
            options={mapOptions}
            onLoad={handleMapLoad}
          >
            {location && (
              <>
                <Marker
                  icon={{
                    url: "/pin.png",
                    scaledSize: new window.google.maps.Size(60, 60),
                  }}
                  position={{
                    lat: markerPosition.lat,
                    lng: markerPosition.lng,
                  }}
                />
                {dropoffPosition && (
                  <Marker
                    icon={{
                      url: "/pin.png",
                      scaledSize: new window.google.maps.Size(60, 60),
                    }}
                    position={{
                      lat: dropoffPosition.lat,
                      lng: dropoffPosition.lng,
                    }}
                  />
                )}
                {location && dropoffPosition && (
                  <Polyline
                    path={[
                      {
                        lat: markerPosition.lat,
                        lng: markerPosition.lng,
                      },
                      {
                        lat: dropoffPosition.lat,
                        lng: dropoffPosition.lng,
                      },
                    ]}
                    options={{ strokeColor: "#3c82f6" }}
                  />
                )}
              </>
            )}
          </GoogleMap>
        </LoadScript>
      )}
    </>
  );
};

export default MapComponent;
