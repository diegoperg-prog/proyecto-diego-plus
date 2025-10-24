import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, BarChart3 } from "lucide-react";
import "./index.css";

export default function App() {
  const [dailyPoints, setDailyPoints] = useState(0);
  const [weeklyPoints, setWeeklyPoints] = useState(0);
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

  const addPoints = (pts) => {
    setDailyPoints((p) => p + pts);
    setWeeklyPoints((p) => p + pts);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-between py-8 px-6">
      {/* Display superior */}
      <motion.div
        className="w-full max-w-xs bg-zinc-900 rounded-3xl py-6 text-center shadow-lg mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-4xl font-bold text-green-400">{dailyPoints}</div>
        <div className="text-sm text-gray-400 tracking-wide">puntos de hoy</div>
        <div className="mt-2 text-lg font-semibold text-yellow-400">
          {weeklyPoints} pts en la semana
        </div>
      </motion.div>

      {/* Cuadrícula de botones */}
      <motion.div
        className="grid grid-cols-2 gap-4 w-full max-w-xs mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {activities.map((a) => (
          <motion.button
            key={a.label}
            onClick={() => addPoints(a.pts)}
            whileTap={{ scale: 0.95 }}
            className="bg-zinc-800 py-4 rounded-2xl text-center shadow-md active:shadow-sm text-base font-medium"
          >
            {a.label}
            <div className="text-green-400 text-sm mt-1">+{a.pts}</div>
          </motion.button>
        ))}
      </motion.div>

      {/* Botones inferiores */}
      <div className="flex justify-center gap-10 mb-2">
        <motion.button
          onClick={() => setShowSettings(true)}
          whileTap={{ scale: 0.9 }}
          className="w-14 h-14 bg-zinc-800 rounded-full flex items-center justify-center shadow-md"
        >
          <Settings size={22} />
        </motion.button>

        <motion.button
          onClick={() => setShowProgress(true)}
          whileTap={{ scale: 0.9 }}
          className="w-14 h-14 bg-zinc-800 rounded-full flex items-center justify-center shadow-md"
        >
          <BarChart3 size={22} />
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
