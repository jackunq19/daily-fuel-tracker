import { motion } from "framer-motion";
import { Search, Calculator, Utensils, TrendingUp, ArrowRight, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Search,
    title: "Food Search",
    description: "Search 10,000+ foods with accurate calorie and macro data",
    color: "bg-primary-muted text-primary",
  },
  {
    icon: Calculator,
    title: "Calorie Calculator",
    description: "Calculate your daily needs based on your goals",
    color: "bg-accent/10 text-accent",
  },
  {
    icon: Utensils,
    title: "Diet Planner",
    description: "Get personalized meal plans that fit your lifestyle",
    color: "bg-warning/10 text-warning",
  },
  {
    icon: TrendingUp,
    title: "Track Progress",
    description: "Monitor your journey with simple visual insights",
    color: "bg-success/10 text-success",
  },
];

const popularSearches = [
  { name: "Chicken Breast", calories: 165, unit: "100g" },
  { name: "Brown Rice", calories: 111, unit: "100g" },
  { name: "Banana", calories: 89, unit: "100g" },
  { name: "Egg", calories: 155, unit: "100g" },
];

export function Hero() {
  return (
    <section className="relative min-h-[90vh] gradient-hero overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-20 w-60 h-60 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-40 h-40 bg-success/5 rounded-full blur-2xl" />
      </div>

      <div className="container relative pt-20 pb-16 md:pt-28 md:pb-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-muted text-primary text-sm font-medium mb-6"
            >
              <Leaf className="w-4 h-4" />
              <span>Simple nutrition tracking</span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              Track your nutrition,{" "}
              <span className="text-primary">effortlessly</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto lg:mx-0 mb-8">
              No complicated apps. No guesswork. Just simple, reliable nutrition
              tracking that helps you reach your goals.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button variant="hero" size="xl" className="group">
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="xl">
                Explore Features
              </Button>
            </div>

            <div className="mt-12 flex items-center gap-4 justify-center lg:justify-start">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-medium text-muted-foreground"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">10,000+</span> users
                tracking daily
              </div>
            </div>
          </motion.div>

          {/* Right content - Quick search preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative bg-card rounded-2xl shadow-lg p-6 md:p-8 border border-border/50">
              {/* Search bar */}
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search foods... e.g., 'Chicken'"
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-foreground placeholder:text-muted-foreground transition-all"
                />
              </div>

              {/* Popular searches */}
              <div className="mb-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Popular searches
                </span>
              </div>

              <div className="space-y-3">
                {popularSearches.map((food, index) => (
                  <motion.div
                    key={food.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary-muted flex items-center justify-center">
                        <span className="text-lg">🍽️</span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{food.name}</p>
                        <p className="text-sm text-muted-foreground">
                          per {food.unit}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">
                        {food.calories}
                      </p>
                      <p className="text-xs text-muted-foreground">kcal</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Decorative gradient */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl -z-10" />
            </div>
          </motion.div>
        </div>

        {/* Features grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-20 md:mt-28"
        >
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              Everything you need to eat better
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Simple tools designed to reduce friction and keep you on track
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="group p-6 rounded-xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer"
              >
                <div
                  className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
