import { supabase } from "~/server/supabaseClient";
import {
  type RealtimeChannel,
  type RealtimePostgresUpdatePayload,
} from "@supabase/realtime-js";
import { type RideRequest } from "./types/rides";

type Subscriber = {
  rideId: number;
  subscription: RealtimeChannel;
};

type DriverSubscriber = {
  driverId: number;
  subscription: RealtimeChannel;
};

const realtimeManager = {
  subscribers: [] as Subscriber[],
  driverSubscribers: [] as DriverSubscriber[],

  subscribeToRide: function (
    rideId: number,
    callback: (payload: RealtimePostgresUpdatePayload<RideRequest>) => void,
  ) {
    const subscription = supabase
      .channel("ride_listener")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "rides",
          filter: `id=eq.${rideId}`,
        },
        callback,
      )
      .subscribe();

    this.subscribers.push({ rideId, subscription });
  },

  unsubscribeFromRide: async function (rideId: number) {
    const subscriber = this.subscribers.find((s) => s.rideId === rideId);
    if (subscriber) {
      const subscription = subscriber.subscription;
      await subscription.unsubscribe();
      const index = this.subscribers.indexOf(subscriber);
      if (index > -1) {
        this.subscribers.splice(index, 1);
      }
    }
  },

  subscribeToDriverRequests: function (
    driverId: number,
    callback: (payload: RealtimePostgresUpdatePayload<RideRequest>) => void,
  ) {
    const subscription = supabase
      .channel(`rides_driver`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "rides",
          filter: `status=eq.requested`,
        },
        callback,
      )
      .subscribe();

    this.driverSubscribers.push({ driverId, subscription });
  },

  unsubscribeFromDriverRequests: async function (driverId: number) {
    const subscriber = this.driverSubscribers.find(
      (s) => s.driverId === driverId,
    );
    if (subscriber) {
      const subscription = subscriber.subscription;
      await subscription.unsubscribe();
      const index = this.driverSubscribers.indexOf(subscriber);
      if (index > -1) {
        this.driverSubscribers.splice(index, 1);
      }
    }
  },
};

export default realtimeManager;
