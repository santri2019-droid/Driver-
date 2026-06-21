import React, { useState, useEffect } from "react";
import { Landmark, ArrowRightLeft, Cpu, ShieldAlert, Check, HelpCircle, ArrowUpRight, Clock, Trash2, Calendar } from "lucide-react";
import { Advance, DriverLog } from "../types";

interface AdvancesTabProps {
  logs: DriverLog[];
  advances: Advance[];
  setAdvances: (advances: Advance[] | ((prev: Advance[]) => Advance[])) => void;
  currencySymbol: string;
}

export default function AdvancesTab({
  logs,
  advances,
  setAdvances,
  currencySymbol,
}: AdvancesTabProps) {
  // Calculable pool: 85% of total cumulative net earnings can be withdrawn early
  const baseEarnings = 2410;
  const loggedNetSum = logs.reduce((sum, log) => sum + log.netIncome, 0);
  const totalCumulativeNet = baseEarnings + loggedNetSum;

  const resolvedAdvancesSum = advances
    .filter(adv => adv.status !== "PENDIENTE") // subtract withdrawn amounts
    .reduce((sum, adv) => sum + adv.amount, 0);

  const withdrawableAvailable = Math.max(0, (totalCumulativeNet * 0.85) - resolvedAdvancesSum);

  // Form input parameters
  const [advanceAmountStr, setAdvanceAmountStr] = useState("100.00");
  const [selectedDest, setSelectedDest] = useState("Mercado Pago (CVU ***420)");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedFeedback, setCompletedFeedback] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Dynamic fee calculation: 2% of withdrawal + $0.50 flat fee
  const enteredAmount = parseFloat(advanceAmountStr) || 0;
  const calculatedFee = enteredAmount > 0 ? (enteredAmount * 0.02) + 0.50 : 0;
  const netDisbursement = Math.max(0, enteredAmount - calculatedFee);

  const destinations = [
    "Mercado Pago (CVU ***420)",
    "Caja de Ahorro Santander (***541)",
    "Ualá Digital Wallet (***719)",
    "Brubank Caja en Dólares (***830)",
  ];

  const handleCreateAdvance = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (enteredAmount <= 10) {
      setValidationError("El monto mínimo a adelantar es de $10.00.");
      return;
    }

    if (enteredAmount > withdrawableAvailable) {
      setValidationError(`El monto solicitado supera tu cupo disponible de ${currencySymbol}${withdrawableAvailable.toFixed(2)}.`);
      return;
    }

    setIsSubmitting(true);

    // Simulate fast server-side response processing
    setTimeout(() => {
      const newAdv: Advance = {
        id: "adv-" + Date.now(),
        amount: enteredAmount,
        fee: parseFloat(calculatedFee.toFixed(2)),
        status: "PENDIENTE",
        date: new Date().toISOString().split("T")[0],
        destination: selectedDest,
      };

      setAdvances(prev => [newAdv, ...prev]);
      setIsSubmitting(false);
      setCompletedFeedback(true);
      setAdvanceAmountStr("");

      // Simulate approved callback after a short period
      const currentAdvId = newAdv.id;
      setTimeout(() => {
        setAdvances(prev => 
          prev.map(item => 
            item.id === currentAdvId ? { ...item, status: "APROBADO" } : item
          )
        );
      }, 5000);

      setTimeout(() => {
        setCompletedFeedback(false);
      }, 4000);
    }, 1500);
  };

  const handleDeleteHistory = (id: string) => {
    setAdvances(prev => prev.filter(adv => adv.id !== id));
  };

  const handlePreloadMax = () => {
    setAdvanceAmountStr(Math.floor(withdrawableAvailable).toFixed(2));
    setValidationError(null);
  };

  return (
    <div className="space-y-6">
      {/* Tab intro header */}
      <section className="space-y-1.5">
        <h2 className="text-xl md:text-2xl font-black text-brand-on-surface">Adelanto Líquido (Advances)</h2>
        <p className="text-xs text-brand-on-surface-variant">
          Evita esperar al cierre bancario. Retira hasta el 85% de tu margen neto real de forma inmediata.
        </p>
      </section>

      {/* Available Liquidity Display Block */}
      <section className="bg-brand-container border border-brand-border rounded-xl p-5 relative overflow-hidden flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="absolute top-0 right-0 w-28 h-28 bg-brand-primary-container/5 rounded-full blur-2xl"></div>
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-on-surface-variant block">Disponible para Adelantos</span>
          <span className="text-3xl font-extrabold text-brand-primary font-mono block">
            {currencySymbol}{withdrawableAvailable.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className="text-[10px] text-brand-on-surface-variant block">
            Límite prudencial: 85% de tu ganancia neta total acumulada mensual.
          </span>
        </div>

        <button
          onClick={handlePreloadMax}
          type="button"
          className="px-4 py-2 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary font-extrabold text-xs rounded-lg hover:bg-brand-primary hover:text-black shrink-0 transition-colors cursor-pointer"
        >
          Retirar Cupo Máximo
        </button>
      </section>

      {/* Interactive withdraw form */}
      <section className="bg-brand-container border border-brand-border rounded-xl p-5 shadow-md">
        <form onSubmit={handleCreateAdvance} className="space-y-4">
          <h3 className="font-bold text-xs uppercase tracking-wider text-brand-on-surface flex items-center gap-1.5 border-b border-brand-border/40 pb-2">
            <ArrowRightLeft className="w-4 h-4 text-brand-primary" />
            Configurar Retiro de Fondos
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Amount Input */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-brand-on-surface-variant uppercase tracking-wider block">
                Monto que desea Retirar ({currencySymbol})
              </label>
              <input
                type="number"
                step="5"
                min="10"
                value={advanceAmountStr}
                onChange={(e) => {
                  setAdvanceAmountStr(e.target.value);
                  setValidationError(null);
                }}
                className="w-full bg-brand-bg border border-brand-border rounded-lg px-3 py-2 text-sm text-brand-on-surface font-semibold focus:outline-none focus:border-brand-primary"
                placeholder="100.00"
              />
            </div>

            {/* Destination Selection */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-brand-on-surface-variant uppercase tracking-wider block">
                Destino de Transferencia Directa
              </label>
              <select
                value={selectedDest}
                onChange={(e) => setSelectedDest(e.target.value)}
                className="w-full bg-brand-bg text-xs border border-brand-border rounded-lg px-3 py-2 text-brand-on-surface focus:outline-none focus:border-brand-primary cursor-pointer"
              >
                {destinations.map((dest, i) => (
                  <option key={i} value={dest} className="bg-brand-container text-brand-on-surface">
                    {dest}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Fee breakdown block */}
          <div className="bg-brand-bg-darker/60 rounded-xl p-3 border border-brand-border/40 space-y-1.5 text-xs">
            <div className="flex justify-between items-center text-brand-on-surface-variant">
              <span>Sustracción por Prorrateo e IVA (2%)</span>
              <span className="font-mono text-brand-on-surface">{currencySymbol}{calculatedFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-brand-on-surface font-bold text-sm border-t border-brand-border/30 pt-1.5">
              <span>Disembolso Neto Estimado</span>
              <span className="font-mono text-brand-primary">{currencySymbol}{netDisbursement.toFixed(2)}</span>
            </div>
          </div>

          {/* Validation warnings */}
          {validationError && (
            <div className="p-3 bg-brand-error/10 border border-brand-error/30 rounded-lg text-xs font-bold text-brand-error flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              {validationError}
            </div>
          )}

          {/* Done alert layout slider */}
          {completedFeedback && (
            <div className="p-3 bg-brand-primary/10 border border-brand-primary/30 rounded-lg text-xs font-bold text-brand-primary flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              ¡Petición enviada! El sistema está verificando la autenticidad e ingresando los fondos piloto.
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || enteredAmount <= 0}
            className={`w-full py-3 text-black text-xs font-extrabold uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 transition-all ${
              isSubmitting
                ? "bg-brand-container-highest text-brand-on-surface-variant cursor-wait"
                : "bg-brand-primary hover:bg-brand-primary/95 cursor-pointer shadow-md"
            }`}
          >
            {isSubmitting ? (
              <>
                <Cpu className="w-4 h-4 animate-spin" />
                Ejecutando firma digital...
              </>
            ) : (
              <>
                <ArrowUpRight className="w-4 h-4 text-black" />
                Solicitar Adelanto Electrónico
              </>
            )}
          </button>
        </form>
      </section>

      {/* Historical logs of early cash out transfers */}
      <section className="space-y-3.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-brand-on-surface-variant block">
          Historial de Adelantos de Ganancias
        </h3>

        {advances.length === 0 ? (
          <div className="p-5 text-center bg-brand-container/30 rounded-xl border border-dashed border-brand-border text-xs text-brand-on-surface-variant">
            No has efectuado solicitudes de cash-out anticipado durante este ciclo de facturación.
          </div>
        ) : (
          <div className="space-y-2.5">
            {advances.map((adv) => {
              const badgeColors = {
                PENDIENTE: "bg-brand-tertiary/10 text-brand-tertiary border-brand-tertiary/20",
                APROBADO: "bg-brand-primary/10 text-brand-primary border-brand-primary/20 animate-pulse",
                COMPLETADO: "bg-brand-primary-container/15 text-brand-on-surface border-brand-primary-container/20",
              };
              
              return (
                <div key={adv.id} className="bg-brand-container border border-brand-border/60 p-3.5 rounded-xl flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-brand-on-surface font-mono">{adv.destination}</span>
                      <span className={`text-[8.5px] px-2 py-0.5 rounded border ${badgeColors[adv.status]}`}>
                        {adv.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-[10px] text-brand-on-surface-variant font-mono">
                      <span>Ref ID: <strong className="text-brand-on-surface">{adv.id}</strong></span>
                      <span>•</span>
                      <span>Fecha: {adv.date}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="text-right">
                      <span className="text-[10px] text-brand-on-surface-variant font-bold block">Desembolso</span>
                      <strong className="text-brand-on-surface font-mono text-sm">{currencySymbol}{(adv.amount - adv.fee).toFixed(2)}</strong>
                    </div>

                    <button
                      onClick={() => handleDeleteHistory(adv.id)}
                      type="button"
                      title="Eliminar de historial"
                      className="p-1 rounded hover:bg-brand-container-highest text-brand-on-surface-variant hover:text-brand-error transition-all cursor-pointer"
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
    </div>
  );
}
