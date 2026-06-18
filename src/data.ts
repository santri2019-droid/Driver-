import { DriverLog, GoalsConfig, Advance, Achievement } from "./types";

export const INITIAL_GOALS_CONFIG: GoalsConfig = {
  monthlyGoal: 3500,
  workingDaysPerWeek: 6,
  monthlySeguro: 120,
  monthlyPatente: 45,
  monthlyAlquiler: 0,
  oilInterval: 10000,
  oilCost: 85,
  tiresInterval: 40000,
  tiresCost: 400,
  reserveFundMonthly: 150,
};

export const INITIAL_LOGS: DriverLog[] = [
  {
    id: "log-1",
    date: "2026-06-12",
    dayOfWeek: "L",
    dayLabel: "LUN 12",
    grossIncome: 120,
    fuelExpense: 35,
    maintenanceExpense: 10,
    reserveExpense: 5,
    netIncome: 70,
  },
  {
    id: "log-2",
    date: "2026-06-13",
    dayOfWeek: "M",
    dayLabel: "MAR 13",
    grossIncome: 150,
    fuelExpense: 40,
    maintenanceExpense: 12,
    reserveExpense: 8,
    netIncome: 90,
  },
  {
    id: "log-3",
    date: "2026-06-14",
    dayOfWeek: "X",
    dayLabel: "MIE 14",
    grossIncome: 100,
    fuelExpense: 35,
    maintenanceExpense: 20,
    reserveExpense: 5,
    netIncome: 40,
  },
  {
    id: "log-4",
    date: "2026-06-15",
    dayOfWeek: "J",
    dayLabel: "JUE 15",
    grossIncome: 180,
    fuelExpense: 30,
    maintenanceExpense: 15,
    reserveExpense: 5,
    netIncome: 130,
  },
  {
    id: "log-5",
    date: "2026-06-16",
    dayOfWeek: "V",
    dayLabel: "VIE 16",
    grossIncome: 160,
    fuelExpense: 45,
    maintenanceExpense: 10,
    reserveExpense: 5,
    netIncome: 100,
  },
  {
    id: "log-6",
    date: "2026-06-17",
    dayOfWeek: "S",
    dayLabel: "SAB 17",
    grossIncome: 80,
    fuelExpense: 20,
    maintenanceExpense: 5,
    reserveExpense: 5,
    netIncome: 50,
  }
];

export const INITIAL_ADVANCES: Advance[] = [
  {
    id: "adv-1",
    amount: 150,
    fee: 2.5,
    status: "COMPLETADO",
    date: "2026-06-10",
    destination: "Caja de Ahorro Santander (***541)"
  },
  {
    id: "adv-2",
    amount: 300,
    fee: 4.5,
    status: "APROBADO",
    date: "2026-06-15",
    destination: "Mercado Pago (CVU ***420)"
  }
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: "ach-1",
    title: "Primer Millonario",
    description: "Alcanza un margen neto mensual acumulado de $1,000",
    targetCount: 1000,
    currentCount: 0, // This gets calculated dynamically from state
    unlocked: false,
    rewardText: "Insignia Bronce + Comisión Bonificada",
    category: "earnings"
  },
  {
    id: "ach-2",
    title: "Conductor Consistente",
    description: "Registra tu actividad (Journal) durante al menos 5 días",
    targetCount: 5,
    currentCount: 6,
    unlocked: true,
    rewardText: "Sello de Oro 'Consistencia'",
    category: "days"
  },
  {
    id: "ach-3",
    title: "Rey del Ahorro",
    description: "Mantén tu costo operativo por debajo del $40 diario",
    targetCount: 40,
    currentCount: 35.5,
    unlocked: true,
    rewardText: "Descuento en Seguro de Auto VIP",
    category: "savings"
  },
  {
    id: "ach-4",
    title: "Meta Superada",
    description: "Supera la meta diaria recomendada por tres días consecutivos",
    targetCount: 3,
    currentCount: 2,
    unlocked: false,
    rewardText: "Insignia 'Imparable'",
    category: "earnings"
  }
];
