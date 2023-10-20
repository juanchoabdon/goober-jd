export const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
export const center = {
  lat: 4.624335,
  lng: -74.063644,
};
const customMapStyles = [
  {
    featureType: "transit",
    elementType: "labels.icon",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "water",
    stylers: [
      {
        color: "#a2daf2",
      },
    ],
  },
  {
    featureType: "landscape",
    stylers: [
      {
        color: "#e5f3ff",
      },
    ],
  },
  {
    featureType: "road",
    stylers: [
      {
        saturation: -70,
      },
    ],
  },
];

export const containerStyle = {
  width: "100%",
  height: "100%",
};

export const mapOptions = {
  styles: customMapStyles,
  streetViewControl: false,
  scaleControl: false,
  mapTypeControl: false,
  zoomControl: false,
  draggable: false,
  rotateControl: false,
  fullscreenControl: false,
};
