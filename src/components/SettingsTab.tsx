import React, { useState } from "react";
import { User, Moon, Sun, Trash2, LogIn } from "lucide-react";

interface SettingsTabProps {
  // Pass setters to handle resetting state if needed
  onResetAllData: () => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
}

export default function SettingsTab({ onResetAllData, isDarkMode, setIsDarkMode }: SettingsTabProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if(email && password) {
      setIsLoggedIn(true);
    }
  };

  const handleReset = () => {
    if (window.confirm("¿Estás seguro de que deseas borrar toda tu información? Esto no se puede deshacer.")) {
      onResetAllData();
      alert("Información reseteada.");
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <section className="space-y-1.5">
        <h2 className="text-xl md:text-2xl font-black text-brand-on-surface">Ajustes</h2>
        <p className="text-xs text-brand-on-surface-variant">
          Configura tu cuenta, apariencia y preferencias.
        </p>
      </section>

      {/* Auth Module */}
      <section className="bg-brand-container border border-brand-border rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex items-center gap-2 border-b border-brand-border/40 pb-2">
          <User className="w-5 h-5 text-brand-primary" />
          <h3 className="font-bold text-sm text-brand-on-surface">Cuenta y Sincronización</h3>
        </div>
        
        {isLoggedIn ? (
          <div className="bg-brand-primary/10 text-brand-primary p-3 rounded-xl text-sm font-semibold">
            Conectado como {email}
            <button onClick={() => setIsLoggedIn(false)} className="ml-4 underline text-xs">Cerrar Sesión</button>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-3">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-brand-on-surface-variant uppercase">Correo Electrónico</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-brand-bg border border-brand-border rounded-lg px-3 py-2 text-sm text-brand-on-surface focus:border-brand-primary outline-none" required />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-brand-on-surface-variant uppercase">Contraseña</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-brand-bg border border-brand-border rounded-lg px-3 py-2 text-sm text-brand-on-surface focus:border-brand-primary outline-none" required />
            </div>
            <div className="flex justify-between items-center pt-2">
              <button type="button" className="text-xs text-brand-primary hover:underline">¿Olvidaste tu clave?</button>
              <button type="submit" className="bg-brand-primary text-black font-bold px-4 py-2 rounded-lg flex items-center gap-2 text-sm hover:brightness-110">
                <LogIn className="w-4 h-4" /> Iniciar Sesión
              </button>
            </div>
          </form>
        )}
      </section>

      {/* Appearance Module */}
      <section className="bg-brand-container border border-brand-border rounded-2xl p-5 shadow-lg space-y-4 flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="font-bold text-sm text-brand-on-surface flex items-center gap-2">
            {isDarkMode ? <Moon className="w-4 h-4 text-brand-primary"/> : <Sun className="w-4 h-4 text-brand-primary"/>}
            Modo Visual
          </h3>
          <p className="text-xs text-brand-on-surface-variant">Alternar entre modo Noche y Día</p>
        </div>
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`w-12 h-6 rounded-full relative transition-colors ${isDarkMode ? 'bg-brand-primary' : 'bg-brand-border'}`}
        >
          <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${isDarkMode ? 'translate-x-7' : 'translate-x-1'}`}></div>
        </button>
      </section>

      {/* Danger Zone */}
      <section className="bg-brand-error/5 border border-brand-error/20 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="space-y-1">
          <h3 className="font-bold text-sm text-brand-error flex items-center gap-2">
            <Trash2 className="w-4 h-4" />
            Zona de Peligro
          </h3>
          <p className="text-xs text-brand-on-surface-variant">Borra toda tu información registrada y vuelve a cero.</p>
        </div>
        <button onClick={handleReset} className="w-full bg-brand-error/10 text-brand-error border border-brand-error/30 hover:bg-brand-error/20 hover:border-brand-error font-bold py-3 rounded-xl text-sm transition-all">
          Resetear Información
        </button>
      </section>
    </div>
  );
}
