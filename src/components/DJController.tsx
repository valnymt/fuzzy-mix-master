import { useState } from "react";
import Turntable from "./Turntable";
import PerformancePad from "./PerformancePad";
import FaderSlider from "./FaderSlider";
import RotaryKnob from "./RotaryKnob";

const PAD_COLORS_LEFT = [
  "hsl(0, 100%, 55%)", "hsl(35, 100%, 55%)", "hsl(55, 100%, 55%)", "hsl(150, 100%, 45%)",
  "hsl(190, 100%, 50%)", "hsl(220, 100%, 60%)", "hsl(270, 100%, 60%)", "hsl(320, 100%, 55%)",
];

const PAD_COLORS_RIGHT = [
  "hsl(320, 100%, 55%)", "hsl(270, 100%, 60%)", "hsl(220, 100%, 60%)", "hsl(190, 100%, 50%)",
  "hsl(150, 100%, 45%)", "hsl(55, 100%, 55%)", "hsl(35, 100%, 55%)", "hsl(0, 100%, 55%)",
];

const PAD_LABELS = ["CUE", "LOOP", "FX1", "FX2", "SMPL", "ROLL", "GATE", "SYNC"];

const INPUT_CONFIG = [
  { key: "heartRate", label: "Activity", top: "Chaotic", bottom: "Still", color: "hsl(0, 100%, 55%)" },
  { key: "weather", label: "Weather", top: "Clear", bottom: "Stormy", color: "hsl(220, 100%, 60%)" },
  { key: "light", label: "Light", top: "Bright", bottom: "Dark", color: "hsl(55, 100%, 55%)" },
  { key: "timeOfDay", label: "Time", top: "3PM", bottom: "3AM", color: "hsl(35, 100%, 55%)" },
  { key: "mood", label: "Mood", top: "Euphoric", bottom: "Sad", color: "hsl(320, 100%, 55%)" },
  { key: "taskFocus", label: "Focus", top: "Party", bottom: "Deep", color: "hsl(270, 100%, 60%)" },
  { key: "caffeine", label: "Caffeine", top: "Wired", bottom: "Tired", color: "hsl(150, 100%, 45%)" },
  { key: "social", label: "Social", top: "Crowd", bottom: "Solo", color: "hsl(190, 100%, 50%)" },
];

interface FuzzyInputs {
  [key: string]: number;
}

