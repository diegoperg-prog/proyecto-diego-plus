import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, BarChart3 } from "lucide-react";
import "./index.css";

export default function App() {
  const [dailyPoints, setDailyPoints] = useState(0);
  const [weeklyPoints, setWeeklyPoints] = useState(0);
  const [recentGain, setRecentGain] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showProgress, setShowProgress] = useState(false);

  const activities = [
    { label: "Entrené", pts: 10 },
    { label: "Caminé 30 min", pts: 5 },
    { label: "Comí saludable", pts: 5 },
    { label: "Dormí 7h+", pts: 5 },
    { label: "Sin pantallas", pts: 5 },
    { label: "Reflexioné", pts: 5 },
    { label: "Tarea laboral", pts: 10 },
    { label: "Aprendí algo", pts: 5 },
  ];

  // 🔊 Reproduce un sonido al sumar puntos
  const playSound = () => {
    const audio = new Audio();
    audio.src = "/sound/pop.ogg";
    audio.type = "audio/ogg";
    audio.volume = 0.4;
    audio.play().catch(() => {});
  };

  // 📈 Sumar puntos y mostrar animación + sonido
  const addPoints = (pts) => {
    setDailyPoints((p) => p + pts);
    setWeeklyPoints((p) => p + pts);
    setRecentGain(`+${pts}`);
    playSound();
    setTimeout(() => setRecentGain(null), 1000);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-between py-6 px-6 relative overflow-hidden">
      {/* LOGO */}
      <img
        src="/icons/icon-192.png"
        alt="Diego+ logo"
        className="w-24 h-24 mt-4 mb-4 opacity-90"
      />

      {/* Display de puntos */}
      <div className="text-center mb-6 relative">
        <div className="text-5xl font-extrabold text-green-400 leading-tight relative">
          {dailyPoints}
          <AnimatePresence>
            {recentGain && (
              <motion.span
                key={recentGain}
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 0, y: -30 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="absolute left-1/2 -translate-x-1/2 text-green-400 text-3xl font-bold"
              >
                {recentGain}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <div className="text-gray-300 text-base tracking-wide mb-1">
          puntos de hoy
        </div>
        <div className="text-yellow-400 text-lg font-semibold">
          {weeklyPoints} pts en la semana
        </div>
      </div>

      {/* Botones principales */}
      <motion.div
        className="grid grid-cols-2 gap-4 w-full max-w-xs justify-items-center flex-grow"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {activities.map((a) => (
          <motion.button
            key={a.label}
            onClick={() => addPoints(a.pts)}
            whileTap={{ scale: 0.95 }}
            className="bg-zinc-900 text-white py-4 rounded-2xl text-center w-full shadow-md text-base font-medium hover:bg-zinc-800 transition-all"
          >
            {a.label}
            <div className="text-green-400 text-sm mt-1">+{a.pts}</div>
          </motion.button>
        ))}
      </motion.div>

      {/* Botones inferiores */}
      <div className="flex justify-center gap-16 mb-4 mt-6">
        <motion.button
          onClick={() => setShowSettings(true)}
          whileTap={{ scale: 0.9 }}
          className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center shadow-md hover:bg-zinc-800 transition-all"
        >
          <Settings size={26} />
        </motion.button>

        <motion.button
          onClick={() => setShowProgress(true)}
          whileTap={{ scale: 0.9 }}
          className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center shadow-md hover:bg-zinc-800 transition-all"
        >
          <BarChart3 size={26} />
        </motion.button>
      </div>

      {/* MODAL AJUSTES */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-zinc-900 rounded-2xl p-6 w-80 text-sm"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <h2 className="font-bold text-lg mb-4">⚙️ Ajustes</h2>
              <ul className="space-y-2">
                <li>🔊 Sonido – On</li>
                <li>📳 Vibración – On</li>
                <li>🎁 Recompensas configuradas</li>
              </ul>
              <button
                className="mt-6 bg-green-500 text-black rounded-xl px-4 py-2 w-full"
                onClick={() => setShowSettings(false)}
              >
                Cerrar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL EVOLUCIÓN */}
      <AnimatePresence>
        {showProgress && (
          <motion.div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-zinc-900 rounded-2xl p-6 w-80"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <h2 className="font-bold text-lg mb-4">📈 Evolución diaria</h2>
              <p className="text-sm text-gray-300 mb-2">
                En la próxima versión verás aquí tus barras de progreso semanal.
              </p>
              <button
                className="mt-4 bg-green-500 text-black rounded-xl px-4 py-2 w-full"
                onClick={() => setShowProgress(false)}
              >
                Cerrar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
