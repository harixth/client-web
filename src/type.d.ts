export type DriversResponse = {
  pickup_eta: number;
  drivers: Driver[];
};

export type Driver = {
  driver_id: string;
  location: {
    latitude: number;
    longitude: number;
    bearing: number;
  };
};
