import { useState } from 'react';

export function useDateState(startDay: Date) {
  const [selectedMonth, setSelectedMonth] = useState(startDay.getMonth());
  const [selectedDay, setSelectedDay] = useState(startDay.getDate());


  function sync(date: Date) {
    setSelectedMonth(date.getMonth());
    setSelectedDay(date.getDate());
  }

  function setMonth(month: number) {
    setSelectedMonth(month);
  }

  function setDay(day: number) {
    setSelectedDay(day);
  }

  return {
    selectedMonth,
    selectedDay,
    setMonth,
    setDay,
    sync,
  };
}
