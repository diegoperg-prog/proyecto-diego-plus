// src/App.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, BarChart3, CalendarDays } from "lucide-react";
import HeroAvatar from "./components/HeroAvatar";
import "./index.css";

const LS_MAIN = "diegoPlusDataV4";
const LS_JOURNEY = "diegoPlusJourneyV1";
const LS_STAGE_MARK = "diegoPlusStageStartPointsV1";

const COLORS = {
  1: "#4CAF50",   // llamado
  2: "#00BCD4",   // pasos
  3: "#FFEB3B",   // pruebas
  4: "#F44336",   // abismo
  5: "#9C27B0",   // salto de fe
  6: "#FFD700",   // gloria
};

const STAGE_INFO = [
  { id: 1, name: "El llamado a la aventura", pct: 0.8 },
  { id: 2, name: "Primeros pasos", pct: 0.9 },
  { id: 3, name: "El camino de las pruebas", pct: 1.0 },
  { id: 4, name: "Frente al abismo", pct: 1.1 },
  { id: 5, name: "Salto de fe", pct: 1.2 },
  { id: 6, name: "La gloria eterna", pct: 1.0 },
];

// meta base por día (ajustable)
const GOAL_PER_DAY = 15; // puntos objetivo por día “saludable”

function daysInMonth(date) {
  const y = date.getFullYear();
  const m = date.getMonth();
  return new Date(y, m + 1, 0).getDate();
}

function buildJourneyForMonth(date) {
  const totalDays = daysInMonth(date);
  // Partimos el mes en 6 bloques lo más parejos posible
  // Ej: 31 -> [5,5,5,5,5,6] — 30 -> [5,5,5,5,5,5] — 28 -> [5,5,5,5,4,4]
  const base = Math.floor(totalDays / 6);
  let remainder = totalDays % 6; // los primeros "remainder" niveles suman +1 día
  const segments = Array.from({ length: 6 }, (_, i) => base + (i >= 6 - remainder ? 1 : 0));

  let cursor = 1;
  const stages = segments.map((len, idx) => {
    const start = cursor;
    const end = cursor + len - 1;
    cursor += len;
    const cfg = STAGE_INFO[idx];
    const target = Math.round(len * GOAL_PER_DAY * cfg.pct);
    return {
      level: cfg.id,
      name: cfg.name,
      startDay: start,
      endDay: end,
      color: COLORS[cfg.id],
      target,         // meta de puntos para ESA etapa
      length: len,
      pct: cfg.pct,
    };
  });
  return { monthKey: `${date.getFullYear()}-${date.getMonth() + 1}`, stages };
}

function todayISO() { return new Date().toISOString().split("T")[0]; }

