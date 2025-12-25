import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const nutritionTips = [
  "Protein helps build muscle! 💪",
  "Stay hydrated, drink 8 glasses daily! 💧",
  "Eat the rainbow for vitamins! 🌈",
  "Fiber keeps you full longer! 🥦",
  "Healthy fats fuel your brain! 🧠",
  "Track your macros for results! 📊",
  "Post-workout protein is key! 🏋️",
  "Complex carbs = sustained energy! ⚡",
];

export function InteractiveRobot() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [currentTip, setCurrentTip] = useState(0);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { stiffness: 150, damping: 25 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), springConfig);
  
  // Eye tracking - smoother springs for eyes
  const eyeSpring = { stiffness: 300, damping: 30 };
  const leftEyeX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-4, 4]), eyeSpring);
  const leftEyeY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-3, 3]), eyeSpring);
  const rightEyeX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-4, 4]), eyeSpring);
  const rightEyeY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-3, 3]), eyeSpring);

  // Cycle through tips when hovered
  useEffect(() => {
    if (!isHovered) return;
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % nutritionTips.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isHovered]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, perspective: 1000 }}
      className="relative w-full max-w-sm h-[420px] cursor-pointer select-none"
    >
      {/* Speech bubble */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 10 }}
        animate={{ 
          opacity: isHovered ? 1 : 0, 
          scale: isHovered ? 1 : 0.8,
          y: isHovered ? 0 : 10
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="absolute -top-2 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="relative bg-card border border-border rounded-2xl px-4 py-3 shadow-lg max-w-[220px]">
          <motion.p 
            key={currentTip}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.3 }}
            className="text-sm font-medium text-foreground text-center"
          >
            {nutritionTips[currentTip]}
          </motion.p>
          {/* Speech bubble tail */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-card border-r border-b border-border rotate-45" />
        </div>
      </motion.div>

      {/* Subtle glow */}
      <motion.div
        animate={{ opacity: isHovered ? 0.5 : 0.25 }}
        transition={{ duration: 0.4 }}
        className="absolute inset-0 bg-gradient-radial from-primary/30 via-transparent to-transparent rounded-full blur-3xl -z-10"
      />

      {/* Robot floating animation */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-full h-full flex items-center justify-center pt-8"
      >
        <svg viewBox="0 0 320 420" className="w-full h-full">
          <defs>
            <linearGradient id="robotBody" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d4d4d8" />
              <stop offset="50%" stopColor="#a1a1aa" />
              <stop offset="100%" stopColor="#71717a" />
            </linearGradient>
            <linearGradient id="robotAccent" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.7" />
            </linearGradient>
            <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Legs */}
          <rect x="115" y="320" width="28" height="60" rx="6" fill="url(#robotBody)" />
          <rect x="177" y="320" width="28" height="60" rx="6" fill="url(#robotBody)" />
          <rect x="105" y="372" width="48" height="20" rx="6" fill="url(#robotAccent)" />
          <rect x="167" y="372" width="48" height="20" rx="6" fill="url(#robotAccent)" />

          {/* Body */}
          <rect x="95" y="185" width="130" height="145" rx="16" fill="url(#robotBody)" />
          
          {/* Chest screen */}
          <rect x="115" y="210" width="90" height="50" rx="8" fill="#18181b" />
          <motion.path
            d="M125 235 L140 235 L148 220 L160 250 L172 228 L180 235 L195 235"
            stroke="hsl(var(--primary))"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            animate={{ pathLength: [0, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Core light */}
          <motion.circle
            cx="160"
            cy="300"
            r="12"
            fill="hsl(var(--primary))"
            filter="url(#softGlow)"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Left Arm */}
          <motion.g
            style={{ originX: "95px", originY: "200px" }}
            animate={isHovered ? { rotate: [0, -15, 0] } : { rotate: 0 }}
            transition={{ duration: 1.5, repeat: isHovered ? Infinity : 0, ease: "easeInOut" }}
          >
            <rect x="55" y="195" width="45" height="24" rx="8" fill="url(#robotBody)" />
            <rect x="50" y="218" width="24" height="65" rx="6" fill="url(#robotBody)" />
            <circle cx="62" cy="290" r="14" fill="url(#robotBody)" />
            {/* Dumbbell */}
            <rect x="35" y="295" width="54" height="10" rx="3" fill="#3f3f46" />
            <rect x="26" y="287" width="16" height="26" rx="4" fill="#52525b" />
            <rect x="82" y="287" width="16" height="26" rx="4" fill="#52525b" />
          </motion.g>

          {/* Right Arm */}
          <motion.g
            style={{ originX: "225px", originY: "200px" }}
            animate={isHovered ? { rotate: [0, 15, 0] } : { rotate: 0 }}
            transition={{ duration: 1.5, repeat: isHovered ? Infinity : 0, ease: "easeInOut", delay: 0.2 }}
          >
            <rect x="220" y="195" width="45" height="24" rx="8" fill="url(#robotBody)" />
            <rect x="246" y="218" width="24" height="65" rx="6" fill="url(#robotBody)" />
            <circle cx="258" cy="290" r="14" fill="url(#robotBody)" />
            {/* Shaker bottle */}
            <rect x="245" y="260" width="26" height="42" rx="5" fill="url(#robotAccent)" opacity="0.85" />
            <rect x="242" y="255" width="32" height="8" rx="3" fill="#3f3f46" />
            <rect x="250" y="242" width="16" height="15" rx="3" fill="#52525b" />
          </motion.g>

          {/* Head */}
          <motion.g
            animate={isHovered ? { y: [0, -3, 0] } : { y: 0 }}
            transition={{ duration: 1.2, repeat: isHovered ? Infinity : 0, ease: "easeInOut" }}
          >
            {/* Neck */}
            <rect x="140" y="165" width="40" height="25" rx="5" fill="url(#robotBody)" />
            {/* Head shape */}
            <rect x="105" y="70" width="110" height="100" rx="20" fill="url(#robotBody)" />
            {/* Headphones */}
            <ellipse cx="102" cy="115" rx="16" ry="24" fill="url(#robotAccent)" />
            <ellipse cx="218" cy="115" rx="16" ry="24" fill="url(#robotAccent)" />
            {/* Face screen */}
            <rect x="120" y="88" width="80" height="58" rx="12" fill="#18181b" />
            
            {/* Left Eye - with tracking */}
            <motion.g style={{ x: leftEyeX, y: leftEyeY }}>
              <motion.ellipse
                cx="145"
                cy="117"
                rx="12"
                ry="14"
                fill="hsl(var(--primary))"
                filter="url(#softGlow)"
                animate={isHovered ? { scaleY: [1, 0.15, 1] } : { scaleY: 1 }}
                transition={{ duration: 0.25, repeat: isHovered ? 1 : 0, repeatDelay: 2.5 }}
              />
              {/* Pupil */}
              <circle cx="147" cy="118" r="4" fill="#18181b" opacity="0.6" />
            </motion.g>
            
            {/* Right Eye - with tracking */}
            <motion.g style={{ x: rightEyeX, y: rightEyeY }}>
              <motion.ellipse
                cx="175"
                cy="117"
                rx="12"
                ry="14"
                fill="hsl(var(--primary))"
                filter="url(#softGlow)"
                animate={isHovered ? { scaleY: [1, 0.15, 1] } : { scaleY: 1 }}
                transition={{ duration: 0.25, repeat: isHovered ? 1 : 0, repeatDelay: 2.5 }}
              />
              {/* Pupil */}
              <circle cx="177" cy="118" r="4" fill="#18181b" opacity="0.6" />
            </motion.g>
            
            {/* Antenna */}
            <rect x="155" y="48" width="10" height="26" rx="5" fill="url(#robotBody)" />
            <motion.circle
              cx="160"
              cy="44"
              r="9"
              fill="hsl(var(--primary))"
              filter="url(#softGlow)"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.g>

          {/* Floating food icons */}
          <motion.text
            x="42"
            y="160"
            fontSize="24"
            animate={{ y: [0, -8, 0], opacity: [0.7, 0.9, 0.7] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          >🍎</motion.text>
          <motion.text
            x="268"
            y="140"
            fontSize="22"
            animate={{ y: [0, 8, 0], opacity: [0.7, 0.9, 0.7] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
          >🥑</motion.text>
          <motion.text
            x="35"
            y="360"
            fontSize="20"
            animate={{ y: [0, -6, 0], opacity: [0.6, 0.85, 0.6] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
          >🥚</motion.text>
          <motion.text
            x="272"
            y="370"
            fontSize="20"
            animate={{ y: [0, 6, 0], opacity: [0.6, 0.85, 0.6] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
          >🥛</motion.text>
        </svg>
      </motion.div>
    </motion.div>
  );
}
