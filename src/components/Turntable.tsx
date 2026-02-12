import { motion } from "framer-motion";
import { useState } from "react";

interface TurntableProps {
  label: string;
  bpm: number;
  glowColor: string;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

const Turntable = ({ label, bpm, glowColor, isPlaying, onTogglePlay }: TurntableProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const speed = Math.max(0.5, 10 - (bpm / 20));

  return (
    <div className="flex flex-col items-center gap-3">
      <span className="text-xs font-display uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <div
        className="relative cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onTogglePlay}
      >
        {/* Outer glow ring */}
        <div
          className="absolute inset-[-4px] rounded-full animate-pulse-glow"
          style={{
            background: `conic-gradient(from 0deg, ${glowColor}, transparent 30%, ${glowColor} 50%, transparent 80%, ${glowColor})`,
            opacity: isPlaying ? 0.7 : 0.2,
            filter: `blur(4px)`,
          }}
        />

        {/* Platter base */}
        <div className="relative w-44 h-44 md:w-56 md:h-56 rounded-full bg-surface-dark border-2 border-surface-light overflow-hidden">
          {/* Vinyl grooves */}
          <motion.div
            className="absolute inset-2 rounded-full"
            animate={{ rotate: isPlaying ? 360 : 0 }}
            transition={{
              duration: speed,
              repeat: isPlaying ? Infinity : 0,
              ease: "linear",
            }}
            style={{
              background: `repeating-radial-gradient(
                circle at center,
                hsl(var(--surface-dark)) 0px,
                hsl(var(--surface-mid)) 1px,
                hsl(var(--surface-dark)) 2px
              )`,
            }}
          >
            {/* Center label */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center border-2"
                style={{
                  background: `radial-gradient(circle, hsl(var(--surface-mid)), hsl(var(--surface-dark)))`,
                  borderColor: glowColor,
                  boxShadow: isPlaying ? `0 0 15px ${glowColor}40` : 'none',
                }}
              >
                <span className="text-[10px] font-display font-bold text-foreground tracking-wider">
                  {isPlaying ? "▶" : "■"}
                </span>
              </div>
            </div>

            {/* Needle mark */}
            <div
              className="absolute top-1/2 right-2 w-1/3 h-[1px]"
              style={{ backgroundColor: glowColor, opacity: 0.6 }}
            />
          </motion.div>

          {/* Hover overlay */}
          {isHovered && (
            <div className="absolute inset-0 rounded-full bg-foreground/5 flex items-center justify-center">
            </div>
          )}
        </div>
      </div>

      {/* BPM Display */}
      <div className="flex items-center gap-2">
        <div
          className="w-2 h-2 rounded-full"
          style={{
            backgroundColor: glowColor,
            boxShadow: isPlaying ? `0 0 8px ${glowColor}` : 'none',
          }}
        />
        <span className="text-sm font-mono text-foreground">
          {bpm} <span className="text-muted-foreground text-xs">BPM</span>
        </span>
      </div>
    </div>
  );
};

export default Turntable;
