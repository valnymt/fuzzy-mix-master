import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { useWebSocket } from "@/hooks/useWebSocket";

// ─── Turntable ───────────────────────────────────────────────
const Turntable = ({ label, bpm, glowColor, isPlaying, onTogglePlay }: {
  label: string; bpm: number; glowColor: string; isPlaying: boolean; onTogglePlay: () => void;
}) => {
  const speed = Math.max(0.5, 10 - bpm / 20);
  return (
    <div className="flex flex-col items-center gap-3">
      <span className="text-xs font-display uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="relative cursor-pointer" onClick={onTogglePlay}>
        <div className="absolute inset-[-4px] rounded-full animate-pulse-glow"
          style={{ background: `conic-gradient(from 0deg, ${glowColor}, transparent 30%, ${glowColor} 50%, transparent 80%, ${glowColor})`, opacity: isPlaying ? 0.7 : 0.2, filter: "blur(4px)" }} />
        <div className="relative w-44 h-44 md:w-56 md:h-56 rounded-full bg-surface-dark border-2 border-surface-light overflow-hidden">
          <motion.div className="absolute inset-2 rounded-full"
            animate={{ rotate: isPlaying ? 360 : 0 }}
            transition={{ duration: speed, repeat: isPlaying ? Infinity : 0, ease: "linear" }}
            style={{ background: "repeating-radial-gradient(circle at center, hsl(var(--surface-dark)) 0px, hsl(var(--surface-mid)) 1px, hsl(var(--surface-dark)) 2px)" }}>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center border-2"
                style={{ background: "radial-gradient(circle, hsl(var(--surface-mid)), hsl(var(--surface-dark)))", borderColor: glowColor, boxShadow: isPlaying ? `0 0 15px ${glowColor}40` : "none" }}>
                <span className="text-[10px] font-display font-bold text-foreground tracking-wider">{isPlaying ? "▶" : "■"}</span>
              </div>
            </div>
            <div className="absolute top-1/2 right-2 w-1/3 h-[1px]" style={{ backgroundColor: glowColor, opacity: 0.6 }} />
          </motion.div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: glowColor, boxShadow: isPlaying ? `0 0 8px ${glowColor}` : "none" }} />
        <span className="text-sm font-mono text-foreground">{bpm} <span className="text-muted-foreground text-xs">BPM</span></span>
      </div>
    </div>
  );
};

// ─── Performance Pad ─────────────────────────────────────────
const PerformancePad = ({ color, label, onTrigger, isActive = false }: {
  color: string; label: string; onTrigger: () => void; isActive?: boolean;
}) => {
  const [isPressed, setIsPressed] = useState(false);
  return (
    <motion.button
      className="relative w-14 h-14 md:w-16 md:h-16 rounded-md border overflow-hidden"
      style={{ backgroundColor: isActive ? color : `${color}30`, borderColor: color, boxShadow: isActive ? `0 0 16px ${color}80, inset 0 0 10px ${color}40` : `inset 0 0 6px ${color}20` }}
      whileTap={{ scale: 0.9 }}
      onMouseDown={() => { setIsPressed(true); onTrigger(); }}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}>
      {isPressed && <motion.div className="absolute inset-0" initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 0.3 }} style={{ backgroundColor: color }} />}
      <span className="relative z-10 text-[9px] font-display font-bold uppercase tracking-wider text-foreground/80">{label}</span>
    </motion.button>
  );
};

