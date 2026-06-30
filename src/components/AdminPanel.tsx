import React, { useState, useEffect } from 'react';
import { useConfig } from '../contexts/ConfigContext';
import { doc, setDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Settings2, Save } from 'lucide-react';

export default function AdminPanel() {
  const { strings, sizes, adminEmails } = useConfig();
  const [localStrings, setLocalStrings] = useState<Record<string, string>>({});
  const [localSizes, setLocalSizes] = useState<Record<string, number>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("General");

  useEffect(() => {
    setLocalStrings(strings);
    setLocalSizes(sizes);
  }, [strings, sizes]);

  const currentUser = auth.currentUser;
  const isAuthorized = currentUser && adminEmails.includes(currentUser.email || "");

  if (!isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-4">
        <Settings2 size={48} className="text-brand-error opacity-50" />
        <h2 className="text-xl font-bold text-brand-error">Acceso Restringido</h2>
        <p className="text-sm text-brand-on-surface-variant">
          No tienes permisos para acceder al Panel de Administración.
        </p>
      </div>
    );
  }

  const handleStringChange = (key: string, value: string) => {
    setLocalStrings(prev => ({ ...prev, [key]: value }));
  };

  const handleSizeChange = (key: string, value: number) => {
    setLocalSizes(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await setDoc(doc(db, "appConfig", "main"), {
        strings: localStrings,
        sizes: localSizes
      }, { merge: true });
      alert("Configuración guardada exitosamente");
    } catch (error: any) {
      alert("Error al guardar: " + error.message);
    }
    setIsSaving(false);
  };

  return (
    <div className="p-4 space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-brand-primary uppercase">Panel CMS</h2>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-brand-primary text-brand-bg px-4 py-2 rounded-xl font-bold text-sm flex items-center space-x-2 disabled:opacity-50"
        >
          <Save size={16} />
          <span>{isSaving ? "Guardando..." : "Guardar Cambios"}</span>
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {["General", "Inicio", "Diario", "Metas", "Logros", "Adelantos"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${activeTab === tab ? "bg-brand-primary text-black" : "bg-brand-container-highest text-brand-on-surface hover:bg-brand-container-highest/80"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-brand-surface rounded-2xl p-5 border border-brand-border space-y-4">
        <h3 className="font-bold text-brand-on-surface mb-4">Gestión de Textos y Tamaños - {activeTab}</h3>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {Object.entries(localStrings)
            .filter(([key]) => {
              if (activeTab === "Inicio") return key.startsWith("home_");
              if (activeTab === "Diario") return key.startsWith("journal_");
              if (activeTab === "Metas") return key.startsWith("goals_");
              if (activeTab === "Logros") return key.startsWith("achievements_");
              if (activeTab === "Adelantos") return key.startsWith("advances_");
              return !key.startsWith("home_") && !key.startsWith("journal_") && !key.startsWith("goals_") && !key.startsWith("achievements_") && !key.startsWith("advances_");
            })
            .map(([key, value]) => (
            <div key={key} className="flex flex-col space-y-1 pb-3 border-b border-brand-border/30 last:border-0">
              <label className="text-[10px] uppercase font-bold text-brand-on-surface-variant">{key}</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={value} 
                  onChange={(e) => handleStringChange(key, e.target.value)}
                  className="bg-brand-bg border border-brand-border rounded-lg px-3 py-2 text-sm text-brand-on-surface focus:border-brand-primary outline-none flex-1"
                />
                <div className="relative flex items-center bg-brand-bg border border-brand-border rounded-lg w-20">
                  <input 
                    type="number" 
                    value={localSizes[key] || 16}
                    onChange={(e) => handleSizeChange(key, parseInt(e.target.value) || 16)}
                    className="w-full bg-transparent px-2 py-2 text-sm text-center text-brand-on-surface outline-none appearance-none"
                    title="Tamaño de fuente (px)"
                  />
                  <span className="text-[10px] text-brand-on-surface-variant absolute right-2 pointer-events-none">px</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
