import React, { useState, useEffect } from "react";
import { DriverLog } from "../types";

export function useJournalForm(
  logs: DriverLog[],
  setLogs: (logs: DriverLog[] | ((prev: DriverLog[]) => DriverLog[])) => void,
  selectedDayObj: any
) {
  const [incomesState, setIncomesState] = useState<{ id: string; source: string; amount: number }[]>([
    { id: "inc-" + Date.now(), source: "Uber", amount: 120 },
  ]);
  const [fuelStr, setFuelStr] = useState("30.00");
  const [maintStr, setMaintStr] = useState("10.00");
  const [otherStr, setOtherStr] = useState("0.00");
  const [kilometersStr, setKilometersStr] = useState("0");
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; error: boolean } | null>(null);

  const grossNum = incomesState.reduce((acc, curr) => acc + curr.amount, 0);
  const fuelNum = parseFloat(fuelStr) || 0;
  const maintNum = parseFloat(maintStr) || 0;
  const otherNum = parseFloat(otherStr) || 0;
  const kilometersNum = parseFloat(kilometersStr) || 0;
  const calculatedNet = grossNum - fuelNum - maintNum - otherNum;

  useEffect(() => {
    const existingLog = logs.find((l) => l.date === selectedDayObj.dateStr);
    if (existingLog) {
      setIncomesState(existingLog.incomes || [{ id: "inc-" + Date.now(), source: "Uber", amount: existingLog.grossIncome }]);
      setFuelStr(existingLog.fuelExpense.toString());
      setMaintStr(existingLog.maintenanceExpense.toString());
      setOtherStr(existingLog.otherExpense ? existingLog.otherExpense.toString() : "0");
      setKilometersStr(existingLog.kilometers ? existingLog.kilometers.toString() : "0");
    } else {
      setIncomesState([{ id: "inc-" + Date.now(), source: "Uber", amount: 0 }]);
      setFuelStr("");
      setMaintStr("");
      setOtherStr("0");
      setKilometersStr("0");
    }
    setFeedbackMsg(null);
  }, [selectedDayObj, logs]);

  const handleSaveLogs = (e: React.FormEvent) => {
    e.preventDefault();

    if (incomesState.length === 0 && !fuelStr && !maintStr) {
      setFeedbackMsg({ text: "Introduce al menos un valor de ingresos o gastos.", error: true });
      return;
    }

    const newLogItem: DriverLog = {
      id: "log-" + selectedDayObj.dateStr,
      date: selectedDayObj.dateStr,
      dayOfWeek: selectedDayObj.key,
      dayLabel: `${selectedDayObj.label} ${selectedDayObj.num}`,
      grossIncome: grossNum,
      incomes: incomesState,
      fuelExpense: fuelNum,
      maintenanceExpense: maintNum,
      otherExpense: otherNum,
      kilometers: kilometersNum,
      netIncome: calculatedNet,
    };

    setLogs((prevLogs) => {
      const filtered = prevLogs.filter((l) => l.date !== selectedDayObj.dateStr);
      return [...filtered, newLogItem].sort((a, b) => a.date.localeCompare(b.date));
    });

    setFeedbackMsg({ text: `✓ Registro del ${selectedDayObj.label} ${selectedDayObj.num} guardado correctamente.`, error: false });

    setTimeout(() => {
      setFeedbackMsg(null);
    }, 4500);
  };

  const handlePreloadDefaults = () => {
    setIncomesState([{ id: "inc-" + Date.now(), source: "Uber", amount: 140 }]);
    setFuelStr("35.00");
    setMaintStr("12.00");
    setOtherStr("0");
    setKilometersStr("110");
  };

  const handleDeleteLog = (id: string) => {
    setLogs((prevLogs) => prevLogs.filter((item) => item.id !== id));
  };

  return {
    incomesState,
    setIncomesState,
    fuelStr,
    setFuelStr,
    maintStr,
    setMaintStr,
    otherStr,
    setOtherStr,
    kilometersStr,
    setKilometersStr,
    feedbackMsg,
    calculatedNet,
    handleSaveLogs,
    handlePreloadDefaults,
    handleDeleteLog,
  };
}
