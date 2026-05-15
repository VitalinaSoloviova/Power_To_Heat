import { city } from "./CityData";
import { getEenergyDemand } from "./getEnergyDemand";

//const date: string = "Jan_1"

// replace with DB values retrieved with the param "date"
const T: number[] = Array.from({ length: 24 }, () =>
  parseFloat((Math.random() * 10 - 5).toFixed(1))
);


export function getStoragePerHour(
    /*
    date: string,                       // or string ? ISO ? 
    capacity: number // KiloWatts 
    hour: number
    */
):number {
    const temps: number[] = T;
    let capacity: number = 18 * 1000;
    const hour: number = 2;

    let temp: number = temps[hour];
    capacity -= getEenergyDemand(temp, city); 
    return capacity; 
}

export function getStoragePerDay(
    /*date: string          // or number  ? ISO ?
    capacity: number // kiloWatts    
    */
): number {
    let capacity: number = 18 * 1000;

    let temp: number = 17;      // this value should be fetched with param date
    capacity -= getEenergyDemand(temp, city); 
    return capacity; 
}
    


