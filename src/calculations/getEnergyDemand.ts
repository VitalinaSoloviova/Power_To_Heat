import { type CityProfile } from "./CityData"

// returns estimated hourly demand in kilowatts
// param: outside temperature, city (as for now city is "our" city with hardcoded values)
//NB! if outsideTemp >= targetInsideTemp -> energy demand = 0

export function getEenergyDemand(
    outsideTemp: number, 
    city: CityProfile, 
    ) {

    return Math.max(
        0,              // returns 0 if result < 0 i.e. outsideTemp > insideTemp
        city.households * 
        city.heatloss_coefficent_kWperK * 
        (city.targetInsideTemp - outsideTemp) // for MW => / 1000
    )
}

