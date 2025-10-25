// src/components/HeroAvatar.jsx
import React from "react";
import { motion } from "framer-motion";

/**
 * HeroAvatar — “Héroe de Luz”
 * Figurativo minimalista con barba + lentes. Sin rasgos faciales, estilizado.
 * Props:
 *  - level: 1..6
 *  - color: hex del nivel (aura/energía)
 *  - name: título del nivel (para accesibilidad)
 */
export default function HeroAvatar({ level = 1, color = "#4CAF50", name = "" }) {
  // Intensidad/estilo por nivel
  const auraOpacity = [0.25, 0.3, 0.35, 0.42, 0.5, 0.6][Math.min(level - 1, 5)];
  const glowSize = [40, 48, 56, 64, 72, 84][Math.min(level - 1, 5)];
  const pulseDur = [3, 2.8, 2.6, 2.4, 2.2, 2.0][Math.min(level - 1, 5)];

  return (
    <div className="hero-wrap" aria-label={`Nivel ${level}: ${name}`}>
      {/* Halo de aura */}
      <motion.div
        className="hero-aura"
        initial={{ opacity: 0 }}
        animate={{ opacity: auraOpacity }}
        transition={{ duration: 0.6 }}
        style={{
          background: `radial-gradient(circle, ${color}66 0%, transparent 65%)`,
          width: glowSize * 3,
          height: glowSize * 3,
          filter: "blur(18px)",
        }}
      />

      {/* SVG del héroe */}
      <motion.svg
        width="160"
        height="180"
        viewBox="0 0 160 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="hero-svg"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Silueta general (cuerpo) */}
        <motion.path
          d="M80 170 C60 170, 42 160, 42 142 L42 120 C42 108, 54 98, 70 96 L90 96 C106 98, 118 108, 118 120 L118 142 C118 160, 100 170, 80 170 Z"
          fill="#1A1A1A"
          stroke={color}
          strokeWidth="2"
          initial={{ filter: "drop-shadow(0 0 0px transparent)" }}
          animate={{ filter: `drop-shadow(0 0 14px ${color}88)` }}
        />
        {/* Cabeza (con barba) */}
        <circle cx="80" cy="60" r="24" fill="#1A1A1A" stroke={color} strokeWidth="2" />
        <path
          d="M60 70 C66 84, 94 84, 100 70 C98 86, 90 94, 80 94 C70 94, 62 86, 60 70 Z"
          fill="#0F0F0F"
        />
        {/* Lentes (marco simple) */}
        <rect x="60" y="55" rx="8" ry="8" width="22" height="16" fill="#111" stroke="#C7D2FE" strokeWidth="1.5"/>
        <rect x="78" y="55" rx="8" ry="8" width="22" height="16" fill="#111" stroke="#C7D2FE" strokeWidth="1.5"/>
        <line x1="82" y1="63" x2="78" y2="63" stroke="#C7D2FE" strokeWidth="1.2"/>
        {/* Energía en el pecho */}
        <motion.circle
          cx="80" cy="112" r="10"
          fill={color}
          initial={{ opacity: 0.5, scale: 0.9 }}
          animate={{ opacity: [0.5, 0.9, 0.5], scale: [0.9, 1.08, 0.9] }}
          transition={{ duration: pulseDur, repeat: Infinity }}
          style={{ filter: `drop-shadow(0 0 10px ${color})` }}
        />
        {/* Líneas de energía (niveles altos) */}
        {level >= 3 && (
          <motion.circle
            cx="80" cy="112" r="28"
            stroke={color} strokeWidth="1.5" fill="transparent"
            initial={{ rotate: 0, opacity: 0.4 }}
            animate={{ rotate: 360, opacity: [0.25, 0.5, 0.25] }}
            transition={{ duration: 12 - level, repeat: Infinity, ease: "linear" }}
            style={{ filter: `drop-shadow(0 0 8px ${color}44)` }}
          />
        )}
        {level >= 5 && (
          <motion.circle
            cx="80" cy="112" r="40"
            stroke={color} strokeWidth="1" strokeDasharray="6 8" fill="transparent"
            initial={{ rotate: 0, opacity: 0.25 }}
            animate={{ rotate: -360, opacity: [0.15, 0.35, 0.15] }}
            transition={{ duration: 14 - level, repeat: Infinity, ease: "linear" }}
          />
        )}
      </motion.svg>
    </div>
  );
}
