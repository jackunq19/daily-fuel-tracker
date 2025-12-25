import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Clock, Check, Timer, ChevronDown, ChevronUp, Dumbbell, PartyPopper } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { WorkoutDay, Exercise } from "@/pages/WorkoutPage";
import confetti from "canvas-confetti";

interface WorkoutDetailProps {
  day: WorkoutDay;
  onBack: () => void;
}

export function WorkoutDetail({ day, onBack }: WorkoutDetailProps) {
  const [exercises, setExercises] = useState(day.exercises);
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null);
  const [showCompletion, setShowCompletion] = useState(false);

  const completedExercises = exercises.filter(e => e.completed).length;
  const totalExercises = exercises.length;
  const progress = totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0;

  const toggleExercise = (exerciseId: string) => {
    setExpandedExercise(expandedExercise === exerciseId ? null : exerciseId);
  };

  const toggleExerciseComplete = (exerciseId: string) => {
    setExercises(prev => 
      prev.map(ex => 
        ex.id === exerciseId 
          ? { ...ex, completed: !ex.completed, sets: ex.sets.map(s => ({ ...s, completed: !ex.completed })) }
          : ex
      )
    );
  };

  const toggleSetComplete = (exerciseId: string, setIndex: number) => {
    setExercises(prev => 
      prev.map(ex => {
        if (ex.id === exerciseId) {
          const newSets = [...ex.sets];
          newSets[setIndex] = { ...newSets[setIndex], completed: !newSets[setIndex].completed };
          const allSetsCompleted = newSets.every(s => s.completed);
          return { ...ex, sets: newSets, completed: allSetsCompleted };
        }
        return ex;
      })
    );
  };

  const handleMarkComplete = () => {
    setShowCompletion(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#22c55e', '#10b981', '#34d399']
    });
  };

  if (day.status === "rest") {
    return (
      <div className="container mx-auto px-4 pt-8 pb-32">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="text-6xl mb-4"
          >
            😌
          </motion.div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Rest Day</h2>
          <p className="text-muted-foreground max-w-xs">
            Your muscles need time to recover. Take it easy today and come back stronger!
          </p>
        </div>
      </div>
    );
  }

  if (showCompletion) {
    return (
      <div className="container mx-auto px-4 pt-8 pb-32">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", duration: 0.8 }}
            className="w-24 h-24 rounded-full bg-success/20 flex items-center justify-center mb-6"
          >
            <PartyPopper className="w-12 h-12 text-success" />
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-foreground mb-2"
          >
            Workout Complete! 🎉
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground max-w-xs mb-8"
          >
            Great job crushing your {day.muscleGroup} workout! Keep up the momentum.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button onClick={onBack} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-8 pb-32">
      {/* Header */}
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back</span>
      </button>

      <div className="mb-6">
        <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
          <span>{day.day}</span>
          <span>•</span>
          <span>{day.date}</span>
        </div>
        <h1 className="text-2xl font-bold text-foreground">{day.muscleGroup}</h1>
        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            ~45 min
          </span>
          <span className="flex items-center gap-1">
            <Dumbbell className="w-4 h-4" />
            {totalExercises} exercises
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <Card className="p-4 glass border-border/30 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">Progress</span>
          <span className="text-sm text-muted-foreground">{completedExercises}/{totalExercises}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </Card>

      {/* Exercise List */}
      <div className="space-y-3">
        {exercises.map((exercise, index) => (
          <motion.div
            key={exercise.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              className={`overflow-hidden glass transition-all duration-300 ${
                exercise.completed ? "border-success/30 bg-success/5" : "border-border/30"
              }`}
            >
              {/* Exercise Header */}
              <div 
                className="p-4 flex items-center justify-between cursor-pointer"
                onClick={() => toggleExercise(exercise.id)}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExerciseComplete(exercise.id);
                    }}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      exercise.completed 
                        ? "bg-success border-success text-success-foreground" 
                        : "border-muted-foreground hover:border-primary"
                    }`}
                  >
                    {exercise.completed && <Check className="w-4 h-4" />}
                  </button>
                  <div>
                    <h3 className={`font-medium ${exercise.completed ? "text-muted-foreground line-through" : "text-foreground"}`}>
                      {exercise.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {exercise.sets.length} sets × {exercise.sets[0]?.reps} reps
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-muted/50 rounded-lg transition-colors">
                    <Timer className="w-4 h-4 text-muted-foreground" />
                  </button>
                  {expandedExercise === exercise.id ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
              </div>

              {/* Expanded Sets */}
              <AnimatePresence>
                {expandedExercise === exercise.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-border/30"
                  >
                    <div className="p-4 space-y-2">
                      {exercise.sets.map((set, setIndex) => (
                        <div 
                          key={setIndex}
                          className={`flex items-center justify-between p-3 rounded-xl transition-all ${
                            set.completed ? "bg-success/10" : "bg-muted/30"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => toggleSetComplete(exercise.id, setIndex)}
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                                set.completed 
                                  ? "bg-success border-success text-success-foreground" 
                                  : "border-muted-foreground hover:border-primary"
                              }`}
                            >
                              {set.completed && <Check className="w-3 h-3" />}
                            </button>
                            <span className="text-sm font-medium text-foreground">Set {setIndex + 1}</span>
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-muted-foreground">{set.reps} reps</span>
                            <span className="text-foreground font-medium">{set.weight} lbs</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Action Buttons */}
      <motion.div 
        className="fixed bottom-24 left-0 right-0 px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="max-w-lg mx-auto flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onBack}
          >
            Skip
          </Button>
          <Button
            className="flex-1 gap-2"
            onClick={handleMarkComplete}
          >
            <Check className="w-4 h-4" />
            Complete Workout
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
