import { useState } from "react";
import { Bell, User, Car, Settings, X, ShieldAlert, BadgeInfo } from "lucide-react";

interface HeaderProps {
  driverName: string;
  setDriverName: (name: string) => void;
  carModel: string;
  setCarModel: (model: string) => void;
  avatarUrl: string;
  setAvatarUrl: (url: string) => void;
  unreadNotifications: number;
  setUnreadNotifications: (count: number) => void;
  currencySymbol: string;
  setCurrencySymbol: (sym: string) => void;
}

export default function Header({
  driverName,
  setDriverName,
  carModel,
  setCarModel,
  avatarUrl,
  setAvatarUrl,
  unreadNotifications,
  setUnreadNotifications,
  currencySymbol,
  setCurrencySymbol,
}: HeaderProps) {
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const predefinedAvatars = [
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBcL-6O-RUAJQq_YWM3Hg01FEEAFziwCNorVtfdNXYKTNgI0Jrc0vGZVE8sbvEWUtUiK4VyPnUY2ItlesODy6eev2S4pPNJoR8Sq55BaZ7_e1OYQAE2c96PlvFdR5dBpjyTTo5YocSSYibDbYg89HuPCJMeK6wGyd9yP0EiMeNTKP0ZNcmYO5FcYrCxxKaEgMZzj3RmVE8HXSvZMHCyrA7qNK_C-7L2FrAuL-oSdtKCtSPn0WZCZKe2_souEyEE0KN0wdrlQ3PVOQ"
  ];

  const simulatedAlerts = [
    {
      id: 1,
      title: "Alta Demanda Anticipada",
      desc: "Zonas de microcentro reportan alta demanda por partido de fútbol local esta noche (20:00 - 23:00).",
      time: "Hace 10 min",
      important: true,
    },
    {
      id: 2,
      title: "Cambio de Aceite Programado",
      desc: "Estás a menos de 500 kms del intervalo meta establecido para tu cambio de aceite preventivo.",
      time: "Hace 2 horas",
      important: false,
    },
    {
      id: 3,
      title: "Fondo de Reserva Estimado",
      desc: "Excelente progreso. Ya cubriste el 50% de tu objetivo de reserva vehicular de este mes.",
      time: "Ayer",
      important: false,
    }
  ];

  return (
    <>
      <header id="top-app-bar" className="fixed top-0 w-full z-40 bg-brand-bg/85 backdrop-blur-xl border-b border-brand-border/60 transition-all">
        <div className="max-w-7xl mx-auto px-4 h-15 flex justify-between items-center">
          {/* Brand Info & Avatar triggers profile modal */}
          <div className="flex items-center gap-3">
            <button
              id="avatar-trigger-btn"
              onClick={() => setProfileModalOpen(true)}
              className="w-9 h-9 rounded-full overflow-hidden border border-brand-primary/30 hover:border-brand-primary active:scale-95 transition-all cursor-pointer relative group"
              title="Ver Perfil de Conductor"
            >
              <img
                src={avatarUrl}
                alt="Conductor Foto"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Settings className="w-3 h-3 text-white" />
              </div>
            </button>
            
            <div className="flex flex-col">
              <h1 className="font-extrabold text-lg md:text-xl tracking-tight text-white flex items-center gap-1.5">
                <span className="text-brand-primary">Driver</span>
                <span className="text-white">Cash</span>
              </h1>
              <span className="text-[10px] text-brand-on-surface-variant uppercase tracking-wider font-semibold -mt-1 hidden sm:inline-block">
                Socio Profesional • {carModel}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Stats on Header */}
            <div className="hidden md:flex items-center gap-4 bg-brand-container/40 px-3 py-1 rounded-lg border border-brand-border/40 text-xs">
              <div>
                <span className="text-brand-on-surface-variant block text-[9px] uppercase tracking-wide">Chofer</span>
                <span className="font-bold text-white text-right">{driverName}</span>
              </div>
              <div className="h-6 w-[1px] bg-brand-border"></div>
              <div>
                <span className="text-brand-on-surface-variant block text-[9px] uppercase tracking-wide">Divisa</span>
                <span className="font-bold text-brand-primary uppercase">{currencySymbol} (USD)</span>
              </div>
            </div>

            {/* Notification triggers alerts drawer */}
            <button
              id="notifications-bell-btn"
              onClick={() => {
                setNotificationsOpen(true);
                setUnreadNotifications(0);
              }}
              className="relative p-2.5 rounded-xl hover:bg-brand-container-highest/50 active:scale-95 text-brand-on-surface-variant hover:text-white transition-all cursor-pointer"
              aria-label="Notificaciones"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifications > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-brand-primary text-black font-extrabold text-[9px] rounded-full flex items-center justify-center animate-pulse">
                  {unreadNotifications}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Profile Modal */}
      {profileModalOpen && (
        <div id="profile-edit-modal" className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
            onClick={() => setProfileModalOpen(false)}
          ></div>
          
          {/* Modal Container */}
          <div className="bg-brand-container border border-brand-border rounded-xl w-full max-w-md overflow-hidden relative z-10 shadow-2xl p-6 text-brand-on-surface">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-brand-border">
              <div className="flex items-center gap-2 text-brand-primary">
                <Settings className="w-5 h-5" />
                <h3 className="font-bold text-lg">Perfil del Conductor</h3>
              </div>
              <button 
                id="close-profile-modal"
                onClick={() => setProfileModalOpen(false)}
                className="p-1 rounded-lg hover:bg-brand-container-highest text-brand-on-surface-variant hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Profile pic selection */}
              <div>
                <label className="text-xs font-semibold text-brand-on-surface-variant block mb-2 uppercase tracking-wider">
                  Foto de Perfil
                </label>
                <div className="flex flex-wrap gap-2.5 items-center">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-brand-primary shrink-0">
                    <img src={avatarUrl} alt="Elegido" className="w-full h-full object-cover" />
                  </div>
                  <div className="grid grid-cols-5 gap-1.5">
                    {predefinedAvatars.map((url, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setAvatarUrl(url)}
                        className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-all hover:scale-105 cursor-pointer ${
                          avatarUrl === url ? "border-brand-primary" : "border-transparent opacity-60 hover:opacity-100"
                        }`}
                      >
                        <img src={url} alt={`Avatar ${i}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Driver Name input */}
              <div>
                <label className="text-xs font-semibold text-brand-on-surface-variant block mb-1 uppercase tracking-wider">
                  Nombre del Conductor
                </label>
                <input
                  type="text"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  placeholder="Ej. Carlos Martínez"
                  className="w-full bg-brand-bg border border-brand-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-primary transition-colors"
                />
              </div>

              {/* Vehicle info input */}
              <div>
                <label className="text-xs font-semibold text-brand-on-surface-variant block mb-1 uppercase tracking-wider">
                  Vehículo de Trabajo (Modelo)
                </label>
                <div className="relative">
                  <Car className="absolute left-3 top-2.5 w-4 h-4 text-brand-on-surface-variant" />
                  <input
                    type="text"
                    value={carModel}
                    onChange={(e) => setCarModel(e.target.value)}
                    placeholder="Ej. Chevrolet Prism 1.4"
                    className="w-full bg-brand-bg border border-brand-border rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-brand-primary transition-colors"
                  />
                </div>
              </div>

              {/* Currency Symbol selection */}
              <div>
                <label className="text-xs font-semibold text-brand-on-surface-variant block mb-1 uppercase tracking-wider">
                  Símbolo de Moneda
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { symbol: "$", label: "USD/ARS/MXN" },
                    { symbol: "€", label: "Euro" },
                    { symbol: "R$", label: "Real" },
                    { symbol: "CLP", label: "Pesos Ch." }
                  ].map((curr) => (
                    <button
                      key={curr.symbol}
                      type="button"
                      onClick={() => setCurrencySymbol(curr.symbol)}
                      className={`py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                        currencySymbol === curr.symbol
                          ? "bg-brand-primary text-black border-brand-primary"
                          : "bg-brand-bg text-brand-on-surface border-brand-border hover:border-brand-on-surface-variant"
                      }`}
                    >
                      {curr.symbol}
                      <span className="block text-[8px] font-normal font-sans text-brand-on-surface-variant">
                        {curr.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-brand-border flex justify-end">
              <button
                type="button"
                onClick={() => setProfileModalOpen(false)}
                className="px-4 py-2 bg-brand-primary hover:bg-brand-primary/90 text-black font-bold text-xs rounded-lg transition-colors cursor-pointer"
              >
                Guardar y Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Side Drawer */}
      {notificationsOpen && (
        <div id="notifications-drawer" className="fixed inset-0 z-50 flex justify-end">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black/60" 
            onClick={() => setNotificationsOpen(false)}
          ></div>
          
          {/* Drawer Content */}
          <div className="bg-brand-container border-l border-brand-border w-full max-w-sm h-full relative z-10 flex flex-col shadow-2xl p-6 text-brand-on-surface">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-brand-border shrink-0">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-brand-primary" />
                <h3 className="font-bold text-lg text-white">Centro de Alertas</h3>
              </div>
              <button 
                id="close-notifications-drawer"
                onClick={() => setNotificationsOpen(false)}
                className="p-1 rounded-lg hover:bg-brand-container-highest text-brand-on-surface-variant hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {simulatedAlerts.map((alert) => (
                <div 
                  key={alert.id}
                  className={`p-3.5 rounded-xl border ${
                    alert.important 
                      ? "bg-brand-primary/5 border-brand-primary/30" 
                      : "bg-brand-bg/40 border-brand-border"
                  }`}
                >
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <span className={`text-xs font-bold ${
                      alert.important ? "text-brand-primary" : "text-white"
                    }`}>
                      {alert.title}
                    </span>
                    <span className="text-[9px] text-brand-on-surface-variant font-mono whitespace-nowrap shrink-0">
                      {alert.time}
                    </span>
                  </div>
                  <p className="text-xs text-brand-on-surface-variant leading-relaxed">
                    {alert.desc}
                  </p>
                  
                  {alert.important && (
                    <div className="mt-2.5 flex items-center gap-1.5 bg-brand-primary/10 border border-brand-primary/20 rounded px-2 py-1 text-[10px] text-brand-primary font-medium">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      Tarifa dinámica esperada +35%
                    </div>
                  )}
                </div>
              ))}

              <div className="p-3.5 bg-brand-container-high/30 border border-brand-border/40 rounded-xl flex items-start gap-2.5">
                <BadgeInfo className="w-4 h-4 text-brand-tertiary mt-0.5 shrink-0" />
                <div>
                  <span className="text-xs font-bold text-white block mb-0.5">Métrica Automatizada</span>
                  <p className="text-[11px] text-brand-on-surface-variant leading-relaxed">
                    ¿Sabías que tu Margen Neto Real por Hora actual es de <strong className="text-brand-primary">14.50 USD/Hr</strong>? Esto es calculado dividiendo tu utilidad limpia tras restar insumos operacionales entre el tiempo de conducción registrado.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-brand-border shrink-0">
              <button
                type="button"
                onClick={() => setNotificationsOpen(false)}
                className="w-full py-2 bg-brand-bg hover:bg-brand-container-high text-brand-on-surface text-center font-bold text-xs rounded-lg border border-brand-border transition-colors cursor-pointer"
              >
                Entendido, Cerrar Panel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
