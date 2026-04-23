// import { UiDayData, UiDataProfile } from "./uiDataProfile"

/*
these functions are responsible for the communication with UI
- UI calls getUiDataProfile with params: periodStart, periodEnd 
- getUiDataProfile retrieves relevant data (dataBase & Calculations)
- returns weather, price and consumption estimates to UI as an UiDataProfile object which is 
    - list of UiDayData objects
- UI receives the entire period and can then choose a specific date with the slider knob and render info in widgets / graph
export const getUiDataProfile(periodStart: number, periodEnd: number) {
    *** creates UiDataprofile***
    return UiDataProfile  // (list of UiDayData objects)
}
*/