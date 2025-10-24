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
  const [reward, setReward] = useState(
    localStorage.getItem("reward") || "Premiate con algo especial 🍨"
  );
  const [lastPhrase, setLastPhrase] = useState(null);
  const [motivationalPhrase, setMotivationalPhrase] = useState("");
  const [lastPhrases, setLastPhrases] = useState([]);
  const [level, setLevel] = useState(1);

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

  // 💬 Frases motivacionales (100)
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

  // 🎲 Frase aleatoria sin repetir
  useEffect(() => {
    const getRandomPhrase = () => {
      let newPhrase;
      do {
        newPhrase =
          motivationalPhrases[
            Math.floor(Math.random() * motivationalPhrases.length)
          ];
      } while (lastPhrases.includes(newPhrase));
      const updatedLast = [...lastPhrases.slice(-4), newPhrase];
      setLastPhrases(updatedLast);
      setMotivationalPhrase(newPhrase);
      localStorage.setItem("lastPhrase", newPhrase);
    };
    getRandomPhrase();
  }, []);

  // 🔊 Sonido dinámico
  const playSound = (pts) => {
    const audio = new Audio(
      pts >= 10 ? "/sound/success.ogg" : "/sound/pop.ogg"
    );
    audio.volume = 0.4;
    audio.play().catch(() => {});
  };

  // 📈 Sumar puntos
  const addPoints = (pts) => {
    setDailyPoints((p) => p + pts);
    setWeeklyPoints((p) => p + pts);
    setMonthlyPoints((p) => p + pts);
    setRecentGain(`+${pts}`);
    playSound(pts);

    // 🎉 Recompensa automática al llegar a 100 semanales
    if (weeklyPoints + pts >= 100 && weeklyPoints < 100) {
      confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
      window.navigator.vibrate(200);
      setTimeout(() => alert(`🎉 ¡Objetivo semanal alcanzado!\n${reward}`), 600);
    }

    setTimeout(() => setRecentGain(null), 1000);
  };

  // 🧮 Nivel dinámico
  useEffect(() => {
    if (weeklyPoints >= 300) setLevel(5);
    else if (weeklyPoints >= 200) setLevel(4);
    else if (weeklyPoints >= 100) setLevel(3);
    else if (weeklyPoints >= 50) setLevel(2);
    else setLevel(1);
  }, [weeklyPoints]);

  return (
    <div className="app-container">
      <img src="/icons/icon-192.png" alt="Diego+ logo" className="logo" />
      <p className="motivation">{motivationalPhrase}</p>

      {/* Puntos */}
      <div className="points-display">
        <div
          className={`points-number ${
            weeklyPoints >= 100 ? "glow" : ""
          }`}
        >
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
              backgroundColor:
                weeklyPoints >= 100 ? "#FFD700" : "#4CAF50",
            }}
          ></div>
        </div>
      </div>

      {/* Botones principales */}
      <div className="buttons-grid">
        {activities.map((a) => (
          <motion.button
            key={a.label}
            onClick={() => addPoints(a.pts)}
            whileTap={{ scale: 0.95 }}
            className="activity-btn"
          >
            <span style={{ fontSize: "1.2rem", marginRight: "6px" }}>
              {a.icon}
            </span>
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
              <ul className="settings-list">
                <li>🎁 Recompensa actual: {reward}</li>
              </ul>
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
              <button
                className="danger-btn"
                onClick={() => {
                  if (window.confirm("¿Borrar puntos de hoy?")) {
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
              <h2>📈 Evolución semanal</h2>
              <p className="text-sm text-gray-300 mb-2">
                Promedio: {Math.round(weeklyPoints / 7)} pts/día  
              </p>
              <p>Mejor día: Martes 🏆</p>
              <p>Racha actual: 4 días 🔥</p>
              <button
                className="close-btn"
                onClick={() => setShowProgress(false)}
              >
                Cerrar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 📅 MODAL BALANCE MENSUAL */}
      <AnimatePresence>
        {showMonthly && (
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
              <h2>📅 Balance general</h2>
              <p>Promedio diario: {Math.round(monthlyPoints / 30)} pts</p>
              <p>Total del mes: {monthlyPoints} pts</p>
              <p>Racha máxima: 7 días consecutivos 🔥</p>
              <button
                className="close-btn"
                onClick={() => setShowMonthly(false)}
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
