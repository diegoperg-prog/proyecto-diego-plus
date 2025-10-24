import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, BarChart3 } from "lucide-react";
import "./index.css";

export default function App() {
  const [points, setPoints] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [showProgress, setShowProgress] = useState(false);

  const activities = [
    { label: "Entrené", pts: 10 },
    { label: "Caminé 30 min", pts: 5 },
    { label: "Comí saludable", pts: 5 },
    { label: "Dormí 7 h +", pts: 5 },
    { label: "10 min sin pantallas", pts: 5 },
    { label: "Escribí / reflexioné", pts: 5 },
    { label: "Tarea laboral", pts: 10 },
    { label: "Aprendí algo nuevo", pts: 5 },
  ];

  const addPoints = (pts) => setPoints(points + pts);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center px-6 py-8">
      <h1 className="text-xl font-bold mb-6">Diego+ — Tu progreso de hoy</h1>

      <motion.div
        className="flex flex-col gap-6 w-full max-w-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {activities.map((a) => (
          <motion.button
            key={a.label}
            onClick={() => addPoints(a.pts)}
            whileTap={{ scale: 0.97 }}
            className="bg-zinc-900 text-white rounded-2xl py-4 text-center shadow-md active:shadow-sm"
          >
            {a.label}  (+{a.pts})
          </motion.button>
        ))}

        <div className="flex justify-between mt-4">
          <button
            className="flex-1 bg-zinc-800 py-3 rounded-2xl mr-2 flex items-center justify-center gap-2"
            onClick={() => setShowSettings(true)}
          >
            <Settings size={18} /> Ajustes
          </button>
          <button
            className="flex-1 bg-zinc-800 py-3 rounded-2xl ml-2 flex items-center justify-center gap-2"
            onClick={() => setShowProgress(true)}
          >
            <BarChart3 size={18} /> Evolución
          </button>
        </div>

        <div className="text-center mt-6 text-lg font-semibold">
          Total hoy: <span className="text-green-400">{points}</span> pts
        </div>
      </motion.div>

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
                (Simulado) Tu progreso semanal pronto estará disponible.
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
