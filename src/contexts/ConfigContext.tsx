import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

interface ConfigContextType {
  strings: Record<string, string>;
  sizes: Record<string, number>;
  adminEmails: string[];
  t: (key: string, defaultText?: string) => string;
  ts: (key: string, defaultSize: number) => React.CSSProperties;
}

const defaultStrings: Record<string, string> = {
  "app_title": "Driver Cash",
  "tab_home": "Inicio",
  "tab_advances": "Adelantos",
  "tab_journal": "Diario",
  "tab_goals": "Metas",
  "tab_achievements": "Logros",
  "welcome_title": "Bienvenido a Driver Cash",
  "login_btn": "Iniciar Sesión",
  "logout_btn": "Cerrar Sesión",
  "register_btn": "Registrarse",
  "home_start_shift": "Iniciar Día Laboral",
  "home_shift_active": "¡Estás en Turno Activo!",
  "home_end_shift": "Finalizar Turno",
  "home_swipe_start": "Desliza para arrancar",
  "home_daily_goal": "Objetivo diario",
  "home_daily_req": "Facturación diaria necesaria",
  "home_net_margin": "Margen Neto",
  "home_total_billing": "Facturación Total Mensual",
  "home_billing": "Facturacion",
  "home_kms_month": "Kms mes",
  "home_fuel_month": "Combustible mes",
  "home_stats_title": "Cuenta y Sincronización",
  "home_days_left": "Días hábiles rest.",
  "home_tooltip_net_margin": "Margen Neto Mensual:",
  "home_tooltip_formula": "Fórmula: Facturación - Gastos Fijos Mensuales. Se muestra en negativo hasta cubrir los gastos.",
  "home_goal_label": "Meta: ",
  "home_budget": "Presupuesto",
  "home_spent": "Gastado",
  "home_view_history": "Ver Histórico de Métricas",
  "home_settings_title": "Ajustes",
  "home_logged_in_as": "Conectado como ",
  "home_logout": "Cerrar Sesión",
  "home_email_label": "Correo Electrónico",
  "home_password_label": "Contraseña",
  "home_already_have_account": "¿Ya tienes cuenta? Inicia Sesión",
  "home_no_account": "¿No tienes cuenta? Regístrate",
  "home_create_account": "Crear Cuenta",
  "home_login": "Iniciar Sesión",
  "home_visual_mode": "Modo Visual",
  "home_visual_mode_desc": "Alternar entre modo Noche y Día",
  "home_danger_zone": "Zona de Peligro",
  "home_danger_zone_desc": "Borra toda tu información registrada y vuelve a cero.",
  "home_reset_info": "Resetear Información",
  "admin_tab": "Admin Panel"
};

const ConfigContext = createContext<ConfigContextType>({
  strings: defaultStrings,
  sizes: {},
  adminEmails: ['drivercash.aplicacion@gmail.com'],
  t: (key, defaultText) => defaultText || defaultStrings[key] || key,
  ts: (key, defaultSize) => ({ fontSize: `${defaultSize}px` }),
});

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [strings, setStrings] = useState<Record<string, string>>(defaultStrings);
  const [sizes, setSizes] = useState<Record<string, number>>({});
  const [adminEmails, setAdminEmails] = useState<string[]>(['drivercash.aplicacion@gmail.com']);

  useEffect(() => {
    // Escuchar cambios en la configuración desde Firebase en tiempo real
    const unsubscribe = onSnapshot(doc(db, "appConfig", "main"), (docSnap) => {
        if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.strings) {
          setStrings((prev) => ({ ...prev, ...data.strings }));
        }
        if (data.sizes) {
          setSizes(data.sizes);
        }
        if (data.adminEmails) {
          setAdminEmails(data.adminEmails);
        }
      }
    }, (error) => {
      console.error("Error fetching config:", error);
    });

    return () => unsubscribe();
  }, []);

  const t = (key: string, defaultText?: string) => {
    return strings[key] || defaultText || defaultStrings[key] || key;
  };

  const ts = (key: string, defaultSize: number): React.CSSProperties => {
    const size = sizes[key] || defaultSize;
    return { fontSize: `${size}px` };
  };

  return (
    <ConfigContext.Provider value={{ strings, sizes, adminEmails, t, ts }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => useContext(ConfigContext);