const DJController = () => {
  const [leftPlaying, setLeftPlaying] = useState(true);
  const [rightPlaying, setRightPlaying] = useState(false);
  const [crossfader, setCrossfader] = useState(50);
  const [activePads, setActivePads] = useState<Set<number>>(new Set([0, 4]));
  const [inputs, setInputs] = useState<FuzzyInputs>({
    heartRate: 65,
    weather: 40,
    light: 70,
    timeOfDay: 50,
    mood: 60,
    taskFocus: 30,
    caffeine: 80,
    social: 20,
  });

  const [knobs, setKnobs] = useState({
    eq1Hi: 60, eq1Mid: 50, eq1Low: 70,
    eq2Hi: 55, eq2Mid: 65, eq2Low: 45,
    filter1: 50, filter2: 50,
  });

  const bpm = Math.round(70 + (inputs.heartRate / 100) * 90);

  const togglePad = (index: number) => {
    setActivePads(prev => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const updateInput = (key: string, value: number) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  const updateKnob = (key: string, value: number) => {
    setKnobs(prev => ({ ...prev, [key]: value }));
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
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse-glow" />
            <span className="text-xs font-mono text-muted-foreground">
              {bpm} BPM • ONLINE
            </span>
          </div>
        </div>

        {/* Main Controller Body */}
        <div className="relative rounded-xl border border-border bg-card overflow-hidden"
          style={{
            boxShadow: `
              0 0 40px hsl(var(--neon-cyan) / 0.08),
              inset 0 1px 0 hsl(var(--foreground) / 0.05)
            `,
          }}
        >
          {/* Top Section: Pads + Knobs */}
          <div className="flex items-start justify-between p-4 border-b border-border">
            {/* Left Pads */}
            <div className="grid grid-cols-4 gap-2">
              {PAD_LABELS.map((label, i) => (
                <PerformancePad
                  key={`left-${i}`}
                  color={PAD_COLORS_LEFT[i]}
                  label={label}
                  isActive={activePads.has(i)}
                  onTrigger={() => togglePad(i)}
                />
              ))}
            </div>

            {/* Center Knobs: EQ Section */}
            <div className="hidden md:flex flex-col items-center gap-3">
              <span className="text-[9px] font-display uppercase tracking-widest text-muted-foreground mb-1">EQ / Filter</span>
              <div className="flex gap-6">
                <div className="flex flex-col items-center gap-2">
                  <RotaryKnob label="HI" value={knobs.eq1Hi} onChange={(v) => updateKnob("eq1Hi", v)} glowColor="hsl(190, 100%, 50%)" size={40} />
                  <RotaryKnob label="MID" value={knobs.eq1Mid} onChange={(v) => updateKnob("eq1Mid", v)} glowColor="hsl(190, 100%, 50%)" size={40} />
                  <RotaryKnob label="LOW" value={knobs.eq1Low} onChange={(v) => updateKnob("eq1Low", v)} glowColor="hsl(190, 100%, 50%)" size={40} />
                </div>
                <div className="flex flex-col items-center gap-2">
                  <RotaryKnob label="GAIN" value={knobs.filter1} onChange={(v) => updateKnob("filter1", v)} glowColor="hsl(320, 100%, 55%)" size={44} />
                  <RotaryKnob label="GAIN" value={knobs.filter2} onChange={(v) => updateKnob("filter2", v)} glowColor="hsl(150, 100%, 45%)" size={44} />
                </div>
                <div className="flex flex-col items-center gap-2">
                  <RotaryKnob label="HI" value={knobs.eq2Hi} onChange={(v) => updateKnob("eq2Hi", v)} glowColor="hsl(320, 100%, 55%)" size={40} />
                  <RotaryKnob label="MID" value={knobs.eq2Mid} onChange={(v) => updateKnob("eq2Mid", v)} glowColor="hsl(320, 100%, 55%)" size={40} />
                  <RotaryKnob label="LOW" value={knobs.eq2Low} onChange={(v) => updateKnob("eq2Low", v)} glowColor="hsl(320, 100%, 55%)" size={40} />
                </div>
              </div>
            </div>

            {/* Right Pads */}
            <div className="grid grid-cols-4 gap-2">
              {PAD_LABELS.map((label, i) => (
                <PerformancePad
                  key={`right-${i}`}
                  color={PAD_COLORS_RIGHT[i]}
                  label={label}
                  isActive={activePads.has(i + 8)}
                  onTrigger={() => togglePad(i + 8)}
                />
              ))}
            </div>
          </div>

          {/* Middle Section: Turntables + Faders */}
          <div className="flex items-center justify-between p-4 md:p-6 gap-4">
            {/* Left Turntable */}
            <Turntable
              label="Melody"
              bpm={bpm}
              glowColor="hsl(190, 100%, 50%)"
              isPlaying={leftPlaying}
              onTogglePlay={() => setLeftPlaying(!leftPlaying)}
            />

            {/* Center Mixer: 8 Fuzzy Input Faders */}
            <div className="flex-1 flex flex-col items-center gap-4">
              <span className="text-[9px] font-display uppercase tracking-[0.3em] text-muted-foreground">
                Fuzzy Input Matrix
              </span>
              <div className="flex gap-2 md:gap-3 justify-center flex-wrap">
                {INPUT_CONFIG.map((cfg) => (
                  <FaderSlider
                    key={cfg.key}
                    label={cfg.label}
                    value={inputs[cfg.key]}
                    onChange={(v) => updateInput(cfg.key, v)}
                    glowColor={cfg.color}
                    labelTop={cfg.top}
                    labelBottom={cfg.bottom}
                  />
                ))}
              </div>

              {/* Crossfader */}
              <div className="w-full max-w-xs flex flex-col items-center gap-1 mt-2">
                <div className="flex justify-between w-full px-1">
                  <span className="text-[8px] font-display text-primary uppercase">Melody</span>
                  <span className="text-[8px] font-display uppercase text-muted-foreground">Crossfader</span>
                  <span className="text-[8px] font-display text-secondary uppercase">Rhythm</span>
                </div>
                <input
                  type="range"
                  className="dj-crossfader"
                  min={0}
                  max={100}
                  value={crossfader}
                  onChange={(e) => setCrossfader(Number(e.target.value))}
                />
              </div>
            </div>

            {/* Right Turntable */}
            <Turntable
              label="Rhythm"
              bpm={bpm}
              glowColor="hsl(320, 100%, 55%)"
              isPlaying={rightPlaying}
              onTogglePlay={() => setRightPlaying(!rightPlaying)}
            />
          </div>

          {/* Bottom Bar: Transport Controls */}
          <div className="flex items-center justify-between px-6 py-3 border-t border-border bg-surface-dark">
            <div className="flex gap-2">
              {["SYNC", "CUE", "PLAY"].map((btn) => (
                <button
                  key={btn}
                  className="px-3 py-1.5 text-[10px] font-display uppercase tracking-wider rounded border border-border bg-surface-mid text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
                >
                  {btn}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <span className="text-xs font-mono text-muted-foreground">
                CH1: <span className="text-primary">{leftPlaying ? "LIVE" : "STOP"}</span>
              </span>
              <div className="w-px h-4 bg-border" />
              <span className="text-xs font-mono text-muted-foreground">
                CH2: <span className="text-secondary">{rightPlaying ? "LIVE" : "STOP"}</span>
              </span>
            </div>

            <div className="flex gap-2">
              {["HOT CUE", "LOOP", "FX"].map((btn) => (
                <button
                  key={btn}
                  className="px-3 py-1.5 text-[10px] font-display uppercase tracking-wider rounded border border-border bg-surface-mid text-muted-foreground hover:text-foreground hover:border-secondary transition-colors"
                >
                  {btn}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DJController;
