import React, { useState, useEffect } from "react";
import { Timer, ArrowRight, Play, Square, Calendar, Flag, Settings2, HelpCircle, Car, TrendingUp, ChevronRight, CheckCircle2 } from "lucide-react";
import { DriverLog, GoalsConfig } from "../types";

interface HomeTabProps {
  logs: DriverLog[];
  goals: GoalsConfig;
  currencySymbol: string;
  isShiftActive: boolean;
  setIsShiftActive: (active: boolean) => void;
  shiftSeconds: number;
  setShiftSeconds: (val: number | ((prev: number) => number)) => void;
}

export default function HomeTab({
  logs,
  goals,
  currencySymbol,
  isShiftActive,
  setIsShiftActive,
  shiftSeconds,
  setShiftSeconds,
}: HomeTabProps) {
  const [showFormulaTooltip, setShowFormulaTooltip] = useState<string | null>(null);
  const [swipeProgress, setSwipeProgress] = useState(0); // for simulating slide-to-start drag
  const [isSwiping, setIsSwiping] = useState(false);

  // Formatting helper for duration
  const formatDuration = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Calculations derived from current logs + configurations
  const baselineNet = 2410; // represent accumulated before this week
  const currentLogsNetSum = logs.reduce((sum, log) => sum + log.netIncome, 0);
  const totalMonthlyNet = baselineNet + currentLogsNetSum;

  const currentLogsGrossSum = logs.reduce((sum, log) => sum + log.grossIncome, 0);
  const currentLogsFuelSum = logs.reduce((sum, log) => sum + log.fuelExpense, 0);
  const currentLogsMaintSum = logs.reduce((sum, log) => sum + log.maintenanceExpense, 0);
  const currentLogsReserveSum = logs.reduce((sum, log) => sum + log.reserveExpense, 0);

  // Simulated calculations for Daily Meta
  // Formula: (Gasto Vida + Seguro + Patente + Alquiler + Mantenimiento Prorrateado + Reserva) / Dias Laborables
  // Let's assume life expenses estimated at $1800, plus configuration parameters
  const estimatedMonthlyLifeExpense = 1500;
  const maintenanceProratedMonthly = (goals.oilCost * 1.5) + (goals.tiresCost / 12); // simulated monthly prorated
  
  const totalMonthlyNeeds = 
    estimatedMonthlyLifeExpense + 
    goals.monthlySeguro + 
    goals.monthlyPatente + 
    (goals.monthlyAlquiler * 26) + 
    maintenanceProratedMonthly + 
    goals.reserveFundMonthly;

  const monthlyWorkingDays = goals.workingDaysPerWeek * 4.3; // Weeks in a month
  const calculatedDailyMeta = totalMonthlyNeeds / Math.max(1, monthlyWorkingDays);

  // Daily Operative Cost calculation
  // Formula: (Combustible Diario Estimado + Prorrateo seguro/patente diario + amortización)
  // Let's take current logs average operative expenses or goals defaults
  const avgLogOperativeCost = logs.length > 0 
    ? logs.reduce((sum, l) => sum + l.fuelExpense + l.maintenanceExpense + l.reserveExpense, 0) / logs.length
    : 35.50;

  // Swipe logic simulation
  const handleSwipeStart = () => {
    setIsSwiping(true);
  };

  const handleSwipeMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isSwiping) return;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const container = document.getElementById("swipe-container");
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const distance = clientX - rect.left - 24; // 24px is offset of thumb
    const progress = Math.max(0, Math.min(100, (distance / (rect.width - 48)) * 100));
    setSwipeProgress(progress);

    if (progress >= 90) {
      setIsShiftActive(true);
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
  }, [isSwiping]);

  // Quick button trigger for starting/stopping driving shift
  const toggleShiftDirectly = () => {
    if (isShiftActive) {
      setIsShiftActive(false);
    } else {
      setIsShiftActive(true);
    }
  };

  // Chart weekdays representation
  const weekdaysLabelMap = ["L", "M", "X", "J", "V", "S", "D"];
  const chartData = weekdaysLabelMap.map((dayLabel, index) => {
    // Find log for this weekday
    const dayLog = logs.find(log => log.dayOfWeek === dayLabel);
    if (dayLog) {
      return {
        label: dayLabel,
        gross: dayLog.grossIncome,
        net: dayLog.netIncome,
        empty: false,
      };
    }
    // Default mock empty placeholders if no log for remaining days
    const mockEmptyValues = [
      { label: "L", gross: 120, net: 70 },
      { label: "M", gross: 150, net: 90 },
      { label: "X", gross: 100, net: 40 },
      { label: "J", gross: 180, net: 130 },
      { label: "V", gross: 160, net: 100 },
      { label: "S", gross: 80, net: 50 },
      { label: "D", gross: 0, net: 0 }
    ];
    return {
      ...mockEmptyValues[index],
      empty: true,
    };
  });

  return (
    <div className="space-y-6">
      {/* Shift Starter Widget */}
      <section id="shift-starter" className="bg-brand-container border border-brand-border rounded-2xl p-5 shadow-lg relative overflow-hidden transition-all duration-300">
        <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/5 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
              isShiftActive ? "bg-brand-primary text-black animate-pulse shadow-[0_0_12px_rgba(78,222,163,0.4)]" : "bg-brand-container-highest text-brand-on-surface-variant"
            }`}>
              <Timer className="w-5.5 h-5.5" />
            </div>
            
            <div className="flex flex-col">
              <span className="text-white font-bold text-sm sm:text-base leading-tight">
                {isShiftActive ? "¡Estás en Turno Activo!" : "Iniciar Día Laboral"}
              </span>
              <span className={`text-[12px] font-mono shrink-0 transition-colors ${isShiftActive ? "text-brand-primary font-bold" : "text-brand-on-surface-variant"}`}>
                {formatDuration(shiftSeconds)} transcurrido
              </span>
            </div>
          </div>

          <div className="flex-1 max-w-xs">
            {isShiftActive ? (
              // Stop Shift Button
              <button
                type="button"
                id="stop-shift-btn"
                onClick={toggleShiftDirectly}
                className="w-full h-11 bg-brand-error/10 hover:bg-brand-error/20 text-brand-error border border-brand-error/20 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Square className="w-4 h-4 fill-brand-error" />
                Finalizar Turno
              </button>
            ) : (
              // Swipe to Start Slide Container
              <div
                id="swipe-container"
                onMouseMove={handleSwipeMove}
                onTouchMove={handleSwipeMove}
                onMouseDown={handleSwipeStart}
                onTouchStart={handleSwipeStart}
                className="relative w-full h-12 bg-brand-bg-darker/60 rounded-full border border-brand-border/60 flex items-center p-1 overflow-hidden select-none cursor-pointer"
              >
                <div 
                  className="absolute inset-0 flex items-center justify-center pointer-events-none text-[10px] font-bold text-brand-on-surface-variant uppercase tracking-wider transition-opacity"
                  style={{ opacity: swipeProgress > 45 ? 0.2 : 1 }}
                >
                  Desliza para arrancar
                </div>
                
                <div
                  className="h-10 w-10 bg-brand-primary hover:bg-brand-primary-container rounded-full flex items-center justify-center shadow-lg transition-transform touch-none"
                  style={{ transform: `translateX(${swipeProgress * 2.2}px)` }}
                >
                  <ChevronRight className="w-5 h-5 text-black shrink-0" />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Métrica de la Verdad: Cumulative Monthly Net */}
      <section id="metrica-verdad" className="bg-gradient-to-br from-brand-container to-brand-bg border border-brand-border border-t-2 border-t-brand-primary rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col items-center justify-center text-center gap-2">
          <span className="font-semibold text-xs text-brand-on-surface-variant uppercase tracking-widest flex items-center gap-1.5">
            Métrica de la Verdad
            <HelpCircle 
              className="w-3.5 h-3.5 text-brand-on-surface-variant/40 hover:text-white cursor-pointer"
              onClick={() => setShowFormulaTooltip(showFormulaTooltip === "verdad" ? null : "verdad")} 
            />
          </span>

          {showFormulaTooltip === "verdad" && (
            <div className="bg-brand-container-highest border border-brand-border rounded-xl p-3 text-xs text-left max-w-sm mt-1 animate-fade-in absolute z-20">
              <p className="font-bold text-white mb-1">Margen Neto acumulado mensual:</p>
              <p className="text-brand-on-surface-variant leading-relaxed mb-2">
                Representa tu facturación limpia. Descuenta combustible gastado, reparaciones mensuales prorrateadas, seguro de auto, patente y tu fondo de reserva personal.
              </p>
              <div className="bg-brand-bg p-2 rounded font-mono text-[9px] text-brand-primary">
                Neto = Facturación Bruta - Gastos Reales - Prorrateo Fijo
              </div>
            </div>
          )}

          <div className="text-[38px] md:text-5xl font-extrabold text-brand-primary tracking-tight font-sans select-all my-1">
            {currencySymbol}{totalMonthlyNet.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>

          <div className="flex flex-wrap justify-center items-center gap-2 text-xs">
            <span className="text-brand-on-surface bg-brand-container-highest/60 border border-brand-border px-3 py-1.5 rounded-full font-medium flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-brand-primary" />
              Acumulado Neto Mensual
            </span>
            <span className="text-brand-primary bg-brand-primary/10 px-2.5 py-1 rounded-full font-bold text-[10px] flex items-center gap-1.5 border border-brand-primary/20">
              <TrendingUp className="w-3.5 h-3.5" />
              $14.50 por Hora de Trabajo
            </span>
          </div>
        </div>
      </section>

      {/* Target & Prorated Cost Formulas Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card: Facturación Diaria Necesaria */}
        <div id="meta-diaria-card" className="bg-brand-container border border-brand-border rounded-2xl p-5 flex flex-col gap-3">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-brand-secondary">
                <Flag className="w-4 h-4 text-brand-primary" />
                <h3 className="font-bold text-sm tracking-tight text-brand-on-surface">Meta Diaria Recomendada</h3>
              </div>
              <p className="text-2xl font-black text-white">
                {currencySymbol}{calculatedDailyMeta.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="bg-brand-container-highest/60 border border-brand-border/60 px-2.5 py-1.5 rounded-xl text-center">
              <span className="text-brand-primary font-black text-base block leading-none">12</span>
              <span className="text-[8px] text-brand-on-surface-variant uppercase tracking-tight block mt-0.5">Días hábiles rest.</span>
            </div>
          </div>
          
          <div className="bg-brand-bg-darker/50 p-2.5 rounded-xl border border-brand-border/40">
            <code className="text-[10px] text-brand-on-surface-val font-mono block whitespace-normal select-all">
              Fórmula: (Gasto Vida + Reserva + Auto) / Días Laborables
            </code>
          </div>
        </div>

        {/* Card: Resumen Gastos Auto Diario */}
        <div id="costo-operativo-card" className="bg-brand-container border border-brand-border rounded-2xl p-5 flex flex-col gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-brand-error">
              <Car className="w-4 h-4 text-brand-error" />
              <h3 className="font-bold text-sm tracking-tight text-brand-on-surface">Costo Operativo Diario Prorrateado</h3>
            </div>
            <p className="text-2xl font-black text-white">
              {currencySymbol}{avgLogOperativeCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-1.5 text-[10px] bg-brand-bg-darker/35 p-2 rounded-xl border border-brand-border/20">
            {[
              { label: "Combustible", checked: true },
              { label: "Mantenimiento", checked: true },
              { label: "Seguro de Auto", checked: true },
              { label: "Depreciación", checked: true },
              { label: "Patente/Fijos", checked: true },
              { label: "Otros Gastos", checked: true },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-1 text-brand-on-surface-variant font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-primary shrink-0" />
                <span className="truncate">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bar Chart: Ingreso Bruto vs Margen Neto */}
      <section id="grafico-semanal" className="bg-brand-container border border-brand-border rounded-2xl p-5 space-y-4">
        <div className="flex justify-between items-center">
          <div className="space-y-0.5">
            <h3 className="font-bold text-sm md:text-base text-white">Bruto vs Neto (Últ. 7 Días)</h3>
            <p className="text-xs text-brand-on-surface-variant">Comparación de facturación bruta contra beneficio neto diario</p>
          </div>
          <div className="bg-brand-container-highest p-2 rounded-lg text-brand-primary">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>

        {/* Custom Visual Bar Chart inside vector bounds */}
        <div className="relative h-44 flex flex-col justify-end mt-4 pt-4">
          
          {/* Y Axis Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[8px] font-mono text-brand-on-surface-variant text-left pl-1">
            <div className="border-b border-brand-border/30 w-full pb-0.5"><span>$200</span></div>
            <div className="border-b border-brand-border/30 w-full pb-0.5"><span>$100</span></div>
            <div className="border-b border-brand-border/30 w-full pb-0.5"><span>$50</span></div>
            <div className="pt-0.5"><span>$0</span></div>
          </div>

          {/* Columns container */}
          <div className="h-full flex-1 flex justify-around items-end pl-10 relative z-10 gap-2">
            {chartData.map((data, idx) => {
              // Calculate percent rates (max is 200 for calculation layout)
              const maxVal = 200;
              const grossHeight = Math.max(8, Math.min(100, (data.gross / maxVal) * 100));
              const netHeight = Math.max(4, Math.min(100, (data.net / maxVal) * 100));

              return (
                <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full group select-none">
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-[110%] bg-brand-container-highest/95 border border-brand-border text-[10px] p-2 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30 shrink-0 text-left min-w-[120px]">
                    <p className="font-bold text-white border-b border-brand-border/50 pb-0.5 mb-1">Día {data.label}</p>
                    <p className="text-brand-on-surface-variant">Bruto: <strong className="text-white">{currencySymbol}{data.gross}</strong></p>
                    <p className="text-brand-primary">Neto: <strong className="font-extrabold">{currencySymbol}{data.net}</strong></p>
                    <p className="text-[8px] text-brand-on-surface-variant/70 italic mt-0.5">
                      {data.empty ? "Preestablecido" : "Registro real"}
                    </p>
                  </div>

                  <div className="w-full max-w-[32px] flex items-end justify-center gap-1 h-full cursor-pointer">
                    {/* Gross Bar */}
                    <div 
                      className={`w-1/2 rounded-t transition-all duration-500 hover:brightness-110 ${
                        data.empty ? "bg-brand-container-highest/30 border border-brand-border/30 border-dashed" : "bg-brand-container-highest"
                      }`}
                      style={{ height: `${grossHeight}%` }}
                    ></div>

                    {/* Net Bar */}
                    <div 
                      className={`w-1/2 rounded-t transition-all duration-500 hover:brightness-110 ${
                        data.empty ? "bg-brand-primary-container/20 border border-dash border-brand-primary/20" : "bg-brand-primary"
                      }`}
                      style={{ height: `${netHeight}%` }}
                    ></div>
                  </div>

                  {/* Day Letter Label */}
                  <span className={`text-[10px] font-bold mt-2 font-mono ${data.label === "S" ? "text-brand-primary" : "text-brand-on-surface-variant"}`}>
                    {data.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-6 pt-2 border-t border-brand-border/40 text-[11px] text-brand-on-surface-variant">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded bg-brand-container-highest block"></span>
            <span>Facturación Bruta (Ingresos)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded bg-brand-primary block"></span>
            <span>Margen de Ganancia Neto</span>
          </div>
        </div>
      </section>

      {/* Progress Bars: Budget of Monthly Expenses */}
      <section id="presupuesto-mensual" className="bg-brand-container border border-brand-border rounded-2xl p-5 space-y-4">
        <div className="space-y-0.5">
          <h3 className="font-bold text-sm md:text-base text-white">Presupuesto de Gastos Acumulado</h3>
          <p className="text-xs text-brand-on-surface-variant">Mapeo del combustible y reparaciones registradas este mes frente al límite</p>
        </div>

        <div className="space-y-4 pt-1">
          {/* Progress Item 1: Combustible */}
          <div>
            <div className="flex justify-between items-end mb-1.5 text-xs">
              <span className="font-semibold text-brand-on-surface flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-brand-primary"></span>
                Combustible de Shift
              </span>
              <span className="font-mono text-brand-on-surface-variant">
                {currencySymbol}{currentLogsFuelSum} / {currencySymbol}400
              </span>
            </div>
            
            {/* Thick to thin style track */}
            <div className="h-2.5 w-full bg-brand-primary/10 rounded-full overflow-hidden p-[2px] border border-brand-primary/15">
              <div 
                className="h-full bg-brand-primary rounded-full transition-all duration-700" 
                style={{ width: `${Math.min(100, (currentLogsFuelSum / 400) * 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Progress Item 2: Mantenimiento */}
          <div>
            <div className="flex justify-between items-end mb-1.5 text-xs">
              <span className="font-semibold text-brand-on-surface flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-brand-secondary"></span>
                Mantenimientos Realizados
              </span>
              <span className="font-mono text-brand-on-surface-variant">
                {currencySymbol}{currentLogsMaintSum} / {currencySymbol}150
              </span>
            </div>
            
            <div className="h-2.5 w-full bg-brand-secondary/10 rounded-full overflow-hidden p-[2px] border border-brand-secondary/15">
              <div 
                className="h-full bg-brand-secondary rounded-full transition-all duration-700" 
                style={{ width: `${Math.min(100, (currentLogsMaintSum / 150) * 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Progress Item 3: Reserva Vehicular */}
          <div>
            <div className="flex justify-between items-end mb-1.5 text-xs">
              <span className="font-semibold text-brand-on-surface flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-brand-tertiary"></span>
                Aporte Reserva Vehicular
              </span>
              <span className="font-mono text-brand-on-surface-variant">
                {currencySymbol}{currentLogsReserveSum} / {currencySymbol}{goals.reserveFundMonthly}
              </span>
            </div>
            
            <div className="h-2.5 w-full bg-brand-tertiary/10 rounded-full overflow-hidden p-[2px] border border-brand-tertiary/15">
              <div 
                className="h-full bg-brand-tertiary rounded-full transition-all duration-700" 
                style={{ width: `${Math.min(100, (currentLogsReserveSum / goals.reserveFundMonthly) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
