import React, { useState } from "react";
import { Target, Settings, Shield, Wrench, PiggyBank, Check, RefreshCw } from "lucide-react";
import { GoalsConfig } from "../types";

interface GoalsTabProps {
  goals: GoalsConfig;
  setGoals: (goals: GoalsConfig) => void;
  currencySymbol: string;
}

export default function GoalsTab({
  goals,
  setGoals,
  currencySymbol,
}: GoalsTabProps) {
  // Local form state
  const [lclGoal, setLclGoal] = useState(goals.monthlyGoal);
  const [lclDays, setLclDays] = useState(goals.workingDaysPerWeek);
  const [lclSeguro, setLclSeguro] = useState(goals.monthlySeguro);
  const [lclPatente, setLclPatente] = useState(goals.monthlyPatente);
  const [lclAlquiler, setLclAlquiler] = useState(goals.monthlyAlquiler);
  
  // Preventative maintenance variables
  const [lclOilInterval, setLclOilInterval] = useState(goals.oilInterval);
  const [lclOilCost, setLclOilCost] = useState(goals.oilCost);
  const [lclTiresInterval, setLclTiresInterval] = useState(goals.tiresInterval);
  const [lclTiresCost, setLclTiresCost] = useState(goals.tiresCost);

  // Reserve slider state
  const [lclReserve, setLclReserve] = useState(goals.reserveFundMonthly);
  
  const [successBanner, setSuccessBanner] = useState(false);

  // Form handle submission
  const handleSubmitGoals = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedGoals: GoalsConfig = {
      monthlyGoal: Number(lclGoal) || 0,
      workingDaysPerWeek: Number(lclDays) || 6,
      monthlySeguro: Number(lclSeguro) || 0,
      monthlyPatente: Number(lclPatente) || 0,
      monthlyAlquiler: Number(lclAlquiler) || 0,
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
    setLclGoal(3500);
    setLclDays(6);
    setLclSeguro(120);
    setLclPatente(45);
    setLclAlquiler(0);
    setLclOilInterval(10000);
    setLclOilCost(85);
    setLclTiresInterval(40000);
    setLclTiresCost(400);
    setLclReserve(150);
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <section className="space-y-1.5 flex justify-between items-start gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-white">Metas y Configuración</h2>
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
            <h3 className="font-bold text-xs uppercase tracking-wider text-white">Objetivo de Margen Neto</h3>
          </div>
          
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-brand-on-surface-variant block uppercase tracking-wide">
              Meta Limpia Mensual Deseada (USD)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-xs font-bold text-brand-primary">{currencySymbol}</span>
              <input
                type="number"
                value={lclGoal}
                onChange={(e) => setLclGoal(Number(e.target.value))}
                className="w-full bg-brand-bg border border-brand-border rounded-lg pl-8 pr-4 py-2 text-sm text-white focus:outline-none focus:border-brand-primary"
                placeholder="Ej. 3500"
              />
            </div>
            <p className="text-[10px] text-brand-on-surface-variant/70 leading-normal">
              Esta meta se dividirá automáticamente por tus jornadas laborales mensuales para proyectar tu "Meta Diaria" recomendada.
            </p>
          </div>
        </div>

        {/* Module Section 2: Gastos Fijos Mensuales */}
        <div className="bg-brand-container border border-brand-border rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-brand-secondary border-b border-brand-border/40 pb-2">
            <Shield className="w-4 h-4 text-brand-primary" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-white">Gastos Fijos Mensuales</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Working days */}
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-brand-on-surface-variant uppercase tracking-wider block">
                Días de Trabajo Semanales
              </label>
              <input
                type="number"
                min="1"
                max="7"
                value={lclDays}
                onChange={(e) => setLclDays(Number(e.target.value))}
                className="w-full bg-brand-bg border border-brand-border rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-brand-primary"
              />
            </div>

            {/* Insurance Seguro */}
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-brand-on-surface-variant uppercase tracking-wider block">
                Seguro del Automóvil ({currencySymbol} / Mes)
              </label>
              <input
                type="number"
                value={lclSeguro}
                onChange={(e) => setLclSeguro(Number(e.target.value))}
                className="w-full bg-brand-bg border border-brand-border rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-brand-primary"
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
                className="w-full bg-brand-bg border border-brand-border rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-brand-primary"
              />
            </div>

            {/* Rental Fee */}
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-brand-on-surface-variant uppercase tracking-wider block">
                Alquiler de Vehículo Diario (Si aplica, {currencySymbol})
              </label>
              <input
                type="number"
                value={lclAlquiler}
                onChange={(e) => setLclAlquiler(Number(e.target.value))}
                className="w-full bg-brand-bg border border-brand-border rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-brand-primary"
              />
            </div>
          </div>
        </div>

        {/* Module Section 3: Mantenimiento Preventivo */}
        <div className="bg-brand-container border border-brand-border rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-brand-tertiary border-b border-brand-border/40 pb-2">
            <Wrench className="w-4 h-4 text-brand-primary" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-white">Mantenimiento Preventivo</h3>
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
                className="w-full bg-brand-bg border border-brand-border rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-brand-primary"
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
                className="w-full bg-brand-bg border border-brand-border rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-brand-primary"
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
                className="w-full bg-brand-bg border border-brand-border rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-brand-primary"
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
                className="w-full bg-brand-bg border border-brand-border rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-brand-primary"
              />
            </div>
          </div>
        </div>

        {/* Module Section 4: Fondo de Reserva Slider */}
        <div className="bg-brand-container border border-brand-border rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-brand-border/40 pb-2">
            <span className="flex items-center gap-2 text-brand-primary">
              <PiggyBank className="w-5 h-5" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-white">Fondo de Reserva Vehicular</h3>
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
                max="500"
                step="10"
                value={lclReserve}
                onChange={(e) => setLclReserve(Number(e.target.value))}
                className="flex-1 h-2 bg-brand-bg-darker rounded-lg appearance-none cursor-pointer accent-brand-primary"
              />
              <span className="text-[10.5px] text-brand-on-surface-variant font-mono">{currencySymbol}500</span>
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