// ─── Fader Slider ────────────────────────────────────────────
const FaderSlider = ({ label, value, onChange, min = 0, max = 100, glowColor = "hsl(var(--primary))", labelTop, labelBottom }: {
  label: string; value: number; onChange: (v: number) => void; min?: number; max?: number; glowColor?: string; labelTop?: string; labelBottom?: string;
}) => (
  <div className="flex flex-col items-center gap-1">
    <span className="text-[9px] font-display uppercase tracking-widest text-muted-foreground truncate max-w-[60px] text-center">{label}</span>
    {labelTop && <span className="text-[8px] font-mono text-muted-foreground">{labelTop}</span>}
    <div className="relative h-28 md:h-36 flex items-center justify-center">
      <div className="absolute w-1 rounded-full" style={{ height: `${((value - min) / (max - min)) * 100}%`, bottom: 0, backgroundColor: glowColor, opacity: 0.3, filter: "blur(3px)" }} />
      <input type="range" className="dj-fader" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))} style={{ height: "100%" }} />
    </div>
    {labelBottom && <span className="text-[8px] font-mono text-muted-foreground">{labelBottom}</span>}
    <span className="text-xs font-mono text-foreground">{value}</span>
  </div>
);

// ─── Rotary Knob ─────────────────────────────────────────────
const RotaryKnob = ({ label, value, onChange, min = 0, max = 100, glowColor = "hsl(var(--primary))", size = 48 }: {
  label: string; value: number; onChange: (v: number) => void; min?: number; max?: number; glowColor?: string; size?: number;
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const rotation = ((value - min) / (max - min)) * 270 - 135;

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    const startY = e.clientY;
    const startValue = value;
    const onMove = (me: MouseEvent) => {
      const delta = startY - me.clientY;
      onChange(Math.round(Math.max(min, Math.min(max, startValue + (delta / 150) * (max - min)))));
    };
    const onUp = () => { setIsDragging(false); window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, [value, min, max, onChange]);

  return (
    <div className="flex flex-col items-center gap-1 select-none">
      <span className="text-[8px] font-display uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="relative rounded-full cursor-grab active:cursor-grabbing" style={{ width: size, height: size }} onMouseDown={handleMouseDown}>
        <div className="absolute inset-0 rounded-full border-2" style={{ borderColor: isDragging ? glowColor : "hsl(var(--border))", boxShadow: isDragging ? `0 0 12px ${glowColor}60` : "none" }} />
        <div className="absolute inset-1 rounded-full" style={{ transform: `rotate(${rotation}deg)`, background: "radial-gradient(circle at 40% 35%, hsl(var(--surface-light)), hsl(var(--surface-dark)))" }}>
          <div className="absolute top-1 left-1/2 -translate-x-1/2 w-[2px] h-3 rounded-full" style={{ backgroundColor: glowColor }} />
        </div>
        <svg className="absolute inset-[-6px]" viewBox="0 0 60 60" style={{ width: size + 12, height: size + 12 }}>
          <circle cx="30" cy="30" r="27" fill="none" stroke={glowColor} strokeWidth="2" strokeLinecap="round" opacity={0.4}
            strokeDasharray={`${((value - min) / (max - min)) * 212} 212`} transform="rotate(-225 30 30)" />
        </svg>
      </div>
      <span className="text-[10px] font-mono text-foreground">{value}</span>
    </div>
  );
};

// ─── Config ──────────────────────────────────────────────────
const PAD_COLORS_L = ["hsl(0,100%,55%)", "hsl(35,100%,55%)", "hsl(55,100%,55%)", "hsl(150,100%,45%)", "hsl(190,100%,50%)", "hsl(220,100%,60%)", "hsl(270,100%,60%)", "hsl(320,100%,55%)"];
const PAD_COLORS_R = [...PAD_COLORS_L].reverse();
const PAD_LABELS = ["CUE", "LOOP", "FX1", "FX2", "SMPL", "ROLL", "GATE", "SYNC"];

// Life Context — 8 Sliders
const SLIDERS = [
  { key: "energy", label: "Energy", top: "Hyper", bottom: "Calm", color: "hsl(0,100%,55%)" },
  { key: "atmosphere", label: "Atmosphere", top: "Vast", bottom: "Intimate", color: "hsl(220,100%,60%)" },
  { key: "task", label: "Task", top: "Complex", bottom: "Simple", color: "hsl(55,100%,55%)" },
  { key: "mood", label: "Mood", top: "Euphoric", bottom: "Sad", color: "hsl(320,100%,55%)" },
  { key: "social", label: "Social", top: "Crowd", bottom: "Solo", color: "hsl(190,100%,50%)" },
  { key: "timeOfDay", label: "Time", top: "3PM", bottom: "3AM", color: "hsl(35,100%,55%)" },
  { key: "caffeine", label: "Caffeine", top: "Wired", bottom: "Tired", color: "hsl(150,100%,45%)" },
  { key: "focus", label: "Focus", top: "Laser", bottom: "Scatter", color: "hsl(270,100%,60%)" },
];

// Musical Soul — 8 Knobs
const KNOB_CONFIGS = [
  { key: "warmth", label: "Warmth", color: "hsl(35,100%,55%)" },
  { key: "texture", label: "Texture", color: "hsl(220,100%,60%)" },
  { key: "clarity", label: "Clarity", color: "hsl(190,100%,50%)" },
  { key: "vibration", label: "Vibration", color: "hsl(270,100%,60%)" },
  { key: "grit", label: "Grit", color: "hsl(0,100%,55%)" },
  { key: "presence", label: "Presence", color: "hsl(150,100%,45%)" },
  { key: "width", label: "Width", color: "hsl(320,100%,55%)" },
  { key: "chaos", label: "Chaos", color: "hsl(55,100%,55%)" },
];

// ─── Main Controller ────────────────────────────────────────
const Index = () => {
  const [leftPlaying, setLeftPlaying] = useState(true);
  const [rightPlaying, setRightPlaying] = useState(false);
  const [crossfader, setCrossfader] = useState(50);
  const [activePads, setActivePads] = useState<Set<number>>(new Set([0, 4]));
  const [inputs, setInputs] = useState<Record<string, number>>({
    energy: 65, atmosphere: 40, task: 50, mood: 60, social: 20, timeOfDay: 50, caffeine: 80, focus: 30,
  });
  const [knobs, setKnobs] = useState<Record<string, number>>({
    warmth: 50, texture: 40, clarity: 60, vibration: 35, grit: 25, presence: 55, width: 50, chaos: 20,
  });
  const { status, sendInputs, audioUrl } = useWebSocket();

  const bpm = Math.round(70 + (inputs.energy / 100) * 90);

  // Send inputs to Flask whenever they change
  useEffect(() => {
    sendInputs({ inputs, crossfader, leftPlaying, rightPlaying, activePads: Array.from(activePads), knobs });
  }, [inputs, crossfader, leftPlaying, rightPlaying, activePads, knobs, sendInputs]);

  const togglePad = (i: number) => {
    setActivePads(prev => { const n = new Set(prev); if (n.has(i)) n.delete(i); else n.add(i); return n; });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 px-4">
          <h1 className="text-lg md:text-xl font-display font-bold tracking-[0.3em] uppercase text-foreground">
            Fuzzy<span className="text-primary">Mix</span>
          </h1>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: status === "connected" ? "hsl(var(--accent))" : status === "connecting" ? "hsl(55,100%,55%)" : "hsl(0,100%,50%)" }} />
            <span className="text-xs font-mono text-muted-foreground">{bpm} BPM • {status === "connected" ? "LIVE" : status === "connecting" ? "CONNECTING…" : "OFFLINE"}</span>
          </div>
        </div>

        {audioUrl && <audio src={audioUrl} autoPlay loop className="hidden" />}

        {/* Controller Body */}
        <div className="relative rounded-xl border border-border bg-card overflow-hidden"
          style={{ boxShadow: "0 0 40px hsl(var(--neon-cyan) / 0.08), inset 0 1px 0 hsl(var(--foreground) / 0.05)" }}>

          {/* Top: Pads + Knobs */}
          <div className="flex items-start justify-between p-4 border-b border-border">
            <div className="grid grid-cols-4 gap-2">
              {PAD_LABELS.map((l, i) => <PerformancePad key={`l${i}`} color={PAD_COLORS_L[i]} label={l} isActive={activePads.has(i)} onTrigger={() => togglePad(i)} />)}
            </div>

            <div className="hidden md:flex flex-col items-center gap-3">
              <span className="text-[9px] font-display uppercase tracking-widest text-muted-foreground mb-1">Musical Soul</span>
              <div className="grid grid-cols-4 gap-x-4 gap-y-2">
                {KNOB_CONFIGS.map(cfg => (
                  <RotaryKnob key={cfg.key} label={cfg.label} value={knobs[cfg.key]} onChange={v => setKnobs(p => ({ ...p, [cfg.key]: v }))} glowColor={cfg.color} size={40} />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {PAD_LABELS.map((l, i) => <PerformancePad key={`r${i}`} color={PAD_COLORS_R[i]} label={l} isActive={activePads.has(i + 8)} onTrigger={() => togglePad(i + 8)} />)}
            </div>
          </div>

          {/* Middle: Turntables + Faders */}
          <div className="flex items-center justify-between p-4 md:p-6 gap-4">
            <Turntable label="Melody" bpm={bpm} glowColor="hsl(190,100%,50%)" isPlaying={leftPlaying} onTogglePlay={() => setLeftPlaying(!leftPlaying)} />

            <div className="flex-1 flex flex-col items-center gap-4">
              <span className="text-[9px] font-display uppercase tracking-[0.3em] text-muted-foreground">Life Context</span>
              <div className="flex gap-2 md:gap-3 justify-center flex-wrap">
                {SLIDERS.map(cfg => <FaderSlider key={cfg.key} label={cfg.label} value={inputs[cfg.key]} onChange={v => setInputs(p => ({ ...p, [cfg.key]: v }))} glowColor={cfg.color} labelTop={cfg.top} labelBottom={cfg.bottom} />)}
              </div>
              <div className="w-full max-w-xs flex flex-col items-center gap-1 mt-2">
                <div className="flex justify-between w-full px-1">
                  <span className="text-[8px] font-display text-primary uppercase">Melody</span>
                  <span className="text-[8px] font-display uppercase text-muted-foreground">Crossfader</span>
                  <span className="text-[8px] font-display text-secondary uppercase">Rhythm</span>
                </div>
                <input type="range" className="dj-crossfader" min={0} max={100} value={crossfader} onChange={e => setCrossfader(Number(e.target.value))} />
              </div>
            </div>

            <Turntable label="Rhythm" bpm={bpm} glowColor="hsl(320,100%,55%)" isPlaying={rightPlaying} onTogglePlay={() => setRightPlaying(!rightPlaying)} />
          </div>

          {/* Bottom Bar */}
          <div className="flex items-center justify-between px-6 py-3 border-t border-border bg-surface-dark">
            <div className="flex gap-2">
              {["SYNC", "CUE", "PLAY"].map(b => (
                <button key={b} className="px-3 py-1.5 text-[10px] font-display uppercase tracking-wider rounded border border-border bg-surface-mid text-muted-foreground hover:text-foreground hover:border-primary transition-colors">{b}</button>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs font-mono text-muted-foreground">CH1: <span className="text-primary">{leftPlaying ? "LIVE" : "STOP"}</span></span>
              <div className="w-px h-4 bg-border" />
              <span className="text-xs font-mono text-muted-foreground">CH2: <span className="text-secondary">{rightPlaying ? "LIVE" : "STOP"}</span></span>
            </div>
            <div className="flex gap-2">
              {["HOT CUE", "LOOP", "FX"].map(b => (
                <button key={b} className="px-3 py-1.5 text-[10px] font-display uppercase tracking-wider rounded border border-border bg-surface-mid text-muted-foreground hover:text-foreground hover:border-secondary transition-colors">{b}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
