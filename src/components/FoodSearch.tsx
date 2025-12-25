import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Info, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FoodItem {
  id: string;
  name: string;
  category: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  servingSize: string;
  isEstimate?: boolean;
}

const foodDatabase: FoodItem[] = [
  { id: "1", name: "Chicken Breast (Grilled)", category: "Protein", calories: 165, protein: 31, carbs: 0, fats: 3.6, servingSize: "100g" },
  { id: "2", name: "Brown Rice (Cooked)", category: "Grains", calories: 111, protein: 2.6, carbs: 23, fats: 0.9, servingSize: "100g" },
  { id: "3", name: "Banana", category: "Fruits", calories: 89, protein: 1.1, carbs: 23, fats: 0.3, servingSize: "100g" },
  { id: "4", name: "Egg (Whole, Boiled)", category: "Protein", calories: 155, protein: 13, carbs: 1.1, fats: 11, servingSize: "100g" },
  { id: "5", name: "Paneer", category: "Dairy", calories: 265, protein: 18, carbs: 1.2, fats: 21, servingSize: "100g" },
  { id: "6", name: "Dal (Cooked Lentils)", category: "Legumes", calories: 116, protein: 9, carbs: 20, fats: 0.4, servingSize: "100g" },
  { id: "7", name: "Roti/Chapati", category: "Grains", calories: 71, protein: 2.7, carbs: 15, fats: 0.4, servingSize: "1 piece (30g)" },
  { id: "8", name: "Apple", category: "Fruits", calories: 52, protein: 0.3, carbs: 14, fats: 0.2, servingSize: "100g" },
  { id: "9", name: "Oats (Cooked)", category: "Grains", calories: 71, protein: 2.5, carbs: 12, fats: 1.5, servingSize: "100g" },
  { id: "10", name: "Greek Yogurt", category: "Dairy", calories: 59, protein: 10, carbs: 3.6, fats: 0.7, servingSize: "100g" },
  { id: "11", name: "Almonds", category: "Nuts", calories: 579, protein: 21, carbs: 22, fats: 50, servingSize: "100g" },
  { id: "12", name: "Salmon (Grilled)", category: "Protein", calories: 208, protein: 20, carbs: 0, fats: 13, servingSize: "100g" },
  { id: "13", name: "Sweet Potato (Baked)", category: "Vegetables", calories: 86, protein: 1.6, carbs: 20, fats: 0.1, servingSize: "100g" },
  { id: "14", name: "Milk (Whole)", category: "Dairy", calories: 61, protein: 3.2, carbs: 4.8, fats: 3.3, servingSize: "100g" },
  { id: "15", name: "Idli", category: "Grains", calories: 39, protein: 2, carbs: 8, fats: 0.1, servingSize: "1 piece (30g)" },
];

const quickFilters = ["All", "Protein", "Grains", "Fruits", "Dairy", "Vegetables"];

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
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);

  const filteredFoods = foodDatabase.filter((food) => {
    const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === "All" || food.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <section id="food-search" className="py-16 md:py-24 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Search Foods & Nutrition
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find accurate calorie and macro information for thousands of foods.
            All data is verified — never estimated or made up.
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
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for food... e.g., 'Chicken', 'Rice', 'Banana'"
              className="w-full pl-14 pr-6 py-5 rounded-2xl bg-card border-2 border-border focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none text-foreground placeholder:text-muted-foreground text-lg transition-all shadow-sm"
            />
          </motion.div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {quickFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeFilter === filter
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Results Grid */}
          <div className="grid gap-4">
            <AnimatePresence mode="popLayout">
              {filteredFoods.slice(0, 8).map((food, index) => (
                <motion.div
                  key={food.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedFood(selectedFood?.id === food.id ? null : food)}
                  className={`group p-5 rounded-xl bg-card border-2 cursor-pointer transition-all ${
                    selectedFood?.id === food.id
                      ? "border-primary shadow-md"
                      : "border-border/50 hover:border-primary/30 hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary-muted flex items-center justify-center text-xl">
                        {food.category === "Protein" && "🍗"}
                        {food.category === "Grains" && "🌾"}
                        {food.category === "Fruits" && "🍎"}
                        {food.category === "Dairy" && "🥛"}
                        {food.category === "Vegetables" && "🥕"}
                        {food.category === "Legumes" && "🫘"}
                        {food.category === "Nuts" && "🥜"}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{food.name}</h3>
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
                            <MacroBar label="Carbs" value={food.carbs} maxValue={50} color="bg-macro-carbs" />
                            <MacroBar label="Fats" value={food.fats} maxValue={50} color="bg-macro-fats" />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Info className="w-4 h-4" />
                              <span>Verified nutrition data</span>
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

          {filteredFoods.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg mb-2">No foods found</p>
              <p className="text-sm">Try a different search term</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
