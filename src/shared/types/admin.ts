export type RevenueProfits = {
  revenue: string;
  profits: string;
};

export type RevenueProfitsStats = {
  days30: RevenueProfits;
  days90: RevenueProfits;
  days180: RevenueProfits;
};

export type RidesStats = {
  activeRides: number;
  finishedRides: number;
};


export type UpdateSettingsInput = {
  take_rate?: number;
  price_km?: number;
  base_price?: number;
  price_minute?: number;
};

export type UpdatedSettings = {
  id: number,
  take_rate: number;
  price_km: number;
  base_price: number;
  price_minute: number;
};

export type RideData = {
  id: string;
  created_at: string;
  status: string;
  start_location: string;
  end_location: string;
  final_price: string;
  driver_profit: string;
  finished_at: string;
  drivers: { id: number; name: string };
  riders: { id: number; name: string };
};

export type FormattedRide = {
  rideId: string;
  created_at: string;
  finished_at: string;
  driver: {
    id: string;
    name: string;
  };
  rider: {
    id: string;
    name: string;
  };
  status: string;
  pickup_address: string;
  dropoff_address: string;
  price: number;
  company_profits: number;
};

export type RideResponse = Array<FormattedRide>;