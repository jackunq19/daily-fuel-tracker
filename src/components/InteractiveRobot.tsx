import { motion, useMotionValue, useSpring, useTransform, type Easing } from "framer-motion";
import { useRef, useState, useEffect } from "react";

type EasingType = Easing;

type RobotAction = 'idle' | 'curling' | 'drinking' | 'waving' | 'flexing';

export function InteractiveRobot() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [action, setAction] = useState<RobotAction>('idle');
  const [isHovered, setIsHovered] = useState(false);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { stiffness: 100, damping: 20 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), springConfig);
  const scale = useSpring(1, springConfig);

  // Cycle through actions every few seconds when hovered
  useEffect(() => {
    if (!isHovered) {
      setAction('idle');
      return;
    }
    
    const actions: RobotAction[] = ['curling', 'drinking', 'waving', 'flexing'];
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      setAction(actions[currentIndex]);
      currentIndex = (currentIndex + 1) % actions.length;
    }, 2000);
    
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

  const handleMouseEnter = () => {
    setIsHovered(true);
    scale.set(1.05);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
    scale.set(1);
  };

  // Animation variants for different body parts
  const getArmAnimation = (side: 'left' | 'right') => {
    const isLeft = side === 'left';
    const easeInOut: EasingType = "easeInOut";
    
    switch (action) {
      case 'curling':
        return {
          rotate: isLeft ? [0, -60, 0] : [0, 60, 0],
          transition: { duration: 0.8, repeat: Infinity, ease: easeInOut }
        };
      case 'drinking':
        return {
          rotate: isLeft ? 0 : [-30, -60, -30],
          y: isLeft ? 0 : [-5, -15, -5],
          transition: { duration: 1.2, repeat: Infinity, ease: easeInOut }
        };
      case 'waving':
        return {
          rotate: isLeft ? 0 : [-20, -40, -20, -40, -20],
          transition: { duration: 0.8, repeat: Infinity }
        };
      case 'flexing':
        return {
          rotate: isLeft ? -45 : 45,
          scale: 1.1,
          transition: { duration: 0.5 }
        };
      default:
        return {
          rotate: 0,
          y: [0, -3, 0],
          transition: { duration: 2, repeat: Infinity, ease: easeInOut }
        };
    }
  };

  const getHeadAnimation = () => {
    const easeInOut: EasingType = "easeInOut";
    
    switch (action) {
      case 'drinking':
        return {
          rotate: [0, 15, 0],
          transition: { duration: 1.2, repeat: Infinity, ease: easeInOut }
        };
      case 'waving':
        return {
          rotate: [0, 5, -5, 0],
          transition: { duration: 0.4, repeat: Infinity }
        };
      default:
        return {
          rotate: 0,
          y: [0, -2, 0],
          transition: { duration: 3, repeat: Infinity, ease: easeInOut }
        };
    }
  };

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, scale, perspective: 1000 }}
      className="relative w-full max-w-md h-[500px] cursor-pointer select-none"
    >
      {/* Glow effect */}
      <motion.div
        animate={{
          opacity: isHovered ? 0.6 : 0.3,
          scale: isHovered ? 1.2 : 1,
        }}
        className="absolute inset-0 bg-gradient-radial from-primary/40 via-primary/10 to-transparent rounded-full blur-3xl -z-10"
      />

      {/* Main robot container */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-full h-full flex items-center justify-center"
      >
        <svg viewBox="0 0 400 500" className="w-full h-full">
          <defs>
            {/* Gradients */}
            <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.9" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="metalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e0e0e0" />
              <stop offset="50%" stopColor="#c0c0c0" />
              <stop offset="100%" stopColor="#a0a0a0" />
            </linearGradient>
            <linearGradient id="screenGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1a1a2e" />
              <stop offset="100%" stopColor="#0f0f1a" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Legs */}
          <motion.g>
            {/* Left Leg */}
            <rect x="140" y="380" width="35" height="80" rx="8" fill="url(#metalGradient)" />
            <rect x="130" y="450" width="55" height="25" rx="8" fill="url(#bodyGradient)" />
            {/* Right Leg */}
            <rect x="225" y="380" width="35" height="80" rx="8" fill="url(#metalGradient)" />
            <rect x="215" y="450" width="55" height="25" rx="8" fill="url(#bodyGradient)" />
          </motion.g>

          {/* Body */}
          <motion.g>
            <rect x="120" y="220" width="160" height="170" rx="20" fill="url(#metalGradient)" />
            {/* Chest screen */}
            <rect x="145" y="250" width="110" height="60" rx="10" fill="url(#screenGradient)" />
            {/* Screen content - heart rate */}
            <motion.g
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <path
                d="M160 280 L175 280 L180 265 L190 295 L200 270 L205 280 L240 280"
                stroke="hsl(var(--primary))"
                strokeWidth="3"
                fill="none"
                filter="url(#glow)"
              />
            </motion.g>
            {/* Core glow */}
            <motion.circle
              cx="200"
              cy="360"
              r="15"
              fill="hsl(var(--primary))"
              animate={{ opacity: [0.5, 1, 0.5], scale: [0.9, 1.1, 0.9] }}
              transition={{ duration: 2, repeat: Infinity }}
              filter="url(#glow)"
            />
          </motion.g>

          {/* Left Arm with dumbbell */}
          <motion.g
            style={{ originX: "120px", originY: "240px" }}
            animate={getArmAnimation('left')}
          >
            <rect x="70" y="230" width="55" height="30" rx="10" fill="url(#metalGradient)" />
            <rect x="55" y="260" width="30" height="80" rx="8" fill="url(#metalGradient)" />
            {/* Hand */}
            <circle cx="70" cy="345" r="18" fill="url(#metalGradient)" />
            {/* Dumbbell */}
            <motion.g animate={action === 'curling' ? { scale: [1, 1.1, 1] } : {}}>
              <rect x="40" y="350" width="60" height="12" rx="3" fill="#333" />
              <rect x="30" y="340" width="18" height="32" rx="4" fill="#555" />
              <rect x="92" y="340" width="18" height="32" rx="4" fill="#555" />
            </motion.g>
          </motion.g>

          {/* Right Arm with shaker */}
          <motion.g
            style={{ originX: "280px", originY: "240px" }}
            animate={getArmAnimation('right')}
          >
            <rect x="275" y="230" width="55" height="30" rx="10" fill="url(#metalGradient)" />
            <rect x="315" y="260" width="30" height="80" rx="8" fill="url(#metalGradient)" />
            {/* Hand */}
            <circle cx="330" cy="345" r="18" fill="url(#metalGradient)" />
            {/* Protein shaker */}
            <motion.g animate={action === 'drinking' ? { y: [-20, 0, -20], rotate: [0, -15, 0] } : {}}>
              <rect x="318" y="300" width="25" height="50" rx="5" fill="hsl(var(--primary))" opacity="0.8" />
              <rect x="315" y="295" width="31" height="10" rx="3" fill="#333" />
              <rect x="323" y="280" width="15" height="18" rx="3" fill="#444" />
              {/* Liquid */}
              <motion.rect
                x="320"
                y="320"
                width="21"
                height="25"
                rx="3"
                fill="hsl(var(--accent))"
                opacity="0.6"
                animate={{ height: action === 'drinking' ? [25, 15, 25] : 25 }}
              />
            </motion.g>
          </motion.g>

          {/* Head */}
          <motion.g animate={getHeadAnimation()}>
            {/* Neck */}
            <rect x="175" y="195" width="50" height="30" rx="5" fill="url(#metalGradient)" />
            {/* Head base */}
            <rect x="130" y="80" width="140" height="120" rx="25" fill="url(#metalGradient)" />
            {/* Headphones/Ears */}
            <ellipse cx="125" cy="130" rx="20" ry="30" fill="url(#bodyGradient)" />
            <ellipse cx="275" cy="130" rx="20" ry="30" fill="url(#bodyGradient)" />
            {/* Face screen */}
            <rect x="150" y="100" width="100" height="70" rx="15" fill="#0a0a0f" />
            {/* Eyes */}
            <motion.g
              animate={isHovered ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.5, repeat: isHovered ? Infinity : 0, repeatDelay: 2 }}
            >
              <motion.ellipse
                cx="175"
                cy="135"
                rx="15"
                ry="18"
                fill="hsl(var(--primary))"
                filter="url(#glow)"
                animate={{ scaleY: action === 'waving' ? [1, 0.2, 1] : 1 }}
                transition={{ duration: 0.2, repeat: action === 'waving' ? Infinity : 0, repeatDelay: 0.5 }}
              />
              <motion.ellipse
                cx="225"
                cy="135"
                rx="15"
                ry="18"
                fill="hsl(var(--primary))"
                filter="url(#glow)"
                animate={{ scaleY: action === 'waving' ? [1, 0.2, 1] : 1 }}
                transition={{ duration: 0.2, repeat: action === 'waving' ? Infinity : 0, repeatDelay: 0.5 }}
              />
            </motion.g>
            {/* Antenna */}
            <motion.g
              animate={{ rotate: isHovered ? [0, -5, 5, 0] : 0 }}
              transition={{ duration: 0.5, repeat: isHovered ? Infinity : 0 }}
            >
              <rect x="195" y="55" width="10" height="30" rx="5" fill="url(#metalGradient)" />
              <motion.circle
                cx="200"
                cy="50"
                r="10"
                fill="hsl(var(--primary))"
                filter="url(#glow)"
                animate={{ opacity: [0.5, 1, 0.5], scale: [0.8, 1.2, 0.8] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </motion.g>
          </motion.g>

          {/* Floating food items around robot */}
          <motion.g
            animate={{ y: [0, -10, 0], x: [0, 5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <text x="50" y="180" fontSize="30" opacity="0.8">🍎</text>
          </motion.g>
          <motion.g
            animate={{ y: [0, 10, 0], x: [0, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          >
            <text x="330" y="150" fontSize="25" opacity="0.8">🥑</text>
          </motion.g>
          <motion.g
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >
            <text x="40" y="400" fontSize="28" opacity="0.7">🥚</text>
          </motion.g>
          <motion.g
            animate={{ y: [0, 8, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          >
            <text x="340" y="420" fontSize="26" opacity="0.7">🥛</text>
          </motion.g>
        </svg>
      </motion.div>

      {/* Action indicator */}
      {isHovered && action !== 'idle' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-primary/20 backdrop-blur-sm rounded-full border border-primary/30"
        >
          <span className="text-sm font-medium text-primary capitalize">
            {action === 'curling' && '💪 Pumping iron!'}
            {action === 'drinking' && '🥤 Protein time!'}
            {action === 'waving' && '👋 Hey there!'}
            {action === 'flexing' && '💪 Feeling strong!'}
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}