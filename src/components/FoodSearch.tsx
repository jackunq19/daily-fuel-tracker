import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Info, ChevronRight, Loader2, Database, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";

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

const popularSearches = [
  "Chicken breast", "Rice", "Banana", "Eggs", "Oatmeal", 
  "Salmon", "Avocado", "Greek yogurt", "Sweet potato", "Almonds"
];

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
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { toast } = useToast();

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
        body: { query, pageSize: 20 },
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
            Search Foods & Nutrition
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Access accurate nutrition data from the USDA database. 
            Real-time information for thousands of foods worldwide.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
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
                  onClick={() => setSelectedFood(selectedFood?.id === food.id ? null : food)}
                  className={`group p-5 rounded-xl bg-card border-2 cursor-pointer transition-all card-hover ${
                    selectedFood?.id === food.id
                      ? "border-primary shadow-md"
                      : "border-border/50 hover:border-primary/30"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
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
                      <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform ${
                        selectedFood?.id === food.id ? "rotate-90" : ""
                      }`} />
                    </div>
                  </div>

                  {/* Expanded View */}
                  <AnimatePresence>
                    {selectedFood?.id === food.id && (
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
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Database className="w-4 h-4" />
                              <span>USDA FoodData Central</span>
                            </div>
                            <Button variant="soft" size="sm" className="gap-2">
                              <Plus className="w-4 h-4" />
                              Add to daily log
                            </Button>
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
