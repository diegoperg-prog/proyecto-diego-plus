import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, BarChart3, CalendarDays } from "lucide-react";
import confetti from "canvas-confetti";
import "./index.css";

export default function App() {
  const [dailyPoints, setDailyPoints] = useState(0);
  const [weeklyPoints, setWeeklyPoints] = useState(0);
  const [monthlyPoints, setMonthlyPoints] = useState(0);
  const [recentGain, setRecentGain] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [showMonthly, setShowMonthly] = useState(false);
  const [reward, setReward] = useState(localStorage.getItem("reward") || "Premiate con algo especial 🍨");
  const [motivationalPhrase, setMotivationalPhrase] = useState("");
  const [showAnimation, setShowAnimation] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [dailyLog, setDailyLog] = useState({});
  const [weeklyHistory, setWeeklyHistory] = useState([]);
  const [monthlyHistory, setMonthlyHistory] = useState([]);
  const [lastReset, setLastReset] = useState(localStorage.getItem("lastReset") || "");

  const days = ["L", "M", "M", "J", "V", "S", "D"];

  // 🎯 Actividades con íconos
  const activities = [
    { label: "Entrené", pts: 10, icon: "🏋️‍♂️" },
    { label: "Caminé 30 min", pts: 5, icon: "🚶‍♂️" },
    { label: "Comí saludable", pts: 5, icon: "🍎" },
    { label: "Dormí 7h+", pts: 5, icon: "🌙" },
    { label: "Sin pantallas", pts: 5, icon: "📵" },
    { label: "Reflexioné", pts: 5, icon: "✍️" },
    { label: "Tarea laboral", pts: 10, icon: "💼" },
    { label: "Aprendí algo", pts: 5, icon: "📚" },
  ];

  // 💬 Frases (acortadas para simplicidad)
  const motivationalPhrases = [
    "Cada punto cuenta más de lo que parece.",
    "Tu progreso de hoy será tu estándar mañana.",
    "Avanzar lento sigue siendo avanzar.",
    "Los resultados se construyen con repeticiones, no con impulsos.",
    "Hoy estás un paso más cerca de la claridad.",
    "Suma pequeña, impacto grande.",
    "Hacer aunque no tengas ganas = ganar.",
    "No pares, solo bajá el ritmo.",
    "Pequeños logros → grandes transformaciones.",
    "Tu versión de mañana te agradece este esfuerzo.",
    "Lo que repetís, te construye.",
    "No hace falta hacerlo perfecto, hace falta hacerlo.",
    "Si lo haces todos los días, deja de ser difícil.",
    "Una semana más de constancia, una versión más sólida.",
    "Cada día cumplido es una promesa a vos mismo.",
    "Dormir bien también es productividad.",
    "Moverte es un mensaje de amor propio.",
    "Tu cuerpo escucha cada pensamiento.",
    "El descanso también suma puntos.",
    "Cuida tu energía, no solo tu tiempo.",
    "No es hacer más, es hacer lo que importa.",
    "Tu atención es tu activo más caro.",
    "Cada tarea terminada libera espacio mental.",
    "Menos multitasking, más profundidad.",
    "Tu mejor versión trabaja con propósito.",
    "Tu mejor versión no se crea, se entrena.",
    "No cambies todo. Mejorá algo cada día.",
    "Convertite en la persona que hacés todos los días.",
    "Tu rutina es tu espejo.",
    "Tus hábitos crean tu historia.",
    "La disciplina es más fuerte que la motivación.",
    "Seguir también es ganar.",
    "Tu ritmo vale más que tu velocidad.",
    "Hacelo igual, incluso cuando no tengas ganas.",
    "Cuidarte no es egoísmo, es estrategia.",
    "Desconectar también es avanzar.",
    "Comer bien no es una dieta, es una forma de respeto.",
    "Tu energía es tu capital.",
    "Tu tiempo no vuelve. Tu energía tampoco.",
    "Enfocarte es una forma de respeto a tu propósito.",
    "Cerrar pendientes abre espacio para crear.",
    "No necesitás motivación, necesitás dirección.",
    "Sos el arquitecto de tu progreso.",
    "La disciplina es la forma más pura de amor propio.",
    "Ser constante es ser libre.",
    "Lo difícil es empezar. Lo imposible es parar.",
    "Tu claridad decide tus resultados.",
    "El cambio no se espera, se provoca.",
    "Los grandes cambios nacen de gestos pequeños.",
    "Tu vida cambia cuando cambian tus repeticiones.",
    "Hoy también suma 💪",
    "Tu cuerpo siente lo que tu mente piensa.",
    "Cada acción tiene poder acumulativo.",
    "Pequeños pasos → grandes victorias.",
    "Tu constancia define tu nivel.",
    "Lo importante no es cuándo empezás, sino cuándo no parás.",
    "Tu esfuerzo de hoy será tu normalidad mañana.",
    "Sumar disciplina es restar caos.",
    "Estás construyendo confianza, no solo puntos.",
    "Tu energía crece con tus decisiones.",
    "Cumplirle al hábito es cumplirte a vos.",
    "Una mente en calma rinde más.",
    "Hacerlo distinto ya es hacerlo mejor.",
    "Menos excusas, más acción.",
    "Un paso más, sin importar el tamaño.",
    "Hoy es el día perfecto para sumar.",
    "Tu cuerpo y tu mente trabajan en equipo.",
    "No necesitás ser el mejor, solo mejor que ayer.",
    "Cada punto te acerca a tu mejor versión.",
    "Estás creando tu propio sistema.",
    "Tu rutina construye tu futuro.",
    "Todo cambio empieza en un hábito.",
    "Los días simples también suman.",
    "Cada semana es una oportunidad nueva.",
    "El orden mental empieza en la acción.",
    "Tus hábitos son tu biografía futura.",
    "Tu energía es contagiosa, incluso para vos mismo.",
    "Hoy podés cumplirte otra vez.",
    "Cada esfuerzo invisible cuenta.",
    "No dejes que el cansancio te frene.",
    "Aprendé a celebrar los pasos chicos.",
    "Tu constancia inspira tu confianza.",
    "Lo que hacés en silencio habla fuerte.",
    "Nada cambia si no cambiás lo que repetís.",
    "Hoy podés entrenar tu voluntad.",
    "Pequeños hábitos → grandes resultados.",
    "Tu compromiso crea tu progreso.",
    "Estás sumando incluso cuando no se nota.",
    "Cada elección suma o resta.",
    "La mejora se construye con días comunes.",
    "Cumplir tus micro-objetivos cambia tu identidad.",
    "Ser disciplinado también es una forma de libertad.",
    "Tu versión de 6 meses te va a agradecer esto.",
    "No pares ahora: estás acumulando impulso.",
    "Hacelo por vos, no por el resultado.",
    "Hoy también tenés oportunidad de sumar.",
    "Cada día cuenta. Este también.",
    "La clave está en sostener lo que funciona.",
    "El progreso no se mide solo en números.",
    "Tu constancia es tu nueva normalidad.",
    "El cambio real empieza en lo cotidiano."
  ];

  // 🎲 Frase aleatoria
  useEffect(() => {
    const phrase =
      motivationalPhrases[Math.floor(Math.random() * motivationalPhrases.length)];
    setMotivationalPhrase(phrase);
  }, []);

  // 🔄 Cargar datos
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("diegoPlusData")) || {};
    setDailyPoints(stored.dailyPoints || 0);
    setWeeklyPoints(stored.weeklyPoints || 0);
    setMonthlyPoints(stored.monthlyPoints || 0);
    setDailyLog(stored.dailyLog || {});
    setWeeklyHistory(stored.weeklyHistory || []);
    setMonthlyHistory(stored.monthlyHistory || []);
    setLastReset(stored.lastReset || "");
  }, []);

  // 💾 Guardar datos
  useEffect(() => {
    localStorage.setItem(
      "diegoPlusData",
      JSON.stringify({
        dailyPoints,
        weeklyPoints,
        monthlyPoints,
        dailyLog,
        weeklyHistory,
        monthlyHistory,
        lastReset,
      })
    );
  }, [dailyPoints, weeklyPoints, monthlyPoints, dailyLog, weeklyHistory, monthlyHistory, lastReset]);

  // 🧮 Día actual
  const currentDayIndex = new Date().getDay(); // 0-6
  const dayKey = days[currentDayIndex === 0 ? 6 : currentDayIndex - 1];

  // 📈 Agregar puntos
  const addPoints = (pts) => {
    const newDaily = (dailyLog[dayKey] || 0) + pts;
    const updatedDaily = { ...dailyLog, [dayKey]: newDaily };
    setDailyLog(updatedDaily);
    setDailyPoints((p) => p + pts);
    setWeeklyPoints((p) => p + pts);
    setMonthlyPoints((p) => p + pts);
    setRecentGain(`+${pts}`);
    playSound(pts);

    // 🎁 Recompensa automática
    if (weeklyPoints + pts >= 100 && weeklyPoints < 100) {
      confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
      navigator.vibrate(150);
      setTimeout(() => alert(`🎉 ¡Objetivo semanal alcanzado!\n${reward}`), 500);
    }

    setTimeout(() => setRecentGain(null), 1000);
  };

  // 🔊 Sonido
  const playSound = (pts) => {
    const audio = new Audio(pts >= 10 ? "/sound/success.ogg" : "/sound/pop.ogg");
    audio.volume = 0.4;
    audio.play().catch(() => {});
  };

  // 🕒 Reinicio semanal/mensual
  useEffect(() => {
    const now = new Date();
    const today = now.toISOString().split("T")[0];
    const last = new Date(lastReset);
    const newWeek = now.getDay() === 1 && now - last > 24 * 3600 * 1000 * 3;
    const newMonth = now.getDate() === 1 && now.getMonth() !== last.getMonth();

    if (newWeek) handleReset("semana");
    else if (newMonth) handleReset("mes");
  }, []);

  const handleReset = (type) => {
    if (window.confirm(`¿Querés comenzar una nueva ${type}?`)) {
      if (type === "semana") {
        setWeeklyHistory((h) => [...h, { weekStart: new Date().toISOString(), total: weeklyPoints }]);
        setDailyLog({});
        setWeeklyPoints(0);
        setDailyPoints(0);
      } else {
        setMonthlyHistory((h) => [...h, { month: new Date().toLocaleString("es-UY", { month: "long", year: "numeric" }), total: monthlyPoints }]);
        setMonthlyPoints(0);
      }
      setLastReset(new Date().toISOString());
      setShowAnimation(true);
      setTimeout(() => setShowAnimation(false), 2500);
      const audio = new Audio("/sound/soft-success.ogg");
      audio.play().catch(() => {});
      navigator.vibrate(100);
    }
  };

  return (
    <div className="app-container">
      <img src="/icons/icon-192.png" alt="Diego+ logo" className="logo" />
      <p className="motivation">{motivationalPhrase}</p>

      {/* Puntos */}
      <div className="points-display">
        <div className={`points-number ${weeklyPoints >= 100 ? "glow" : ""}`}>
          {dailyPoints}
          <AnimatePresence>
            {recentGain && (
              <motion.span
                key={recentGain}
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 0, y: -30 }}
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

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${Math.min((weeklyPoints / 100) * 100, 100)}%`,
              backgroundColor: weeklyPoints >= 100 ? "#FFD700" : "#4CAF50",
            }}
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
            <span style={{ fontSize: "1.2rem", marginRight: "6px" }}>{a.icon}</span>
            {a.label}
            <div className="pts">+{a.pts}</div>
          </motion.button>
        ))}
      </div>

      {/* Botones inferiores */}
      <div className="bottom-buttons">
        <button className="circle-btn" onClick={() => setShowSettings(true)}>
          <Settings size={24} />
        </button>
        <button className="circle-btn" onClick={() => setShowProgress(true)}>
          <BarChart3 size={24} />
        </button>
        <button className="circle-btn" onClick={() => setShowMonthly(true)}>
          <CalendarDays size={24} />
        </button>
      </div>

      {/* ⚙️ Ajustes */}
      <AnimatePresence>
        {showSettings && (
          <motion.div className="modal-bg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="modal-card" initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}>
              <h2>⚙️ Ajustes</h2>
              <input
                className="reward-input"
                type="text"
                placeholder="Editar recompensa..."
                value={reward}
                onChange={(e) => {
                  setReward(e.target.value);
                  localStorage.setItem("reward", e.target.value);
                }}
              />
              <button className="close-btn" onClick={() => setShowSettings(false)}>Cerrar</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 📈 Evolución semanal */}
      <AnimatePresence>
        {showProgress && (
          <motion.div className="modal-bg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="modal-card" initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}>
              <h2>📈 Evolución semanal</h2>
              <div className="bars-container">
                {days.map((d) => (
                  <div key={d} className="bar-group">
                    <div
                      className="bar"
                      style={{ height: `${Math.min((dailyLog[d] || 0), 100)}px` }}
                    ></div>
                    <div className="bar-label">{d}</div>
                  </div>
                ))}
              </div>
              <button className="close-btn" onClick={() => setShowProgress(false)}>Cerrar</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 📅 Balance mensual */}
      <AnimatePresence>
        {showMonthly && (
          <motion.div className="modal-bg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="modal-card" initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}>
              <h2>📅 Balance mensual</h2>
              <p>Total del mes: {monthlyPoints} pts</p>
              <button
                className="close-btn"
                onClick={() => setShowHistory((h) => !h)}
              >
                {showHistory ? "Ocultar ▲" : "Mostrar más ▼"}
              </button>
              <AnimatePresence>
                {showHistory && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="stats-box"
                  >
                    {monthlyHistory.map((m, i) => (
                      <p key={i}>{m.month}: {m.total} pts</p>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
              <button className="close-btn" onClick={() => setShowMonthly(false)}>Cerrar</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✨ Animación reinicio */}
      <AnimatePresence>
        {showAnimation && (
          <motion.div
            className="reset-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="reset-message"
              initial={{ scale: 0.8 }}
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
