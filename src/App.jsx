import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, BarChart3, ArrowLeft } from "lucide-react";
import "./index.css";

export default function App() {
  const [dailyPoints, setDailyPoints] = useState(0);
  const [weeklyPoints, setWeeklyPoints] = useState(0);
  const [recentGain, setRecentGain] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [history, setHistory] = useState(Array(7).fill(0)); // 7 días

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

  // Simula guardar puntos del día al cerrar app (placeholder)
  const saveDay = () => {
    const today = new Date().getDay();
    const newHistory = [...history];
    newHistory[today] = dailyPoints;
    setHistory(newHistory);
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
            <motion.div className="modal-card" initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}>
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

      {/* 📈 MODAL EVOLUCIÓN */}
      <AnimatePresence>
        {showProgress && (
          <motion.div
            className="modal-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div className="modal-card progress-card" initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}>
              <div className="progress-header">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className="back-btn"
                  onClick={() => setShowProgress(false)}
                >
                  <ArrowLeft size={20} />
                </motion.button>
                <h2>📈 Evolución semanal</h2>
              </div>

              <div className="bars-container">
                {history.map((value, i) => (
                  <div key={i} className="bar-group">
                    <div
                      className="bar"
                      style={{ height: `${Math.min(value * 2, 100)}px` }}
                    ></div>
                    <span className="bar-label">
                      {["D", "L", "M", "X", "J", "V", "S"][i]}
                    </span>
                  </div>
                ))}
              </div>

              <p className="progress-hint">Meta: 50 pts/día</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
