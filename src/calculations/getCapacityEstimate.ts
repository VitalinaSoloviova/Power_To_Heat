// energy consumption estimate for three days uses historical and current data combined 
import { city } from "./CityData";
import { getEenergyDemand } from "./getEnergyDemand";




let temp: number = null;
let tempDaysOneToThree: number = (historicalAvg + currentTemp) /2;
let tempDaysThreePlus: number = historicalAvg;


export function getStorageCapacity(days: number, dates: , capacity: number) {

    function getHistoricalAvg(date: number) { // from DB and/or  https://open-meteo.com
    console.log(date);
    return 13;
    }   

function getCurrentTemp(date: number) { // from  https://open-meteo.com
    console.log(date);
    return 17;
}
 
    let estimatedCapacity: number = capacity;

    for (let i = 1; 1 <= days; i++) {
        if (i < 4) {
            temp = (getHistoricalAvg(date) + getCurrentTemp(date)) / 2)
            estimatedCapacity - getEenergyDemand(tempDaysOneToThree, city)
        }
        else {
            estimatedCapacity - getEenergyDemand(tempDaysThreePlus, city)
        }
    }
    
    return estimatedCapacity; 

}
