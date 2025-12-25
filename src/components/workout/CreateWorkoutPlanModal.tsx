import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Calendar, Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CreateWorkoutPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePlan: (plan: WorkoutPlanData) => void;
}

export interface WorkoutPlanData {
  day: string;
  muscleGroup: string;
  isRestDay: boolean;
}

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const muscleGroups = [
  "Chest & Triceps",
  "Back & Biceps",
  "Legs",
  "Shoulders",
  "Arms",
  "Core",
  "Full Body",
  "Upper Body",
  "Lower Body",
  "Push",
  "Pull",
  "Cardio",
];

export function CreateWorkoutPlanModal({ isOpen, onClose, onCreatePlan }: CreateWorkoutPlanModalProps) {
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [muscleGroup, setMuscleGroup] = useState<string>("");
  const [customMuscleGroup, setCustomMuscleGroup] = useState("");
  const [isRestDay, setIsRestDay] = useState(false);

  const handleSubmit = () => {
    const finalMuscleGroup = isRestDay ? "Rest Day" : (muscleGroup === "custom" ? customMuscleGroup : muscleGroup);
    
    if (!selectedDay || (!isRestDay && !finalMuscleGroup)) return;

    onCreatePlan({
      day: selectedDay,
      muscleGroup: finalMuscleGroup,
      isRestDay,
    });

    resetForm();
    onClose();
  };

  const resetForm = () => {
    setSelectedDay("");
    setMuscleGroup("");
    setCustomMuscleGroup("");
    setIsRestDay(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const canSubmit = selectedDay && (isRestDay || muscleGroup === "custom" ? customMuscleGroup.trim() : muscleGroup);

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
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed inset-x-4 bottom-4 z-50 flex items-end justify-center"
          >
            <Card className="w-full max-w-lg glass border-primary/20">
              {/* Header */}
              <div className="p-4 border-b border-border/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">Plan Workout Day</h2>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-muted/50 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4 space-y-4">
                {/* Day Selection */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Select Day
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {daysOfWeek.map((day) => (
                      <button
                        key={day}
                        onClick={() => setSelectedDay(day)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          selectedDay === day
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted/50 text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        {day.slice(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rest Day Toggle */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsRestDay(!isRestDay)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                      isRestDay
                        ? "bg-muted text-foreground border-2 border-primary"
                        : "bg-muted/50 text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    😌 Mark as Rest Day
                  </button>
                </div>

                {/* Muscle Group Selection */}
                {!isRestDay && (
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Muscle Group
                    </label>
                    <Select value={muscleGroup} onValueChange={setMuscleGroup}>
                      <SelectTrigger className="bg-muted/30">
                        <SelectValue placeholder="Select muscle group" />
                      </SelectTrigger>
                      <SelectContent>
                        {muscleGroups.map((group) => (
                          <SelectItem key={group} value={group}>
                            <div className="flex items-center gap-2">
                              <Dumbbell className="w-4 h-4" />
                              {group}
                            </div>
                          </SelectItem>
                        ))}
                        <SelectItem value="custom">
                          <div className="flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            Custom
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    {muscleGroup === "custom" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-3"
                      >
                        <Input
                          placeholder="Enter custom muscle group..."
                          value={customMuscleGroup}
                          onChange={(e) => setCustomMuscleGroup(e.target.value)}
                          className="bg-muted/30"
                        />
                      </motion.div>
                    )}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-border/30">
                <Button
                  className="w-full gap-2"
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                >
                  <Plus className="w-4 h-4" />
                  Create Workout Plan
                </Button>
              </div>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
