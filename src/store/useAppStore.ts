import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DriverLog, GoalsConfig, Advance } from '../types';
import { initialLogs, defaultGoals, INITIAL_ADVANCES } from '../data';

interface AppState {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;

  driverName: string;
  setDriverName: (name: string) => void;
  
  carModel: string;
  setCarModel: (model: string) => void;
  
  avatarUrl: string;
  setAvatarUrl: (url: string) => void;
  
  currencySymbol: string;
  setCurrencySymbol: (symbol: string) => void;
  
  isDarkMode: boolean;
  setIsDarkMode: (isDark: boolean) => void;
  
  hasOnboarded: boolean;
  setHasOnboarded: (onboarded: boolean) => void;
  
  unreadNotifications: number;
  setUnreadNotifications: (count: number) => void;

  logs: DriverLog[];
  setLogs: (logs: DriverLog[] | ((prev: DriverLog[]) => DriverLog[])) => void;
  
  goals: GoalsConfig;
  setGoals: (goals: GoalsConfig | ((prev: GoalsConfig) => GoalsConfig)) => void;
  
  advances: Advance[];
  setAdvances: (advances: Advance[] | ((prev: Advance[]) => Advance[])) => void;

  isShiftActive: boolean;
  setIsShiftActive: (active: boolean) => void;
  
  shiftSeconds: number;
  setShiftSeconds: (seconds: number | ((prev: number) => number)) => void;

  resetAllData: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      selectedTab: "home",
      setSelectedTab: (tab) => set({ selectedTab: tab }),

      driverName: "Carlos Martínez",
      setDriverName: (name) => set({ driverName: name }),
      
      carModel: "Chevrolet Prisma 1.4",
      setCarModel: (model) => set({ carModel: model }),

      avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBcL-6O-RUAJQq_YWM3Hg01FEEAFziwCNorVtfdNXYKTNgI0Jrc0vGZVE8sbvEWUtUiK4VyPnUY2ItlesODy6eev2S4pPNJoR8Sq55BaZ7_e1OYQAE2c96PlvFdR5dBpjyTTo5YocSSYibDbYg89HuPCJMeK6wGyd9yP0EiMeNTKP0ZNcmYO5FcYrCxxKaEgMZzj3RmVE8HXSvZMHCyrA7qNK_C-7L2FrAuL-oSdtKCtSPn0WZCZKe2_souEyEE0KN0wdrlQ3PVOQ",
      setAvatarUrl: (url) => set({ avatarUrl: url }),

      currencySymbol: "$",
      setCurrencySymbol: (symbol) => set({ currencySymbol: symbol }),

      isDarkMode: true,
      setIsDarkMode: (isDark) => set({ isDarkMode: isDark }),

      hasOnboarded: false,
      setHasOnboarded: (onboarded) => set({ hasOnboarded: onboarded }),

      unreadNotifications: 2,
      setUnreadNotifications: (count) => set({ unreadNotifications: count }),

      logs: initialLogs,
      setLogs: (logsOrUpdater) => set((state) => ({
        logs: typeof logsOrUpdater === 'function' ? logsOrUpdater(state.logs) : logsOrUpdater
      })),

      goals: defaultGoals,
      setGoals: (goalsOrUpdater) => set((state) => ({
        goals: typeof goalsOrUpdater === 'function' ? goalsOrUpdater(state.goals) : goalsOrUpdater
      })),

      advances: INITIAL_ADVANCES,
      setAdvances: (advancesOrUpdater) => set((state) => ({
        advances: typeof advancesOrUpdater === 'function' ? advancesOrUpdater(state.advances) : advancesOrUpdater
      })),

      isShiftActive: false,
      setIsShiftActive: (active) => set({ isShiftActive: active }),

      shiftSeconds: 0,
      setShiftSeconds: (secondsOrUpdater) => set((state) => ({
        shiftSeconds: typeof secondsOrUpdater === 'function' ? secondsOrUpdater(state.shiftSeconds) : secondsOrUpdater
      })),

      resetAllData: () => set({
        logs: initialLogs,
        goals: defaultGoals,
        advances: INITIAL_ADVANCES,
        driverName: "Carlos Martínez",
        carModel: "Chevrolet Prisma 1.4",
        currencySymbol: "$",
        isDarkMode: true,
        isShiftActive: false,
        shiftSeconds: 0
      })
    }),
    {
      name: 'dc_app_storage',
    }
  )
);
