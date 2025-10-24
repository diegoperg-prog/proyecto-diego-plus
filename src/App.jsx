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

  const playSound = () => {
    const audio = new Audio("/sound/pop.ogg");
    audio.volume = 0.4;
    audio.play().catch(() => {});
  };

  const vibrate = () => {
    if (navigator.vibrate) navigator.vibrate(80);
  };

  const addPoints = (pts) => {
    setDailyPoints((p) => p + pts);
    setWeeklyPoints((p) => p + pts);
    setRecentGain(`+${pts}`);
    playSound();
    vibrate();
    setTimeout(() => setRecentGain(null), 1000);
  };

  return (
    <div className="app-container">
      {/* LOGO */}
      <img src="/icons/icon-192.png" alt="Diego+ logo" className="logo" />

      {/* PUNTOS */}
      <div className="points-display">
        <div className="points-number">
          {dailyPoints}
          <AnimatePresence>
            {recentGain && (
              <motion.span
                key={recentGain}
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 0, y: -40 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="points-gain"
              >
                {recentGain}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <div className="points-today">puntos de hoy</div>
        <div className="points-week">{weeklyPoints} pts en la semana</div>
      </div>

      {/* BOTONES DE ACTIVIDADES */}
      <div className="buttons-grid">
        {activities.map((a) => (
          <motion.button
            key={a.label}
            onClick={() => addPoints(a.pts)}
            whileTap={{ scale: 0.95 }}
            className="activity-btn"
          >
            <span>{a.label}</span>
            <small>+{a.pts}</small>
          </motion.button>
        ))}
      </div>

      {/* BOTONES INFERIORES */}
      <div className="bottom-buttons">
        <motion.button
          onClick={() => setShowSettings(true)}
          whileTap={{ scale: 0.9 }}
          className="circle-btn"
        >
          <Settings size={28} />
        </motion.button>

        <motion.button
          onClick={() => setShowProgress(true)}
          whileTap={{ scale: 0.9 }}
          className="circle-btn"
        >
          <BarChart3 size={28} />
        </motion.button>
      </div>

      {/* MODAL AJUSTES */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            className="modal-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="modal-card"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <h2>⚙️ Ajustes</h2>
              <ul>
                <li>🔊 Sonido – On</li>
                <li>📳 Vibración – On</li>
                <li>🎁 Recompensas configuradas</li>
              </ul>
              <button className="close-btn" onClick={() => setShowSettings(false)}>
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
            className="modal-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="modal-card"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <h2>📈 Evolución diaria</h2>
              <p>Próximamente: gráfico de progreso semanal.</p>
              <button className="close-btn" onClick={() => setShowProgress(false)}>
                Cerrar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
