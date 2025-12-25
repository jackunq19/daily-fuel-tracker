import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { WorkoutDay } from "@/pages/WorkoutPage";

interface WeeklyPlannerProps {
  onDaySelect: (day: WorkoutDay) => void;
}

const mockWeekData: WorkoutDay[] = [
  {
    day: "Mon",
    date: "23",
    muscleGroup: "Chest & Triceps",
    status: "completed",
    exercises: [
      { id: "1", name: "Bench Press", sets: [{ reps: 10, weight: 135, completed: true }, { reps: 10, weight: 135, completed: true }, { reps: 8, weight: 145, completed: true }], completed: true },
      { id: "2", name: "Incline Dumbbell Press", sets: [{ reps: 12, weight: 50, completed: true }, { reps: 12, weight: 50, completed: true }, { reps: 10, weight: 55, completed: true }], completed: true },
      { id: "3", name: "Cable Flyes", sets: [{ reps: 15, weight: 30, completed: true }, { reps: 15, weight: 30, completed: true }, { reps: 12, weight: 35, completed: true }], completed: true },
      { id: "4", name: "Tricep Pushdowns", sets: [{ reps: 15, weight: 40, completed: true }, { reps: 15, weight: 40, completed: true }, { reps: 12, weight: 45, completed: true }], completed: true },
    ],
  },
  {
    day: "Tue",
    date: "24",
    muscleGroup: "Back & Biceps",
    status: "completed",
    exercises: [
      { id: "5", name: "Deadlifts", sets: [{ reps: 8, weight: 225, completed: true }, { reps: 8, weight: 225, completed: true }, { reps: 6, weight: 245, completed: true }], completed: true },
      { id: "6", name: "Pull-ups", sets: [{ reps: 10, weight: 0, completed: true }, { reps: 10, weight: 0, completed: true }, { reps: 8, weight: 0, completed: true }], completed: true },
      { id: "7", name: "Barbell Rows", sets: [{ reps: 10, weight: 135, completed: true }, { reps: 10, weight: 135, completed: true }, { reps: 8, weight: 145, completed: true }], completed: true },
      { id: "8", name: "Bicep Curls", sets: [{ reps: 12, weight: 30, completed: true }, { reps: 12, weight: 30, completed: true }, { reps: 10, weight: 35, completed: true }], completed: true },
    ],
  },
  {
    day: "Wed",
    date: "25",
    muscleGroup: "Rest Day",
    status: "rest",
    exercises: [],
  },
  {
    day: "Thu",
    date: "26",
    muscleGroup: "Legs",
    status: "partial",
    exercises: [
      { id: "9", name: "Squats", sets: [{ reps: 10, weight: 185, completed: true }, { reps: 10, weight: 185, completed: true }, { reps: 8, weight: 205, completed: true }], completed: true },
      { id: "10", name: "Leg Press", sets: [{ reps: 12, weight: 360, completed: true }, { reps: 12, weight: 360, completed: false }, { reps: 10, weight: 400, completed: false }], completed: false },
      { id: "11", name: "Leg Curls", sets: [{ reps: 12, weight: 90, completed: false }, { reps: 12, weight: 90, completed: false }, { reps: 10, weight: 100, completed: false }], completed: false },
      { id: "12", name: "Calf Raises", sets: [{ reps: 15, weight: 150, completed: false }, { reps: 15, weight: 150, completed: false }, { reps: 12, weight: 170, completed: false }], completed: false },
    ],
  },
  {
    day: "Fri",
    date: "27",
    muscleGroup: "Shoulders",
    status: "planned",
    exercises: [
      { id: "13", name: "Overhead Press", sets: [{ reps: 10, weight: 95, completed: false }, { reps: 10, weight: 95, completed: false }, { reps: 8, weight: 105, completed: false }], completed: false },
      { id: "14", name: "Lateral Raises", sets: [{ reps: 15, weight: 20, completed: false }, { reps: 15, weight: 20, completed: false }, { reps: 12, weight: 25, completed: false }], completed: false },
      { id: "15", name: "Face Pulls", sets: [{ reps: 15, weight: 40, completed: false }, { reps: 15, weight: 40, completed: false }, { reps: 12, weight: 45, completed: false }], completed: false },
      { id: "16", name: "Shrugs", sets: [{ reps: 12, weight: 70, completed: false }, { reps: 12, weight: 70, completed: false }, { reps: 10, weight: 80, completed: false }], completed: false },
    ],
  },
  {
    day: "Sat",
    date: "28",
    muscleGroup: "Arms",
    status: "planned",
    exercises: [
      { id: "17", name: "Close Grip Bench", sets: [{ reps: 10, weight: 115, completed: false }, { reps: 10, weight: 115, completed: false }, { reps: 8, weight: 125, completed: false }], completed: false },
      { id: "18", name: "Hammer Curls", sets: [{ reps: 12, weight: 35, completed: false }, { reps: 12, weight: 35, completed: false }, { reps: 10, weight: 40, completed: false }], completed: false },
      { id: "19", name: "Skull Crushers", sets: [{ reps: 12, weight: 50, completed: false }, { reps: 12, weight: 50, completed: false }, { reps: 10, weight: 55, completed: false }], completed: false },
      { id: "20", name: "Preacher Curls", sets: [{ reps: 12, weight: 40, completed: false }, { reps: 12, weight: 40, completed: false }, { reps: 10, weight: 45, completed: false }], completed: false },
    ],
  },
  {
    day: "Sun",
    date: "29",
    muscleGroup: "Rest Day",
    status: "rest",
    exercises: [],
  },
];

