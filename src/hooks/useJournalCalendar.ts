import { useState, useEffect, useMemo } from "react";

export const getDayOfWeekKey = (date: Date): string => {
  const day = date.getDay();
  const keys = ["D", "L", "M", "X", "J", "V", "S"];
  return keys[day];
};

export const getDayOfWeekLabel = (date: Date): string => {
  const day = date.getDay();
  const labels = ["DOM", "LUN", "MAR", "MIE", "JUE", "VIE", "SAB"];
  return labels[day];
};

export const generateLastNDays = (n: number) => {
  const list = [];
  const today = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const dayVal = String(d.getDate()).padStart(2, "0");
    const dateStr = `${year}-${month}-${dayVal}`;
    list.push({
      key: getDayOfWeekKey(d),
      label: getDayOfWeekLabel(d),
      num: d.getDate(),
      dateStr: dateStr,
    });
  }
  return list;
};

export function useJournalCalendar(initialDays: number = 30) {
  const daysList = useMemo(() => generateLastNDays(initialDays), [initialDays]);
  const [selectedDayObj, setSelectedDayObj] = useState(daysList[daysList.length - 1]);
  const [calendarStartIndex, setCalendarStartIndex] = useState<number>(daysList.length - 3);

  useEffect(() => {
    const selectedIdx = daysList.findIndex((d) => d.dateStr === selectedDayObj.dateStr);
    if (selectedIdx >= 0) {
      if (selectedIdx < calendarStartIndex || selectedIdx >= calendarStartIndex + 3) {
        const newStart = Math.max(0, Math.min(daysList.length - 3, selectedIdx - 1));
        setCalendarStartIndex(newStart);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDayObj, daysList, calendarStartIndex]);

  return {
    daysList,
    selectedDayObj,
    setSelectedDayObj,
    calendarStartIndex,
    setCalendarStartIndex,
  };
}
