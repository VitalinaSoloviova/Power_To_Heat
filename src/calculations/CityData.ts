// estimated data about the city
// this could easily be scaled to have city data as user input

export type CityProfile = {
    clients: number
    targetInsideTemp: number
    energyDemandPerPerson: number // kW / per person per 1 degree celsius

}

// so far there is only one city but in a scalable version this would not be hard coded
export const city: CityProfile = {
    clients: 60000,
    targetInsideTemp: 20, 
    energyDemandPerPerson: 0.1 // kW / per person per 1 degree celcius
}






 