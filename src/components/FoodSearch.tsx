import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Minus, ChevronRight, Loader2, Database, TrendingUp, X, ShoppingBasket, Target, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import { useDailyGoals } from "@/hooks/useDailyGoals";

interface FoodItem {
  id: string;
  name: string;
  category: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber?: number;
  servingSize: string;
  servingWeight: number;
  source: 'usda' | 'custom';
}

interface SelectedFood extends FoodItem {
  quantity: number;
}

const popularSearches = [
  "Chicken breast", "Rice", "Banana", "Eggs", "Oatmeal", 
  "Salmon", "Avocado", "Greek yogurt", "Sweet potato", "Almonds"
];

function MacroProgressBar({ label, current, target, color }: { label: string; current: number; target: number; color: string }) {
  const percentage = Math.min((current / target) * 100, 100);
  const isOver = current > target;
  
  return (
    <div className="flex-1">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <span className={`text-xs font-semibold ${isOver ? 'text-destructive' : 'text-foreground'}`}>
          {Math.round(current)}g / {target}g
        </span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`h-full rounded-full ${isOver ? 'bg-destructive' : color}`}
        />
      </div>
    </div>
  );
}

function MacroBar({ label, value, maxValue, color }: { label: string; value: number; maxValue: number; color: string }) {
  const percentage = Math.min((value / maxValue) * 100, 100);
  
  return (
    <div className="flex-1">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <span className="text-xs font-semibold text-foreground">{value}g</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
    </div>
  );
}