export default function App() {
  // --- estado de puntos (ya venías con esto)
  const [dailyPoints, setDailyPoints] = useState(0);
  const [weeklyPoints, setWeeklyPoints] = useState(0);
  const [monthlyPoints, setMonthlyPoints] = useState(0);
  const [dailyLog, setDailyLog] = useState({}); // mapa L..D si lo usás, no crítico acá
  const [reward, setReward] = useState(localStorage.getItem("reward") || "Premiate al lograr 100 semanales 🎉");

  // UI
  const [showSettings, setShowSettings] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [showMonthly, setShowMonthly] = useState(false);
  const [recentGain, setRecentGain] = useState(null);

  // --- Viaje del Héroe
  const [journey, setJourney] = useState(null);
  const stageStartPointsRef = useRef(0); // puntos acumulados al iniciar la etapa actual (para medir progreso relativo)

  // ---------- cargar/persistir puntos ----------
  useEffect(() => {
    const raw = localStorage.getItem(LS_MAIN);
    if (raw) {
      try {
        const d = JSON.parse(raw);
        setDailyPoints(d.dailyPoints ?? 0);
        setWeeklyPoints(d.weeklyPoints ?? 0);
        setMonthlyPoints(d.monthlyPoints ?? 0);
        setDailyLog(d.dailyLog ?? {});
      } catch {}
    }
  }, []);
  useEffect(() => {
    localStorage.setItem(LS_MAIN, JSON.stringify({ dailyPoints, weeklyPoints, monthlyPoints, dailyLog }));
  }, [dailyPoints, weeklyPoints, monthlyPoints, dailyLog]);

  // ---------- construir viaje del héroe (una vez por mes) ----------
  useEffect(() => {
    const now = new Date();
    const key = `${now.getFullYear()}-${now.getMonth() + 1}`;
    const cached = localStorage.getItem(LS_JOURNEY);
    if (cached) {
      const obj = JSON.parse(cached);
      if (obj.monthKey === key) { setJourney(obj); return; }
    }
    const j = buildJourneyForMonth(now);
    localStorage.setItem(LS_JOURNEY, JSON.stringify(j));
    setJourney(j);
  }, []);

  // ---------- detectar etapa actual y actualizar “puntos al inicio de etapa” ----------
  const currentStage = useMemo(() => {
    if (!journey) return null;
    const today = new Date().getDate();
    return journey.stages.find(s => today >= s.startDay && today <= s.endDay) || journey.stages[journey.stages.length - 1];
  }, [journey]);

  // cuando cambio de etapa, “marco” los puntos que llevaba en ese momento
  useEffect(() => {
    if (!currentStage) return;
    const stageKey = `${journey.monthKey}-L${currentStage.level}`;
    const savedMark = localStorage.getItem(LS_STAGE_MARK);
    const parsed = savedMark ? JSON.parse(savedMark) : {};
    if (parsed.stageKey !== stageKey) {
      // nueva etapa -> grabo baseline de puntos
      const next = { stageKey, baseline: monthlyPoints };
      localStorage.setItem(LS_STAGE_MARK, JSON.stringify(next));
      stageStartPointsRef.current = monthlyPoints;
    } else {
      stageStartPointsRef.current = parsed.baseline ?? 0;
    }
  }, [currentStage, journey, monthlyPoints]);

  const stageProgressPoints = Math.max(0, monthlyPoints - stageStartPointsRef.current);
  const stageTarget = currentStage?.target ?? 1;
  const stagePct = Math.min(100, Math.round((stageProgressPoints / stageTarget) * 100));

  // ---------- sumar puntos (sin sonido) ----------
  const activities = [
    { label: "🏋️‍♂️ Entrené", pts: 10 },
    { label: "🚶‍♂️ Caminé 30 min", pts: 5 },
    { label: "🍎 Comí saludable", pts: 5 },
    { label: "🌙 Dormí 7h+", pts: 5 },
    { label: "📵 Sin pantallas", pts: 5 },
    { label: "✍️ Reflexioné", pts: 5 },
    { label: "💼 Tarea laboral", pts: 10 },
    { label: "📚 Aprendí algo", pts: 5 },
  ];

  function addPoints(pts) {
    setDailyPoints(p => p + pts);
    setWeeklyPoints(p => p + pts);
    setMonthlyPoints(p => p + pts);
    setRecentGain(`+${pts}`);
    setTimeout(() => setRecentGain(null), 900);
  }

  // ---------- INSIGHTS simples por etapa ----------
  const insight = useMemo(() => {
    if (!currentStage) return "";
    if (stagePct >= 100) return "¡Etapa superada! Mantené el flujo 🔥";
    if (stagePct >= 75) return "Estás muy cerca. Una acción más te acerca al salto.";
    if (stagePct >= 40) return "Buen ritmo. Probá combinar dos micro-hábitos hoy.";
    return "Empezá con uno fácil ahora. Activá el movimiento.";
  }, [currentStage, stagePct]);

  return (
    <div className="app-container">
      {/* LOGO */}
      <img src="/icons/icon-192.png" alt="Diego+ logo" className="app-logo" />

      {/* Héroe de Luz (entre logo y puntos) */}
      {currentStage && (
        <div className="stage-header">
          <HeroAvatar level={currentStage.level} color={currentStage.color} name={currentStage.name} />
          <div className="stage-chip" style={{ borderColor: currentStage.color }}>
            <span style={{ color: currentStage.color }}>
              Nivel {currentStage.level} · {currentStage.name}
            </span>
            <small>Meta etapa: {currentStage.target} pts</small>
          </div>
        </div>
      )}

      {/* DISPLAY DE PUNTOS */}
      <div className="points-display">
        <div className="daily-points">
          {dailyPoints}
          <AnimatePresence>
            {recentGain && (
              <motion.span
                key={recentGain}
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 0, y: -28 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9 }}
                className="recent-gain"
              >
                {recentGain}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <div className="points-subtitle">puntos de hoy</div>
        <div className="weekly-points">{weeklyPoints} pts en la semana</div>

        {/* Progreso de la etapa actual */}
        {currentStage && (
          <>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${stagePct}%`,
                  backgroundColor: currentStage.color,
                }}
              />
            </div>
            <div className="stage-progress-label">
              {stageProgressPoints}/{currentStage.target} pts · {stagePct}%
            </div>
            <div className="stage-insight">{insight}</div>
          </>
        )}
      </div>

      {/* BOTONES DE ACTIVIDAD */}
      <motion.div className="activity-grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {activities.map((a) => (
          <motion.button
            key={a.label}
            onClick={() => addPoints(a.pts)}
            whileTap={{ scale: 0.96 }}
            className="activity-button"
          >
            {a.label}
            <div className="activity-points">+{a.pts}</div>
          </motion.button>
        ))}
      </motion.div>

      {/* BOTONERA INFERIOR */}
      <div className="bottom-buttons">
        <button className="round-button" onClick={() => setShowSettings(true)}>
          <Settings size={22} />
        </button>
        <button className="round-button" onClick={() => setShowProgress(true)}>
          <BarChart3 size={22} />
        </button>
        <button className="round-button" onClick={() => setShowMonthly(true)}>
          <CalendarDays size={22} />
        </button>
      </div>

      {/* MODALES (placeholders, ya los tenías – mantenemos estilo) */}
      <AnimatePresence>
        {showSettings && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="modal-content" initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}>
              <h2>⚙️ Ajustes</h2>
              <input
                className="reward-input"
                type="text"
                placeholder="Editar recompensa…"
                value={reward}
                onChange={(e) => {
                  setReward(e.target.value);
                  localStorage.setItem("reward", e.target.value);
                }}
              />
              <button className="modal-button" onClick={() => setShowSettings(false)}>Cerrar</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showProgress && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="modal-content" initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}>
              <h2>📈 Evolución</h2>
              <p>Próxima iteración: histórico real de 7 días aquí.</p>
              <button className="modal-button" onClick={() => setShowProgress(false)}>Cerrar</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showMonthly && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="modal-content" initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}>
              <h2>📅 Balance general</h2>
              <p>Total del mes: {monthlyPoints} pts</p>
              <p>Meta diaria base: {GOAL_PER_DAY} pts</p>
              <button className="modal-button" onClick={() => setShowMonthly(false)}>Cerrar</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
