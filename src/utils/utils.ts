import { type PricingSettings } from "~/shared/types/rides";
import { PositionComplete, type PositionAbrev } from "~/shared/types/map";
import { type Location } from "~/shared/types/map";

export const calculateDistance = (
  start: PositionAbrev | null,
  end: PositionAbrev | null,
) => {
  if (!end || !start) {
    return;
  }
  const R = 6371;
  const dLat = degreesToRadians(end.lat - start.lat);
  const dLon = degreesToRadians(end.lng - start.lng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(degreesToRadians(start.lat)) *
      Math.cos(degreesToRadians(end.lat)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
};

export const calculateDistanceOfRide = (
  start: PositionAbrev | null,
  end: PositionComplete | null,
) => {
  if (!end || !start) {
    return;
  }

  const parsedEnd = JSON.parse(end);
  const parsedStart = JSON.parse(start);

  const R = 6371;
  const dLat = degreesToRadians(parsedEnd.latitude - parsedStart.lat);
  const dLon = degreesToRadians(parsedEnd.longitude - parsedStart.lng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(degreesToRadians(parsedStart.lat)) *
      Math.cos(degreesToRadians(parsedEnd.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
};

const degreesToRadians = (degrees: number) => {
  return degrees * (Math.PI / 180);
};

export const calculateRidePrice = (
  start: PositionAbrev,
  end: PositionAbrev,
  pricingSettings: PricingSettings,
) => {
  const distanceInKm = calculateDistance(start, end);

  const BASE_FARE = pricingSettings.base_price;
  const PRICE_PER_KM = pricingSettings.price_km;
  const PRICE_PER_MINUTE = pricingSettings.price_minute;

  // For demonstration, let's assume every ride takes 15 minutes per 5 km as a hypothetical average time, we should integrate google in the future.
  if (distanceInKm) {
    const estimatedTimeInMinutes = (distanceInKm / 5) * 15;

    const distancePrice = distanceInKm * PRICE_PER_KM;
    const timePrice = estimatedTimeInMinutes * PRICE_PER_MINUTE;

    const quotePrice = BASE_FARE + distancePrice + timePrice;

    return quotePrice;
  }
  return 0;
};

export const calculateFinalRidePrice = (
  start: PositionAbrev,
  end: PositionAbrev,
  pricingSettings: PricingSettings,
  time: number,
) => {
  const distanceInKm = calculateDistance(start, end);

  const BASE_FARE = pricingSettings.base_price;
  const PRICE_PER_KM = pricingSettings.price_km;
  const PRICE_PER_MINUTE = pricingSettings.price_minute;

  if (distanceInKm) {
    const distancePrice = distanceInKm * PRICE_PER_KM;
    const timePrice = time * PRICE_PER_MINUTE;

    const quotePrice = BASE_FARE + distancePrice + timePrice;

    return quotePrice;
  }
  return 0;
};

export const calculateRideETA = (start: PositionAbrev, end: PositionAbrev) => {
  const distanceInKm = calculateDistance(start, end);

  if (distanceInKm) {
    const estimatedTimeInMinutes = (distanceInKm / 5) * 15;

    return estimatedTimeInMinutes;
  }
  return 0;
};

export const parseLocation = (location: string | null | undefined) => {
  if (!location) {
    return;
  }
  const parsedLocation = JSON.parse(location) as Location;
  return parsedLocation;
};
