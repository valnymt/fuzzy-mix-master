import { useState } from "react";
import { motion } from "framer-motion";

interface PerformancePadProps {
  color: string;
  label: string;
  onTrigger: () => void;
  isActive?: boolean;
}

const PerformancePad = ({ color, label, onTrigger, isActive = false }: PerformancePadProps) => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <motion.button
      className="relative w-14 h-14 md:w-16 md:h-16 rounded-md border overflow-hidden"
      style={{
        backgroundColor: isActive ? color : `${color}30`,
        borderColor: color,
        boxShadow: isActive ? `0 0 16px ${color}80, inset 0 0 10px ${color}40` : `inset 0 0 6px ${color}20`,
      }}
      whileTap={{ scale: 0.9 }}
      onMouseDown={() => {
        setIsPressed(true);
        onTrigger();
      }}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
    >
      {isPressed && (
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{ backgroundColor: color }}
        />
      )}
      <span className="relative z-10 text-[9px] font-display font-bold uppercase tracking-wider text-foreground/80">
        {label}
      </span>
    </motion.button>
  );
};

export default PerformancePad;
