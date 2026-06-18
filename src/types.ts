export interface DriverLog {
  id: string;
  date: string;
  dayOfWeek: string; // "L", "M", "X", "J", "V", "S", "D"
  dayLabel: string; // e.g. "LUN 12", "MAR 13"
  grossIncome: number;
  fuelExpense: number;
  maintenanceExpense: number;
  reserveExpense: number;
  netIncome: number;
}

export interface GoalsConfig {
  monthlyGoal: number; // e.g. 3500
  workingDaysPerWeek: number; // e.g. 6
  monthlySeguro: number; // e.g. 120
  monthlyPatente: number; // e.g. 45
  monthlyAlquiler: number; // e.g. 0
  oilInterval: number; // e.g. 10000
  oilCost: number; // e.g. 85
  tiresInterval: number; // e.g. 40000
  tiresCost: number; // e.g. 400
  reserveFundMonthly: number; // e.g. 150
}

export interface Advance {
  id: string;
  amount: number;
  fee: number;
  status: "PENDIENTE" | "APROBADO" | "COMPLETADO";
  date: string;
  destination: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  targetCount: number;
  currentCount: number;
  unlocked: boolean;
  rewardText: string;
  category: "earnings" | "days" | "savings";
}
