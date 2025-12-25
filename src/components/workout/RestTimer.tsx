import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Pause, RotateCcw, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface RestTimerProps {
  isOpen: boolean;
  onClose: () => void;
}

const presetTimes = [30, 60, 90, 120, 180];

export function RestTimer({ isOpen, onClose }: RestTimerProps) {
  const [timeLeft, setTimeLeft] = useState(60);
  const [initialTime, setInitialTime] = useState(60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      // Play a sound or vibration here if needed
      if (typeof window !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate([200, 100, 200]);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handlePresetSelect = (seconds: number) => {
    setInitialTime(seconds);
    setTimeLeft(seconds);
    setIsRunning(false);
  };

  const handleReset = useCallback(() => {
    setTimeLeft(initialTime);
    setIsRunning(false);
  }, [initialTime]);

  const toggleTimer = () => {
    if (timeLeft === 0) {
      handleReset();
    }
    setIsRunning(!isRunning);
  };

  const progress = initialTime > 0 ? ((initialTime - timeLeft) / initialTime) * 100 : 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 flex items-center justify-center"
          >
            <Card className="w-full max-w-sm glass border-primary/20">
              {/* Header */}
              <div className="p-4 border-b border-border/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Timer className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">Rest Timer</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-muted/50 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Timer Display */}
              <div className="p-6 flex flex-col items-center">
                <div className="relative w-48 h-48 mb-6">
                  {/* Background circle */}
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="hsl(var(--muted))"
                      strokeWidth="8"
                    />
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="hsl(var(--primary))"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${progress * 2.83}, 283`}
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.span
                      key={timeLeft}
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                      className={`text-5xl font-bold ${
                        timeLeft <= 10 && timeLeft > 0 ? "text-warning" : "text-foreground"
                      } ${timeLeft === 0 ? "text-success" : ""}`}
                    >
                      {formatTime(timeLeft)}
                    </motion.span>
                  </div>
                </div>

                {/* Preset Times */}
                <div className="flex gap-2 mb-6 flex-wrap justify-center">
                  {presetTimes.map((time) => (
                    <button
                      key={time}
                      onClick={() => handlePresetSelect(time)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        initialTime === time
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted/50 text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {time < 60 ? `${time}s` : `${time / 60}m`}
                    </button>
                  ))}
                </div>

                {/* Controls */}
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleReset}
                    className="w-12 h-12 rounded-full"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </Button>
                  <Button
                    size="icon"
                    onClick={toggleTimer}
                    className={`w-16 h-16 rounded-full ${
                      isRunning ? "bg-warning hover:bg-warning/90" : ""
                    }`}
                  >
                    {isRunning ? (
                      <Pause className="w-6 h-6" />
                    ) : (
                      <Play className="w-6 h-6 ml-1" />
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
