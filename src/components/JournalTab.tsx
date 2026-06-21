import React, { useState, useEffect } from "react";
import { Plus, BookOpen, Trash2, Edit3, Check, RotateCcw, AlertCircle, ShoppingBag, Coins, DollarSign } from "lucide-react";
import { DriverLog, GoalsConfig } from "../types";

interface JournalTabProps {
  logs: DriverLog[];
  setLogs: (logs: DriverLog[] | ((prev: DriverLog[]) => DriverLog[])) => void;
  goals: GoalsConfig;
  currencySymbol: string;
}

export default function JournalTab({
  logs,
  setLogs,
  goals,
  currencySymbol,
}: JournalTabProps) {
  // Calendar row selector choices
  const initialDays = [
    { key: "L", label: "LUN", num: 12, dateStr: "2026-06-12" },
    { key: "M", label: "MAR", num: 13, dateStr: "2026-06-13" },
    { key: "X", label: "MIE", num: 14, dateStr: "2026-06-14" },
    { key: "J", label: "JUE", num: 15, dateStr: "2026-06-15" },
    { key: "V", label: "VIE", num: 16, dateStr: "2026-06-16" },
    { key: "S", label: "SAB", num: 17, dateStr: "2026-06-17" },
    { key: "D", label: "DOM", num: 18, dateStr: "2026-06-18" },
  ];

  const [selectedDayObj, setSelectedDayObj] = useState(initialDays[5]); // SAB 17 as default corresponding to today
  
  // Input fields state
  const [incomesState, setIncomesState] = useState<{ id: string; source: string; amount: number }[]>([{ id: 'inc-'+Date.now(), source: 'Uber', amount: 120 }]);
  const [fuelStr, setFuelStr] = useState("30.00");
  const [maintStr, setMaintStr] = useState("10.00");
  const [otherStr, setOtherStr] = useState("0.00");

  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; error: boolean } | null>(null);

  // Parse strings to float safely
  const grossNum = incomesState.reduce((acc, curr) => acc + curr.amount, 0);
  const fuelNum = parseFloat(fuelStr) || 0;
  const maintNum = parseFloat(maintStr) || 0;
  const otherNum = parseFloat(otherStr) || 0;
  const calculatedNet = grossNum - fuelNum - maintNum - otherNum;

  // When selected day shifts, check if a log already exists for it, and prepopulate values!
  // This turns the journal into an elegant interactive editor.
  useEffect(() => {
    const existingLog = logs.find(l => l.date === selectedDayObj.dateStr);
    if (existingLog) {
      setIncomesState(existingLog.incomes || [{ id: 'inc-'+Date.now(), source: 'Uber', amount: existingLog.grossIncome }]);
      setFuelStr(existingLog.fuelExpense.toString());
      setMaintStr(existingLog.maintenanceExpense.toString());
      setOtherStr(existingLog.otherExpense ? existingLog.otherExpense.toString() : '0');
    } else {
      // Default recommended values based on goals setup or empty fields
      setIncomesState([{ id: 'inc-'+Date.now(), source: 'Uber', amount: 0 }]);
      setFuelStr("");
      setMaintStr("");
      setOtherStr("0");
    }
    setFeedbackMsg(null);
  }, [selectedDayObj, logs, goals]);

  // Handle saving the logged values
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
      kilometers: 0,
      netIncome: calculatedNet,
    };

    setLogs((prevLogs) => {
      // Filter out any duplicate of this date
      const filtered = prevLogs.filter(l => l.date !== selectedDayObj.dateStr);
      return [...filtered, newLogItem].sort((a, b) => a.date.localeCompare(b.date));
    });

    setFeedbackMsg({ text: `✓ Registro del ${selectedDayObj.label} ${selectedDayObj.num} guardado correctamente.`, error: false });
    
    // Clear feedback automatically
    setTimeout(() => {
      setFeedbackMsg(null);
    }, 4500);
  };

  // Quick action: preload defaults
  const handlePreloadDefaults = () => {
    setIncomesState([{ id: 'inc-'+Date.now(), source: 'Uber', amount: 140 }]);
    setFuelStr("35.00");
    setMaintStr("12.00");
    setOtherStr("0");
  };

  // Delete log item
  const handleDeleteLog = (id: string) => {
    setLogs((prevLogs) => prevLogs.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Title & Introduction */}
      <section className="space-y-1.5">
        <h2 className="text-xl md:text-2xl font-black text-brand-on-surface">Carga Diaria</h2>
        <p className="text-xs text-brand-on-surface-variant">
          Registra tu actividad de conducción para mantener tus métricas presupuestarias y netas al segundo.
        </p>
      </section>

      {/* Date picker row */}
      <section className="bg-brand-container/40 p-1 rounded-xl border border-brand-border/60">
        <div className="flex justify-between md:justify-around overflow-x-auto gap-1 py-1">
          {initialDays.map((day) => {
            const isSelected = selectedDayObj.dateStr === day.dateStr;
            const hasExisting = logs.some(l => l.date === day.dateStr);
            
            return (
              <button
                key={day.dateStr}
                onClick={() => setSelectedDayObj(day)}
                type="button"
                className={`flex flex-col items-center justify-center p-2 rounded-xl min-w-[50px] transition-all cursor-pointer relative ${
                  isSelected 
                    ? "bg-brand-primary text-black font-extrabold scaling" 
                    : "bg-brand-container hover:bg-brand-container-highest text-brand-on-surface-variant hover:text-brand-on-surface"
                }`}
              >
                <span className="text-[10px] uppercase font-bold tracking-wider">{day.label}</span>
                <span className="text-base font-extrabold">{day.num}</span>

                {/* Has logged data dot badge */}
                {hasExisting && (
                  <span className={`w-1.5 h-1.5 rounded-full absolute bottom-1 ${
                    isSelected ? "bg-black" : "bg-brand-primary"
                  }`}></span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Logging Form */}
      <form onSubmit={handleSaveLogs} className="bg-brand-container border border-brand-border rounded-2xl p-5 space-y-5 shadow-lg">
        {/* Dynamic header showing existing status */}
        <div className="flex justify-between items-center border-b border-brand-border/60 pb-3">
          <span className="text-xs text-brand-on-surface-variant font-semibold">
            Modificando día: <strong className="text-brand-on-surface font-black">{selectedDayObj.label} {selectedDayObj.num} de Junio</strong>
          </span>
          <button
            onClick={handlePreloadDefaults}
            type="button"
            className="text-[10px] text-brand-primary font-bold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            Cargar valores de referencia
          </button>
        </div>

        {/* Section: Ingresos */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-on-surface flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-brand-primary" />
              Ingresos por Plataforma
            </h3>
            <button
              type="button"
              onClick={() => setIncomesState([...incomesState, { id: 'inc-'+Date.now(), source: 'Nueva App', amount: 0 }])}
              className="text-xs text-brand-primary font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              Agregar
            </button>
          </div>
          {incomesState.map((inc, i) => (
            <div key={inc.id} className="flex gap-2 items-center">
              <select
                value={inc.source}
                onChange={e => {
                  const updated = [...incomesState];
                  updated[i].source = e.target.value;
                  setIncomesState(updated);
                }}
                className="w-1/2 bg-brand-bg border border-brand-border rounded-lg px-2 py-2 text-xs text-brand-on-surface"
              >
                <option value="Uber">Uber</option>
                <option value="Didi">Didi</option>
                <option value="Cabify">Cabify</option>
                <option value="Pedidos Ya">Pedidos Ya</option>
                <option value="Rappi">Rappi</option>
                <option value="Mercado Envíos">Mercado Envíos</option>
                <option value="Nueva App">Otra</option>
              </select>
              <div className="relative w-1/2">
                <span className="absolute left-2 top-2 text-xs font-bold text-brand-primary">{currencySymbol}</span>
                <input
                  type="number"
                  value={inc.amount}
                  onChange={e => {
                    const updated = [...incomesState];
                    updated[i].amount = parseFloat(e.target.value) || 0;
                    setIncomesState(updated);
                  }}
                  className="w-full bg-brand-bg-darker text-brand-on-surface text-sm rounded-lg pl-6 pr-2 py-2 border border-brand-border focus:border-brand-primary outline-none"
                />
              </div>
              <button type="button" onClick={() => {
                const updated = [...incomesState];
                updated.splice(i, 1);
                setIncomesState(updated);
              }} className="text-brand-error p-2 cursor-pointer"><Trash2 className="w-4 h-4"/></button>
            </div>
          ))}
        </div>

        {/* Section: Egresos Operativos */}
        <div className="space-y-3.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-brand-error flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4" />
            Egresos Operativos Directos
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Gasto combustible */}
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-brand-on-surface-variant block uppercase tracking-wider">
                Combustible / Carga
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs font-bold text-brand-on-surface-variant">{currencySymbol}</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={fuelStr}
                  onChange={(e) => setFuelStr(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-brand-bg-darker text-brand-on-surface text-xs rounded-lg pl-7 pr-3 py-1.5 border border-brand-border focus:outline-none focus:border-brand-primary"
                />
              </div>
            </div>

            {/* Mantenimiento prorrateado */}
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-brand-on-surface-variant block uppercase tracking-wider">
                Mantenimiento (Día)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs font-bold text-brand-on-surface-variant">{currencySymbol}</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={maintStr}
                  onChange={(e) => setMaintStr(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-brand-bg-darker text-brand-on-surface text-xs rounded-lg pl-7 pr-3 py-1.5 border border-brand-border focus:outline-none focus:border-brand-primary"
                />
              </div>
            </div>

            {/* Otro */}
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-brand-on-surface-variant block uppercase tracking-wider">
                Otro (Día)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs font-bold text-brand-on-surface-variant">{currencySymbol}</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={otherStr}
                  onChange={(e) => setOtherStr(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-brand-bg-darker text-brand-on-surface text-xs rounded-lg pl-7 pr-3 py-1.5 border border-brand-border focus:outline-none focus:border-brand-primary"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Live Calculation display card */}
        <div className="bg-brand-container-high border border-brand-border rounded-xl p-4 flex justify-between items-center relative overflow-hidden">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-brand-on-surface-variant uppercase tracking-widest block">Margen Diario Neto</span>
            <span className="text-[11px] text-brand-primary font-medium flex items-center gap-1">
              <span>Cálculo simulado en vivo</span>
            </span>
          </div>
          <div className={`text-2xl font-extrabold ${calculatedNet >= 0 ? "text-brand-primary" : "text-brand-error"}`}>
            {currencySymbol}{calculatedNet.toFixed(2)}
          </div>
        </div>

        {/* Message feedback alert */}
        {feedbackMsg && (
          <div className={`p-3 rounded-lg text-xs font-bold border ${
            feedbackMsg.error 
              ? "bg-brand-error/10 border-brand-error/30 text-brand-error" 
              : "bg-brand-primary/10 border-brand-primary/30 text-brand-primary"
          }`}>
            {feedbackMsg.text}
          </div>
        )}

        <button
          type="submit"
          className="w-full py-3 bg-brand-primary hover:bg-brand-primary/95 text-black font-extrabold text-sm rounded-xl transition-all shadow-[0_4px_12px_rgba(78,222,163,0.2)] hover:shadow-[0_4px_16px_rgba(78,222,163,0.3)] duration-200 cursor-pointer"
        >
          Guardar Registro Diario
        </button>
      </form>

      {/* Historically Logged entries checklist */}
      <section id="historical-logs-section" className="space-y-3">
        <h3 className="text-xs font-semibold text-brand-on-surface-variant uppercase tracking-wider block">
          Registros del mes ({logs.length})
        </h3>
        
        {logs.length === 0 ? (
          <div className="bg-brand-container/30 border border-brand-border/40 rounded-xl p-6 text-center text-xs text-brand-on-surface-variant leading-relaxed">
            Aún no has guardado registros de conducción de forma persistente. Introduce valores arriba para iniciar.
          </div>
        ) : (
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {logs.slice().reverse().map((log) => (
              <div 
                key={log.id} 
                className="bg-brand-container hover:bg-brand-container/95 border border-brand-border/60 p-3.5 rounded-xl flex items-center justify-between gap-3 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-brand-on-surface">{log.dayLabel} de Junio</span>
                    <span className="text-[9px] text-brand-on-surface-variant font-mono">{log.date}</span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-[10px] text-brand-on-surface-variant font-mono">
                    <span>Bruto: <strong className="text-brand-on-surface">{currencySymbol}{log.grossIncome}</strong></span>
                    <span>•</span>
                    <span>Nafta: <strong className="text-brand-error/90">{currencySymbol}{log.fuelExpense}</strong></span>
                    <span>•</span>
                    <span>Reparos: <strong className="text-brand-error/90">{currencySymbol}{log.maintenanceExpense}</strong></span>
                    <span>•</span>
                    <span>Kms: <strong className="text-brand-tertiary">0</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[8px] uppercase font-bold tracking-wider text-brand-on-surface-variant block">Neto Limpio</span>
                    <span className={`text-sm font-extrabold font-mono ${log.netIncome >= 0 ? "text-brand-primary" : "text-brand-error"}`}>
                      {currencySymbol}{log.netIncome.toFixed(2)}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => handleDeleteLog(log.id)}
                    type="button"
                    title="Eliminar este log"
                    className="p-1.5 rounded bg-brand-error/10 hover:bg-brand-error/20 border border-brand-error/10 hover:border-brand-error text-brand-error transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
