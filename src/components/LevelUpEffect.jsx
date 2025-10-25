import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// 🎯 Frases inspiradas en el universo geek / motivacional
const levelUpPhrases = [
  "¡Tu energía crece!", "Etapa superada", "¡El héroe despierta!", "La tierra media tiembla",
  "Como salido de Kaer Morhen", "La fuerza está contigo", "¡Subiste de nivel!",
  "Has ganado un punto en sabiduría", "Geralt aprobaría tu constancia",
  "Que los midiclorianos te acompañen", "¡Diego+ assemble!", "Un gran poder conlleva grandes hábitos",
  "Forjaste tu propia espada en el Monte del Destino", "Has elegido la píldora correcta",
  "Super Diego Blue activado", "¡Checkpoint desbloqueado!", "Game saved. Keep playing.",
  "¡Has cruzado el umbral!", "El fuego interior arde más fuerte", "Tu leyenda acaba de subir de nivel.",
  "El mundo cambia contigo.", "Monstruo interior domado, siguiente contrato.",
  "El equilibrio vuelve a la fuerza interior!", "Nuevo perk: autodisciplina",
  "¡Nivel desbloqueado: Ultra Instinto Productivo!", "Gandalf sonríe desde su torre.",
  "Neo estaría orgulloso.", "Tu ki se dispara por los cielos.", "Aura dorada: máxima sincronía.",
  "El héroe interior sonríe.", "Hoy subiste de nivel en humanidad.", "Las estrellas brillan más cuando vos avanzás.",
  "¡XP ganada con estilo!", "Nuevo logro: equilibrio interior.", "“No sos casual, sos main character.”",
  "Modo leyenda: activado.", "Pip-Boy actualizado: versión Diego+.", "“El miedo es el camino al lado oscuro.”",
  "Geralt te haría un gesto de respeto.", "“Hazlo o no lo hagas. No hay intento.”",
  "El código se ajusta a tu voluntad.", "Recompensa desbloqueada: más determinación.",
  "“Incluso la persona más pequeña puede cambiar el curso del futuro.”",
  "Balance logrado. Código estable.", "Respirá. Estás creando tu propia leyenda.",
  "Hoy, vos ganaste.", "Sistema neural optimizado.", "Tu versión 2.0 se instala con éxito.",
  "¡Sombra Gris aprueba tu constancia!", "Has cruzado las Montañas Nubladas.",
  "¡Los fuegos de Mordor no te detienen!", "Tu historia se escribe con pasos firmes.",
  "“El poder no está en los músculos, sino en el espíritu.”", "Checkpoint desbloqueado.",
  "¡Nadie detiene a un alma en crecimiento!", "“Would you kindly... seguir creciendo?”",
  "Recompensa desbloqueada: más determinación.", "¡El héroe despierta!",
  "Nadie puede detener a Diego Prime!", "“There is no spoon.” — solo tu mente y tu progreso.",
  "El fuego interior arde más fuerte.", "Tu aura se expande.",
  "Tu entrenamiento mental está rindiendo frutos.", "Has ganado +10 en resiliencia élfica.",
  "¡Incluso Yennefer sonreiría por esto!", "“Conócete a ti mismo.” — y vos lo estás logrando.",
  "Tu energía vibra como la de un brujo.", "“Soy inevitable.” — y vos también.",
  "Neo aprobaría tu crecimiento.", "Superaste tu propio límite.",
  "El equilibrio vuelve a la fuerza interior.", "Geralt estaría orgulloso.",
  "La senda del brujo no se detiene.", "Tu mente brilla más fuerte que nunca.",
  "¡La galaxia entera aplaude tu progreso!", "Tu energía se expande como la fuerza.",
  "Tu historia evoluciona con propósito.", "“No todos los que vagan están perdidos.”",
  "Forjaste tu voluntad en acero.", "¡Has alcanzado el siguiente plano!",
  "“El mal es mal, menor, mayor... pero hoy elegiste el bien.”",
  "¡Diego+ Prime alcanzado!", "Tu fuego interior ilumina el camino.",
  "El héroe interior sonríe.", "Modo leyenda: activado.",
  "Has ganado un punto en coraje.", "¡Tu espíritu brilla con poder!",
  "Un paso más en la senda del héroe.", "¡Subiste de nivel con estilo!",
  "“El mal no descansa… pero vos tampoco.”", "Nuevo nivel desbloqueado.",
  "Checkpoint guardado.", "“El miedo es un fuego que también da calor.”",
  "La luz te acompaña.", "Has dominado una nueva habilidad.",
  "Tu fuerza interior se expande.", "¡Tu energía fluye con claridad!",
  "Una nueva etapa comienza.", "El viaje continúa.", "Has despertado el héroe dentro."
];

export default function LevelUpEffect({ visible }) {
  const [phrase, setPhrase] = useState("");

  // 🔁 Selecciona una frase aleatoria cada vez que se activa
  useEffect(() => {
    if (visible) {
      const randomIndex = Math.floor(Math.random() * levelUpPhrases.length);
      setPhrase(levelUpPhrases[randomIndex]);
    }
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black/70 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="text-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl font-extrabold text-yellow-400 drop-shadow-lg mb-4 tracking-wider">
              ✨ LEVEL UP! ✨
            </h1>
            <p className="text-2xl text-white font-medium italic">
              {phrase}
            </p>

            {/* ⚡ Halo de energía */}
            <motion.div
              className="absolute w-64 h-64 rounded-full bg-yellow-500/10 blur-3xl"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 2.5, opacity: 0.6 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 1 }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
