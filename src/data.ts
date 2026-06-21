import { DriverLog, GoalsConfig, Advance, Achievement } from "./types";

export const defaultGoals: GoalsConfig = {
  monthlyGoal: 250000,
  workingDaysPerMonth: 24,
  monthlySeguro: 35000,
  monthlyPatente: 15000,
  monthlyFuelAverage: 60000,
  customFixedExpenses: [],
  oilInterval: 10000,
  oilCost: 45000,
  tiresInterval: 40000,
  tiresCost: 350000,
  reserveFundMonthly: 50000,
};

export const initialLogs: DriverLog[] = [
  {
    id: "log-12",
    date: "2026-06-12",
    dayOfWeek: "L",
    dayLabel: "LUN 12",
    grossIncome: 135,
    incomes: [{ id: "inc-1", source: "Uber", amount: 135 }],
    fuelExpense: 25,
    maintenanceExpense: 5,
    otherExpense: 0,
    kilometers: 120,
    netIncome: 100,
  },
  {
    id: "log-13",
    date: "2026-06-13",
    dayOfWeek: "M",
    dayLabel: "MAR 13",
    grossIncome: 180,
    incomes: [{ id: "inc-2", source: "Didi", amount: 180 }],
    fuelExpense: 35,
    maintenanceExpense: 8,
    otherExpense: 0,
    kilometers: 160,
    netIncome: 129,
  },
  {
    id: "log-14",
    date: "2026-06-14",
    dayOfWeek: "X",
    dayLabel: "MIE 14",
    grossIncome: 110,
    incomes: [{ id: "inc-3", source: "Uber", amount: 110 }],
    fuelExpense: 20,
    maintenanceExpense: 5,
    otherExpense: 0,
    kilometers: 95,
    netIncome: 80,
  },
  {
    id: "log-15",
    date: "2026-06-15",
    dayOfWeek: "J",
    dayLabel: "JUE 15",
    grossIncome: 150,
    incomes: [{ id: "inc-4", source: "Cabify", amount: 150 }],
    fuelExpense: 30,
    maintenanceExpense: 5,
    otherExpense: 0,
    kilometers: 130,
    netIncome: 110,
  },
  {
    id: "log-16",
    date: "2026-06-16",
    dayOfWeek: "V",
    dayLabel: "VIE 16",
    grossIncome: 210,
    incomes: [{ id: "inc-5", source: "Uber", amount: 100 }, { id: "inc-6", source: "Didi", amount: 110 }],
    fuelExpense: 40,
    maintenanceExpense: 5,
    otherExpense: 0,
    kilometers: 180,
    netIncome: 160,
  },
  {
    id: "log-17",
    date: "2026-06-17",
    dayOfWeek: "S",
    dayLabel: "SAB 17",
    grossIncome: 240,
    incomes: [{ id: "inc-7", source: "Pedidos Ya", amount: 240 }],
    fuelExpense: 45,
    maintenanceExpense: 5,
    otherExpense: 0,
    kilometers: 200,
    netIncome: 185,
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
