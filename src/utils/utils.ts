import { type PricingSettings } from "~/shared/types/rides";
import { type PositionAbrev } from "~/shared/types/map";
import { type Location } from "~/shared/types/map";

export const calculateDistance = (start: PositionAbrev, end: PositionAbrev) => {
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
  const estimatedTimeInMinutes = (distanceInKm / 5) * 15;

  const distancePrice = distanceInKm * PRICE_PER_KM;
  const timePrice = estimatedTimeInMinutes * PRICE_PER_MINUTE;

  const quotePrice = BASE_FARE + distancePrice + timePrice;

  return quotePrice;
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

  const distancePrice = distanceInKm * PRICE_PER_KM;
  const timePrice = time * PRICE_PER_MINUTE;

  const quotePrice = BASE_FARE + distancePrice + timePrice;

  return quotePrice;
};

export const calculateRideETA = (start: PositionAbrev, end: PositionAbrev) => {
  const distanceInKm = calculateDistance(start, end);

  const estimatedTimeInMinutes = (distanceInKm / 5) * 15;

  return estimatedTimeInMinutes;
};

export const parseLocation = (location: string) => {
  const parsedLocation = JSON.parse(location) as Location;
  return parsedLocation;
};
