import { Box } from "@mui/material";
import { useState } from "react";
import SimulationRangeToggleGroup from "./SimulationRangeToggleGroup";
import DayPicker from "./DayPicker";

const DateSimulationControlComponent = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());

  const daysInMonth = (month: number) => new Date(2024, month + 1, 0).getDate();
  const applyDate = (month: number, day: number) => {
    setSelectedMonth(month);
    setSelectedDay(day);
  };

  return (
    <Box sx={{ width: "100%", minHeight: 48, bgcolor: "#287dd8", borderRadius: 2, mt: 1, mb: 2, display: "flex", alignItems: "center", justifyContent: "center", gap: 2 }}>
      <DayPicker
        selectedMonth={selectedMonth}
        selectedDay={selectedDay}
        daysInMonth={daysInMonth}
        applyDate={applyDate}
      />
      <SimulationRangeToggleGroup range={"day"} onRangeChange={() => {}} />
    </Box>
  );
};

export default DateSimulationControlComponent;