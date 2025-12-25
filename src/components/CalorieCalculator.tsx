import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Calculator, Info, Flame, Activity, Target, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useDailyGoals } from "@/hooks/useDailyGoals";
import { toast } from "sonner";

type Gender = "male" | "female";
type Goal = "lose" | "maintain" | "gain";
type ActivityLevel = "sedentary" | "light" | "moderate" | "active" | "very_active";

const activityLevels: { value: ActivityLevel; label: string; multiplier: number; description: string }[] = [
  { value: "sedentary", label: "Sedentary", multiplier: 1.2, description: "Little or no exercise, desk job" },
  { value: "light", label: "Light", multiplier: 1.375, description: "Light exercise 1-3 days/week" },
  { value: "moderate", label: "Moderate", multiplier: 1.55, description: "Moderate exercise 3-5 days/week" },
  { value: "active", label: "Active", multiplier: 1.725, description: "Hard exercise 6-7 days/week" },
  { value: "very_active", label: "Very Active", multiplier: 1.9, description: "Very hard exercise, physical job" },
];

const goals: { value: Goal; label: string; emoji: string; adjustment: number }[] = [
  { value: "lose", label: "Lose Weight", emoji: "📉", adjustment: -500 },
  { value: "maintain", label: "Maintain", emoji: "⚖️", adjustment: 0 },
  { value: "gain", label: "Gain Weight", emoji: "📈", adjustment: 500 },
];

