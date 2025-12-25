import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BottomNav } from "@/components/BottomNav";
import { WorkoutDashboard } from "@/components/workout/WorkoutDashboard";
import { WeeklyPlanner } from "@/components/workout/WeeklyPlanner";
import { WorkoutDetail } from "@/components/workout/WorkoutDetail";
import { WorkoutAnalytics } from "@/components/workout/WorkoutAnalytics";
import { Helmet } from "react-helmet-async";

export type WorkoutView = "dashboard" | "detail" | "analytics";

export interface WorkoutDay {
  day: string;
  date: string;
  muscleGroup: string;
  status: "completed" | "partial" | "skipped" | "planned" | "rest";
  exercises: Exercise[];
}

export interface Exercise {
  id: string;
  name: string;
  sets: ExerciseSet[];
  completed: boolean;
}

export interface ExerciseSet {
  reps: number;
  weight: number;
  completed: boolean;
}

const WorkoutPage = () => {
  const [view, setView] = useState<WorkoutView>("dashboard");
  const [selectedDay, setSelectedDay] = useState<WorkoutDay | null>(null);

  const handleDaySelect = (day: WorkoutDay) => {
    setSelectedDay(day);
    setView("detail");
  };

  const handleBack = () => {
    setView("dashboard");
    setSelectedDay(null);
  };

  return (
    <>
      <Helmet>
        <title>Workout Tracker | NutriTrack</title>
        <meta name="description" content="Track your workouts, plan your exercises, and monitor your fitness progress" />
      </Helmet>
      
      <div className="min-h-screen bg-background gradient-mesh pb-32">
        <AnimatePresence mode="wait">
          {view === "dashboard" && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <WorkoutDashboard onViewAnalytics={() => setView("analytics")} />
              <WeeklyPlanner onDaySelect={handleDaySelect} />
            </motion.div>
          )}
          
          {view === "detail" && selectedDay && (
            <motion.div
              key="detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <WorkoutDetail day={selectedDay} onBack={handleBack} />
            </motion.div>
          )}
          
          {view === "analytics" && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <WorkoutAnalytics onBack={handleBack} />
            </motion.div>
          )}
        </AnimatePresence>
        
        <BottomNav />
      </div>
    </>
  );
};

export default WorkoutPage;
