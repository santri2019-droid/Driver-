import React, { useState } from "react";
import { Target, Settings, Shield, Wrench, PiggyBank, Check, RefreshCw } from "lucide-react";
import { DriverLog, GoalsConfig } from "../types";

interface GoalsTabProps {
  logs: DriverLog[];
  goals: GoalsConfig;
  setGoals: (goals: GoalsConfig) => void;
  currencySymbol: string;
}

export default function GoalsTab({
  logs,
  goals,
  setGoals,
  currencySymbol,
}: GoalsTabProps) {
  // Local form state
  const [lclGoal, setLclGoal] = useState(goals.monthlyGoal);
  const [lclDays, setLclDays] = useState(goals.workingDaysPerMonth);
  const [lclSeguro, setLclSeguro] = useState(goals.monthlySeguro);
  const [lclPatente, setLclPatente] = useState(goals.monthlyPatente);
  const [lclFuelAverage, setLclFuelAverage] = useState(goals.monthlyFuelAverage || 400);
  
  // Custom fixed expenses
  const [lclCustomExpenses, setLclCustomExpenses] = useState(goals.customFixedExpenses || []);

  // Preventative maintenance variables
  const [lclOilInterval, setLclOilInterval] = useState(goals.oilInterval);
  const [lclOilCost, setLclOilCost] = useState(goals.oilCost);
  const [lclTiresInterval, setLclTiresInterval] = useState(goals.tiresInterval);
  const [lclTiresCost, setLclTiresCost] = useState(goals.tiresCost);

  // Reserve slider state
  const [lclReserve, setLclReserve] = useState(goals.reserveFundMonthly);
  
  const [successBanner, setSuccessBanner] = useState(false);

  // Fuel spent
  const totalFuelSpent = (logs || []).reduce((sum, log) => sum + (log.fuelExpense || 0), 0);
  const remainingFuel = Number(lclFuelAverage) - totalFuelSpent;

  // Form handle submission
  const handleSubmitGoals = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedGoals: GoalsConfig = {
      monthlyGoal: Number(lclGoal) || 0,
      workingDaysPerMonth: Number(lclDays) || 24,
      monthlySeguro: Number(lclSeguro) || 0,
      monthlyPatente: Number(lclPatente) || 0,
      monthlyFuelAverage: Number(lclFuelAverage) || 0,
      customFixedExpenses: lclCustomExpenses,
      oilInterval: Number(lclOilInterval) || 10000,
      oilCost: Number(lclOilCost) || 0,
      tiresInterval: Number(lclTiresInterval) || 40000,
      tiresCost: Number(lclTiresCost) || 0,
      reserveFundMonthly: Number(lclReserve) || 0,
    };

    setGoals(updatedGoals);
    setSuccessBanner(true);
    
    setTimeout(() => {
      setSuccessBanner(false);
    }, 4000);
  };

  const handleResetDefaults = () => {
    setLclGoal(250000);
    setLclDays(24);
    setLclSeguro(35000);
    setLclPatente(15000);
    setLclFuelAverage(60000);
    setLclCustomExpenses([]);
    setLclOilInterval(10000);
    setLclOilCost(45000);
    setLclTiresInterval(40000);
    setLclTiresCost(350000);
    setLclReserve(50000);
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <section className="space-y-1.5 flex justify-between items-start gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-brand-on-surface">Metas y Configuración</h2>
          <p className="text-xs text-brand-on-surface-variant">
            Establece objetivos de rentabilidad, prorratea gastos fijos y optimiza tus fórmulas de conducción.
          </p>
        </div>
        
        <button
          onClick={handleResetDefaults}
          type="button"
          className="text-[10px] text-brand-primary-container hover:text-brand-primary font-bold border border-brand-border/80 hover:border-brand-primary/35 px-2.5 py-1.5 rounded-lg flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3 h-3" />
          Restablecer
        </button>
      </section>

      {/* Main configuration forms panel */}
      <form onSubmit={handleSubmitGoals} className="space-y-5">
        
        {/* Module Section 1: Objetivo Mensual */}
        <div className="bg-brand-container border border-brand-border rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-brand-primary border-b border-brand-border/40 pb-2">
            <Target className="w-4 h-4" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-brand-on-surface">Objetivo de trabajo</h3>
          </div>
          
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-brand-on-surface-variant block uppercase tracking-wide">
              Facturacion mes
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-xs font-bold text-brand-primary">{currencySymbol}</span>
              <input
                type="number"
                value={lclGoal}
                onChange={(e) => setLclGoal(Number(e.target.value))}
                className="w-full bg-brand-bg border border-brand-border rounded-lg pl-8 pr-4 py-2 text-sm text-brand-on-surface focus:outline-none focus:border-brand-primary"
                placeholder="Ej. 3500"
              />
            </div>
            <p className="text-[10px] text-brand-on-surface-variant/70 leading-normal">
              Esta meta se dividirá automáticamente por tus jornadas laborales mensuales para proyectar tu "Meta Diaria" recomendada.
            </p>
          </div>

          {/* Working days moved here */}
          <div className="space-y-1">
            <label className="text-[10px] font-semibold text-brand-on-surface-variant uppercase tracking-wider block">
              Días de Trabajo x mes
            </label>
            <input
              type="number"
              min="1"
              max="31"
              value={lclDays}
              onChange={(e) => setLclDays(Number(e.target.value))}
              className="w-full bg-brand-bg border border-brand-border rounded-lg px-3 py-1.5 text-xs text-brand-on-surface focus:outline-none focus:border-brand-primary"
            />
          </div>
        </div>

        {/* Module Section 2: Gastos Fijos Mensuales */}
        <div className="bg-brand-container border border-brand-border rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-brand-secondary border-b border-brand-border/40 pb-2">
            <Shield className="w-4 h-4 text-brand-primary" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-brand-on-surface">Gastos Fijos Mensuales</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Insurance Seguro */}
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-brand-on-surface-variant uppercase tracking-wider block">
                Seguro del Automóvil ({currencySymbol} / Mes)
              </label>
              <input
                type="number"
                value={lclSeguro}
                onChange={(e) => setLclSeguro(Number(e.target.value))}
                className="w-full bg-brand-bg border border-brand-border rounded-lg px-3 py-1.5 text-xs text-brand-on-surface focus:outline-none focus:border-brand-primary"
              />
            </div>

            {/* Patents/taxes */}
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-brand-on-surface-variant uppercase tracking-wider block">
                Patente / Impuestos del Auto ({currencySymbol} / Mes)
              </label>
              <input
                type="number"
                value={lclPatente}
                onChange={(e) => setLclPatente(Number(e.target.value))}
                className="w-full bg-brand-bg border border-brand-border rounded-lg px-3 py-1.5 text-xs text-brand-on-surface focus:outline-none focus:border-brand-primary"
              />
            </div>

            {/* Combustible promedio mensual */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-semibold text-brand-on-surface-variant uppercase tracking-wider block">
                  Combustible Promedio Mensual ({currencySymbol} / Mes)
                </label>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${remainingFuel < 0 ? 'bg-brand-error/10 text-brand-error' : 'bg-brand-primary/10 text-brand-primary'}`}>
                  Restan: {currencySymbol}{remainingFuel.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </span>
              </div>
              <input
                type="number"
                value={lclFuelAverage}
                onChange={(e) => setLclFuelAverage(Number(e.target.value))}
                className="w-full bg-brand-bg border border-brand-border rounded-lg px-3 py-1.5 text-xs text-brand-on-surface focus:outline-none focus:border-brand-primary"
              />
            </div>


            {/* Custom Fixed Expenses */}
            {lclCustomExpenses.map((expense, index) => (
              <div key={expense.id} className="col-span-1 sm:col-span-2 flex gap-2 items-end">
                <div className="flex-1 space-y-1">
                  <label className="text-[10px] font-semibold text-brand-on-surface-variant uppercase tracking-wider block">Nombre del Gasto</label>
                  <input
                    type="text"
                    value={expense.name}
                    onChange={(e) => {
                      const updated = [...lclCustomExpenses];
                      updated[index].name = e.target.value;
                      setLclCustomExpenses(updated);
                    }}
                    placeholder="Ej. Seguro móvil"
                    className="w-full bg-brand-bg border border-brand-border rounded-lg px-3 py-1.5 text-xs text-brand-on-surface focus:outline-none focus:border-brand-primary"
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <label className="text-[10px] font-semibold text-brand-on-surface-variant uppercase tracking-wider block">Costo ({currencySymbol})</label>
                  <input
                    type="number"
                    value={expense.amount}
                    onChange={(e) => {
                      const updated = [...lclCustomExpenses];
                      updated[index].amount = Number(e.target.value);
                      setLclCustomExpenses(updated);
                    }}
                    className="w-full bg-brand-bg border border-brand-border rounded-lg px-3 py-1.5 text-xs text-brand-on-surface focus:outline-none focus:border-brand-primary"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const updated = [...lclCustomExpenses];
                    updated.splice(index, 1);
                    setLclCustomExpenses(updated);
                  }}
                  className="h-[34px] px-3 bg-brand-error/10 text-brand-error border border-brand-error/30 rounded-lg text-xs"
                >
                  X
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              setLclCustomExpenses([
                ...lclCustomExpenses,
                { id: `expense-${Date.now()}`, name: "", amount: 0 }
              ]);
            }}
            className="text-[11px] mt-2 font-bold text-brand-primary border border-brand-primary/30 bg-brand-primary/10 px-3 py-1.5 rounded-lg w-full flex items-center justify-center gap-2"
          >
            + Agregar nuevo gasto fijo mensual
          </button>
        </div>

        {/* Module Section 3: Mantenimiento Preventivo */}
        <div className="bg-brand-container border border-brand-border rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-brand-tertiary border-b border-brand-border/40 pb-2">
            <Wrench className="w-4 h-4 text-brand-primary" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-brand-on-surface">Mantenimiento Preventivo</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Oil interval */}
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-brand-on-surface-variant uppercase tracking-wider block">
                Cambio Aceite Frecuencia (Kilómetros)
              </label>
              <input
                type="number"
                step="1000"
                value={lclOilInterval}
                onChange={(e) => setLclOilInterval(Number(e.target.value))}
                className="w-full bg-brand-bg border border-brand-border rounded-lg px-3 py-1.5 text-xs text-brand-on-surface focus:outline-none focus:border-brand-primary"
                placeholder="Ej. 10000"
              />
            </div>

            {/* Oil Cost */}
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-brand-on-surface-variant uppercase tracking-wider block">
                Costo Estimado del Aceite ({currencySymbol})
              </label>
              <input
                type="number"
                value={lclOilCost}
                onChange={(e) => setLclOilCost(Number(e.target.value))}
                className="w-full bg-brand-bg border border-brand-border rounded-lg px-3 py-1.5 text-xs text-brand-on-surface focus:outline-none focus:border-brand-primary"
              />
            </div>

            {/* Tires interval */}
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-brand-on-surface-variant uppercase tracking-wider block">
                Cambio Cubiertas Frecuencia (Kilómetros)
              </label>
              <input
                type="number"
                step="5000"
                value={lclTiresInterval}
                onChange={(e) => setLclTiresInterval(Number(e.target.value))}
                className="w-full bg-brand-bg border border-brand-border rounded-lg px-3 py-1.5 text-xs text-brand-on-surface focus:outline-none focus:border-brand-primary"
                placeholder="Ej. 40000"
              />
            </div>

            {/* Tires Cost */}
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-brand-on-surface-variant uppercase tracking-wider block">
                Costo del Juego de Cubiertas ({currencySymbol})
              </label>
              <input
                type="number"
                value={lclTiresCost}
                onChange={(e) => setLclTiresCost(Number(e.target.value))}
                className="w-full bg-brand-bg border border-brand-border rounded-lg px-3 py-1.5 text-xs text-brand-on-surface focus:outline-none focus:border-brand-primary"
              />
            </div>
          </div>
        </div>

        {/* Module Section 4: Fondo de Reserva Slider */}
        <div className="bg-brand-container border border-brand-border rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-brand-border/40 pb-2">
            <span className="flex items-center gap-2 text-brand-primary">
              <PiggyBank className="w-5 h-5" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-brand-on-surface">Fondo de Reserva Vehicular</h3>
            </span>
            <span className="text-sm font-black text-brand-primary font-mono select-none">
              {currencySymbol}{lclReserve}
            </span>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-semibold text-brand-on-surface-variant uppercase block tracking-wider">
              Aporte Mensual para Arreglos / Fondo de Garantía
            </span>
            
            <div className="flex items-center gap-3">
              <span className="text-[10.5px] text-brand-on-surface-variant font-mono">{currencySymbol}0</span>
              <input
                type="range"
                min="0"
                max="500000"
                step="5000"
                value={lclReserve}
                onChange={(e) => setLclReserve(Number(e.target.value))}
                className="flex-1 h-2 bg-brand-bg-darker rounded-lg appearance-none cursor-pointer accent-brand-primary"
              />
              <span className="text-[10.5px] text-brand-on-surface-variant font-mono">{currencySymbol}500.000</span>
            </div>

            <p className="text-[10px] text-brand-on-surface-variant leading-relaxed">
              El fondo amortiza reparaciones imprevistas o de embrague, desgaste de frenos y la depreciación general por uso diario.
            </p>
          </div>
        </div>

        {/* Success Alert */}
        {successBanner && (
          <div className="p-3.5 bg-brand-primary/15 border border-brand-primary/30 rounded-xl text-xs font-bold text-brand-primary flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0" />
            ¡Configuración y metas guardadas de forma óptima! Tus cálculos han sido recalculados de inmediato.
          </div>
        )}

        {/* Submit Save Button */}
        <button
          type="submit"
          className="w-full py-4 bg-brand-primary hover:bg-brand-primary/95 text-black font-extrabold text-sm rounded-xl transition-all shadow-[0_4px_12px_rgba(78,222,163,0.15)] hover:shadow-[0_4px_16px_rgba(78,222,163,0.3)] duration-200 cursor-pointer"
        >
          Guardar Configuración y Metas
        </button>
      </form>
    </div>
  );
}
