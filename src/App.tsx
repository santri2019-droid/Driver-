import { useEffect } from "react";
import Header from "./components/Header";
import BottomNav from "./components/BottomNav";
import HomeTab from "./components/HomeTab";
import AdvancesTab from "./components/AdvancesTab";
import JournalTab from "./components/JournalTab";
import GoalsTab from "./components/GoalsTab";
import AchievementsTab from "./components/AchievementsTab";
import OnboardingWizard from "./components/OnboardingWizard";
import AdminPanel from "./components/AdminPanel";

import { auth, db } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useAppStore } from "./store/useAppStore";

export default function App() {
  const {
    selectedTab,
    setSelectedTab,
    driverName,
    setDriverName,
    carModel,
    setCarModel,
    avatarUrl,
    setAvatarUrl,
    currencySymbol,
    setCurrencySymbol,
    isDarkMode,
    setIsDarkMode,
    hasOnboarded,
    setHasOnboarded,
    logs,
    setLogs,
    goals,
    setGoals,
    advances,
    setAdvances,
    isShiftActive,
    setShiftSeconds,
  } = useAppStore();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    }
  }, [isDarkMode]);

  // Firebase Auth & Initial Fetch
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
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
    const syncData = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) return;
        try {
          await setDoc(doc(db, "users", currentUser.uid), {
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
  }, [driverName, carModel, avatarUrl, currencySymbol, isDarkMode, hasOnboarded, logs, goals, advances]);

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
    return <OnboardingWizard />;
  }

  return (
    <div className="min-h-screen bg-brand-bg text-brand-on-surface antialiased flex flex-col selection:bg-brand-primary/20 selection:text-brand-primary">
      
      {/* Top Bar Navigation Component */}
      <Header />

      <div className="flex-1 w-full max-w-7xl mx-auto flex flex-col md:flex-row relative">
        
        {/* Navigation Sidebar/BottomNav Manager */}
        <BottomNav onRequestQuickCash={handleRequestQuickCashOut} />

        {/* Central Interactive Tab Canvas */}
        <main 
          id="main-content-area"
          className="flex-1 pt-20 pb-26 px-4 md:pb-12 md:pl-72 md:pr-6 md:pt-22 transition-all duration-300"
        >
          {selectedTab === "home" && <HomeTab />}
          {selectedTab === "advances" && <AdvancesTab />}
          {selectedTab === "journal" && <JournalTab />}
          {selectedTab === "goals" && <GoalsTab />}
          {selectedTab === "achievements" && <AchievementsTab />}

          {selectedTab === "admin" && (
            <AdminPanel />
          )}
        </main>
      </div>
    </div>
  );
}
