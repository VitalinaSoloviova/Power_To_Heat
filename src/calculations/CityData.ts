// estimated data about the city
// this could easily be scaled to have city data as user input

export type CityProfile = {
  households: number;
  targetInsideTemp: number;
  heatloss_coefficent_kWperK: number; // kW / per person per 1 degree celsius
};

// so far there is only one city but in a scalable version this would not be hard coded
export const city: CityProfile = {
  households: 4100,
  targetInsideTemp: 20,
  heatloss_coefficent_kWperK:  0.12 // kW / per person per 1 degree celcius
};
