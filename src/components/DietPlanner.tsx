import { useState } from "react";
import { motion } from "framer-motion";
import { Utensils, ChevronRight, Leaf, Drumstick, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

type DietType = "vegetarian" | "non-vegetarian";
type Goal = "lose" | "maintain" | "gain";

interface Meal {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  emoji: string;
}

interface MealPlan {
  breakfast: Meal;
  lunch: Meal;
  snack: Meal;
  dinner: Meal;
}

const mealPlans: Record<DietType, Record<Goal, MealPlan>> = {
  vegetarian: {
    lose: {
      breakfast: { name: "Oats with Fruits & Nuts", calories: 320, protein: 12, carbs: 45, fats: 10, emoji: "🥣" },
      lunch: { name: "Dal + Brown Rice + Salad", calories: 420, protein: 18, carbs: 55, fats: 12, emoji: "🍛" },
      snack: { name: "Greek Yogurt with Berries", calories: 150, protein: 15, carbs: 18, fats: 3, emoji: "🫐" },
      dinner: { name: "Paneer Tikka + Roti + Veggies", calories: 380, protein: 22, carbs: 35, fats: 16, emoji: "🥗" },
    },
    maintain: {
      breakfast: { name: "Paratha + Curd + Fruits", calories: 450, protein: 14, carbs: 55, fats: 18, emoji: "🥞" },
      lunch: { name: "Rajma + Rice + Raita", calories: 520, protein: 20, carbs: 70, fats: 15, emoji: "🍚" },
      snack: { name: "Banana Smoothie + Almonds", calories: 280, protein: 10, carbs: 35, fats: 12, emoji: "🍌" },
      dinner: { name: "Paneer Bhurji + 2 Rotis", calories: 480, protein: 25, carbs: 40, fats: 22, emoji: "🍽️" },
    },
    gain: {
      breakfast: { name: "Stuffed Paratha + Lassi", calories: 580, protein: 18, carbs: 65, fats: 25, emoji: "🥛" },
      lunch: { name: "Chole + Rice + Salad + Curd", calories: 650, protein: 24, carbs: 85, fats: 20, emoji: "🍛" },
      snack: { name: "Peanut Butter Toast + Banana", calories: 380, protein: 14, carbs: 45, fats: 18, emoji: "🥜" },
      dinner: { name: "Palak Paneer + 3 Rotis", calories: 600, protein: 28, carbs: 55, fats: 28, emoji: "🥬" },
    },
  },
  "non-vegetarian": {
    lose: {
      breakfast: { name: "Egg White Omelette + Toast", calories: 280, protein: 22, carbs: 25, fats: 8, emoji: "🍳" },
      lunch: { name: "Grilled Chicken + Brown Rice", calories: 420, protein: 35, carbs: 40, fats: 10, emoji: "🍗" },
      snack: { name: "Protein Shake + Apple", calories: 180, protein: 25, carbs: 20, fats: 2, emoji: "🍎" },
      dinner: { name: "Fish Curry + Roti + Veggies", calories: 380, protein: 30, carbs: 32, fats: 12, emoji: "🐟" },
    },
    maintain: {
      breakfast: { name: "Eggs + Paratha + Fruits", calories: 480, protein: 20, carbs: 45, fats: 22, emoji: "🥚" },
      lunch: { name: "Chicken Biryani + Raita", calories: 580, protein: 32, carbs: 65, fats: 18, emoji: "🍛" },
      snack: { name: "Boiled Eggs + Nuts Mix", calories: 250, protein: 18, carbs: 8, fats: 16, emoji: "🥜" },
      dinner: { name: "Mutton Curry + 2 Rotis", calories: 520, protein: 35, carbs: 40, fats: 24, emoji: "🍖" },
    },
    gain: {
      breakfast: { name: "Full Eggs + Paratha + Shake", calories: 650, protein: 35, carbs: 55, fats: 32, emoji: "💪" },
      lunch: { name: "Chicken + Rice + Dal + Salad", calories: 720, protein: 45, carbs: 75, fats: 22, emoji: "🍗" },
      snack: { name: "PB Sandwich + Protein Shake", calories: 450, protein: 30, carbs: 40, fats: 20, emoji: "🥪" },
      dinner: { name: "Fish + Rice + Egg Curry", calories: 680, protein: 42, carbs: 60, fats: 26, emoji: "🐟" },
    },
  },
};

function MealCard({ meal, time }: { meal: Meal; time: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-xl p-4 border border-border hover:border-primary/30 hover:shadow-sm transition-all"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{time}</span>
        <span className="text-2xl">{meal.emoji}</span>
      </div>
      <h4 className="font-semibold text-foreground mb-2">{meal.name}</h4>
      <div className="flex items-center gap-4 text-sm">
        <span className="text-primary font-medium">{meal.calories} kcal</span>
        <span className="text-muted-foreground">P: {meal.protein}g</span>
        <span className="text-muted-foreground">C: {meal.carbs}g</span>
        <span className="text-muted-foreground">F: {meal.fats}g</span>
      </div>
    </motion.div>
  );
}

export function DietPlanner() {
  const [dietType, setDietType] = useState<DietType>("vegetarian");
  const [goal, setGoal] = useState<Goal>("maintain");
  const [showPlan, setShowPlan] = useState(false);

  const currentPlan = mealPlans[dietType][goal];
  const totalCalories =
    currentPlan.breakfast.calories +
    currentPlan.lunch.calories +
    currentPlan.snack.calories +
    currentPlan.dinner.calories;
  const totalProtein =
    currentPlan.breakfast.protein +
    currentPlan.lunch.protein +
    currentPlan.snack.protein +
    currentPlan.dinner.protein;

  return (
    <section id="diet-planner" className="py-16 md:py-24 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 text-success text-sm font-medium mb-4">
            <Utensils className="w-4 h-4" />
            <span>Diet Planner</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Get a Personalized Meal Plan
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Realistic, repeatable meal plans designed for your goals. 
            No exotic ingredients — just practical, everyday foods.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Selection Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Diet Type */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-card rounded-2xl p-6 border border-border"
            >
              <h3 className="font-semibold text-foreground mb-4">Diet Preference</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setDietType("vegetarian")}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    dietType === "vegetarian"
                      ? "border-primary bg-primary-muted"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <Leaf className={`w-6 h-6 mx-auto mb-2 ${dietType === "vegetarian" ? "text-primary" : "text-muted-foreground"}`} />
                  <span className={`text-sm font-medium ${dietType === "vegetarian" ? "text-primary" : "text-foreground"}`}>
                    Vegetarian
                  </span>
                </button>
                <button
                  onClick={() => setDietType("non-vegetarian")}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    dietType === "non-vegetarian"
                      ? "border-primary bg-primary-muted"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <Drumstick className={`w-6 h-6 mx-auto mb-2 ${dietType === "non-vegetarian" ? "text-primary" : "text-muted-foreground"}`} />
                  <span className={`text-sm font-medium ${dietType === "non-vegetarian" ? "text-primary" : "text-foreground"}`}>
                    Non-Vegetarian
                  </span>
                </button>
              </div>
            </motion.div>

            {/* Goal */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-card rounded-2xl p-6 border border-border"
            >
              <h3 className="font-semibold text-foreground mb-4">Your Goal</h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: "lose" as Goal, label: "Lose", emoji: "📉" },
                  { value: "maintain" as Goal, label: "Maintain", emoji: "⚖️" },
                  { value: "gain" as Goal, label: "Gain", emoji: "📈" },
                ].map((g) => (
                  <button
                    key={g.value}
                    onClick={() => setGoal(g.value)}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      goal === g.value
                        ? "border-primary bg-primary-muted"
                        : "border-border hover:border-primary/30"
                    }`}
                  >
                    <span className="text-xl block mb-1">{g.emoji}</span>
                    <span className={`text-xs font-medium ${goal === g.value ? "text-primary" : "text-foreground"}`}>
                      {g.label}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Generate Button */}
          <div className="text-center mb-8">
            <Button variant="hero" size="lg" onClick={() => setShowPlan(true)} className="gap-2">
              Generate My Meal Plan
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Meal Plan Display */}
          {showPlan && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Summary */}
              <div className="bg-primary-muted rounded-2xl p-6 mb-6 text-center">
                <p className="text-sm text-primary font-medium mb-2">Daily Total</p>
                <div className="flex items-center justify-center gap-8">
                  <div>
                    <span className="text-4xl font-bold text-primary">{totalCalories}</span>
                    <span className="text-primary ml-1">kcal</span>
                  </div>
                  <div className="h-8 w-px bg-primary/20" />
                  <div>
                    <span className="text-2xl font-bold text-primary">{totalProtein}g</span>
                    <span className="text-primary/70 ml-1 text-sm">protein</span>
                  </div>
                </div>
              </div>

              {/* Meals Grid */}
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <MealCard meal={currentPlan.breakfast} time="Breakfast" />
                <MealCard meal={currentPlan.lunch} time="Lunch" />
                <MealCard meal={currentPlan.snack} time="Snack" />
                <MealCard meal={currentPlan.dinner} time="Dinner" />
              </div>

              {/* Disclaimer */}
              <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/50 text-sm text-muted-foreground">
                <Info className="w-4 h-4 mt-0.5 shrink-0" />
                <p>
                  This is a general fitness guideline, not medical advice. Meal plans are designed 
                  for healthy adults. Consult a nutritionist for personalized recommendations.
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
