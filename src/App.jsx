import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, BarChart3, ArrowLeft } from "lucide-react";
import "./index.css";

export default function App() {
  const STORAGE_KEY = "diegoPlusDataV2";

  const [dailyPoints, setDailyPoints] = useState(0);
  const [weeklyPoints, setWeeklyPoints] = useState(0);
  const [recentGain, setRecentGain] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [viewMode, setViewMode] = useState("week"); // week | month
  const [records, setRecords] = useState([]); // { date, points }

  // ✅ Cargar datos guardados
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      setDailyPoints(data.dailyPoints || 0);
      setWeeklyPoints(data.weeklyPoints || 0);
      setRecords(data.records || []);
    }
  }, []);

  // ✅ Guardar automáticamente
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ dailyPoints, weeklyPoints, records })
    );
  }, [dailyPoints, weeklyPoints, records]);

  // 📆 Registrar automáticamente el cambio de día
  useEffect(() => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const lastDate = localStorage.getItem("diegoPlusLastDate");

    if (lastDate && lastDate !== todayStr) {
      // Guardar puntos del día anterior
      if (dailyPoints > 0) {
        setRecords((prev) => [
          ...prev.filter((r) => r.date !== lastDate),
          { date: lastDate, points: dailyPoints },
        ]);
      }
      setDailyPoints(0);
    }

    localStorage.setItem("diegoPlusLastDate", todayStr);
  }, []);

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

  // 🔢 Filtrar registros por rango temporal
  const getFilteredRecords = () => {
    const now = new Date();
    const cutoff = new Date(
      now.getTime() - (viewMode === "week" ? 6 : 29) * 24 * 60 * 60 * 1000
    );
    const filtered = records.filter((r) => new Date(r.date) >= cutoff);

    // Rellenar días vacíos
    const allDays = [];
    for (let i = 0; i < (viewMode === "week" ? 7 : 30); i++) {
      const d = new Date(now.getTime() - (viewMode === "week" ? 6 - i : 29 - i) * 24 * 60 * 60 * 1000);
      const ds = d.toISOString().slice(0, 10);
      const found = filtered.find((r) => r.date === ds);
      allDays.push({ date: ds, points: found ? found.points : 0 });
    }
    return allDays;
  };

  const filtered = getFilteredRecords();

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

{/* ⚙️ MODAL AJUSTES */}
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
          <li>💾 Guardado automático – Activo</li>
        </ul>

        {/* Nuevo botón de borrado */}
        <button
          className="danger-btn"
          onClick={() => {
            if (
              window.confirm(
                "¿Seguro que querés borrar los puntos de hoy?"
              )
            ) {
              setWeeklyPoints((w) => w - dailyPoints);
              setDailyPoints(0);
            }
          }}
        >
          🗑️ Borrar puntos de hoy
        </button>

        <button
          className="close-btn"
          onClick={() => setShowSettings(false)}
        >
          Cerrar
        </button>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

      {/* 📈 MODAL EVOLUCIÓN */}
      <AnimatePresence>
        {showProgress && (
          <motion.div className="modal-bg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="modal-card progress-card" initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}>
              <div className="progress-header">
                <motion.button whileTap={{ scale: 0.9 }} className="back-btn" onClick={() => setShowProgress(false)}>
                  <ArrowLeft size={20} />
                </motion.button>
                <h2>📈 Evolución {viewMode === "week" ? "semanal" : "mensual"}</h2>
              </div>

              {/* Selector semana/mes */}
              <div className="view-toggle">
                <button
                  className={`toggle-btn ${viewMode === "week" ? "active" : ""}`}
                  onClick={() => setViewMode("week")}
                >
                  Semana
                </button>
                <button
                  className={`toggle-btn ${viewMode === "month" ? "active" : ""}`}
                  onClick={() => setViewMode("month")}
                >
                  Mes
                </button>
              </div>

              {/* Gráfico */}
              <div className="bars-container">
                {filtered.map((r, i) => (
                  <div key={i} className="bar-group">
                    <div
                      className="bar"
                      style={{ height: `${Math.min(r.points * 2, 100)}px` }}
                    ></div>
                    <span className="bar-label">
                      {viewMode === "week"
                        ? ["D", "L", "M", "X", "J", "V", "S"][i]
                        : new Date(r.date).getDate()}
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
