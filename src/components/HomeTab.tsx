import React, { useState, useEffect } from "react";
import { Timer, ArrowRight, Play, Square, Calendar, Flag, Settings2, HelpCircle, Car, TrendingUp, ChevronRight, CheckCircle2, User, Moon, Sun, Trash2, LogIn, ChevronDown, ChevronUp } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { DriverLog, GoalsConfig } from "../types";
import { useConfig } from "../contexts/ConfigContext";
import { useAuth } from "../hooks/useAuth";
import { useShiftManager } from "../hooks/useShiftManager";

import { useAppStore } from "../store/useAppStore";

export default function HomeTab() {
  const {
    logs,
    setLogs,
    goals,
    currencySymbol,
    isShiftActive,
    setIsShiftActive,
    shiftSeconds,
    setShiftSeconds,
    resetAllData: onResetAllData,
    isDarkMode,
    setIsDarkMode,
  } = useAppStore();
  const { t, ts } = useConfig();
  const [showFormulaTooltip, setShowFormulaTooltip] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const {
    email,
    setEmail,
    password,
    setPassword,
    user,
    isRegisterMode,
    setIsRegisterMode,
    authError,
    handleLogin,
    handleForgotPassword,
    handleLogout,
  } = useAuth();

  const {
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
  } = useShiftManager(isShiftActive, setIsShiftActive, setShiftSeconds, setLogs);

  const handleReset = () => {
    if (window.confirm("¿Estás seguro de que deseas borrar toda tu información? Esto no se puede deshacer.")) {
      onResetAllData();
      if (user) handleLogout();
      alert("Información reseteada.");
    }
  };

  // Formatting helper for duration
  const formatDuration = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Calculations derived from current logs + configurations
  const currentLogsGrossSum = logs.reduce((sum, log) => sum + log.grossIncome, 0);
  const scale = currentLogsGrossSum < 5000 ? 1000 : 1;

  const baselineNet = 2410 * scale; // represent accumulated before this week
  const currentLogsNetSum = logs.reduce((sum, log) => sum + log.netIncome, 0) * scale;
  const totalMonthlyNet = baselineNet + currentLogsNetSum;

  const currentLogsFuelSum = logs.reduce((sum, log) => sum + log.fuelExpense, 0);
  const currentLogsMaintSum = logs.reduce((sum, log) => sum + log.maintenanceExpense + (log.otherExpense || 0), 0);

  const currentLogsFuelSumScaled = currentLogsFuelSum * scale;
  const currentLogsMaintSumScaled = currentLogsMaintSum * scale;

  // Simulated calculations for Daily Meta
  const estimatedMonthlyLifeExpense = 1500 * scale;
  const maintenanceProratedMonthly = ((goals.oilCost || 0) * 1.5) + ((goals.tiresCost || 0) / 12); // simulated monthly prorated
  
  const customFixedExpensesSum = (goals.customFixedExpenses || []).reduce((sum, exp) => sum + exp.amount, 0);

  const totalGastosFijosMensuales = (goals.monthlySeguro || 0) + (goals.monthlyPatente || 0) + (goals.monthlyFuelAverage || 0) + customFixedExpensesSum;
  const totalFacturacion = currentLogsGrossSum;
  const displayedMargenNeto = totalFacturacion - totalGastosFijosMensuales;

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const kmsDelMes = logs
    .filter(log => {
      if (!log.date) return false;
      const d = new Date(log.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    })
    .reduce((sum, log) => sum + (log.kilometers || 0), 0);

  const totalMonthlyNeeds = 
    estimatedMonthlyLifeExpense + 
    goals.monthlySeguro + 
    goals.monthlyPatente + 
    maintenanceProratedMonthly + 
    goals.reserveFundMonthly +
    customFixedExpensesSum;

  const monthlyWorkingDays = goals.workingDaysPerMonth;
  const today = new Date();
  const daysLeftInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate() - today.getDate();
  const plannedRemaining = monthlyWorkingDays - logs.length;
  // Limitar a los días del mes y asegurar un mínimo de 1 para evitar divisiones por cero
  const remainingWorkingDays = Math.max(1, Math.min(plannedRemaining, daysLeftInMonth));
  const calculatedDailyMeta = (goals.monthlyGoal - totalFacturacion) / remainingWorkingDays;

  // Daily Operative Cost calculation
  const avgLogOperativeCost = logs.length > 0 
    ? (logs.reduce((sum, l) => sum + l.fuelExpense + l.maintenanceExpense + (l.otherExpense || 0), 0) / logs.length) * scale
    : 35500;

  const junGross = currentLogsGrossSum;
  const junNet = displayedMargenNeto;
  const junFuel = currentLogsFuelSumScaled;
  const junOthers = currentLogsMaintSumScaled;
  const junKms = kmsDelMes > 0 ? kmsDelMes : 5800; // fallback si no hay kms
  const junFixed = totalGastosFijosMensuales;

  const monthlyData = [
    { name: "Ene", facturacion: 320000, margenNeto: 180000, combustible: 80000, otrosGastos: 20000, kms: 4200, gastosFijos: 40000 },
    { name: "Feb", facturacion: 350000, margenNeto: 195000, combustible: 85000, otrosGastos: 25000, kms: 4500, gastosFijos: 45000 },
    { name: "Mar", facturacion: 380000, margenNeto: 210000, combustible: 90000, otrosGastos: 28000, kms: 4800, gastosFijos: 52000 },
    { name: "Abr", facturacion: 400000, margenNeto: 220000, combustible: 98000, otrosGastos: 30000, kms: 5100, gastosFijos: 52000 },
    { name: "May", facturacion: 430000, margenNeto: 245000, combustible: 105000, otrosGastos: 28000, kms: 5500, gastosFijos: 52000 },
    { name: "Jun", facturacion: junGross, margenNeto: junNet, combustible: junFuel, otrosGastos: junOthers, kms: junKms, gastosFijos: junFixed },
  ];

  const renderAreaChart = (title: string, dataKey: string, color: string, currentVal: number) => {
    const gradId = `color-${dataKey}`;
    return (
      <div className="bg-brand-container border border-brand-border rounded-2xl p-5 shadow-lg flex flex-col gap-3">
        <div className="flex justify-between items-start">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold tracking-widest text-brand-on-surface-variant block">
              {title}
            </span>
            <span className="text-xl font-extrabold text-brand-on-surface">
              {dataKey === "kms" ? "" : currencySymbol}{Math.round(currentVal).toLocaleString()}
              {dataKey === "kms" ? " Kms" : ""}
            </span>
          </div>
        </div>

        <div className="h-32 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.4}/>
                  <stop offset="95%" stopColor={color} stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#5D6D61" fontSize={9} tickLine={false} />
              <YAxis stroke="#5D6D61" fontSize={9} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#161D18', borderColor: '#263229', color: '#fff', fontSize: '11px', borderRadius: '8px' }} 
                formatter={(val: any) => [`${dataKey === "kms" ? "" : currencySymbol}${Number(val).toLocaleString()}${dataKey === "kms" ? " Kms" : ""}`, title]}
              />
              <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2.5} fillOpacity={1} fill={`url(#${gradId})`} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const toggleShiftDirectly = () => {
    if (isShiftActive) {
      handleEndShiftClick();
    } else {
      handleStartShift();
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
              <span className="text-brand-on-surface font-bold leading-tight" style={ts("home_shift_status", 18)}>
                {isShiftActive ? t("home_shift_active", "¡Estás en Turno Activo!") : t("home_start_shift", "Iniciar Día Laboral")}
              </span>
              <span className={`text-lg font-mono shrink-0 transition-colors ${isShiftActive ? "text-brand-primary font-bold" : "text-brand-on-surface-variant"}`}>
                {formatDuration(shiftSeconds)} transcurrido
              </span>
            </div>
          </div>

          <div className="flex-1 max-w-xs">
            {isConfirmingEnd ? (
              <div className="space-y-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-bold text-brand-on-surface-variant block">
                    Odómetro Final (km)
                  </label>
                  <input
                    type="number"
                    placeholder={`Inicial: ${startOdometer || "0"}`}
                    value={endOdometer}
                    onChange={(e) => setEndOdometer(e.target.value)}
                    className="w-full bg-brand-bg-darker border border-brand-border rounded-xl px-3 py-1.5 text-sm text-brand-on-surface focus:border-brand-primary outline-none"
                    autoFocus
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleConfirmEndShift}
                    className="flex-1 py-2 bg-brand-primary text-black font-bold rounded-lg text-xs cursor-pointer hover:brightness-110"
                  >
                    Confirmar
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelEndShift}
                    className="flex-1 py-2 bg-brand-container-highest border border-brand-border text-brand-on-surface-variant hover:text-brand-on-surface font-bold rounded-lg text-xs cursor-pointer"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : isShiftActive ? (
              // Stop Shift Button
              <button
                type="button"
                id="stop-shift-btn"
                onClick={handleEndShiftClick}
                className="w-full h-11 bg-brand-error/10 hover:bg-brand-error/20 text-brand-error border border-brand-error/20 font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                style={ts("home_end_shift", 18)}
              >
                <Square className="w-4 h-4 fill-brand-error" />
                {t("home_end_shift", "Finalizar Turno")}
              </button>
            ) : (
              <div className="space-y-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-bold text-brand-on-surface-variant block">
                    Odómetro Inicial (km)
                  </label>
                  <input
                    type="number"
                    placeholder="Ej: 124500"
                    value={startOdometer}
                    onChange={(e) => setStartOdometer(e.target.value)}
                    className="w-full bg-brand-bg-darker border border-brand-border rounded-xl px-3 py-1.5 text-sm text-brand-on-surface focus:border-brand-primary outline-none"
                  />
                </div>
                {/* Swipe to Start Slide Container */}
                <div
                  id="swipe-container"
                  onMouseMove={handleSwipeMove}
                  onTouchMove={handleSwipeMove}
                  onMouseDown={handleSwipeStart}
                  onTouchStart={handleSwipeStart}
                  className="relative w-full h-12 bg-brand-bg-darker/60 rounded-full border border-brand-border/60 flex items-center p-1 overflow-hidden select-none cursor-pointer"
                >
                  <div 
                    className="absolute inset-0 flex items-center justify-center pointer-events-none font-bold text-brand-on-surface-variant uppercase tracking-wider transition-opacity"
                    style={{ opacity: swipeProgress > 45 ? 0.2 : 1, ...ts("home_swipe_start", 14) }}
                  >
                    {t("home_swipe_start", "Desliza para arrancar")}
                  </div>
                  
                  <div
                    className="h-10 w-10 bg-brand-primary hover:bg-brand-primary-container rounded-full flex items-center justify-center shadow-lg transition-transform touch-none"
                    style={{ transform: `translateX(${swipeProgress * 2.2}px)` }}
                  >
                    <ChevronRight className="w-5 h-5 text-black shrink-0" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Dashboard Grid Modules (Combined with ordering classes for responsive design) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card: Facturación Diaria Necesaria (Objetivo Diario) - order-1 on mobile, md:order-3 on desktop */}
        <div id="meta-diaria-card" className="order-1 md:order-3 bg-brand-container border border-brand-border rounded-2xl p-5 flex flex-col gap-3">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-brand-primary">
                <Flag className="w-4 h-4 text-brand-primary" />
                <h3 className="font-bold tracking-tight text-brand-on-surface" style={ts("home_daily_goal", 18)}>
                  {t("home_daily_goal", "Objetivo diario")}
                </h3>
              </div>
              <p className="text-2xl font-black text-brand-on-surface">
                {currencySymbol}{calculatedDailyMeta.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </p>
            </div>
            <div className="bg-brand-container-highest/60 border border-brand-border/60 px-2.5 py-1.5 rounded-xl text-center">
              <span className="text-brand-primary font-black text-lg block leading-none">{remainingWorkingDays}</span>
              <span className="font-bold text-brand-on-surface-variant uppercase tracking-tight block mt-0.5" style={ts("home_days_left", 8)}>
                {t("home_days_left", "Días hábiles rest.")}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-brand-primary/10 text-brand-primary px-3 py-2 rounded-xl border border-brand-primary/20">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span className="font-semibold" style={ts("home_daily_req", 14)}>
              {t("home_daily_req", "Facturación diaria necesaria")}
            </span>
          </div>
        </div>

        {/* Left: Margen Neto - order-2 on mobile, md:order-1 on desktop */}
        <div id="margen-neto-real" className="order-2 md:order-1 bg-gradient-to-br from-brand-container to-brand-bg border border-brand-border border-t-2 border-t-brand-primary rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col items-center justify-center text-center gap-2">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 rounded-full blur-3xl pointer-events-none"></div>
          <span className="font-semibold text-brand-on-surface-variant uppercase tracking-widest flex items-center gap-1.5" style={ts("home_net_margin", 14)}>
            {t("home_net_margin", "Margen Neto")}
            <HelpCircle 
              className="w-3.5 h-3.5 text-brand-on-surface-variant/40 hover:text-brand-on-surface cursor-pointer"
              onClick={() => setShowFormulaTooltip(showFormulaTooltip === "verdad" ? null : "verdad")} 
            />
          </span>

          {showFormulaTooltip === "verdad" && (
            <div className="bg-brand-container-highest border border-brand-border rounded-xl p-3 text-lg text-left max-w-sm mt-1 animate-fade-in absolute z-20">
              <p className="font-bold text-brand-on-surface mb-1" style={ts("home_tooltip_net_margin", 14)}>
                {t("home_tooltip_net_margin", "Margen Neto Mensual:")}
              </p>
              <p className="text-brand-on-surface-variant leading-relaxed mb-2" style={ts("home_tooltip_formula", 12)}>
                {t("home_tooltip_formula", "Fórmula: Facturación - Gastos Fijos Mensuales. Se muestra en negativo hasta cubrir los gastos.")}
              </p>
            </div>
          )}

          <div className={`text-[38px] md:text-5xl font-extrabold tracking-tight font-sans select-all my-1 ${displayedMargenNeto < 0 ? "text-brand-error" : "text-brand-primary"}`}>
            {displayedMargenNeto < 0 ? "-" : ""}{currencySymbol}{Math.abs(displayedMargenNeto).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </div>

          {/* Nueva sección de Facturación */}
          <div className="flex flex-col items-center justify-center mt-3 pt-3 border-t border-brand-border/40 w-full relative z-10">
            <span className="font-bold text-brand-on-surface-variant uppercase tracking-widest" style={ts("home_total_billing", 10)}>
              {t("home_total_billing", "Facturación Total Mensual")}
            </span>
            <span className="text-[38px] md:text-5xl font-extrabold text-brand-primary mt-1">
              {currencySymbol}{totalFacturacion.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </span>
          </div>
        </div>

        {/* Right: Ganancia Neta Donut Chart & KMS - order-3 on mobile, md:order-2 on desktop */}
        <div id="ganancia-neta-avance" className="order-3 md:order-2 bg-brand-container border border-brand-border rounded-2xl p-4 md:p-5 shadow-xl flex items-center justify-center gap-8 md:gap-12">
          
          {/* Left: Donut Chart */}
          <div className="flex flex-col items-center justify-center gap-2">
            <span className="font-semibold text-brand-on-surface-variant uppercase tracking-widest text-center animate-pulse" style={ts("home_billing", 11)}>
              {t("home_billing", "Facturacion")}
            </span>
            <div className="relative w-16 h-16 md:w-20 md:h-20">
              <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                <path
                  className="text-brand-bg-darker stroke-current"
                  strokeWidth="4"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-brand-primary stroke-current"
                  strokeWidth="4"
                  strokeDasharray={`${Math.min(100, (totalMonthlyNet / Math.max(1, goals.monthlyGoal)) * 100)}, 100`}
                  fill="none"
                  strokeLinecap="round"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xs font-bold text-brand-on-surface">{Math.round((totalMonthlyNet / Math.max(1, goals.monthlyGoal)) * 100)}%</span>
              </div>
            </div>
            <span className="text-brand-on-surface-variant" style={ts("home_goal_label", 11)}>
              {t("home_goal_label", "Meta: ")}{currencySymbol}{goals.monthlyGoal}
            </span>
          </div>

          {/* Right: KMS Counter */}
          <div className="flex flex-col items-end gap-3">
            <div className="flex items-center gap-2">
              <div className="bg-[#0A0D0B] p-1.5 rounded border border-brand-border/40">
                <Car className="w-4 h-4 text-brand-primary" />
              </div>
              <span className="font-medium text-brand-on-surface" style={ts("home_kms_month", 12)}>
                {t("home_kms_month", "Kms mes")}
              </span>
            </div>
            <div className="bg-[#0A0D0B] border border-brand-border/40 rounded-xl px-6 py-2.5 min-w-[90px] flex items-center justify-center">
              <span className="text-3xl md:text-4xl font-extrabold text-brand-primary tracking-tighter">
                {kmsDelMes.toLocaleString()}
              </span>
            </div>
          </div>
        </div>


      </section>



      {/* Progress Bars: Budget of Monthly Expenses */}
      <section id="presupuesto-mensual" className="bg-brand-container border border-brand-border rounded-2xl p-5 space-y-4">
        <div className="space-y-0.5">
          <h3 className="font-bold text-brand-on-surface" style={ts("home_fuel_month", 18)}>
            {t("home_fuel_month", "Combustible mes")}
          </h3>
        </div>

        <div className="space-y-4 pt-1">
          {/* Progress Item 1: Combustible Presupuestado */}
          <div>
            <div className="flex justify-between items-end mb-1.5">
              <span className="font-semibold text-brand-primary flex items-center gap-1.5 uppercase tracking-wider" style={ts("home_budget", 12)}>
                {t("home_budget", "Presupuesto")}
              </span>
              <span className="font-mono text-brand-primary text-xs">
                {currencySymbol}{(goals.monthlyFuelAverage || 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} / {currencySymbol}{(800000).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </span>
            </div>
            
            <div className="h-2.5 w-full bg-brand-primary/10 rounded-full overflow-hidden p-[2px] border border-brand-primary/15">
              <div 
                className="h-full bg-brand-primary rounded-full transition-all duration-700" 
                style={{ width: `${Math.min(100, ((goals.monthlyFuelAverage || 0) / 800000) * 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Progress Item 2: Combustible Consumido (Diario) */}
          <div className="pt-2">
            <div className="flex justify-between items-end mb-1.5">
              <span className="font-semibold text-white flex items-center gap-1.5 uppercase tracking-wider" style={ts("home_spent", 12)}>
                {t("home_spent", "Gastado")}
              </span>
              <span className="font-mono text-white text-xs">
                {currencySymbol}{currentLogsFuelSumScaled.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} / {currencySymbol}{(800000).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </span>
            </div>
            
            <div className="h-2.5 w-full bg-white/10 rounded-full overflow-hidden p-[2px] border border-white/15">
              <div 
                className="h-full bg-white rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(255,255,255,0.6)]" 
                style={{ width: `${Math.min(100, (currentLogsFuelSumScaled / 800000) * 100)}%` }}
              ></div>
            </div>
          </div>




        </div>
      </section>

      {/* HISTÓRICO Y AJUSTES */}
      <section className="pt-6 border-t border-brand-border/40 mt-6 space-y-6">
        <button 
          onClick={() => setShowHistory(!showHistory)}
          className="w-full bg-brand-container border border-brand-border rounded-xl p-4 flex items-center justify-between shadow-sm hover:bg-brand-container-highest/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-brand-primary" />
            <span className="font-bold text-brand-on-surface" style={ts("home_view_history", 16)}>
              {t("home_view_history", "Ver Histórico de Métricas")}
            </span>
          </div>
          {showHistory ? <ChevronUp className="w-5 h-5 text-brand-on-surface-variant" /> : <ChevronDown className="w-5 h-5 text-brand-on-surface-variant" />}
        </button>

        {showHistory && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
            {renderAreaChart("Margen Neto mes", "margenNeto", "#0AE182", junNet)}
            {renderAreaChart("Facturación mes", "facturacion", "#00E676", junGross)}
            {renderAreaChart("Combustible mes", "combustible", "#FFB95F", junFuel)}
            {renderAreaChart("Otros gastos", "otrosGastos", "#FF8A80", junOthers)}
            {renderAreaChart("Kms mes", "kms", "#1890FF", junKms)}
            {renderAreaChart("Gastos Fijos mes", "gastosFijos", "#B9C7E0", junFixed)}
          </div>
        )}

        {/* AJUSTES */}
        <div className="space-y-4 pt-4">
          <h2 className="font-black text-brand-on-surface" style={ts("home_settings_title", 24)}>
            {t("home_settings_title", "Ajustes")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Auth Module */}
            <section className="bg-brand-container border border-brand-border rounded-2xl p-5 shadow-lg space-y-4">
              <div className="flex items-center gap-2 border-b border-brand-border/40 pb-2">
                <User className="w-5 h-5 text-brand-primary" />
                <h3 className="font-bold text-brand-on-surface" style={ts("home_stats_title", 14)}>
                  {t("home_stats_title", "Cuenta y Sincronización")}
                </h3>
              </div>
              
              {user ? (
                <div className="bg-brand-primary/10 text-brand-primary p-3 rounded-xl font-semibold flex items-center justify-between">
                  <span style={ts("home_logged_in_as", 14)}>{t("home_logged_in_as", "Conectado como ")} {user.email}</span>
                  <button onClick={handleLogout} className="underline cursor-pointer" style={ts("home_logout", 12)}>
                    {t("home_logout", "Cerrar Sesión")}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleLogin} className="space-y-3">
                  {authError && <div className="text-xs text-brand-error font-bold">{authError}</div>}
                  <div className="space-y-1">
                    <label className="font-semibold text-brand-on-surface-variant uppercase" style={ts("home_email_label", 11)}>
                      {t("home_email_label", "Correo Electrónico")}
                    </label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-brand-bg border border-brand-border rounded-lg px-3 py-2 text-sm text-brand-on-surface focus:border-brand-primary outline-none" required />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-brand-on-surface-variant uppercase" style={ts("home_password_label", 11)}>
                      {t("home_password_label", "Contraseña")}
                    </label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-brand-bg border border-brand-border rounded-lg px-3 py-2 text-sm text-brand-on-surface focus:border-brand-primary outline-none" required />
                  </div>
                  {!isRegisterMode && (
                    <div className="text-right pt-0.5">
                      <button
                        type="button"
                        onClick={handleForgotPassword}
                        className="text-xs text-brand-primary hover:underline cursor-pointer"
                      >
                        ¿Olvidaste tu contraseña?
                      </button>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-2">
                    <button 
                      type="button" 
                      onClick={() => setIsRegisterMode(!isRegisterMode)}
                      className="text-brand-primary hover:underline"
                      style={ts("home_already_have_account", 12)}
                    >
                      {isRegisterMode ? t("home_already_have_account", "¿Ya tienes cuenta? Inicia Sesión") : t("home_no_account", "¿No tienes cuenta? Regístrate")}
                    </button>
                    <button type="submit" className="bg-brand-primary text-black font-bold px-4 py-2 rounded-lg flex items-center gap-2 hover:brightness-110" style={ts("home_login", 14)}>
                      <LogIn className="w-4 h-4" /> {isRegisterMode ? t("home_create_account", "Crear Cuenta") : t("home_login", "Iniciar Sesión")}
                    </button>
                  </div>
                </form>
              )}
            </section>

            <div className="space-y-4">
              {/* Appearance Module */}
              <section className="bg-brand-container border border-brand-border rounded-2xl p-5 shadow-lg space-y-4 flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="font-bold text-brand-on-surface flex items-center gap-2" style={ts("home_visual_mode", 14)}>
                    {isDarkMode ? <Moon className="w-4 h-4 text-brand-primary"/> : <Sun className="w-4 h-4 text-brand-primary"/>}
                    {t("home_visual_mode", "Modo Visual")}
                  </h3>
                  <p className="text-brand-on-surface-variant" style={ts("home_visual_mode_desc", 12)}>
                    {t("home_visual_mode_desc", "Alternar entre modo Noche y Día")}
                  </p>
                </div>
                <button 
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className={`w-12 h-6 rounded-full relative transition-colors ${isDarkMode ? 'bg-brand-primary' : 'bg-brand-border'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${isDarkMode ? 'translate-x-7' : 'translate-x-1'}`}></div>
                </button>
              </section>

              {/* Danger Zone */}
              <section className="bg-brand-error/5 border border-brand-error/20 rounded-2xl p-5 shadow-lg space-y-4">
                <div className="space-y-1">
                  <h3 className="font-bold text-brand-error flex items-center gap-2" style={ts("home_danger_zone", 14)}>
                    <Trash2 className="w-4 h-4" />
                    {t("home_danger_zone", "Zona de Peligro")}
                  </h3>
                  <p className="text-brand-on-surface-variant" style={ts("home_danger_zone_desc", 12)}>
                    {t("home_danger_zone_desc", "Borra toda tu información registrada y vuelve a cero.")}
                  </p>
                </div>
                <button 
                  onClick={handleReset} 
                  className="w-full bg-brand-error/10 text-brand-error border border-brand-error/30 hover:bg-brand-error/20 hover:border-brand-error font-bold py-3 rounded-xl transition-all"
                  style={ts("home_reset_info", 14)}
                >
                  {t("home_reset_info", "Resetear Información")}
                </button>
              </section>
            </div>
          </div>
        </div>

      </section>
    </div>
  );
}
