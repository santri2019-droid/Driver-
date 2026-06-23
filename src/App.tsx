import { useState, useEffect } from "react";
import Header from "./components/Header";
import BottomNav from "./components/BottomNav";
import HomeTab from "./components/HomeTab";
import AdvancesTab from "./components/AdvancesTab";
import JournalTab from "./components/JournalTab";
import GoalsTab from "./components/GoalsTab";
import AchievementsTab from "./components/AchievementsTab";
import OnboardingWizard from "./components/OnboardingWizard";
import AdminPanel from "./components/AdminPanel";

import { 
  initialLogs, 
  defaultGoals, 
  INITIAL_ADVANCES, 
  INITIAL_ACHIEVEMENTS 
} from "./data";
import { DriverLog, GoalsConfig, Advance, Achievement } from "./types";
import { auth, db } from "./firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function App() {
  // Navigation
  const [selectedTab, setSelectedTab] = useState<string>("home");
  const [user, setUser] = useState<User | null>(null);

  // Profile configurations with persistent fallback
  const [driverName, setDriverName] = useState<string>(() => {
    return localStorage.getItem("dc_driverName") || "Carlos Martínez";
  });
  const [carModel, setCarModel] = useState<string>(() => {
    return localStorage.getItem("dc_carModel") || "Chevrolet Prisma 1.4";
  });
  const [avatarUrl, setAvatarUrl] = useState<string>(() => {
    return localStorage.getItem("dc_avatarUrl") || "https://lh3.googleusercontent.com/aida-public/AB6AXuBcL-6O-RUAJQq_YWM3Hg01FEEAFziwCNorVtfdNXYKTNgI0Jrc0vGZVE8sbvEWUtUiK4VyPnUY2ItlesODy6eev2S4pPNJoR8Sq55BaZ7_e1OYQAE2c96PlvFdR5dBpjyTTo5YocSSYibDbYg89HuPCJMeK6wGyd9yP0EiMeNTKP0ZNcmYO5FcYrCxxKaEgMZzj3RmVE8HXSvZMHCyrA7qNK_C-7L2FrAuL-oSdtKCtSPn0WZCZKe2_souEyEE0KN0wdrlQ3PVOQ";
  });
  const [currencySymbol, setCurrencySymbol] = useState<string>(() => {
    const saved = localStorage.getItem("dc_currencySymbol");
    if (saved === "$(ARS)") {
      return "$";
    }
    return saved || "$";
  });
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("dc_darkMode") !== "false";
  });
  const [unreadNotifications, setUnreadNotifications] = useState<number>(2);

  const [hasOnboarded, setHasOnboarded] = useState<boolean>(() => {
    return localStorage.getItem("dc_onboarded") === "true";
  });

  // Core logs state with LocalStorage persistence and safe parsing
  const [logs, setLogs] = useState<DriverLog[]>(() => {
    try {
      const saved = localStorage.getItem("dc_logs");
      if (saved && saved !== "undefined") {
        const parsed = JSON.parse(saved);
        // Map old logs to new schema
        return parsed.map((log: any) => ({
          ...log,
          kilometers: log.kilometers ?? 0,
        }));
      }
    } catch (e) {
      console.error("Error parsing dc_logs:", e);
    }
    return initialLogs;
  });

  // Core goals state with LocalStorage persistence and safe parsing
  const [goals, setGoals] = useState<GoalsConfig>(() => {
    try {
      const saved = localStorage.getItem("dc_goals");
      if (saved && saved !== "undefined") {
        const parsed = JSON.parse(saved);
        return {
          ...defaultGoals,
          ...parsed,
          workingDaysPerMonth: parsed.workingDaysPerMonth ?? (parsed.workingDaysPerWeek ? parsed.workingDaysPerWeek * 4 : defaultGoals.workingDaysPerMonth),
          customFixedExpenses: parsed.customFixedExpenses || defaultGoals.customFixedExpenses,
        };
      }
    } catch (e) {
      console.error("Error parsing dc_goals:", e);
    }
    return defaultGoals;
  });

  // Early withdrawals / advances state with LocalStorage persistence and safe parsing
  const [advances, setAdvances] = useState<Advance[]>(() => {
    try {
      const saved = localStorage.getItem("dc_advances");
      if (saved && saved !== "undefined") {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Error parsing dc_advances:", e);
    }
    return INITIAL_ADVANCES;
  });

  // Shift stopwatch state
  const [isShiftActive, setIsShiftActive] = useState<boolean>(() => {
    return localStorage.getItem("dc_shiftActive") === "true";
  });
  const [shiftSeconds, setShiftSeconds] = useState<number>(() => {
    const saved = localStorage.getItem("dc_shiftSeconds");
    return saved ? parseInt(saved, 10) : 0;
  });

  // LocalStorage synchronizers
  useEffect(() => {
    localStorage.setItem("dc_driverName", driverName);
  }, [driverName]);

  useEffect(() => {
    localStorage.setItem("dc_carModel", carModel);
  }, [carModel]);

  useEffect(() => {
    localStorage.setItem("dc_avatarUrl", avatarUrl);
  }, [avatarUrl]);

  useEffect(() => {
    localStorage.setItem("dc_currencySymbol", currencySymbol);
  }, [currencySymbol]);

  useEffect(() => {
    localStorage.setItem("dc_darkMode", isDarkMode ? "true" : "false");
    if (isDarkMode) {
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    }
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem("dc_logs", JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem("dc_goals", JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem("dc_advances", JSON.stringify(advances));
  }, [advances]);

  useEffect(() => {
    localStorage.setItem("dc_shiftActive", isShiftActive ? "true" : "false");
  }, [isShiftActive]);

  useEffect(() => {
    localStorage.setItem("dc_shiftSeconds", shiftSeconds.toString());
  }, [shiftSeconds]);

  useEffect(() => {
    localStorage.setItem("dc_onboarded", hasOnboarded ? "true" : "false");
  }, [hasOnboarded]);

  // Firebase Auth & Initial Fetch
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const docRef = doc(db, "users", currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.driverName) setDriverName(data.driverName);
            if (data.carModel) setCarModel(data.carModel);
            if (data.avatarUrl) setAvatarUrl(data.avatarUrl);
            if (data.currencySymbol) setCurrencySymbol(data.currencySymbol);
            if (data.isDarkMode !== undefined) setIsDarkMode(data.isDarkMode);
            if (data.hasOnboarded !== undefined) setHasOnboarded(data.hasOnboarded);
            if (data.logs) setLogs(data.logs);
            if (data.goals) setGoals(data.goals);
            if (data.advances) setAdvances(data.advances);
          }
        } catch (e) {
          console.error("Error fetching data from Firestore", e);
        }
      }
    });
    return unsubscribe;
  }, []);

  // Firebase Auto-Sync (Debounced)
  useEffect(() => {
    if (!user) return;
    const syncData = async () => {
      try {
        await setDoc(doc(db, "users", user.uid), {
          driverName, 
          carModel, 
          avatarUrl, 
          currencySymbol, 
          isDarkMode, 
          hasOnboarded, 
          logs, 
          goals, 
          advances
        }, { merge: true });
      } catch (e) {
        console.error("Error syncing to Firestore", e);
      }
    };
    const timeout = setTimeout(syncData, 2000);
    return () => clearTimeout(timeout);
  }, [driverName, carModel, avatarUrl, currencySymbol, isDarkMode, hasOnboarded, logs, goals, advances, user]);

  // Stopwatch Interval countdown ticking loop
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isShiftActive) {
      interval = setInterval(() => {
        setShiftSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isShiftActive]);

  const handleResetAllData = () => {
    localStorage.clear();
    setLogs(initialLogs);
    setGoals(defaultGoals);
    setAdvances(INITIAL_ADVANCES);
    setDriverName("Carlos Martínez");
    setCarModel("Chevrolet Prisma 1.4");
    setCurrencySymbol("$");
    setShiftSeconds(0);
    setIsShiftActive(false);
    setIsDarkMode(true);
  };

  // Sidebar shortcut action trigger
  const handleRequestQuickCashOut = () => {
    setSelectedTab("advances");
    // Pulse notifications alert or scrolling container
    setTimeout(() => {
      const formInput = document.querySelector('input[type="number"]');
      if (formInput) (formInput as HTMLInputElement).focus();
    }, 150);
  };

  if (!hasOnboarded) {
    return (
      <OnboardingWizard 
        onComplete={(name, model, goal, days, seguro, patente, fuel) => {
          setDriverName(name);
          setCarModel(model);
          setGoals({
            ...goals,
            monthlyGoal: goal,
            workingDaysPerMonth: days,
            monthlySeguro: seguro,
            monthlyPatente: patente,
            // Guardamos el gasto promedio de combustible en los custom expenses temporalmente
            // o lo usamos de base. Por ahora no lo aplicamos a "goals" base si no hay campo.
          });
          setHasOnboarded(true);
        }} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg text-brand-on-surface antialiased flex flex-col selection:bg-brand-primary/20 selection:text-brand-primary">
      
      {/* Top Bar Navigation Component */}
      <Header
        driverName={driverName}
        setDriverName={setDriverName}
        carModel={carModel}
        setCarModel={setCarModel}
        avatarUrl={avatarUrl}
        setAvatarUrl={setAvatarUrl}
        unreadNotifications={unreadNotifications}
        setUnreadNotifications={setUnreadNotifications}
        currencySymbol={currencySymbol}
        setCurrencySymbol={setCurrencySymbol}
      />

      <div className="flex-1 w-full max-w-7xl mx-auto flex flex-col md:flex-row relative">
        
        {/* Navigation Sidebar/BottomNav Manager */}
        <BottomNav 
          selectedTab={selectedTab} 
          setSelectedTab={setSelectedTab}
          onRequestQuickCash={handleRequestQuickCashOut}
        />

        {/* Central Interactive Tab Canvas */}
        <main 
          id="main-content-area"
          className="flex-1 pt-20 pb-26 px-4 md:pb-12 md:pl-72 md:pr-6 md:pt-22 transition-all duration-300"
        >
          {selectedTab === "home" && (
            <HomeTab
              logs={logs}
              goals={goals}
              currencySymbol={currencySymbol}
              isShiftActive={isShiftActive}
              setIsShiftActive={setIsShiftActive}
              shiftSeconds={shiftSeconds}
              setShiftSeconds={setShiftSeconds}
              onResetAllData={handleResetAllData}
              isDarkMode={isDarkMode}
              setIsDarkMode={setIsDarkMode}
            />
          )}

          {selectedTab === "advances" && (
            <AdvancesTab
              logs={logs}
              advances={advances}
              setAdvances={setAdvances}
              currencySymbol={currencySymbol}
            />
          )}

          {selectedTab === "journal" && (
            <JournalTab
              logs={logs}
              setLogs={setLogs}
              goals={goals}
              currencySymbol={currencySymbol}
            />
          )}

          {selectedTab === "goals" && (
            <GoalsTab
              logs={logs}
              goals={goals}
              setGoals={setGoals}
              currencySymbol={currencySymbol}
            />
          )}

          {selectedTab === "achievements" && (
            <AchievementsTab
              logs={logs}
              goals={goals}
              achievements={INITIAL_ACHIEVEMENTS}
              currencySymbol={currencySymbol}
            />
          )}

          {selectedTab === "admin" && (
            <AdminPanel />
          )}
        </main>
      </div>
    </div>
  );
}
