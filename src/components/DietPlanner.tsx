import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Utensils, ChevronRight, Leaf, Drumstick, Info, Sparkles, 
  Loader2, Clock, Coffee, Apple, Moon, ChefHat, AlertCircle,
  Salad, Beef, Scale, Flame, Wheat
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type DietType = "vegetarian" | "non-vegetarian" | "vegan" | "keto" | "high-protein";
type Goal = "lose" | "maintain" | "gain";

interface FoodItem {
  item: string;
  quantity: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

interface Meal {
  name: string;
  time: string;
  foods: FoodItem[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
}

interface MealPlan {
  meals: Meal[];
  dailyTotal: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
  tips: string[];
  waterIntake: string;
}

interface DietPlannerProps {
  initialCalories?: number;
  initialGoal?: Goal;
}

const dietTypes = [
  { value: "vegetarian" as DietType, label: "Vegetarian", icon: Leaf, color: "text-green-500" },
  { value: "non-vegetarian" as DietType, label: "Non-Veg", icon: Beef, color: "text-red-500" },
  { value: "vegan" as DietType, label: "Vegan", icon: Salad, color: "text-emerald-500" },
  { value: "keto" as DietType, label: "Keto", icon: Flame, color: "text-orange-500" },
  { value: "high-protein" as DietType, label: "High Protein", icon: Scale, color: "text-purple-500" },
];

const cuisineOptions = [
  "Indian", "Mediterranean", "Asian", "American", "Mexican", "Italian"
];

const allergyOptions = [
  "Gluten", "Dairy", "Nuts", "Eggs", "Soy", "Shellfish"
];

const mealIcons: Record<string, any> = {
  "Breakfast": Coffee,
  "Lunch": ChefHat,
  "Snack": Apple,
  "Dinner": Moon,
  "Pre-Workout": Flame,
  "Post-Workout": Scale,
};

function MealCard({ meal }: { meal: Meal }) {
  const Icon = mealIcons[meal.name] || Utensils;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl p-5 border border-border hover:border-primary/30 transition-all card-hover"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h4 className="font-semibold text-foreground">{meal.name}</h4>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {meal.time}
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xl font-bold text-primary">{meal.totalCalories}</span>
          <span className="text-xs text-muted-foreground ml-1">kcal</span>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        {meal.foods.map((food, idx) => (
          <div key={idx} className="flex items-center justify-between text-sm py-2 border-b border-border/50 last:border-0">
            <div>
              <span className="text-foreground">{food.item}</span>
              <span className="text-muted-foreground ml-2 text-xs">({food.quantity})</span>
            </div>
            <span className="text-muted-foreground">{food.calories} kcal</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border">
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Protein</p>
          <p className="text-sm font-semibold text-macro-protein">{meal.totalProtein}g</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Carbs</p>
          <p className="text-sm font-semibold text-macro-carbs">{meal.totalCarbs}g</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Fats</p>
          <p className="text-sm font-semibold text-macro-fats">{meal.totalFats}g</p>
        </div>
      </div>
    </motion.div>
  );
}

export function DietPlanner({ initialCalories, initialGoal }: DietPlannerProps) {
  const [dietType, setDietType] = useState<DietType>("vegetarian");
  const [goal, setGoal] = useState<Goal>(initialGoal || "maintain");
  const [calories, setCalories] = useState(initialCalories || 2000);
  const [mealsPerDay, setMealsPerDay] = useState(4);
  const [cuisines, setCuisines] = useState<string[]>(["Indian"]);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [activityLevel, setActivityLevel] = useState("moderate");
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [showOptions, setShowOptions] = useState(!initialCalories);
  const { toast } = useToast();

  useEffect(() => {
    if (initialCalories) {
      setCalories(initialCalories);
    }
    if (initialGoal) {
      setGoal(initialGoal);
    }
  }, [initialCalories, initialGoal]);

  const toggleCuisine = (cuisine: string) => {
    setCuisines(prev => 
      prev.includes(cuisine) 
        ? prev.filter(c => c !== cuisine)
        : [...prev, cuisine]
    );
  };

  const toggleAllergy = (allergy: string) => {
    setAllergies(prev =>
      prev.includes(allergy)
        ? prev.filter(a => a !== allergy)
        : [...prev, allergy]
    );
  };

  const generateMealPlan = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-diet-plan', {
        body: {
          calories,
          goal,
          dietType,
          mealsPerDay,
          cuisinePreference: cuisines,
          allergies,
          activityLevel,
        },
      });

      if (error) {
        throw error;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setMealPlan(data);
      setShowOptions(false);
      toast({
        title: "Meal Plan Generated!",
        description: "Your personalized AI diet plan is ready.",
      });
    } catch (error: any) {
      console.error("Error generating meal plan:", error);
      toast({
        title: "Failed to generate plan",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="diet-planner" className="py-16 md:py-24 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Diet Planner</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Get Your Personalized Meal Plan
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our AI creates realistic, practical meal plans tailored to your goals,
            preferences, and dietary restrictions.
          </p>

          {initialCalories && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent"
            >
              <Flame className="w-4 h-4" />
              <span className="font-medium">Target: {initialCalories} kcal/day</span>
            </motion.div>
          )}
        </motion.div>

        <div className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            {showOptions || !mealPlan ? (
              <motion.div
                key="options"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Calorie Target */}
                <div className="bg-card rounded-2xl p-6 border border-border">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Flame className="w-5 h-5 text-accent" />
                    Daily Calorie Target
                  </h3>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="1200"
                      max="4000"
                      step="50"
                      value={calories}
                      onChange={(e) => setCalories(parseInt(e.target.value))}
                      className="flex-1 h-2 rounded-full appearance-none bg-muted cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
                    />
                    <div className="text-center min-w-[80px]">
                      <span className="text-3xl font-bold text-foreground">{calories}</span>
                      <span className="text-sm text-muted-foreground ml-1">kcal</span>
                    </div>
                  </div>
                </div>

                {/* Diet Type & Goal */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-card rounded-2xl p-6 border border-border">
                    <h3 className="font-semibold text-foreground mb-4">Diet Preference</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {dietTypes.map((type) => (
                        <button
                          key={type.value}
                          onClick={() => setDietType(type.value)}
                          className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${
                            dietType === type.value
                              ? "border-primary bg-primary/10"
                              : "border-border hover:border-primary/30"
                          }`}
                        >
                          <type.icon className={`w-5 h-5 ${dietType === type.value ? "text-primary" : type.color}`} />
                          <span className={`text-xs font-medium ${dietType === type.value ? "text-primary" : "text-foreground"}`}>
                            {type.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-card rounded-2xl p-6 border border-border">
                    <h3 className="font-semibold text-foreground mb-4">Your Goal</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: "lose" as Goal, label: "Lose Weight", emoji: "📉" },
                        { value: "maintain" as Goal, label: "Maintain", emoji: "⚖️" },
                        { value: "gain" as Goal, label: "Build Muscle", emoji: "💪" },
                      ].map((g) => (
                        <button
                          key={g.value}
                          onClick={() => setGoal(g.value)}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            goal === g.value
                              ? "border-primary bg-primary/10"
                              : "border-border hover:border-primary/30"
                          }`}
                        >
                          <span className="text-2xl block mb-1">{g.emoji}</span>
                          <span className={`text-xs font-medium ${goal === g.value ? "text-primary" : "text-foreground"}`}>
                            {g.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Meals per day */}
                <div className="bg-card rounded-2xl p-6 border border-border">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Utensils className="w-5 h-5 text-primary" />
                    Meals Per Day
                  </h3>
                  <div className="flex gap-3">
                    {[3, 4, 5, 6].map((num) => (
                      <button
                        key={num}
                        onClick={() => setMealsPerDay(num)}
                        className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                          mealsPerDay === num
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/30"
                        }`}
                      >
                        <span className={`text-2xl font-bold ${mealsPerDay === num ? "text-primary" : "text-foreground"}`}>
                          {num}
                        </span>
                        <span className="text-xs text-muted-foreground block">meals</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cuisine & Allergies */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-card rounded-2xl p-6 border border-border">
                    <h3 className="font-semibold text-foreground mb-4">Cuisine Preference</h3>
                    <div className="flex flex-wrap gap-2">
                      {cuisineOptions.map((cuisine) => (
                        <button
                          key={cuisine}
                          onClick={() => toggleCuisine(cuisine)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                            cuisines.includes(cuisine)
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
                          }`}
                        >
                          {cuisine}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-card rounded-2xl p-6 border border-border">
                    <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-warning" />
                      Allergies / Restrictions
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {allergyOptions.map((allergy) => (
                        <button
                          key={allergy}
                          onClick={() => toggleAllergy(allergy)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                            allergies.includes(allergy)
                              ? "bg-destructive text-destructive-foreground"
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
                          }`}
                        >
                          {allergy}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Generate Button */}
                <div className="text-center pt-4">
                  <Button
                    variant="hero"
                    size="xl"
                    onClick={generateMealPlan}
                    disabled={loading}
                    className="gap-3 text-lg px-10"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Generating with AI...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Generate My Meal Plan
                        <ChevronRight className="w-5 h-5" />
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="plan"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {/* Summary */}
                <div className="bg-gradient-to-br from-primary/20 to-accent/10 rounded-2xl p-6 mb-8 border border-primary/20">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="text-center md:text-left">
                      <p className="text-sm text-muted-foreground mb-1">Daily Total</p>
                      <div className="flex items-center gap-4">
                        <span className="text-4xl font-bold text-foreground">{mealPlan.dailyTotal.calories}</span>
                        <span className="text-muted-foreground">kcal</span>
                      </div>
                    </div>
                    <div className="flex gap-8">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-macro-protein">{mealPlan.dailyTotal.protein}g</p>
                        <p className="text-xs text-muted-foreground">Protein</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-macro-carbs">{mealPlan.dailyTotal.carbs}g</p>
                        <p className="text-xs text-muted-foreground">Carbs</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-macro-fats">{mealPlan.dailyTotal.fats}g</p>
                        <p className="text-xs text-muted-foreground">Fats</p>
                      </div>
                    </div>
                    <Button variant="outline" onClick={() => setShowOptions(true)}>
                      Modify Plan
                    </Button>
                  </div>
                </div>

                {/* Meals Grid */}
                <div className="grid sm:grid-cols-2 gap-6 mb-8">
                  {mealPlan.meals.map((meal, index) => (
                    <MealCard key={index} meal={meal} />
                  ))}
                </div>

                {/* Tips & Water */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-card rounded-2xl p-6 border border-border">
                    <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      💡 Tips for Success
                    </h4>
                    <ul className="space-y-2">
                      {mealPlan.tips.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="text-primary">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-card rounded-2xl p-6 border border-border">
                    <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      💧 Daily Water Intake
                    </h4>
                    <p className="text-3xl font-bold text-primary">{mealPlan.waterIntake}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Stay hydrated for optimal results
                    </p>
                  </div>
                </div>

                {/* Disclaimer */}
                <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/50 text-sm text-muted-foreground">
                  <Info className="w-4 h-4 mt-0.5 shrink-0" />
                  <p>
                    This is a general fitness guideline generated by AI, not medical advice.
                    Consult a nutritionist for personalized recommendations, especially if you
                    have health conditions.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
