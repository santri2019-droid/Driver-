import React, { useState } from "react";
import { Plus, BookOpen, Trash2, Edit3, Check, RotateCcw, AlertCircle, ShoppingBag, Coins, DollarSign, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { DriverLog, GoalsConfig } from "../types";
import { useJournalCalendar } from "../hooks/useJournalCalendar";
import { useJournalForm } from "../hooks/useJournalForm";
import { handleDownloadDailyTxt, handleDownloadMonthlyTxt, getMonthNameSpanish } from "../utils/exportUtils";

import { useAppStore } from "../store/useAppStore";

export default function JournalTab() {
  const { logs, setLogs, goals, currencySymbol } = useAppStore();
  const {
    daysList,
    selectedDayObj,
    setSelectedDayObj,
    calendarStartIndex,
    setCalendarStartIndex,
  } = useJournalCalendar();

  const {
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
  } = useJournalForm(logs, setLogs, selectedDayObj);

  const [selectedHistMonth, setSelectedHistMonth] = useState<number>(new Date().getMonth());
  const [selectedHistYear, setSelectedHistYear] = useState<number>(new Date().getFullYear());

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
      <section className="bg-brand-container/40 p-1.5 rounded-xl border border-brand-border/60 flex items-center justify-between gap-2 select-none">
        <button
          type="button"
          onClick={() => setCalendarStartIndex(prev => Math.max(0, prev - 1))}
          disabled={calendarStartIndex === 0}
          className="p-2 bg-brand-container hover:bg-brand-container-highest disabled:opacity-30 text-brand-on-surface-variant hover:text-brand-on-surface rounded-xl border border-brand-border/40 transition-colors cursor-pointer shrink-0"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex-1 grid grid-cols-3 gap-1 px-1">
          {daysList.slice(calendarStartIndex, calendarStartIndex + 3).map((day) => {
            const isSelected = selectedDayObj.dateStr === day.dateStr;
            const hasExisting = logs.some(l => l.date === day.dateStr);

            return (
              <button
                key={day.dateStr}
                onClick={() => setSelectedDayObj(day)}
                type="button"
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all cursor-pointer relative ${isSelected
                    ? "bg-brand-primary text-black font-extrabold scaling"
                    : "bg-brand-container hover:bg-brand-container-highest text-brand-on-surface-variant hover:text-brand-on-surface"
                  }`}
              >
                <span className="text-[10px] uppercase font-bold tracking-wider">{day.label}</span>
                <span className="text-base font-extrabold">{day.num}</span>

                {/* Has logged data dot badge */}
                {hasExisting && (
                  <span className={`w-1.5 h-1.5 rounded-full absolute bottom-1 ${isSelected ? "bg-black" : "bg-brand-primary"
                    }`}></span>
                )}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => setCalendarStartIndex(prev => Math.min(daysList.length - 3, prev + 1))}
          disabled={calendarStartIndex >= daysList.length - 3}
          className="p-2 bg-brand-container hover:bg-brand-container-highest disabled:opacity-30 text-brand-on-surface-variant hover:text-brand-on-surface rounded-xl border border-brand-border/40 transition-colors cursor-pointer shrink-0"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </section>

      {/* Logging Form */}
      <form onSubmit={handleSaveLogs} className="bg-brand-container border border-brand-border rounded-2xl p-5 space-y-5 shadow-lg">
        {/* Dynamic header showing existing status */}
        <div className="flex justify-between items-center border-b border-brand-border/60 pb-3">
          <span className="text-xs text-brand-on-surface-variant font-semibold">
            Modificando día: <strong className="text-brand-on-surface font-black">
              {selectedDayObj.label} {selectedDayObj.num} de {(() => {
                const d = new Date(selectedDayObj.dateStr + "T00:00:00");
                const monthNames = [
                  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
                  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
                ];
                return monthNames[d.getMonth()];
              })()}
            </strong>
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
              onClick={() => setIncomesState([...incomesState, { id: 'inc-' + Date.now(), source: 'Nueva App', amount: 0 }])}
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
              }} className="text-brand-error p-2 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>

        {/* Section: Egresos Operativos */}
        <div className="space-y-3.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-brand-error flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4" />
            Egresos Operativos Directos
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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

            {/* Kilómetros Recorridos */}
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-brand-on-surface-variant block uppercase tracking-wider">
                Kms Recorridos
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="1"
                  min="0"
                  value={kilometersStr}
                  onChange={(e) => setKilometersStr(e.target.value)}
                  placeholder="0"
                  className="w-full bg-brand-bg-darker text-brand-on-surface text-xs rounded-lg px-3 py-1.5 border border-brand-border focus:outline-none focus:border-brand-primary"
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
          <div className={`p-3 rounded-lg text-xs font-bold border ${feedbackMsg.error
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
      <section id="historical-logs-section" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-brand-border/40">
          <h3 className="text-xs font-semibold text-brand-on-surface-variant uppercase tracking-wider block">
            Registros del mes ({logs.length})
          </h3>
          {logs.length > 0 && (
            <button
              onClick={() => handleDownloadMonthlyTxt(new Date().getMonth(), new Date().getFullYear(), logs, currencySymbol)}
              className="text-xs text-brand-primary font-bold hover:underline flex items-center gap-1.5 cursor-pointer bg-brand-primary/10 border border-brand-primary/20 px-3 py-1 rounded-lg"
            >
              <Download className="w-3.5 h-3.5" />
              Descargar Resumen del Mes
            </button>
          )}
        </div>

        {logs.length === 0 ? (
          <div className="bg-brand-container/30 border border-brand-border/40 rounded-xl p-6 text-center text-xs text-brand-on-surface-variant leading-relaxed">
            Aún no has guardado registros de conducción de forma persistente. Introduce valores arriba para iniciar.
          </div>
        ) : (
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {logs.slice().reverse().map((log) => {
              const d = new Date(log.date + "T00:00:00");
              const monthName = getMonthNameSpanish(d.getMonth());

              return (
                <div
                  key={log.id}
                  className="bg-brand-container hover:bg-brand-container/95 border border-brand-border/60 p-3.5 rounded-xl flex items-center justify-between gap-3 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-brand-on-surface">{log.dayLabel} de {monthName}</span>
                      <span className="text-[9px] text-brand-on-surface-variant font-mono">{log.date}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-[10px] text-brand-on-surface-variant font-mono">
                      <span>Bruto: <strong className="text-brand-on-surface">{currencySymbol}{log.grossIncome}</strong></span>
                      <span>•</span>
                      <span>Nafta: <strong className="text-brand-error/90">{currencySymbol}{log.fuelExpense}</strong></span>
                      <span>•</span>
                      <span>Reparos: <strong className="text-brand-error/90">{currencySymbol}{log.maintenanceExpense}</strong></span>
                      <span>•</span>
                      <span>Kms: <strong className="text-brand-tertiary">{log.kilometers || 0}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="text-right mr-1">
                      <span className="text-[8px] uppercase font-bold tracking-wider text-brand-on-surface-variant block">Neto Limpio</span>
                      <span className={`text-sm font-extrabold font-mono ${log.netIncome >= 0 ? "text-brand-primary" : "text-brand-error"}`}>
                        {currencySymbol}{log.netIncome.toFixed(2)}
                      </span>
                    </div>

                    {/* Download Daily TXT Button */}
                    <button
                      onClick={() => handleDownloadDailyTxt(log, currencySymbol)}
                      type="button"
                      title="Descargar reporte .txt"
                      className="p-1.5 rounded bg-brand-primary/10 hover:bg-brand-primary/20 border border-brand-primary/10 hover:border-brand-primary text-brand-primary transition-all cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete Log Button */}
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
              );
            })}
          </div>
        )}
      </section>

      {/* Historical Month Exporter */}
      <section className="bg-brand-container border border-brand-border rounded-2xl p-5 space-y-4 shadow-lg">
        <h3 className="text-xs font-bold uppercase tracking-wider text-brand-on-surface flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-brand-primary" />
          Descargar Resumen de Meses Anteriores
        </h3>
        <p className="text-[11px] text-brand-on-surface-variant">
          Selecciona un mes y año para descargar un reporte de texto consolidado con todos los ingresos, gastos y kilómetros recorridos.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="w-full sm:w-1/3 space-y-1">
            <label className="text-[9px] font-semibold text-brand-on-surface-variant uppercase block">Mes</label>
            <select
              value={selectedHistMonth}
              onChange={e => setSelectedHistMonth(parseInt(e.target.value))}
              className="w-full bg-brand-bg border border-brand-border rounded-lg px-3 py-2 text-xs text-brand-on-surface"
            >
              <option value="0">Enero</option>
              <option value="1">Febrero</option>
              <option value="2">Marzo</option>
              <option value="3">Abril</option>
              <option value="4">Mayo</option>
              <option value="5">Junio</option>
              <option value="6">Julio</option>
              <option value="7">Agosto</option>
              <option value="8">Septiembre</option>
              <option value="9">Octubre</option>
              <option value="10">Noviembre</option>
              <option value="11">Diciembre</option>
            </select>
          </div>

          <div className="w-full sm:w-1/3 space-y-1">
            <label className="text-[9px] font-semibold text-brand-on-surface-variant uppercase block">Año</label>
            <select
              value={selectedHistYear}
              onChange={e => setSelectedHistYear(parseInt(e.target.value))}
              className="w-full bg-brand-bg border border-brand-border rounded-lg px-3 py-2 text-xs text-brand-on-surface"
            >
              <option value="2025">2025</option>
              <option value="2026">2026</option>
              <option value="2027">2027</option>
            </select>
          </div>

          <div className="w-full sm:w-1/3 flex items-end">
            <button
              onClick={() => handleDownloadMonthlyTxt(selectedHistMonth, selectedHistYear, logs, currencySymbol)}
              disabled={logs.length === 0}
              className="w-full py-2 bg-brand-primary disabled:bg-brand-primary/40 text-black font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Descargar Resumen .txt
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
