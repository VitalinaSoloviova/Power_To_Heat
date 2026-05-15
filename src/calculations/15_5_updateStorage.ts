const households: number = 4090;
const heat_loss_coefficient: number = 0.1265; // kW/K per household
const tempIn: number = 20; // target inside temp

export function updateStorage(
  currentCapacity_kWh: number,
  tempOut: number,
  dt: number, // hours **
): number {
  const updatedCapacity_kWh =
    currentCapacity_kWh - households * heat_loss_coefficient * (tempIn - tempOut) * dt;
  return updatedCapacity_kWh;
}

// ** for hourly capacity update dt = 1,  for daily average energy demand: tempOut = averageTemp, dt = 24
// if the 24h / daily functionality is not deeded dt can be omitted from params and function
