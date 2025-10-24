import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, BarChart3, ArrowLeft, Plus } from "lucide-react";
import "./index.css";

export default function App() {
  const STORAGE_KEY = "diegoPlusDataV23";

  const [dailyPoints, setDailyPoints] = useState(0);
  const [weeklyPoints, setWeeklyPoints] = useState(0);
  const [recentGain, setRecentGain] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [viewMode, setViewMode] = useState("week");
  const [records, setRecords] = useState([]);
  const [activities, setActivities] = useState([]);
  const [showSplash, setShowSplash] = useState(true);
  const [newActivity, setNewActivity] = useState("");

  const motivationalPhrases = [
    "Hoy también suma 💪",
    "Pequeños pasos → grandes resultados 🌱",
    "Lo importante es avanzar 🚀",
    "Constancia mata talento 💯",
    "Estás construyendo disciplina 🔥",
    "Sumar puntos es sumar bienestar 💚",
  ];

  const phrase = motivationalPhrases[new Date().getDay() % motivationalPhrases.length];

  // ✅ Cargar progreso
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      setDailyPoints(data.dailyPoints || 0);
      setWeeklyPoints(data.weeklyPoints || 0);
      setRecords(data.records || []);
      setActivities(
        data.activities || [
          { label: "Entrené", pts: 10 },
          { label: "Caminé 30 min", pts: 5 },
          { label: "Comí saludable", pts: 5 },
          { label: "Dormí 7h+", pts: 5 },
          { label: "Sin pantallas", pts: 5 },
          { label: "Reflexioné", pts: 5 },
          { label: "Tarea laboral", pts: 10 },
          { label: "Aprendí algo", pts: 5 },
        ]
      );
    } else {
      setActivities([
        { label: "Entrené", pts: 10 },
        { label: "Caminé 30 min", pts: 5 },
        { label: "Comí saludable", pts: 5 },
        { label: "Dormí 7h+", pts: 5 },
        { label: "Sin pantallas", pts: 5 },
        { label: "Reflexioné", pts: 5 },
        { label: "Tarea laboral", pts: 10 },
        { label: "Aprendí algo", pts: 5 },
      ]);
    }

    setTimeout(() => setShowSplash(false), 1200);
  }, []);

  // ✅ Guardar datos
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ dailyPoints, weeklyPoints, records, activities })
    );
  }, [dailyPoints, weeklyPoints, records, activities]);

  // ✅ Cambio de día
  useEffect(() => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const lastDate = localStorage.getItem("diegoPlusLastDate");

    if (lastDate && lastDate !== todayStr) {
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
    setTimeout(() => setRecentGain(null), 800);
  };

  const getProgressColor = () => {
    if (weeklyPoints < 100) return "#4CAF50";
    if (weeklyPoints < 200) return "#FFD700";
    return "#FF5722";
  };

  const addActivity = () => {
    if (!newActivity.trim()) return;
    setActivities([...activities, { label: newActivity.trim(), pts: 5 }]);
    setNewActivity("");
  };

  const progressPercent = Math.min((weeklyPoints / 100) * 100, 100);

  // 📊 Filtrado semanal/mensual
  const getFilteredRecords = () => {
    const now = new Date();
    const cutoff = new Date(
      now.getTime() - (viewMode === "week" ? 6 : 29) * 24 * 60 * 60 * 1000
    );
    const filtered = records.filter((r) => new Date(r.date) >= cutoff);
    const totalDays = viewMode === "week" ? 7 : 30;
    const allDays = [];
    for (let i = 0; i < totalDays; i++) {
      const d = new Date(now.getTime() - (totalDays - 1 - i) * 86400000);
      const ds = d.toISOString().slice(0, 10);
      const found = filtered.find((r) => r.date === ds);
      allDays.push({ date: ds, points: found ? found.points : 0 });
    }
    return allDays;
  };

  const filtered = getFilteredRecords();

  const calcStats = () => {
    const points = filtered.map((r) => r.points);
    const total = points.reduce((a, b) => a + b, 0);
    const avg = points.length ? (total / points.length).toFixed(1) : 0;
    const max = Math.max(...points, 0);
    let streak = 0;
    for (let i = points.length - 1; i >= 0; i--) {
      if (points[i] > 0) streak++;
      else break;
    }
    return { avg, max, streak };
  };

  const { avg, max, streak } = calcStats();

  return (
    <div className="app-container">
      {/* Splash animado */}
      <AnimatePresence>
        {showSplash && (
          <motion.div
            className="splash"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <img src="/icons/icon-192.png" alt="logo" className="splash-logo" />
            <h1 className="splash-title">Diego+</h1>
            <p className="splash-sub">Gamificá tu progreso diario ⚡</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logo + frase */}
      <img src="/icons/icon-192.png" alt="Diego+ logo" className="logo" />
      <p className="motivation">{phrase}</p>

      {/* Puntos */}
      <div className="points-display">
        <div
          className="points-number glow"
          style={{ color: getProgressColor() }}
        >
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

        {/* Barra de progreso semanal */}
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progressPercent}%`, background: getProgressColor() }}
          ></div>
        </div>
      </div>

      {/* Actividades */}
      <div className="buttons-grid">
        {activities.map((a) => (
          <motion.button
            key={a.label}
            onClick={() => addPoints(a.pts)}
            whileTap={{ scale: 0.95 }}
            className="activity-btn"
          >
            {a.label}
            <div className="pts">+{a.pts}</div>
          </motion.button>
        ))}
      </div>

      {/* Botones inferiores */}
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

      {/* Modal ajustes */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            className="modal-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div className="modal-card" initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
              <h2>⚙️ Ajustes</h2>
              <ul className="settings-list">
                <li>🔊 Sonido – On</li>
                <li>📳 Vibración – On</li>
                <li>💾 Guardado automático – Activo</li>
              </ul>

              {/* Nueva actividad */}
              <div className="new-activity">
                <input
                  type="text"
                  placeholder="Nueva actividad"
                  value={newActivity}
                  onChange={(e) => setNewActivity(e.target.value)}
                />
                <button onClick={addActivity} className="add-btn">
                  <Plus size={18} />
                </button>
              </div>

              <motion.button
                whileTap={{ scale: 0.95 }}
                className="danger-btn"
                onClick={() => {
                  if (window.confirm("¿Borrar puntos de hoy?")) {
                    setWeeklyPoints((w) => w - dailyPoints);
                    setDailyPoints(0);
                  }
                }}
              >
                🗑️ Borrar puntos de hoy
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                className="close-btn"
                onClick={() => setShowSettings(false)}
              >
                Cerrar
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
