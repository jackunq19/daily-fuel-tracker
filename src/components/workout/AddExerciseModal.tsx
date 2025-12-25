import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Dumbbell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Exercise, ExerciseSet } from "@/pages/WorkoutPage";

interface AddExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddExercise: (exercise: Exercise) => void;
}

const exerciseDatabase = [
  { name: "Bench Press", category: "Chest" },
  { name: "Incline Dumbbell Press", category: "Chest" },
  { name: "Cable Flyes", category: "Chest" },
  { name: "Push-ups", category: "Chest" },
  { name: "Dumbbell Flyes", category: "Chest" },
  { name: "Deadlifts", category: "Back" },
  { name: "Pull-ups", category: "Back" },
  { name: "Barbell Rows", category: "Back" },
  { name: "Lat Pulldown", category: "Back" },
  { name: "Seated Cable Row", category: "Back" },
  { name: "Squats", category: "Legs" },
  { name: "Leg Press", category: "Legs" },
  { name: "Leg Curls", category: "Legs" },
  { name: "Leg Extensions", category: "Legs" },
  { name: "Calf Raises", category: "Legs" },
  { name: "Lunges", category: "Legs" },
  { name: "Romanian Deadlift", category: "Legs" },
  { name: "Overhead Press", category: "Shoulders" },
  { name: "Lateral Raises", category: "Shoulders" },
  { name: "Face Pulls", category: "Shoulders" },
  { name: "Shrugs", category: "Shoulders" },
  { name: "Arnold Press", category: "Shoulders" },
  { name: "Bicep Curls", category: "Arms" },
  { name: "Tricep Pushdowns", category: "Arms" },
  { name: "Hammer Curls", category: "Arms" },
  { name: "Skull Crushers", category: "Arms" },
  { name: "Preacher Curls", category: "Arms" },
  { name: "Close Grip Bench", category: "Arms" },
  { name: "Dips", category: "Arms" },
  { name: "Planks", category: "Core" },
  { name: "Crunches", category: "Core" },
  { name: "Russian Twists", category: "Core" },
  { name: "Leg Raises", category: "Core" },
  { name: "Mountain Climbers", category: "Core" },
];

export function AddExerciseModal({ isOpen, onClose, onAddExercise }: AddExerciseModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [customName, setCustomName] = useState("");
  const [sets, setSets] = useState<ExerciseSet[]>([
    { reps: 10, weight: 0, completed: false },
    { reps: 10, weight: 0, completed: false },
    { reps: 10, weight: 0, completed: false },
  ]);
  const [showCustomInput, setShowCustomInput] = useState(false);

  const filteredExercises = exerciseDatabase.filter(ex =>
    ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ex.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddSet = () => {
    setSets([...sets, { reps: 10, weight: 0, completed: false }]);
  };

  const handleRemoveSet = (index: number) => {
    if (sets.length > 1) {
      setSets(sets.filter((_, i) => i !== index));
    }
  };

  const handleSetChange = (index: number, field: "reps" | "weight", value: number) => {
    const newSets = [...sets];
    newSets[index] = { ...newSets[index], [field]: Math.max(0, value) };
    setSets(newSets);
  };

  const handleSubmit = () => {
    const exerciseName = showCustomInput ? customName : selectedExercise;
    if (!exerciseName) return;

    const newExercise: Exercise = {
      id: `custom-${Date.now()}`,
      name: exerciseName,
      sets: sets,
      completed: false,
    };

    onAddExercise(newExercise);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setSearchQuery("");
    setSelectedExercise(null);
    setCustomName("");
    setSets([
      { reps: 10, weight: 0, completed: false },
      { reps: 10, weight: 0, completed: false },
      { reps: 10, weight: 0, completed: false },
    ]);
    setShowCustomInput(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const canSubmit = (showCustomInput ? customName.trim() : selectedExercise) && sets.length > 0;

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
            className="fixed inset-x-4 bottom-4 top-20 z-50 flex items-end justify-center"
          >
            <Card className="w-full max-w-lg max-h-full overflow-hidden glass border-primary/20 flex flex-col">
              {/* Header */}
              <div className="p-4 border-b border-border/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Dumbbell className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">Add Exercise</h2>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-muted/50 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Search or Custom Toggle */}
                <div className="flex gap-2">
                  <Button
                    variant={!showCustomInput ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowCustomInput(false)}
                    className="flex-1"
                  >
                    Choose Exercise
                  </Button>
                  <Button
                    variant={showCustomInput ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowCustomInput(true)}
                    className="flex-1"
                  >
                    Custom Exercise
                  </Button>
                </div>

                {showCustomInput ? (
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Exercise Name
                    </label>
                    <Input
                      placeholder="Enter exercise name..."
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      className="bg-muted/30"
                    />
                  </div>
                ) : (
                  <>
                    {/* Search */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search exercises..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-muted/30"
                      />
                    </div>

                    {/* Exercise List */}
                    <div className="max-h-48 overflow-y-auto space-y-1 rounded-lg border border-border/30 p-2">
                      {filteredExercises.map((exercise) => (
                        <button
                          key={exercise.name}
                          onClick={() => setSelectedExercise(exercise.name)}
                          className={`w-full text-left p-3 rounded-lg transition-all ${
                            selectedExercise === exercise.name
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-muted/50"
                          }`}
                        >
                          <span className="font-medium">{exercise.name}</span>
                          <span className={`text-sm ml-2 ${
                            selectedExercise === exercise.name
                              ? "text-primary-foreground/70"
                              : "text-muted-foreground"
                          }`}>
                            {exercise.category}
                          </span>
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {/* Sets Configuration */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-foreground">Sets</label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAddSet}
                      className="gap-1 h-8"
                    >
                      <Plus className="w-3 h-3" />
                      Add Set
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {sets.map((set, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3 p-3 rounded-xl bg-muted/30"
                      >
                        <span className="text-sm font-medium text-muted-foreground w-12">
                          Set {index + 1}
                        </span>
                        
                        <div className="flex-1 flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleSetChange(index, "reps", set.reps - 1)}
                              className="p-1 hover:bg-muted rounded transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <Input
                              type="number"
                              value={set.reps}
                              onChange={(e) => handleSetChange(index, "reps", parseInt(e.target.value) || 0)}
                              className="w-14 h-8 text-center bg-background/50 text-sm"
                            />
                            <button
                              onClick={() => handleSetChange(index, "reps", set.reps + 1)}
                              className="p-1 hover:bg-muted rounded transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <span className="text-xs text-muted-foreground">reps</span>
                        </div>

                        <div className="flex-1 flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleSetChange(index, "weight", set.weight - 5)}
                              className="p-1 hover:bg-muted rounded transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <Input
                              type="number"
                              value={set.weight}
                              onChange={(e) => handleSetChange(index, "weight", parseInt(e.target.value) || 0)}
                              className="w-16 h-8 text-center bg-background/50 text-sm"
                            />
                            <button
                              onClick={() => handleSetChange(index, "weight", set.weight + 5)}
                              className="p-1 hover:bg-muted rounded transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <span className="text-xs text-muted-foreground">lbs</span>
                        </div>

                        {sets.length > 1 && (
                          <button
                            onClick={() => handleRemoveSet(index)}
                            className="p-1 hover:bg-destructive/20 rounded transition-colors text-destructive"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-border/30">
                <Button
                  className="w-full gap-2"
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                >
                  <Plus className="w-4 h-4" />
                  Add Exercise
                </Button>
              </div>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
