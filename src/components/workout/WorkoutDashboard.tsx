import { useState } from "react";
import { motion } from "framer-motion";
import { Flame, Clock, Trophy, Zap, ChartLine, Dumbbell, Plus, Target } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreateWorkoutPlanModal, WorkoutPlanData } from "./CreateWorkoutPlanModal";

interface WorkoutDashboardProps {
  onViewAnalytics: () => void;
}

export function WorkoutDashboard({ onViewAnalytics }: WorkoutDashboardProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Mock data - in production this would come from state/API
  const todayWorkout = {
    muscleGroup: "Chest & Triceps",
    duration: "45 min",
    exercises: 6,
  };
  
  const weeklyProgress = 71; // percentage
  const streak = 5;
  const caloriesBurned = 320;
  const personalBests = 3;

  const handleCreatePlan = (plan: WorkoutPlanData) => {
    console.log("Created plan:", plan);
    // In production, this would update the state/API
  };

  return (
    <div className="container mx-auto px-4 pt-8 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <motion.h1 
            className="text-3xl font-bold text-foreground"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Workout Tracker
          </motion.h1>
          <p className="text-muted-foreground mt-1">Let's crush it today 💪</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCreateModal(true)}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            New
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onViewAnalytics}
            className="gap-2"
          >
            <ChartLine className="w-4 h-4" />
            Analytics
          </Button>
        </div>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Today's Workout Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="col-span-2"
        >
          <Card className="p-5 glass border-primary/20 relative overflow-hidden group hover-glow cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-primary mb-2">
                <Dumbbell className="w-5 h-5" />
                <span className="text-sm font-medium">Today's Workout</span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                {todayWorkout.muscleGroup}
              </h3>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {todayWorkout.duration}
                </span>
                <span>{todayWorkout.exercises} exercises</span>
              </div>
            </div>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-16 h-16 opacity-20">
              <Dumbbell className="w-full h-full text-primary" />
            </div>
          </Card>
        </motion.div>

        {/* Weekly Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-4 glass border-border/30">
            <div className="flex items-center gap-2 text-muted-foreground mb-3">
              <Trophy className="w-4 h-4 text-warning" />
              <span className="text-xs font-medium">Weekly Goal</span>
            </div>
            <div className="relative w-20 h-20 mx-auto mb-2">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="hsl(var(--muted))"
                  strokeWidth="3"
                />
                <motion.path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={{ strokeDasharray: "0, 100" }}
                  animate={{ strokeDasharray: `${weeklyProgress}, 100` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-foreground">{weeklyProgress}%</span>
              </div>
            </div>
            <p className="text-xs text-center text-muted-foreground">5/7 days completed</p>
          </Card>
        </motion.div>

        {/* Streak */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-4 glass border-border/30">
            <div className="flex items-center gap-2 text-muted-foreground mb-3">
              <Flame className="w-4 h-4 text-accent" />
              <span className="text-xs font-medium">Streak</span>
            </div>
            <div className="flex items-center justify-center gap-1 mb-2">
              <motion.span 
                className="text-4xl font-bold text-foreground"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.6 }}
              >
                {streak}
              </motion.span>
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, -10, 10, 0]
                }}
                transition={{ 
                  duration: 0.5, 
                  delay: 0.8,
                  repeat: Infinity,
                  repeatDelay: 3
                }}
              >
                <Flame className="w-8 h-8 text-accent" />
              </motion.div>
            </div>
            <p className="text-xs text-center text-muted-foreground">days in a row!</p>
          </Card>
        </motion.div>

        {/* Calories Burned */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-4 glass border-border/30">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Zap className="w-4 h-4 text-warning" />
              <span className="text-xs font-medium">Calories Today</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-foreground">{caloriesBurned}</span>
              <span className="text-sm text-muted-foreground">kcal</span>
            </div>
          </Card>
        </motion.div>

        {/* Personal Bests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-4 glass border-border/30">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Target className="w-4 h-4 text-success" />
              <span className="text-xs font-medium">PRs This Month</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-foreground">{personalBests}</span>
              <span className="text-sm text-muted-foreground">new records</span>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* AI Tip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="p-4 glass border-primary/20 bg-primary/5">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <span className="text-sm">🤖</span>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground mb-1">AI Suggestion</p>
              <p className="text-xs text-muted-foreground">
                Based on your progress, try increasing your bench press weight by 5lbs next session!
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Create Workout Modal */}
      <CreateWorkoutPlanModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreatePlan={handleCreatePlan}
      />
    </div>
  );
}
