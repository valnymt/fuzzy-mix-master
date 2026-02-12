interface FaderSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  glowColor?: string;
  labelTop?: string;
  labelBottom?: string;
}

const FaderSlider = ({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  glowColor = "hsl(var(--primary))",
  labelTop,
  labelBottom,
}: FaderSliderProps) => {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-[9px] font-display uppercase tracking-widest text-muted-foreground truncate max-w-[60px] text-center">
        {label}
      </span>
      {labelTop && (
        <span className="text-[8px] font-mono text-muted-foreground">{labelTop}</span>
      )}
      <div className="relative h-28 md:h-36 flex items-center justify-center">
        {/* Track glow */}
        <div
          className="absolute w-1 rounded-full"
          style={{
            height: `${((value - min) / (max - min)) * 100}%`,
            bottom: 0,
            backgroundColor: glowColor,
            opacity: 0.3,
            filter: `blur(3px)`,
          }}
        />
        <input
          type="range"
          className="dj-fader"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{ height: '100%' }}
        />
      </div>
      {labelBottom && (
        <span className="text-[8px] font-mono text-muted-foreground">{labelBottom}</span>
      )}
      <span className="text-xs font-mono text-foreground">{value}</span>
    </div>
  );
};

export default FaderSlider;
