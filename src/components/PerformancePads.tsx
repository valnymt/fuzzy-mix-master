import { useState } from "react";
import { motion } from "framer-motion";

const PAD_COLORS_L = ["hsl(0,100%,55%)", "hsl(35,100%,55%)", "hsl(55,100%,55%)", "hsl(150,100%,45%)", "hsl(190,100%,50%)", "hsl(220,100%,60%)", "hsl(270,100%,60%)", "hsl(320,100%,55%)"];
const PAD_COLORS_R = [...PAD_COLORS_L].reverse();
const PAD_LABELS = ["CUE", "LOOP", "FX1", "FX2", "SMPL", "ROLL", "GATE", "SYNC"];

const DisplayPad = ({ color, label, isActive }: { color: string; label: string; isActive: boolean }) => {
  const [isPressed, setIsPressed] = useState(false);
  return (
    <motion.div
      className="relative w-14 h-14 md:w-16 md:h-16 rounded-md border overflow-hidden flex items-center justify-center cursor-default"
      style={{
        backgroundColor: isActive ? color : `${color}30`,
        borderColor: color,
        boxShadow: isActive ? `0 0 16px ${color}80, inset 0 0 10px ${color}40` : `inset 0 0 6px ${color}20`,
      }}
    >
      <span className="text-[9px] font-display font-bold uppercase tracking-wider text-foreground/80">{label}</span>
    </motion.div>
  );
};

const ACTIVE_LEFT = new Set([0, 4]);
const ACTIVE_RIGHT = new Set([2, 5]);

export const LeftPads = () => (
  <div className="grid grid-cols-4 gap-2">
    {PAD_LABELS.map((l, i) => (
      <DisplayPad key={`l${i}`} color={PAD_COLORS_L[i]} label={l} isActive={ACTIVE_LEFT.has(i)} />
    ))}
  </div>
);

export const RightPads = () => (
  <div className="grid grid-cols-4 gap-2">
    {PAD_LABELS.map((l, i) => (
      <DisplayPad key={`r${i}`} color={PAD_COLORS_R[i]} label={l} isActive={ACTIVE_RIGHT.has(i)} />
    ))}
  </div>
);
