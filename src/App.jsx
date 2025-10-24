import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dumbbell,
  Footprints,
  Moon,
  Sun,
  Check,
  NotebookPen,
  Coffee,
  BookOpen,
  ClipboardCheck,
  Sparkles,
  Gift,
  Settings,
  Download,
  History,
  Trophy,
  Bell,
  BellOff,
  AudioLines,
  AudioWaveform
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

// ------------------------------------------------------------
// Proyecto Diego+ — Prototipo funcional (single-file React)
// ------------------------------------------------------------
// Estilo: minimalista, claro/oscuro, gamificado.
// Persistencia: localStorage. (Placeholder para Google Sheets más abajo)
// Compatible móvil. Incluye exportación CSV y pequeño sistema de mensajes.
// ------------------------------------------------------------

// Paleta
const COLORS = {
  green: "#4CAF50", // progreso
  light: "#F4F4F4",
  dark: "#212121",
  accent: "#FFC107", // logros
  textDark: "#111827",
  textLight: "#F9FAFB",
};

// Hábitos + puntos
const HABITS = [
  { key: "train", label: "Entrené", points: 10, icon: Dumbbell },
  { key: "walk", label: "Caminar 30+ min", points: 5, icon: Footprints },
  { key: "eat", label: "Comí saludable", points: 5, icon: Check },
  { key: "sleep", label: "Dormí 7+ h", points: 5, icon: Moon },
  { key: "detox", label: "10' sin pantallas", points: 5, icon: Coffee },
  { key: "reflect", label: "Escribir/Reflexionar", points: 5, icon: NotebookPen },
  { key: "task", label: "Tarea laboral importante", points: 10, icon: ClipboardCheck },
  { key: "improve", label: "Mejora/pendiente", points: 10, icon: Sparkles },
  { key: "learn", label: "Aprender algo nuevo", points: 5, icon: BookOpen },
];

// Niveles por puntaje semanal
const LEVELS = [
  { id: 1, name: "En marcha", min: 0, max: 100 },
  { id: 2, name: "En ritmo", min: 101, max: 200 },
  { id: 3, name: "En foco", min: 201, max: 300 },
  { id: 4, name: "En crecimiento", min: 301, max: 400 },
  { id: 5, name: "Diego+ 🌟", min: 401, max: Infinity },
];

// Utils de fecha
const pad = (n) => (n < 10 ? `0${n}` : `${n}`);
const toKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const startOfWeek = (date) => {
  const d = new Date(date);
  // Empezar el lunes
  const day = (d.getDay() + 6) % 7; // 0 = lunes
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
};
const isSameWeek = (a, b) => startOfWeek(a).getTime() === startOfWeek(b).getTime();

// Persistencia simple
const STORAGE_KEY = "diegoPlusDataV1";
const defaultRewards = { 1: "", 2: "", 3: "", 4: "", 5: "" };