export function CalorieCalculator() {
  const navigate = useNavigate();
  const { setGoalsFromCalculator } = useDailyGoals();
  const [gender, setGender] = useState<Gender>("male");
  const [age, setAge] = useState(25);
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(70);
  const [activity, setActivity] = useState<ActivityLevel>("moderate");
  const [goal, setGoal] = useState<Goal>("maintain");
  const [showResults, setShowResults] = useState(false);
  const [goalsSaved, setGoalsSaved] = useState(false);

  const results = useMemo(() => {
    // Mifflin-St Jeor Equation
    let bmr: number;
    if (gender === "male") {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    const activityMultiplier = activityLevels.find((a) => a.value === activity)?.multiplier || 1.55;
    const tdee = Math.round(bmr * activityMultiplier);
    
    const goalAdjustment = goals.find((g) => g.value === goal)?.adjustment || 0;
    const targetCalories = Math.max(1200, Math.round(tdee + goalAdjustment));

    // Safe range
    const minCalories = Math.max(1200, Math.round(tdee - 750));
    const maxCalories = Math.round(tdee + 750);

    // Macro recommendations (simplified)
    const protein = Math.round((targetCalories * 0.3) / 4); // 30% from protein
    const carbs = Math.round((targetCalories * 0.4) / 4); // 40% from carbs
    const fats = Math.round((targetCalories * 0.3) / 9); // 30% from fats

    return {
      bmr: Math.round(bmr),
      tdee,
      targetCalories,
      minCalories,
      maxCalories,
      protein,
      carbs,
      fats,
    };
  }, [gender, age, height, weight, activity, goal]);

  const handleCalculate = () => {
    setShowResults(true);
    setGoalsSaved(false);
  };

  const handleSaveGoals = () => {
    setGoalsFromCalculator(results.targetCalories, results.protein, results.carbs, results.fats);
    setGoalsSaved(true);
    toast.success("Daily goals updated!", {
      description: `Target: ${results.targetCalories} kcal, ${results.protein}g protein, ${results.carbs}g carbs, ${results.fats}g fats`
    });
  };

  const handleGoToDietPlanner = () => {
    navigate(`/diet-planner?calories=${results.targetCalories}&goal=${goal}`);
  };

  return (
    <section id="calculator" className="py-16 md:py-24 bg-muted/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            <Calculator className="w-4 h-4" />
            <span>Smart Calculator</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Calculate Your Daily Calories
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find out exactly how many calories you need based on your body and goals.
            No guesswork — just science-backed calculations.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Panel */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-card rounded-2xl p-6 md:p-8 border border-border shadow-sm"
            >
              {/* Gender */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-foreground mb-3">Gender</label>
                <div className="grid grid-cols-2 gap-3">
                  {(["male", "female"] as Gender[]).map((g) => (
                    <button
                      key={g}
                      onClick={() => setGender(g)}
                      className={`p-4 rounded-xl border-2 transition-all text-center ${
                        gender === g
                          ? "border-primary bg-primary-muted text-primary"
                          : "border-border hover:border-primary/30"
                      }`}
                    >
                      <span className="text-2xl mb-1 block">{g === "male" ? "👨" : "👩"}</span>
                      <span className="text-sm font-medium capitalize">{g}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Age Slider */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-medium text-foreground">Age</label>
                  <span className="text-lg font-bold text-primary">{age} years</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="80"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>15</span>
                  <span>80</span>
                </div>
              </div>

              {/* Height Slider */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-medium text-foreground">Height</label>
                  <span className="text-lg font-bold text-primary">{height} cm</span>
                </div>
                <input
                  type="range"
                  min="120"
                  max="220"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>120 cm</span>
                  <span>220 cm</span>
                </div>
              </div>

              {/* Weight Slider */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-medium text-foreground">Weight</label>
                  <span className="text-lg font-bold text-primary">{weight} kg</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="200"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>30 kg</span>
                  <span>200 kg</span>
                </div>
              </div>

              {/* Activity Level */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-foreground mb-3">Activity Level</label>
                <div className="space-y-2">
                  {activityLevels.map((level) => (
                    <button
                      key={level.value}
                      onClick={() => setActivity(level.value)}
                      className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                        activity === level.value
                          ? "border-primary bg-primary-muted"
                          : "border-border hover:border-primary/30"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className={`font-medium ${activity === level.value ? "text-primary" : "text-foreground"}`}>
                          {level.label}
                        </span>
                        <Activity className={`w-4 h-4 ${activity === level.value ? "text-primary" : "text-muted-foreground"}`} />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{level.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Goal */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-foreground mb-3">Your Goal</label>
                <div className="grid grid-cols-3 gap-3">
                  {goals.map((g) => (
                    <button
                      key={g.value}
                      onClick={() => setGoal(g.value)}
                      className={`p-4 rounded-xl border-2 transition-all text-center ${
                        goal === g.value
                          ? "border-primary bg-primary-muted text-primary"
                          : "border-border hover:border-primary/30"
                      }`}
                    >
                      <span className="text-xl mb-1 block">{g.emoji}</span>
                      <span className="text-xs font-medium">{g.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <Button variant="hero" size="lg" className="w-full" onClick={handleCalculate}>
                Calculate My Calories
              </Button>
            </motion.div>

            {/* Results Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              {showResults ? (
                <>
                  {/* Main Result */}
                  <div className="bg-card rounded-2xl p-6 md:p-8 border border-border shadow-sm text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-success/10 text-success text-sm font-medium mb-4">
                      <Target className="w-4 h-4" />
                      Your daily target
                    </div>
                    <div className="mb-6">
                      <span className="text-6xl md:text-7xl font-bold text-primary">{results.targetCalories}</span>
                      <span className="text-2xl text-muted-foreground ml-2">kcal</span>
                    </div>
                    <p className="text-muted-foreground">
                      Safe range: {results.minCalories} - {results.maxCalories} kcal
                    </p>
                  </div>

                  {/* BMR & TDEE */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-card rounded-xl p-5 border border-border">
                      <div className="flex items-center gap-2 text-muted-foreground mb-2">
                        <Flame className="w-4 h-4" />
                        <span className="text-sm font-medium">BMR</span>
                      </div>
                      <p className="text-2xl font-bold text-foreground">{results.bmr}</p>
                      <p className="text-xs text-muted-foreground">Calories at rest</p>
                    </div>
                    <div className="bg-card rounded-xl p-5 border border-border">
                      <div className="flex items-center gap-2 text-muted-foreground mb-2">
                        <Activity className="w-4 h-4" />
                        <span className="text-sm font-medium">TDEE</span>
                      </div>
                      <p className="text-2xl font-bold text-foreground">{results.tdee}</p>
                      <p className="text-xs text-muted-foreground">Total daily energy</p>
                    </div>
                  </div>

                  {/* Macros */}
                  <div className="bg-card rounded-2xl p-6 border border-border">
                    <h3 className="font-semibold text-foreground mb-4">Recommended Macros</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-macro-protein" />
                          <span className="text-sm text-muted-foreground">Protein</span>
                        </div>
                        <span className="font-semibold text-foreground">{results.protein}g</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-macro-carbs" />
                          <span className="text-sm text-muted-foreground">Carbohydrates</span>
                        </div>
                        <span className="font-semibold text-foreground">{results.carbs}g</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-macro-fats" />
                          <span className="text-sm text-muted-foreground">Fats</span>
                        </div>
                        <span className="font-semibold text-foreground">{results.fats}g</span>
                      </div>
                    </div>
                  </div>

                  {/* Save Goals Button */}
                  <Button 
                    variant={goalsSaved ? "outline" : "hero"} 
                    size="lg" 
                    className="w-full gap-2"
                    onClick={handleSaveGoals}
                    disabled={goalsSaved}
                  >
                    {goalsSaved ? (
                      <>
                        <Check className="w-5 h-5" />
                        Goals Saved to Food Tracker
                      </>
                    ) : (
                      <>
                        <Target className="w-5 h-5" />
                        Set as My Daily Goals
                      </>
                    )}
                  </Button>

                  {/* Go to Diet Planner */}
                  <Button 
                    variant="default" 
                    size="lg" 
                    className="w-full gap-2"
                    onClick={handleGoToDietPlanner}
                  >
                    Get My Meal Plan
                    <ArrowRight className="w-5 h-5" />
                  </Button>

                  {/* Disclaimer */}
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/50 text-sm text-muted-foreground">
                    <Info className="w-4 h-4 mt-0.5 shrink-0" />
                    <p>
                      This is a general fitness guideline based on the Mifflin-St Jeor equation. 
                      For personalized advice, please consult a healthcare professional.
                    </p>
                  </div>
                </>
              ) : (
                <div className="bg-card rounded-2xl p-8 border border-border text-center h-full flex flex-col items-center justify-center min-h-[400px]">
                  <div className="w-16 h-16 rounded-full bg-primary-muted flex items-center justify-center mb-4">
                    <Calculator className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Enter your details
                  </h3>
                  <p className="text-muted-foreground max-w-xs">
                    Fill in your information on the left and click calculate to see your personalized results.
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