export function FoodSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [selectedFoods, setSelectedFoods] = useState<SelectedFood[]>([]);
  const [expandedFood, setExpandedFood] = useState<FoodItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [showGoalSettings, setShowGoalSettings] = useState(false);
  const { toast } = useToast();
  const { goals, updateGoals } = useDailyGoals();

  const searchFoods = useCallback(async (query: string) => {
    if (!query.trim() || query.length < 2) {
      setFoods([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setHasSearched(true);

    try {
      const { data, error } = await supabase.functions.invoke('search-food', {
        body: { query, pageSize: 15 },
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      setFoods(data.foods || []);
    } catch (error: any) {
      console.error("Error searching foods:", error);
      toast({
        title: "Search failed",
        description: "Unable to search foods. Please try again.",
        variant: "destructive",
      });
      setFoods([]);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const debouncedSearch = useDebouncedCallback(searchFoods, 500);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    debouncedSearch(value);
  };

  const handleQuickSearch = (term: string) => {
    setSearchQuery(term);
    searchFoods(term);
  };

  const addFood = (food: FoodItem) => {
    const existing = selectedFoods.find(f => f.id === food.id);
    if (existing) {
      setSelectedFoods(prev => 
        prev.map(f => f.id === food.id ? { ...f, quantity: f.quantity + 1 } : f)
      );
    } else {
      setSelectedFoods(prev => [...prev, { ...food, quantity: 1 }]);
    }
    toast({
      title: "Added to tracker",
      description: `${food.name} added to your selection.`,
    });
  };

  const removeFood = (foodId: string) => {
    const existing = selectedFoods.find(f => f.id === foodId);
    if (existing && existing.quantity > 1) {
      setSelectedFoods(prev => 
        prev.map(f => f.id === foodId ? { ...f, quantity: f.quantity - 1 } : f)
      );
    } else {
      setSelectedFoods(prev => prev.filter(f => f.id !== foodId));
    }
  };

  const clearSelection = () => {
    setSelectedFoods([]);
  };

  const isSelected = (foodId: string) => selectedFoods.some(f => f.id === foodId);
  const getQuantity = (foodId: string) => selectedFoods.find(f => f.id === foodId)?.quantity || 0;

  // Calculate totals
  const totals = selectedFoods.reduce(
    (acc, food) => ({
      calories: acc.calories + food.calories * food.quantity,
      protein: acc.protein + food.protein * food.quantity,
      carbs: acc.carbs + food.carbs * food.quantity,
      fats: acc.fats + food.fats * food.quantity,
    }),
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );

  const getCategoryEmoji = (category: string) => {
    const lower = category.toLowerCase();
    if (lower.includes('beef') || lower.includes('pork') || lower.includes('meat')) return "🥩";
    if (lower.includes('poultry') || lower.includes('chicken')) return "🍗";
    if (lower.includes('fish') || lower.includes('seafood')) return "🐟";
    if (lower.includes('dairy') || lower.includes('milk') || lower.includes('cheese')) return "🥛";
    if (lower.includes('vegetable')) return "🥕";
    if (lower.includes('fruit')) return "🍎";
    if (lower.includes('grain') || lower.includes('cereal') || lower.includes('bread')) return "🌾";
    if (lower.includes('legume') || lower.includes('bean')) return "🫘";
    if (lower.includes('nut') || lower.includes('seed')) return "🥜";
    if (lower.includes('egg')) return "🥚";
    if (lower.includes('beverage') || lower.includes('drink')) return "🥤";
    if (lower.includes('snack') || lower.includes('sweet')) return "🍪";
    return "🍽️";
  };

  return (
    <section id="food-search" className="py-16 md:py-24 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Database className="w-4 h-4" />
            <span>Real-Time Data</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Search Foods & Track Nutrition
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Search for foods, add them to your tracker, and see your total calories and macros in real-time.
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          {/* Daily Goals Progress */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-5 rounded-2xl bg-card border border-border"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                  <Target className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Daily Goals</h3>
                  <p className="text-sm text-muted-foreground">Track your progress</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowGoalSettings(!showGoalSettings)}
                className="text-muted-foreground"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>

            {/* Goal Settings */}
            <AnimatePresence>
              {showGoalSettings && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 p-4 rounded-xl bg-muted/50 space-y-3 overflow-hidden"
                >
                  <p className="text-xs text-muted-foreground mb-2">Set your daily targets:</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <label className="text-xs text-muted-foreground">Calories</label>
                      <input
                        type="number"
                        value={goals.calories}
                        onChange={(e) => updateGoals({ calories: Number(e.target.value) })}
                        className="w-full mt-1 px-3 py-2 rounded-lg bg-card border border-border text-foreground text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Protein (g)</label>
                      <input
                        type="number"
                        value={goals.protein}
                        onChange={(e) => updateGoals({ protein: Number(e.target.value) })}
                        className="w-full mt-1 px-3 py-2 rounded-lg bg-card border border-border text-foreground text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Carbs (g)</label>
                      <input
                        type="number"
                        value={goals.carbs}
                        onChange={(e) => updateGoals({ carbs: Number(e.target.value) })}
                        className="w-full mt-1 px-3 py-2 rounded-lg bg-card border border-border text-foreground text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Fats (g)</label>
                      <input
                        type="number"
                        value={goals.fats}
                        onChange={(e) => updateGoals({ fats: Number(e.target.value) })}
                        className="w-full mt-1 px-3 py-2 rounded-lg bg-card border border-border text-foreground text-sm"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Calories Progress */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-foreground">Calories</span>
                <span className={`text-sm font-semibold ${totals.calories > goals.calories ? 'text-destructive' : 'text-foreground'}`}>
                  {Math.round(totals.calories)} / {goals.calories} kcal
                </span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((totals.calories / goals.calories) * 100, 100)}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className={`h-full rounded-full ${totals.calories > goals.calories ? 'bg-destructive' : 'bg-primary'}`}
                />
              </div>
            </div>

            {/* Macro Progress */}
            <div className="grid grid-cols-3 gap-4">
              <MacroProgressBar label="Protein" current={totals.protein} target={goals.protein} color="bg-macro-protein" />
              <MacroProgressBar label="Carbs" current={totals.carbs} target={goals.carbs} color="bg-macro-carbs" />
              <MacroProgressBar label="Fats" current={totals.fats} target={goals.fats} color="bg-macro-fats" />
            </div>
          </motion.div>

          {/* Selection Summary - Fixed at top when items selected */}
          <AnimatePresence>
            {selectedFoods.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-6 p-5 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 border-2 border-primary/20 backdrop-blur-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                      <ShoppingBasket className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Your Selection</h3>
                      <p className="text-sm text-muted-foreground">{selectedFoods.length} items • {selectedFoods.reduce((a, f) => a + f.quantity, 0)} servings</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={clearSelection} className="text-muted-foreground hover:text-destructive">
                    <X className="w-4 h-4 mr-1" />
                    Clear All
                  </Button>
                </div>

                {/* Selected Items */}
                <div className="flex flex-wrap gap-2">
                  {selectedFoods.map((food) => (
                    <motion.div
                      key={food.id}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-2 px-3 py-2 rounded-full bg-card border border-border text-sm"
                    >
                      <span className="text-base">{getCategoryEmoji(food.category)}</span>
                      <span className="font-medium text-foreground max-w-32 truncate">{food.name}</span>
                      <span className="text-muted-foreground">×{food.quantity}</span>
                      <button
                        onClick={() => removeFood(food.id)}
                        className="w-5 h-5 rounded-full bg-muted hover:bg-destructive/20 hover:text-destructive flex items-center justify-center transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Search Input */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative mb-6"
          >
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search for any food... e.g., 'Chicken', 'Rice', 'Banana'"
              className="w-full pl-14 pr-6 py-5 rounded-2xl bg-card border-2 border-border focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none text-foreground placeholder:text-muted-foreground text-lg transition-all shadow-sm"
            />
            {loading && (
              <Loader2 className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-primary animate-spin" />
            )}
          </motion.div>

          {/* Popular Searches */}
          {!hasSearched && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-8"
            >
              <p className="text-sm text-muted-foreground mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Popular searches
              </p>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => handleQuickSearch(term)}
                    className="px-4 py-2 rounded-full text-sm font-medium bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Results Grid */}
          <div className="grid gap-4">
            <AnimatePresence mode="popLayout">
              {foods.map((food, index) => (
                <motion.div
                  key={food.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.03 }}
                  className={`group p-5 rounded-xl bg-card border-2 transition-all card-hover ${
                    isSelected(food.id)
                      ? "border-primary shadow-md ring-2 ring-primary/20"
                      : "border-border/50 hover:border-primary/30"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div 
                      className="flex items-center gap-4 flex-1 cursor-pointer"
                      onClick={() => setExpandedFood(expandedFood?.id === food.id ? null : food)}
                    >
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl">
                        {getCategoryEmoji(food.category)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground line-clamp-1">{food.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {food.servingSize} • {food.category}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-foreground">{food.calories}</p>
                        <p className="text-xs text-muted-foreground">kcal</p>
                      </div>
                      
                      {/* Add/Remove Controls */}
                      <div className="flex items-center gap-2">
                        {isSelected(food.id) ? (
                          <div className="flex items-center gap-1 bg-primary/10 rounded-full p-1">
                            <button
                              onClick={() => removeFood(food.id)}
                              className="w-8 h-8 rounded-full bg-card hover:bg-destructive/20 hover:text-destructive flex items-center justify-center transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center font-semibold text-foreground">
                              {getQuantity(food.id)}
                            </span>
                            <button
                              onClick={() => addFood(food)}
                              className="w-8 h-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <Button
                            variant="soft"
                            size="sm"
                            onClick={() => addFood(food)}
                            className="gap-1"
                          >
                            <Plus className="w-4 h-4" />
                            Add
                          </Button>
                        )}
                      </div>
                      
                      <ChevronRight 
                        className={`w-5 h-5 text-muted-foreground transition-transform cursor-pointer ${
                          expandedFood?.id === food.id ? "rotate-90" : ""
                        }`}
                        onClick={() => setExpandedFood(expandedFood?.id === food.id ? null : food)}
                      />
                    </div>
                  </div>

                  {/* Expanded View */}
                  <AnimatePresence>
                    {expandedFood?.id === food.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-5 mt-5 border-t border-border">
                          <div className="flex gap-6 mb-4">
                            <MacroBar label="Protein" value={food.protein} maxValue={50} color="bg-macro-protein" />
                            <MacroBar label="Carbs" value={food.carbs} maxValue={80} color="bg-macro-carbs" />
                            <MacroBar label="Fats" value={food.fats} maxValue={50} color="bg-macro-fats" />
                          </div>
                          {food.fiber !== undefined && food.fiber > 0 && (
                            <p className="text-sm text-muted-foreground mb-4">
                              Fiber: {food.fiber}g
                            </p>
                          )}
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Database className="w-4 h-4" />
                            <span>USDA FoodData Central</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {hasSearched && foods.length === 0 && !loading && (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg mb-2">No foods found for "{searchQuery}"</p>
              <p className="text-sm">Try a different search term or check spelling</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
