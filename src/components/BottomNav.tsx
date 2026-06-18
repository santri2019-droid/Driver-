import { Home, Landmark, BookOpen, Target, Award, DollarSign } from "lucide-react";

interface BottomNavProps {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  onRequestQuickCash: () => void;
}

export default function BottomNav({ 
  selectedTab, 
  setSelectedTab,
  onRequestQuickCash 
}: BottomNavProps) {
  
  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "advances", label: "Advances", icon: Landmark },
    { id: "journal", label: "Journal", icon: BookOpen },
    { id: "goals", label: "Goals", icon: Target },
    { id: "achievements", label: "Achievements", icon: Award },
  ];

  return (
    <>
      {/* Mobile Bottom Navigation Bar (Hidden on md+) */}
      <nav 
        id="mobile-bottom-nav" 
        className="fixed bottom-0 left-0 right-0 z-40 bg-brand-bg/85 backdrop-blur-xl border-t border-brand-border/60 flex justify-around items-center px-2 py-2 md:hidden"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = selectedTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setSelectedTab(item.id)}
              className={`flex flex-col items-center justify-center p-1.5 w-16 h-12 rounded-xl transition-all active:scale-90 duration-200 cursor-pointer ${
                isActive 
                  ? "bg-brand-primary-container text-black font-semibold" 
                  : "text-brand-on-surface-variant hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span className="text-[10px] mt-0.5 font-medium block">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Desktop/Tablet Navigation Sidebar (Hidden on mobile < md) */}
      <aside 
        id="desktop-sidebar-nav" 
        className="hidden md:flex flex-col fixed left-0 top-[60px] bottom-0 w-64 bg-brand-container border-r border-brand-border/60 p-4 shrink-0 overflow-y-auto"
      >
        {/* Navigation items list */}
        <div className="space-y-1.5 flex-1">
          <p className="text-[10px] uppercase font-bold tracking-widest text-brand-on-surface-variant px-3 py-1 mb-2">
            Navegación Financiera
          </p>
          
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = selectedTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-3 py-3 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-brand-primary text-black"
                    : "text-brand-on-surface hover:bg-brand-container-highest/50 hover:text-white"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-black" : "text-brand-primary"}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Quick Cash sidebar-bottom widget */}
        <div className="mt-auto pt-6 border-t border-brand-border/60">
          <div className="bg-brand-bg-darker/60 rounded-xl p-3.5 border border-brand-border/40 mb-3">
            <span className="text-[9px] uppercase font-bold tracking-wider text-brand-on-surface-variant block mb-1">
              Retiro Instantáneo
            </span>
            <p className="text-xs text-brand-on-surface leading-relaxed mb-3">
              ¿Necesitas combustible o efectivo? Solicita un adelanto de tus ingresos limpios acumulados.
            </p>
            <button
              onClick={onRequestQuickCash}
              className="w-full py-2 bg-brand-primary-container text-black font-extrabold text-xs rounded-lg hover:bg-brand-primary transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <DollarSign className="w-4 h-4" />
              Adelanto Rápido
            </button>
          </div>
          
          <div className="text-center text-[10px] text-brand-on-surface-variant py-1">
            Driver Cash v1.4 • Profesional
          </div>
        </div>
      </aside>
    </>
  );
}