export default function ProyectoDiegoPlusApp() {
  // Estado base
  const [entries, setEntries] = useState([]); // {date: 'YYYY-MM-DD', key, points}
  const [rewards, setRewards] = useState(defaultRewards);
  const [theme, setTheme] = useState("dark");
  const [toast, setToast] = useState(null); // {title, subtitle}
  const [soundOn, setSoundOn] = useState(true);
  const [vibrationOn, setVibrationOn] = useState(true);

  // Cargar/guardar
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setEntries(parsed.entries ?? []);
        setRewards(parsed.rewards ?? defaultRewards);
        setTheme(parsed.theme ?? "dark");
        setSoundOn(parsed.soundOn ?? true);
        setVibrationOn(parsed.vibrationOn ?? true);
      } catch (e) {
        console.warn("Error leyendo localStorage", e);
      }
    }
  }, []);

  useEffect(() => {
    const payload = JSON.stringify({ entries, rewards, theme, soundOn, vibrationOn });
    localStorage.setItem(STORAGE_KEY, payload);
  }, [entries, rewards, theme, soundOn, vibrationOn]);

  // Tema
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [theme]);

  // Audio beep embebido (muy sutil)
  const audioRef = useRef(null);
  useEffect(() => {
    const a = new Audio(
      "data:audio/mp3;base64,//uQZAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAADAAACcQAA" +
        "AExJSUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQQ=="
    );
    audioRef.current = a;
  }, []);

  // Agregar entrada y feedback
  const addEntry = (habit) => {
    const todayKey = toKey(new Date());
    const newEntry = { date: todayKey, key: habit.key, points: habit.points };
    setEntries((prev) => [...prev, newEntry]);

    // haptics + sound
    if (vibrationOn && navigator.vibrate) navigator.vibrate(25);
    if (soundOn && audioRef.current) {
      try { audioRef.current.currentTime = 0; audioRef.current.play(); } catch {}
    }

    // toast motivacional
    setToast({
      title: `+${habit.points} puntos`,
      subtitle: mensajeMotivacional(habit.key),
    });
    setTimeout(() => setToast(null), 2200);
  };

  // Datos semanales
  const today = new Date();
  const weekStart = startOfWeek(today);
  const weekKeys = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return toKey(d);
  });

  const weeklyEntries = useMemo(
    () => entries.filter((e) => isSameWeek(new Date(e.date), today)),
    [entries]
  );

  const weeklyPoints = weeklyEntries.reduce((acc, e) => acc + (e.points || 0), 0);
  const currentLevel = LEVELS.find((L) => weeklyPoints >= L.min && weeklyPoints <= L.max) || LEVELS[LEVELS.length - 1];
  const nextLevel = LEVELS.find((L) => L.id === Math.min(currentLevel.id + 1, 5));
  const pointsToNext = Math.max(0, (nextLevel?.min ?? weeklyPoints) - weeklyPoints);

  const barData = weekKeys.map((k) => ({
    day: k.slice(5),
    puntos: entries.filter((e) => e.date === k).reduce((acc, e) => acc + e.points, 0),
  }));

  // Historial (últimas 4 semanas)
  const last4Weeks = useMemo(() => {
    const result = [];
    let cursor = startOfWeek(today);
    for (let i = 0; i < 4; i++) {
      const start = new Date(cursor);
      const end = new Date(cursor); end.setDate(end.getDate() + 6);
      const weekKey = `${toKey(start)}→${toKey(end)}`;
      const pts = entries
        .filter((e) => {
          const d = new Date(e.date);
          return d >= start && d <= end;
        })
        .reduce((a, e) => a + e.points, 0);
      result.push({ week: weekKey, points: pts });
      cursor.setDate(cursor.getDate() - 7);
    }
    return result;
  }, [entries]);

  // Manejo recompensas
  const handleRewardChange = (levelId, value) => {
    setRewards((r) => ({ ...r, [levelId]: value }));
  };

  // Exportar CSV
  const exportCSV = () => {
    const header = "date,habit,points\n";
    const rows = entries.map((e) => `${e.date},${e.key},${e.points}`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `diego-plus-${toKey(new Date())}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  // Placeholder Google Sheets
  const syncToGoogleSheets = async () => {
    alert(
      "Placeholder: aquí conectarías tu Google Sheet con la API (Apps Script o gapi). Exportá el CSV mientras tanto."
    );
  };

  // Recordatorio simple (no persistente)
  const scheduleReminder = () => {
    if ("Notification" in window) {
      Notification.requestPermission().then((perm) => {
        if (perm === "granted") {
          setTimeout(() => {
            new Notification("Proyecto Diego+", {
              body: "Hoy podés sumar puntos para vos ✨",
            });
          }, 5000);
        } else {
          alert("Las notificaciones están bloqueadas por el navegador.");
        }
      });
    } else {
      alert("Tu navegador no soporta notificaciones. ¡Usá un recordatorio de calendario!");
    }
  };

  // Mensajes dinámicos
  function mensajeMotivacional(habitKey) {
    const base = {
      train: "¡Potencia física on!",
      walk: "Paso a paso, suma grande.",
      eat: "Tu cuerpo te agradece.",
      sleep: "Dormir también es progreso.",
      detox: "Tu mente respira.",
      reflect: "Clareando ideas = poder.",
      task: "Lo importante primero. Bien ahí.",
      improve: "Un pendiente menos, más liviano.",
      learn: "Curiosidad = superpoder.",
    };
    return base[habitKey] || "¡Otro paso hacia tu mejor versión!";
  }

  const LevelBadge = ({ level }) => (
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold"
      style={{ background: theme === "dark" ? "#2E7D32" : COLORS.green, color: COLORS.textLight }}>
      <Trophy size={16} />
      Nivel {level.id} — {level.name}
    </div>
  );

  const ProgressBar = ({ value, max }) => {
    const pct = Math.min(100, Math.round((value / max) * 100));
    return (
      <div className="w-full h-3 rounded-full bg-gray-200 dark:bg-neutral-700 overflow-hidden">
        <div
          className="h-full transition-all"
          style={{ width: `${pct}%`, background: COLORS.green }}
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full px-4 py-6 md:py-8 md:px-8 font-sans" style={{
      background: theme === "dark" ? COLORS.dark : COLORS.light,
      color: theme === "dark" ? COLORS.textLight : COLORS.textDark,
      fontFamily: "Poppins, Montserrat, ui-sans-serif, system-ui",
    }}>
      {/* Header */}
      <div className="max-w-5xl mx-auto flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Proyecto Diego+</h1>
          <p className="opacity-80 mt-1">Gamifica tu progreso diario — físico, mental y laboral.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
            className="px-3 py-2 rounded-xl border border-gray-300/30 hover:opacity-90"
            title="Cambiar tema"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            onClick={exportCSV}
            className="px-3 py-2 rounded-xl border border-gray-300/30 hover:opacity-90"
            title="Exportar CSV"
          >
            <Download size={18} />
          </button>
          <button
            onClick={scheduleReminder}
            className="px-3 py-2 rounded-xl border border-gray-300/30 hover:opacity-90"
            title="Recordatorio de hoy"
          >
            <Bell size={18} />
          </button>
        </div>
      </div>

      {/* Panel principal */}
      <div className="max-w-5xl mx-auto mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progreso / Nivel */}
        <div className="lg:col-span-2 p-5 rounded-2xl shadow-sm border border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur">
          <div className="flex items-center justify-between">
            <LevelBadge level={currentLevel} />
            <div className="text-sm opacity-80">Semana: {toKey(weekStart)} → {toKey(new Date(weekStart.getTime() + 6*86400000))}</div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span>Puntos semanales</span>
              <span className="font-semibold">{weeklyPoints} pts</span>
            </div>
            <ProgressBar value={weeklyPoints - (currentLevel.min || 0)} max={(nextLevel?.min ?? weeklyPoints) - (currentLevel.min || 0)} />
            <div className="text-xs opacity-80 mt-2">
              {currentLevel.id < 5 ? `${pointsToNext} pts para Nivel ${currentLevel.id + 1}` : "Nivel máximo alcanzado. ¡Crack!"}
            </div>
          </div>

          {/* Botones rápidos */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {HABITS.map((h) => (
              <button
                key={h.key}
                onClick={() => addEntry(h)}
                className="group flex items-center gap-2 px-3 py-3 rounded-xl border border-gray-300/30 hover:border-transparent hover:shadow-md transition bg-white/80 dark:bg-white/10"
              >
                <h.icon size={18} />
                <div className="text-left">
                  <div className="text-sm font-semibold leading-tight">{h.label}</div>
                  <div className="text-xs opacity-70">+{h.points} pts</div>
                </div>
              </button>
            ))}
          </div>

          {/* Gráfico semanal */}
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-2 text-sm opacity-80"><History size={16} /> Totales diarios (semana)</div>
            <div className="w-full h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme === "dark" ? "#444" : "#ddd"} />
                  <XAxis dataKey="day" tick={{ fill: theme === "dark" ? COLORS.textLight : COLORS.textDark, fontSize: 12 }} />
                  <YAxis tick={{ fill: theme === "dark" ? COLORS.textLight : COLORS.textDark, fontSize: 12 }} />
                  <Tooltip contentStyle={{ background: theme === "dark" ? "#2b2b2b" : "white", border: "1px solid #ddd", fontSize: 12 }} />
                  <Bar dataKey="puntos" radius={[6,6,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Ajustes */}
        <div className="p-5 rounded-2xl shadow-sm border border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur">
          <div className="flex items-center gap-2 mb-4"><Settings size={18} /><span className="font-semibold">Ajustes</span></div>
          <div className="space-y-3 text-sm">
            <label className="flex items-center justify-between gap-3">
              <span>Sonidos</span>
              <button onClick={() => setSoundOn((s) => !s)} className="px-3 py-2 rounded-lg border border-gray-300/30">
                {soundOn ? <AudioWaveform size={16} /> : <AudioLines size={16} />}
              </button>
            </label>
            <label className="flex items-center justify-between gap-3">
              <span>Vibración</span>
              <button onClick={() => setVibrationOn((v) => !v)} className="px-3 py-2 rounded-lg border border-gray-300/30">
                {vibrationOn ? <Bell size={16} /> : <BellOff size={16} />}
              </button>
            </label>
            <div className="pt-2 border-t border-white/10">
              <button onClick={syncToGoogleSheets} className="w-full px-3 py-2 rounded-xl border border-gray-300/30 hover:opacity-90">Conectar a Google Sheets (placeholder)</button>
            </div>
          </div>
        </div>
      </div>

      {/* Recompensas */}
      <div className="max-w-5xl mx-auto mt-6 p-5 rounded-2xl shadow-sm border border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur">
        <div className="flex items-center gap-2 mb-4"><Gift size={18} /><span className="font-semibold">Recompensas por nivel</span></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 text-sm">
          {LEVELS.map((L) => (
            <div key={L.id} className="p-3 rounded-xl border border-gray-300/30 bg-white/60 dark:bg-white/10">
              <div className="text-xs opacity-70 mb-1">Nivel {L.id}</div>
              <input
                value={rewards[L.id] ?? ""}
                onChange={(e) => handleRewardChange(L.id, e.target.value)}
                placeholder="Escribí tu recompensa"
                className="w-full bg-transparent outline-none placeholder:opacity-50"
              />
              {currentLevel.id >= L.id && rewards[L.id] ? (
                <div className="mt-2 inline-flex items-center gap-1 text-xs" style={{ color: COLORS.accent }}>
                  <Trophy size={14} /> Desbloqueada: {rewards[L.id]}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      {/* Historial últimas 4 semanas */}
      <div className="max-w-5xl mx-auto mt-6 p-5 rounded-2xl shadow-sm border border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur">
        <div className="flex items-center gap-2 mb-4"><History size={18} /><span className="font-semibold">Historial (últimas 4 semanas)</span></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
          {last4Weeks.map((w, idx) => (
            <div key={idx} className="p-3 rounded-xl border border-gray-300/30 bg-white/60 dark:bg-white/10">
              <div className="text-xs opacity-70 mb-1">{w.week}</div>
              <div className="text-base font-semibold">{w.points} pts</div>
            </div>
          ))}
        </div>
      </div>

      {/* Toast / Mensajes motivacionales */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 240, damping: 18 }}
            className="fixed bottom-5 left-1/2 -translate-x-1/2 px-4 py-3 rounded-2xl shadow-xl border border-white/10 bg-white/90 dark:bg-neutral-800/95 backdrop-blur"
            style={{ color: theme === "dark" ? COLORS.textLight : COLORS.textDark }}
          >
            <div className="text-sm font-semibold">{toast.title}</div>
            <div className="text-xs opacity-80">{toast.subtitle}</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <div className="max-w-5xl mx-auto text-center text-xs opacity-60 mt-6">
        Hecho con ♥ para Diego — Colores base {COLORS.green}, {COLORS.accent}, tipografías sugeridas Poppins/Montserrat.
      </div>
    </div>
  );
}
