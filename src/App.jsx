import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, BarChart3 } from "lucide-react";
import confetti from "canvas-confetti";
import "./index.css";

export default function App() {
  const [dailyPoints, setDailyPoints] = useState(0);
  const [weeklyPoints, setWeeklyPoints] = useState(0);
  const [recentGain, setRecentGain] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [motivation, setMotivation] = useState("");
  const [showMotivation, setShowMotivation] = useState(true);

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

  const phrases = [
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

  // Elegir frase aleatoria sin repetir la última
  useEffect(() => {
    let prev = localStorage.getItem("lastPhrase");
    let newPhrase = prev;
    while (newPhrase === prev) {
      newPhrase = phrases[Math.floor(Math.random() * phrases.length)];
    }
    setMotivation(newPhrase);
    localStorage.setItem("lastPhrase", newPhrase);
  }, []);

  const addPoints = (pts) => {
    setDailyPoints((p) => p + pts);
    setWeeklyPoints((p) => p + pts);
    setRecentGain(`+${pts}`);
    confetti({
      particleCount: 50,
      spread: 80,
      origin: { y: 0.7 },
    });
    setTimeout(() => setRecentGain(null), 1000);
  };

  return (
    <div className="app-container">
      {/* Popup de frase motivacional */}
      <AnimatePresence>
        {showMotivation && (
          <motion.div
            className="motivation-popup"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.5 }}
          >
            <p>{motivation}</p>
            <button
              className="motivation-close"
              onClick={() => setShowMotivation(false)}
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LOGO */}
      <img src="/icons/icon-192.png" alt="Logo Diego+" className="app-logo" />

      {/* CONTADOR */}
      <div className="points-display">
        <div className="daily-points">
          {dailyPoints}
          <AnimatePresence>
            {recentGain && (
              <motion.span
                key={recentGain}
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 0, y: -30 }}
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
      </div>

      {/* BOTONES PRINCIPALES */}
      <motion.div
        className="activity-grid"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {activities.map((a) => (
          <motion.button
            key={a.label}
            onClick={() => addPoints(a.pts)}
            whileTap={{ scale: 0.95 }}
            className="activity-button"
          >
            {a.label}
            <div className="activity-points">+{a.pts}</div>
          </motion.button>
        ))}
      </motion.div>

      {/* BOTONES INFERIORES */}
      <div className="bottom-buttons">
        <motion.button
          onClick={() => setShowSettings(true)}
          whileTap={{ scale: 0.9 }}
          className="round-button"
        >
          <Settings size={26} />
        </motion.button>

        <motion.button
          onClick={() => setShowProgress(true)}
          whileTap={{ scale: 0.9 }}
          className="round-button"
        >
          <BarChart3 size={26} />
        </motion.button>
      </div>

      {/* MODAL AJUSTES */}
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
              <ul>
                <li>🔊 Sonido – On</li>
                <li>📳 Vibración – On</li>
                <li>🎁 Recompensas configuradas</li>
              </ul>
              <button
                className="modal-button"
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
              <h2>📈 Evolución diaria</h2>
              <p>En la próxima versión verás aquí tus barras de progreso semanal.</p>
              <button
                className="modal-button"
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
