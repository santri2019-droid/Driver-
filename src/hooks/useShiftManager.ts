import React, { useState, useEffect } from "react";
import { DriverLog } from "../types";

export function useShiftManager(
  isShiftActive: boolean,
  setIsShiftActive: (active: boolean) => void,
  setShiftSeconds: (val: number | ((prev: number) => number)) => void,
  setLogs: (logs: DriverLog[] | ((prev: DriverLog[]) => DriverLog[])) => void
) {
  const [startOdometer, setStartOdometer] = useState<string>(() => {
    return localStorage.getItem("dc_startOdometer") || localStorage.getItem("dc_lastEndOdometer") || "";
  });
  const [endOdometer, setEndOdometer] = useState<string>("");
  const [isConfirmingEnd, setIsConfirmingEnd] = useState<boolean>(false);
  const [swipeProgress, setSwipeProgress] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);

  const handleStartShift = () => {
    setIsShiftActive(true);
    if (startOdometer) {
      localStorage.setItem("dc_startOdometer", startOdometer);
    } else {
      localStorage.removeItem("dc_startOdometer");
    }
  };

  const handleSwipeStart = () => {
    setIsSwiping(true);
  };

  const handleSwipeMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isSwiping) return;
    const clientX = "touches" in e ? (e as React.TouchEvent).touches[0].clientX : (e as React.MouseEvent).clientX;
    const container = document.getElementById("swipe-container");
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const distance = clientX - rect.left - 24; // 24px is offset of thumb
    const progress = Math.max(0, Math.min(100, (distance / (rect.width - 48)) * 100));
    setSwipeProgress(progress);

    if (progress >= 90) {
      handleStartShift();
      setIsSwiping(false);
      setSwipeProgress(0);
    }
  };

  const handleSwipeEnd = () => {
    if (swipeProgress < 90) {
      setSwipeProgress(0);
      setIsSwiping(false);
    }
  };

  useEffect(() => {
    if (isSwiping) {
      window.addEventListener("mouseup", handleSwipeEnd);
      window.addEventListener("touchend", handleSwipeEnd);
    }
    return () => {
      window.removeEventListener("mouseup", handleSwipeEnd);
      window.removeEventListener("touchend", handleSwipeEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSwiping, swipeProgress]);

  const handleEndShiftClick = () => {
    setIsConfirmingEnd(true);
    setEndOdometer("");
  };

  const handleConfirmEndShift = () => {
    const startVal = parseFloat(startOdometer) || 0;
    const endVal = parseFloat(endOdometer) || 0;

    if (endOdometer && endVal < startVal) {
      if (!window.confirm("El odómetro final es menor que el inicial. ¿Deseas guardar de todas formas?")) {
        return;
      }
    }

    const calculatedKms = endOdometer ? Math.max(0, endVal - startVal) : 0;

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const dayVal = String(today.getDate()).padStart(2, "0");
    const todayStr = `${year}-${month}-${dayVal}`;

    setLogs((prevLogs) => {
      const existingLogIndex = prevLogs.findIndex(l => l.date === todayStr);
      if (existingLogIndex >= 0) {
        const updatedLogs = [...prevLogs];
        const existing = updatedLogs[existingLogIndex];
        updatedLogs[existingLogIndex] = {
          ...existing,
          kilometers: (existing.kilometers || 0) + calculatedKms,
        };
        return updatedLogs;
      } else {
        const weekdaysLabelMap = ["DOM", "LUN", "MAR", "MIE", "JUE", "VIE", "SAB"];
        const dayOfWeekKeys = ["D", "L", "M", "X", "J", "V", "S"];
        const dayOfWeek = dayOfWeekKeys[today.getDay()];
        const dayLabel = `${weekdaysLabelMap[today.getDay()]} ${today.getDate()}`;

        const newLog: DriverLog = {
          id: "log-" + todayStr,
          date: todayStr,
          dayOfWeek,
          dayLabel,
          grossIncome: 0,
          incomes: [],
          fuelExpense: 0,
          maintenanceExpense: 0,
          otherExpense: 0,
          kilometers: calculatedKms,
          netIncome: 0,
        };
        return [...prevLogs, newLog].sort((a, b) => a.date.localeCompare(b.date));
      }
    });

    if (endOdometer) {
      localStorage.setItem("dc_lastEndOdometer", endOdometer);
      setStartOdometer(endOdometer);
    }
    localStorage.removeItem("dc_startOdometer");

    setIsShiftActive(false);
    setShiftSeconds(0);
    setIsConfirmingEnd(false);
    alert(`Turno finalizado. Kilómetros recorridos registrados: ${calculatedKms} km.`);
  };

  const handleCancelEndShift = () => {
    setIsConfirmingEnd(false);
  };

  return {
    startOdometer,
    setStartOdometer,
    endOdometer,
    setEndOdometer,
    isConfirmingEnd,
    swipeProgress,
    handleSwipeStart,
    handleSwipeMove,
    handleStartShift,
    handleEndShiftClick,
    handleConfirmEndShift,
    handleCancelEndShift,
  };
}
