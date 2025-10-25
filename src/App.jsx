import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, BarChart3, CalendarDays } from "lucide-react";
import confetti from "canvas-confetti";
import "./index.css";

/**
 * Diego+ v4 — Histórico real + insights + recompensas
 * Persistencia localStorage (clave: diegoPlusDataV4)
 */

const LS_KEY = "diegoPlusDataV4";

const DAYS_LABELS = ["L", "M", "M", "J", "V", "S", "D"]; // mapea el getDay() de JS

function todayKey() {
  const jsIdx = new Date().getDay(); // 0=Dom..6=Sab
  return DAYS_LABELS[jsIdx === 0 ? 6 : jsIdx - 1]; // L..D
}

function todayISO() {
  return new Date().toISOString().split("T")[0];
}

export default function App() {
  // --------- estado principal ----------
  const [dailyPoints, setDailyPoints] = useState(0);
  const [weeklyPoints, setWeeklyPoints] = useState(0);
  const [monthlyPoints, setMonthlyPoints] = useState(0);

  const [dailyLog, setDailyLog] = useState({}); // { L: 30, M: 10, ... } semana actual
  const [weeklyHistory, setWeeklyHistory] = useState([]); // [{weekStart, total}]
  const [monthlyHistory, setMonthlyHistory] = useState([]); // [{month, total}]
  const [streakCurrent, setStreakCurrent] = useState(0);
  const [streakBest, setStreakBest] = useState(0);
  const [lastActiveDate, setLastActiveDate] = useState(null);

  const [reward, setReward] = useState(
    localStorage.getItem("reward") || "Premiate con algo especial 🍨"
  );

  // UI
  const [recentGain, setRecentGain] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [showMonthly, setShowMonthly] = useState(false);
  const [showResetAnim, setShowResetAnim] = useState(false);
  const [showHistoryMore, setShowHistoryMore] = useState(false);

  const [lastReset, setLastReset] = useState(""); // ISO

  // --------- actividades ----------
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

  // ---------- cargar estado ----------
  useEffect(() => {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      try {
        const d = JSON.parse(raw);
        setDailyPoints(d.dailyPoints ?? 0);
        setWeeklyPoints(d.weeklyPoints ?? 0);
        setMonthlyPoints(d.monthlyPoints ?? 0);
        setDailyLog(d.dailyLog ?? {});
        setWeeklyHistory(d.weeklyHistory ?? []);
        setMonthlyHistory(d.monthlyHistory ?? []);
        setStreakCurrent(d.streakCurrent ?? 0);
        setStreakBest(d.streakBest ?? 0);
        setLastActiveDate(d.lastActiveDate ?? null);
        setLastReset(d.lastReset ?? "");
      } catch {
        // si algo está corrupto, arrancamos limpio
      }
    }
  }, []);

  // ---------- persistir ----------
  useEffect(() => {
    localStorage.setItem(
      LS_KEY,
      JSON.stringify({
        dailyPoints,
        weeklyPoints,
        monthlyPoints,
        dailyLog,
        weeklyHistory,
        monthlyHistory,
        streakCurrent,
        streakBest,
        lastActiveDate,
        lastReset,
      })
    );
  }, [
    dailyPoints,
    weeklyPoints,
    monthlyPoints,
    dailyLog,
    weeklyHistory,
    monthlyHistory,
    streakCurrent,
    streakBest,
    lastActiveDate,
    lastReset,
  ]);

  // ---------- reinicios inteligentes con pop-up ----------
  useEffect(() => {
    const now = new Date();
    const last = lastReset ? new Date(lastReset) : null;

    const isNewWeek = now.getDay() === 1; // lunes
    const isNewMonth = now.getDate() === 1;

    // Evitar spamear si ya se reseteó hoy
    const alreadyToday =
      last && last.toISOString().slice(0, 10) === now.toISOString().slice(0, 10);

    if (!alreadyToday) {
      if (isNewMonth) confirmReset("mes");
      else if (isNewWeek) confirmReset("semana");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastReset]);

  function confirmReset(type) {
    const ok = window.confirm(
      `¿Querés comenzar una nueva ${type === "mes" ? "mes" : "semana"}?`
    );
    if (!ok) return;

    if (type === "semana") {
      // archivar semana
      setWeeklyHistory((h) => [
        ...h,
        { weekStart: new Date().toISOString(), total: weeklyPoints },
      ]);
      setWeeklyPoints(0);
      setDailyPoints(0);
      setDailyLog({});
    } else {
      // archivar mes
      const monthLbl = new Date().toLocaleString("es-UY", {
        month: "long",
        year: "numeric",
      });
      setMonthlyHistory((h) => [...h, { month: monthLbl, total: monthlyPoints }]);
      setMonthlyPoints(0);
    }

    setLastReset(todayISO());
    // animación + sonido
    setShowResetAnim(true);
    setTimeout(() => setShowResetAnim(false), 2200);
    playSound("/sound/soft-success.ogg", 0.7);
    if ("vibrate" in navigator) navigator.vibrate(120);
  }

  // ---------- sumar puntos ----------
  function addPoints(pts) {
    const key = todayKey();
    const updatedLog = { ...dailyLog, [key]: (dailyLog[key] ?? 0) + pts };
    setDailyLog(updatedLog);
    setDailyPoints((p) => p + pts);
    setWeeklyPoints((p) => p + pts);
    setMonthlyPoints((p) => p + pts);
    setRecentGain(`+${pts}`);

    // confeti + sonido
    if (pts >= 10) playSound("/sound/success.ogg");
    else playSound("/sound/pop.ogg");
    confetti({ particleCount: 70, spread: 70, origin: { y: 0.7 } });

    // rachas
    updateStreak();

    // recompensa semanal (100+)
    const newWeekly = weeklyPoints + pts;
    if (weeklyPoints < 100 && newWeekly >= 100) {
      if ("vibrate" in navigator) navigator.vibrate(180);
      setTimeout(() => alert(`🎉 ¡Objetivo semanal alcanzado!\n${reward}`), 400);
    }

    setTimeout(() => setRecentGain(null), 1000);
  }

  function playSound(src, vol = 0.4) {
    const a = new Audio(src);
    a.volume = vol;
    a.play().catch(() => {});
  }

  // ---------- rachas (día a día) ----------
  function updateStreak() {
    const today = todayISO();
    if (!lastActiveDate) {
      setStreakCurrent(1);
      setStreakBest(1);
      setLastActiveDate(today);
      return;
    }
    const last = new Date(lastActiveDate);
    const diffDays = Math.floor(
      (new Date(today) - new Date(last.toISOString().slice(0, 10))) /
        (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) {
      // mismo día, no cambia la racha
      setLastActiveDate(today);
      return;
    }
    if (diffDays === 1) {
      const next = streakCurrent + 1;
      setStreakCurrent(next);
      setStreakBest(Math.max(streakBest, next));
    } else {
      // se cortó
      setStreakCurrent(1);
    }
    setLastActiveDate(today);
  }

  // ---------- insights semanales ----------
  const insights = useMemo(() => {
    const vals = DAYS_LABELS.map((d) => dailyLog[d] || 0);
    const totalWeek = vals.reduce((a, b) => a + b, 0);
    const avg = Math.round(totalWeek / 7);
    let bestIdx = -1;
    let bestVal = -1;
    vals.forEach((v, i) => {
      if (v > bestVal) {
        bestVal = v;
        bestIdx = i;
      }
    });
    const bestDay = bestVal > 0 ? DAYS_LABELS[bestIdx] : "—";

    // recomendación simple
    let tip = "Hoy podés sumar +10 con 2 hábitos simples (+5/+5).";
    if (avg < 20) tip = "Tu promedio es bajo. Probá con 3 micro-acciones rápidas hoy.";
    if (weeklyPoints >= 80 && weeklyPoints < 100)
      tip = "Estás a un paso del objetivo semanal. Dos acciones y lo tenés 💥";
    if (streakCurrent >= 3) tip = `Racha de ${streakCurrent} días. ¡Sostené el ritmo!`;

    return { totalWeek, avg, bestDay, tip };
  }, [dailyLog, weeklyPoints, streakCurrent]);

  return (
    <div className="app-container">
      {/* Logo */}
      <img src="/icons/icon-192.png" alt="Diego+ logo" className="app-logo" />

      {/* Puntos */}
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
                transition={{ duration: 1 }}
                className="recent-gain"
              >
                {recentGain}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <div className="points-subtitle">puntos de hoy</div>
        <div className="weekly-points">{weeklyPoints} pts en la semana</div>

        {/* Barra de progreso hacia 100 semanales */}
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${Math.min((weeklyPoints / 100) * 100, 100)}%`,
              backgroundColor: weeklyPoints >= 100 ? "#FFD700" : "#4CAF50",
            }}
          />
        </div>
      </div>

      {/* Botones de actividades */}
      <motion.div
        className="activity-grid"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
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

      {/* Botonera inferior */}
      <div className="bottom-buttons">
        <button className="round-button" onClick={() => setShowSettings(true)}>
          <Settings size={24} />
        </button>
        <button className="round-button" onClick={() => setShowProgress(true)}>
          <BarChart3 size={24} />
        </button>
        <button className="round-button" onClick={() => setShowMonthly(true)}>
          <CalendarDays size={24} />
        </button>
      </div>

      {/* MODAL: Ajustes */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
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
              <button className="danger-btn"
                onClick={() => {
                  if (window.confirm("¿Borrar puntos de hoy?")) {
                    setWeeklyPoints((w) => w - dailyPoints);
                    const key = todayKey();
                    setDailyLog((log) => ({ ...log, [key]: 0 }));
                    setDailyPoints(0);
                  }
                }}
              >
                🗑️ Borrar puntos de hoy
              </button>
              <button className="modal-button" onClick={() => setShowSettings(false)}>
                Cerrar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL: Evolución semanal */}
      <AnimatePresence>
        {showProgress && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <h2>📈 Evolución semanal</h2>

              <div className="bars-container">
                {DAYS_LABELS.map((d) => {
                  const val = dailyLog[d] || 0;
                  const h = Math.min(val, 110); // cap visual
                  return (
                    <div key={d} className="bar-group">
                      <motion.div
                        className="bar"
                        initial={{ height: 0 }}
                        animate={{ height: h }}
                        transition={{ type: "spring", stiffness: 120, damping: 18 }}
                      />
                      <div className="bar-label">{d}</div>
                    </div>
                  );
                })}
              </div>

              {/* Insights */}
              <div className="stats-box">
                <div>Promedio: {insights.avg} pts/día</div>
                <div>Mejor día: {insights.bestDay}</div>
                <div>Racha actual: {streakCurrent} días</div>
                <div className="tip">{insights.tip}</div>
              </div>

              <button className="modal-button" onClick={() => setShowProgress(false)}>
                Cerrar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL: Balance mensual */}
      <AnimatePresence>
        {showMonthly && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <h2>📅 Balance general</h2>
              <p>Total del mes: {monthlyPoints} pts</p>
              <p>Promedio diario (30d): {Math.round(monthlyPoints / 30)} pts</p>
              <p>Racha más larga: {streakBest} días 🔥</p>

              <button
                className="modal-secondary"
                onClick={() => setShowHistoryMore((v) => !v)}
              >
                {showHistoryMore ? "Ocultar ▲" : "Mostrar histórico ▼"}
              </button>

              <AnimatePresence>
                {showHistoryMore && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="stats-box"
                  >
                    {monthlyHistory.length === 0 && <p>Sin meses archivados aún.</p>}
                    {monthlyHistory.map((m, i) => (
                      <p key={i}>
                        {m.month}: {m.total} pts
                      </p>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <button className="modal-button" onClick={() => setShowMonthly(false)}>
                Cerrar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animación reinicio */}
      <AnimatePresence>
        {showResetAnim && (
          <motion.div
            className="reset-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="reset-message"
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              ✨ Nueva semana, nuevas oportunidades
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
