import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Exercise, ExerciseSet } from "@/pages/WorkoutPage";

interface EditSetModalProps {
  isOpen: boolean;
  exercise: Exercise | null;
  onClose: () => void;
  onSave: (exercise: Exercise) => void;
  onDelete: (exerciseId: string) => void;
}

export function EditSetModal({ isOpen, exercise, onClose, onSave, onDelete }: EditSetModalProps) {
  const [sets, setSets] = useState<ExerciseSet[]>(exercise?.sets || []);
  const [exerciseName, setExerciseName] = useState(exercise?.name || "");

  // Reset state when exercise changes
  useState(() => {
    if (exercise) {
      setSets(exercise.sets);
      setExerciseName(exercise.name);
    }
  });

  const handleAddSet = () => {
    const lastSet = sets[sets.length - 1];
    setSets([...sets, { 
      reps: lastSet?.reps || 10, 
      weight: lastSet?.weight || 0, 
      completed: false 
    }]);
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

  const handleSave = () => {
    if (!exercise) return;
    onSave({
      ...exercise,
      name: exerciseName,
      sets: sets,
    });
    onClose();
  };

  const handleDelete = () => {
    if (!exercise) return;
    onDelete(exercise.id);
    onClose();
  };

  if (!exercise) return null;

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
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed inset-x-4 bottom-4 z-50 flex items-end justify-center"
          >
            <Card className="w-full max-w-lg max-h-[70vh] overflow-hidden glass border-primary/20 flex flex-col">
              {/* Header */}
              <div className="p-4 border-b border-border/30 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">Edit Exercise</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-muted/50 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Exercise Name */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Exercise Name
                  </label>
                  <Input
                    value={exerciseName}
                    onChange={(e) => setExerciseName(e.target.value)}
                    className="bg-muted/30"
                  />
                </div>

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
              <div className="p-4 border-t border-border/30 flex gap-2">
                <Button
                  variant="destructive"
                  className="gap-2"
                  onClick={handleDelete}
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
                <Button
                  className="flex-1 gap-2"
                  onClick={handleSave}
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </Button>
              </div>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
