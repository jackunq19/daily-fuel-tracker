import { useState, useRef, useEffect } from "react";
import { motion, useSpring, useTransform, useMotionValue } from "framer-motion";

export function InteractiveNutritionCore() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring animations for parallax effect
  const springConfig = { stiffness: 150, damping: 30 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), springConfig);
  const x = useSpring(useTransform(mouseX, [-0.5, 0.5], [-20, 20]), springConfig);
  const y = useSpring(useTransform(mouseY, [-0.5, 0.5], [-20, 20]), springConfig);
  const scale = useSpring(1, springConfig);

  const handleMouseMove = (e: MouseEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Normalize mouse position relative to center (-0.5 to 0.5)
    const normalizedX = (e.clientX - centerX) / rect.width;
    const normalizedY = (e.clientY - centerY) / rect.height;
    
    mouseX.set(normalizedX);
    mouseY.set(normalizedY);
  };

  const handleMouseEnter = () => {
    scale.set(1.05);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    scale.set(1);
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative w-full max-w-lg mx-auto aspect-square flex items-center justify-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle, hsl(var(--primary) / 0.3) 0%, transparent 70%)",
          x,
          y,
          scale,
        }}
      />

      {/* Main floating element */}
      <motion.div
        className="relative w-64 h-64 md:w-80 md:h-80"
        style={{
          rotateX,
          rotateY,
          x,
          y,
          scale,
          transformStyle: "preserve-3d",
          perspective: 1000,
        }}
      >
        {/* Central nutrition orb */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 via-primary/10 to-transparent backdrop-blur-xl border border-primary/20 shadow-2xl flex items-center justify-center"
          animate={{
            boxShadow: [
              "0 0 40px hsl(var(--primary) / 0.2)",
              "0 0 60px hsl(var(--primary) / 0.3)",
              "0 0 40px hsl(var(--primary) / 0.2)",
            ],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Inner circles */}
          <div className="absolute inset-4 rounded-full border border-primary/10" />
          <div className="absolute inset-8 rounded-full border border-primary/10" />
          <div className="absolute inset-12 rounded-full border border-primary/10" />

          {/* Center content */}
          <div className="relative z-10 text-center">
            <motion.div
              className="text-6xl md:text-7xl mb-2"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              🥗
            </motion.div>
            <p className="text-xs text-muted-foreground font-medium tracking-wider uppercase">
              Your Journey
            </p>
          </div>
        </motion.div>

        {/* Orbiting elements */}
        {[
          { emoji: "🍎", delay: 0, distance: 140, duration: 8 },
          { emoji: "🥚", delay: 2, distance: 140, duration: 10 },
          { emoji: "🥛", delay: 4, distance: 140, duration: 9 },
          { emoji: "🥑", delay: 6, distance: 140, duration: 11 },
        ].map((item, i) => (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2 w-12 h-12 -ml-6 -mt-6 rounded-full bg-card/80 backdrop-blur-sm border border-border/50 flex items-center justify-center text-2xl shadow-lg"
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: item.duration,
              repeat: Infinity,
              ease: "linear",
              delay: item.delay,
            }}
            style={{
              transformOrigin: "center center",
              transform: `rotate(${i * 90}deg) translateX(${item.distance}px) rotate(-${i * 90}deg)`,
            }}
          >
            <motion.span
              animate={{ rotate: -360 }}
              transition={{
                duration: item.duration,
                repeat: Infinity,
                ease: "linear",
                delay: item.delay,
              }}
            >
              {item.emoji}
            </motion.span>
          </motion.div>
        ))}
      </motion.div>

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-primary/30"
          style={{
            left: `${20 + Math.random() * 60}%`,
            top: `${20 + Math.random() * 60}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
