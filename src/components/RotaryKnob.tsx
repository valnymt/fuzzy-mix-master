import { useState, useCallback } from "react";

interface RotaryKnobProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  glowColor?: string;
  size?: number;
}

const RotaryKnob = ({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  glowColor = "hsl(var(--primary))",
  size = 48,
}: RotaryKnobProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const rotation = ((value - min) / (max - min)) * 270 - 135;

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    const startY = e.clientY;
    const startValue = value;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const delta = startY - moveEvent.clientY;
      const range = max - min;
      const newValue = Math.round(Math.max(min, Math.min(max, startValue + (delta / 150) * range)));
      onChange(newValue);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  }, [value, min, max, onChange]);

  return (
    <div className="flex flex-col items-center gap-1 select-none">
      <span className="text-[8px] font-display uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <div
        className="relative rounded-full cursor-grab active:cursor-grabbing"
        style={{ width: size, height: size }}
        onMouseDown={handleMouseDown}
      >
        {/* Outer ring */}
        <div
          className="absolute inset-0 rounded-full border-2"
          style={{
            borderColor: isDragging ? glowColor : 'hsl(var(--border))',
            boxShadow: isDragging ? `0 0 12px ${glowColor}60` : 'none',
          }}
        />

        {/* Knob body */}
        <div
          className="absolute inset-1 rounded-full bg-surface-mid"
          style={{
            transform: `rotate(${rotation}deg)`,
            background: `radial-gradient(circle at 40% 35%, hsl(var(--surface-light)), hsl(var(--surface-dark)))`,
          }}
        >
          {/* Indicator line */}
          <div
            className="absolute top-1 left-1/2 -translate-x-1/2 w-[2px] h-3 rounded-full"
            style={{ backgroundColor: glowColor }}
          />
        </div>

        {/* Arc indicator */}
        <svg className="absolute inset-[-6px]" viewBox="0 0 60 60" style={{ width: size + 12, height: size + 12 }}>
          <circle
            cx="30" cy="30" r="27"
            fill="none"
            stroke={glowColor}
            strokeWidth="2"
            strokeLinecap="round"
            opacity={0.4}
            strokeDasharray={`${((value - min) / (max - min)) * 212} 212`}
            transform="rotate(-225 30 30)"
          />
        </svg>
      </div>
      <span className="text-[10px] font-mono text-foreground">{value}</span>
    </div>
  );
};

export default RotaryKnob;
