import { Award, Lock, Unlock, Trophy, CheckCircle, Search, TrendingUp, Sparkles, Star } from "lucide-react";
import { Achievement, DriverLog, GoalsConfig } from "../types";

interface AchievementsTabProps {
  logs: DriverLog[];
  goals: GoalsConfig;
  achievements: Achievement[];
  currencySymbol: string;
}

export default function AchievementsTab({
  logs,
  goals,
  achievements,
  currencySymbol,
}: AchievementsTabProps) {
  // Compute real-time values to inject into achievement progression
  const totalLogsCount = logs.length;
  
  const loggedNetSum = logs.reduce((sum, log) => sum + log.netIncome, 0);
  const baselineNet = 2410;
  const currentTotalNetAccumulated = baselineNet + loggedNetSum;

  const averageOperatingExpense = logs.length > 0
    ? logs.reduce((sum, log) => sum + log.fuelExpense + log.maintenanceExpense, 0) / logs.length
    : 35.5;

  const evaluateProgression = (ach: Achievement) => {
    switch (ach.id) {
      case "ach-1": // Primer Millonario
        return {
          current: Math.min(ach.targetCount, currentTotalNetAccumulated),
          isUnlocked: currentTotalNetAccumulated >= ach.targetCount,
        };
      case "ach-2": // Conductor Consistente
        return {
          current: Math.min(ach.targetCount, totalLogsCount),
          isUnlocked: totalLogsCount >= ach.targetCount,
        };
      case "ach-3": // Rey del Ahorro
        // Unlocked if operating expense average is <= 40
        return {
          current: Math.max(0, averageOperatingExpense),
          isUnlocked: averageOperatingExpense <= ach.targetCount && logs.length > 0,
        };
      case "ach-4": // Meta Superada: days gross > calcDailyMeta
        const estimatedMonthlyNeeds = 1500 + goals.monthlySeguro + goals.monthlyPatente + goals.reserveFundMonthly;
        const recommendedMeta = estimatedMonthlyNeeds / Math.max(1, goals.workingDaysPerMonth);
        const daysMeetingGoalCount = logs.filter(log => log.grossIncome >= recommendedMeta).length;
        
        return {
          current: Math.min(ach.targetCount, daysMeetingGoalCount),
          isUnlocked: daysMeetingGoalCount >= ach.targetCount,
        };
      default:
        return {
          current: ach.currentCount,
          isUnlocked: ach.unlocked,
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Title header block */}
      <section className="space-y-1.5">
        <h2 className="text-xl md:text-2xl font-black text-brand-on-surface">Logros de Conductor</h2>
        <p className="text-xs text-brand-on-surface-variant">
          Cumple tareas periódicas de ahorro, consistencia de carga y rentabilidad limpia para adquirir insignias y recompensas afiliadas.
        </p>
      </section>

      {/* Gamified summary stats block */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {/* Stat 1: Unlocked Badges */}
        <div className="bg-brand-container border border-brand-border rounded-xl p-4 flex items-center gap-3.5 relative overflow-hidden">
          <div className="w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] text-brand-on-surface-variant uppercase tracking-wider font-bold block">Insignias Logradas</span>
            <span className="text-lg font-extrabold text-brand-on-surface">
              {achievements.filter(ach => evaluateProgression(ach).isUnlocked).length} / {achievements.length}
            </span>
          </div>
        </div>

        {/* Stat 2: Active Streak */}
        <div className="bg-brand-container border border-brand-border rounded-xl p-4 flex items-center gap-3.5 relative overflow-hidden">
          <div className="w-10 h-10 rounded-lg bg-brand-tertiary/15 flex items-center justify-center text-brand-tertiary">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] text-brand-on-surface-variant uppercase tracking-wider font-bold block">Racha de Journal</span>
            <span className="text-lg font-extrabold text-brand-on-surface">
              {logs.length} Días Activos
            </span>
          </div>
        </div>

        {/* Stat 3: Ahorro operacionales */}
        <div className="bg-brand-container border border-brand-border rounded-xl p-4 flex items-center gap-3.5 relative overflow-hidden">
          <div className="w-10 h-10 rounded-lg bg-brand-primary-container/10 flex items-center justify-center text-brand-primary">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] text-brand-on-surface-variant uppercase tracking-wider font-bold block">Gasto Promedio Día</span>
            <span className="text-lg font-extrabold text-brand-on-surface">
              {currencySymbol}{averageOperatingExpense.toFixed(2)}
            </span>
          </div>
        </div>
      </section>

      {/* Challenges lists checklist */}
      <section className="space-y-3.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-brand-on-surface-variant block">
          Tus Desafíos Profesionales
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((ach) => {
            const { current, isUnlocked } = evaluateProgression(ach);
            const rawPercent = (current / ach.targetCount) * 100;
            // Handle scale logic inverse if required (savings is better if lower, else standard)
            const resolvedPercent = ach.category === "savings"
              ? (current <= ach.targetCount ? 100 : Math.max(0, 100 - ((current - ach.targetCount) / ach.targetCount) * 100))
              : Math.min(100, Math.max(0, rawPercent));

            return (
              <div 
                key={ach.id} 
                className={`bg-brand-container border p-4.5 rounded-xl flex flex-col gap-3.5 transition-all relative overflow-hidden ${
                  isUnlocked 
                    ? "border-brand-primary/30 shadow-[0_4px_16px_rgba(78,222,163,0.06)]"
                    : "border-brand-border/80"
                }`}
              >
                {/* Background ambient lock indicator */}
                <div className="absolute -right-3 -bottom-3 text-brand-on-surface-variant/5">
                  <Star className="w-20 h-20 rotate-12" />
                </div>

                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <span className="text-[8px] uppercase tracking-widest font-black text-brand-on-surface-variant bg-brand-bg-darker px-2 py-0.5 rounded border border-brand-border">
                      {ach.category === "earnings" ? "Margen" : ach.category === "days" ? "Jornada" : "Gastos"}
                    </span>
                    <h4 className="text-xs md:text-sm font-extrabold text-brand-on-surface pt-1">{ach.title}</h4>
                    <p className="text-[11px] text-brand-on-surface-variant leading-relaxed">
                      {ach.description}
                    </p>
                  </div>

                  <div className={`w-9.5 h-9.5 rounded-full flex items-center justify-center shrink-0 border transition-colors ${
                    isUnlocked 
                      ? "bg-brand-primary/10 border-brand-primary text-brand-primary" 
                      : "bg-brand-container-highest/50 border-brand-border text-brand-on-surface-variant"
                  }`}>
                    {isUnlocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                  </div>
                </div>

                {/* Progress ratio metric information */}
                <div className="space-y-1.5 relative z-10">
                  <div className="flex justify-between items-center text-[10px] font-mono text-brand-on-surface-variant">
                    <span>
                      {ach.category === "savings" ? "Costo operativo promedio" : "Progreso"}
                    </span>
                    <span className="font-bold text-brand-on-surface">
                      {ach.id === "ach-1" 
                        ? `${currencySymbol}${current.toFixed(0)} / ${currencySymbol}${ach.targetCount}`
                        : ach.id === "ach-3"
                          ? `${currencySymbol}${current.toFixed(1)} / máx ${currencySymbol}${ach.targetCount}`
                          : `${current} / ${ach.targetCount}`
                      }
                    </span>
                  </div>

                  {/* Meter bar slider */}
                  <div className="h-2 w-full bg-brand-bg-darker rounded-full overflow-hidden p-[1px] border border-brand-border/40">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${
                        isUnlocked ? "bg-brand-primary" : "bg-brand-tertiary"
                      }`} 
                      style={{ width: `${resolvedPercent}%` }}
                    ></div>
                  </div>
                </div>

                {/* Reward info banner */}
                <div className={`text-[10px] p-2 rounded-lg flex items-center gap-1.5 font-medium ${
                  isUnlocked 
                    ? "bg-brand-primary/10 border border-brand-primary/15 text-brand-primary" 
                    : "bg-brand-container-highest/20 text-brand-on-surface-variant border border-brand-border/30"
                }`}>
                  <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>Sello: <strong className="text-brand-on-surface">{ach.rewardText}</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