const getStatusColor = (status: WorkoutDay["status"]) => {
  switch (status) {
    case "completed":
      return "bg-success text-success-foreground";
    case "partial":
      return "bg-warning text-warning-foreground";
    case "skipped":
      return "bg-destructive text-destructive-foreground";
    case "rest":
      return "bg-muted text-muted-foreground";
    default:
      return "bg-secondary text-secondary-foreground";
  }
};

const getStatusBorder = (status: WorkoutDay["status"]) => {
  switch (status) {
    case "completed":
      return "border-success/30";
    case "partial":
      return "border-warning/30";
    case "skipped":
      return "border-destructive/30";
    default:
      return "border-border/30";
  }
};

export function WeeklyPlanner({ onDaySelect }: WeeklyPlannerProps) {
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);

  return (
    <div className="container mx-auto px-4 pb-6">
      <motion.h2 
        className="text-lg font-semibold text-foreground mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        This Week
      </motion.h2>

      {/* Horizontal Day Selector */}
      <motion.div 
        className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {mockWeekData.map((day, index) => (
          <motion.button
            key={day.day}
            onClick={() => setSelectedDayIndex(selectedDayIndex === index ? null : index)}
            className={`flex-shrink-0 w-16 p-3 rounded-2xl transition-all duration-300 ${
              selectedDayIndex === index 
                ? "bg-primary text-primary-foreground shadow-glow" 
                : `glass ${getStatusBorder(day.status)}`
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="text-center">
              <span className={`text-xs font-medium ${
                selectedDayIndex === index ? "text-primary-foreground/80" : "text-muted-foreground"
              }`}>
                {day.day}
              </span>
              <p className={`text-lg font-bold mt-1 ${
                selectedDayIndex === index ? "text-primary-foreground" : "text-foreground"
              }`}>
                {day.date}
              </p>
              <div className={`w-2 h-2 rounded-full mx-auto mt-2 ${getStatusColor(day.status)}`} />
            </div>
          </motion.button>
        ))}
      </motion.div>

      {/* Selected Day Preview */}
      {selectedDayIndex !== null && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card 
            className={`p-4 glass mt-2 ${getStatusBorder(mockWeekData[selectedDayIndex].status)} cursor-pointer hover-glow`}
            onClick={() => onDaySelect(mockWeekData[selectedDayIndex])}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground">
                  {mockWeekData[selectedDayIndex].muscleGroup}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {mockWeekData[selectedDayIndex].status === "rest" 
                    ? "Time to recover 😌" 
                    : `${mockWeekData[selectedDayIndex].exercises.length} exercises planned`
                  }
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(mockWeekData[selectedDayIndex].status)}`}>
                  {mockWeekData[selectedDayIndex].status.charAt(0).toUpperCase() + mockWeekData[selectedDayIndex].status.slice(1)}
                </span>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Status Legend */}
      <motion.div 
        className="flex items-center justify-center gap-4 mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-success" />
          <span className="text-xs text-muted-foreground">Completed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-warning" />
          <span className="text-xs text-muted-foreground">Partial</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-destructive" />
          <span className="text-xs text-muted-foreground">Skipped</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-muted" />
          <span className="text-xs text-muted-foreground">Rest</span>
        </div>
      </motion.div>
    </div>
  );
}
