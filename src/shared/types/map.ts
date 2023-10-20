export type PositionComplete = {
  latitude: number;
  longitude: number;
};

export type PositionAbrev = {
  lat: number;
  lng: number;
};

export type Location = {
    lat: number;
    lng: number;
    address: string
  };

export type GeocodeResponse = {
  results?: google.maps.GeocoderResult[];
  status: "OK" | "ZERO_RESULTS";
};
