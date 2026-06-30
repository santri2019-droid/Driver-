import React, { useState } from "react";
import { Car, User, Target, Calendar, Fuel, Shield, ArrowRight } from "lucide-react";

import { useAppStore } from "../store/useAppStore";

export default function OnboardingWizard() {
  const { setDriverName, setCarModel, goals, setGoals, setHasOnboarded } = useAppStore();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [model, setModel] = useState("");
  const [goal, setGoal] = useState<number>(1500000);
  const [days, setDays] = useState<number>(24);
  const [seguro, setSeguro] = useState<number>(50000);
  const [patente, setPatente] = useState<number>(25000);
  const [fuel, setFuel] = useState<number>(35000);

  const handleNext = () => setStep(prev => prev + 1);

  const handleComplete = () => {
    setDriverName(name || "Conductor");
    setCarModel(model || "Vehículo");
    setGoals({
      ...goals,
      monthlyGoal: goal || 1500000,
      workingDaysPerMonth: days || 24,
      monthlySeguro: seguro || 0,
      monthlyPatente: patente || 0,
      monthlyFuelAverage: fuel || 0,
    });
    setHasOnboarded(true);
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-on-surface flex flex-col items-center justify-center p-6 selection:bg-brand-primary/20">
      <div className="w-full max-w-md bg-brand-container border border-brand-border rounded-3xl p-8 shadow-2xl space-y-8 animate-fade-in relative overflow-hidden">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-brand-border">
          <div 
            className="h-full bg-brand-primary transition-all duration-500 ease-out" 
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-brand-primary/20 shadow-[0_0_15px_rgba(10,225,130,0.2)]">
                <Car className="w-8 h-8 text-brand-primary" />
              </div>
              <h2 className="text-2xl font-black">Bienvenido a Driver Cash</h2>
              <p className="text-brand-on-surface-variant text-sm">Configuremos tu perfil básico para personalizar tus metas.</p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold tracking-widest text-brand-primary uppercase flex items-center gap-2">
                  <User className="w-3 h-3" /> Tu Nombre
                </label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="Ej: Carlos Martínez"
                  className="w-full bg-brand-bg border border-brand-border rounded-xl px-4 py-3 text-brand-on-surface focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold tracking-widest text-brand-primary uppercase flex items-center gap-2">
                  <Car className="w-3 h-3" /> Modelo de Vehículo
                </label>
                <input 
                  type="text" 
                  value={model} 
                  onChange={(e) => setModel(e.target.value)} 
                  placeholder="Ej: Chevrolet Prisma 1.4"
                  className="w-full bg-brand-bg border border-brand-border rounded-xl px-4 py-3 text-brand-on-surface focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all"
                />
              </div>
            </div>
            
            <button 
              onClick={handleNext}
              disabled={!name || !model}
              className="w-full bg-brand-primary text-black font-black py-4 rounded-xl flex items-center justify-center gap-2 hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continuar <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-brand-primary/20 shadow-[0_0_15px_rgba(10,225,130,0.2)]">
                <Target className="w-8 h-8 text-brand-primary" />
              </div>
              <h2 className="text-2xl font-black">Tus Metas</h2>
              <p className="text-brand-on-surface-variant text-sm">¿Cuánto quieres facturar este mes y cuántos días trabajarás?</p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold tracking-widest text-brand-primary uppercase flex items-center gap-2">
                  <Target className="w-3 h-3" /> Meta Mensual (Bruto)
                </label>
                <input 
                  type="number" 
                  value={goal || ""} 
                  onChange={(e) => setGoal(Number(e.target.value))} 
                  placeholder="Ej: 1500000"
                  className="w-full bg-brand-bg border border-brand-border rounded-xl px-4 py-3 text-brand-on-surface focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold tracking-widest text-brand-primary uppercase flex items-center gap-2">
                  <Calendar className="w-3 h-3" /> Días de trabajo por mes
                </label>
                <input 
                  type="number" 
                  value={days || ""} 
                  onChange={(e) => setDays(Number(e.target.value))} 
                  placeholder="Ej: 24"
                  className="w-full bg-brand-bg border border-brand-border rounded-xl px-4 py-3 text-brand-on-surface focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all font-mono"
                />
              </div>
            </div>
            
            <button 
              onClick={handleNext}
              disabled={!goal || !days}
              className="w-full bg-brand-primary text-black font-black py-4 rounded-xl flex items-center justify-center gap-2 hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continuar <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-brand-primary/20 shadow-[0_0_15px_rgba(10,225,130,0.2)]">
                <Shield className="w-8 h-8 text-brand-primary" />
              </div>
              <h2 className="text-2xl font-black">Gastos Fijos Iniciales</h2>
              <p className="text-brand-on-surface-variant text-sm">Esta base te ayudará a calcular tu Ganancia Neta real diaria.</p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold tracking-widest text-brand-primary uppercase flex items-center gap-2">
                  <Shield className="w-3 h-3" /> Costo Mensual Seguro
                </label>
                <input 
                  type="number" 
                  value={seguro || ""} 
                  onChange={(e) => setSeguro(Number(e.target.value))} 
                  placeholder="Ej: 50000"
                  className="w-full bg-brand-bg border border-brand-border rounded-xl px-4 py-3 text-brand-on-surface focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold tracking-widest text-brand-primary uppercase flex items-center gap-2">
                  <Shield className="w-3 h-3" /> Costo Mensual Patente
                </label>
                <input 
                  type="number" 
                  value={patente || ""} 
                  onChange={(e) => setPatente(Number(e.target.value))} 
                  placeholder="Ej: 25000"
                  className="w-full bg-brand-bg border border-brand-border rounded-xl px-4 py-3 text-brand-on-surface focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold tracking-widest text-brand-primary uppercase flex items-center gap-2">
                  <Fuel className="w-3 h-3" /> Costo Promedio Combustible (Día)
                </label>
                <input 
                  type="number" 
                  value={fuel || ""} 
                  onChange={(e) => setFuel(Number(e.target.value))} 
                  placeholder="Ej: 35000"
                  className="w-full bg-brand-bg border border-brand-border rounded-xl px-4 py-3 text-brand-on-surface focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all font-mono"
                />
              </div>
            </div>
            
            <button 
              onClick={handleComplete}
              disabled={!seguro || !patente || !fuel}
              className="w-full bg-brand-primary text-black font-black py-4 rounded-xl flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-[0_0_20px_rgba(10,225,130,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Comenzar a usar Driver Cash <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
