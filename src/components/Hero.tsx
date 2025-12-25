import { motion } from "framer-motion";
import { ArrowRight, Zap, Target, TrendingUp, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const stats = [
  { value: "10K+", label: "Active Users" },
  { value: "500K+", label: "Foods Tracked" },
  { value: "98%", label: "Success Rate" },
];

const features = [
  {
    icon: Zap,
    title: "Instant Search",
    description: "Find any food in milliseconds",
  },
  {
    icon: Target,
    title: "Smart Goals",
    description: "Personalized calorie targets",
  },
  {
    icon: TrendingUp,
    title: "Track Progress",
    description: "Visual journey insights",
  },
];

export function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen overflow-hidden bg-background">
      {/* Dynamic background with fitness imagery feel */}
      <div className="absolute inset-0">
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-accent/10 to-transparent rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />
        
        {/* Animated floating shapes */}
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] right-[15%] w-24 h-24 bg-primary/10 rounded-3xl backdrop-blur-sm border border-primary/20"
        />
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[60%] left-[10%] w-32 h-32 bg-accent/10 rounded-full backdrop-blur-sm border border-accent/20"
        />
        <motion.div
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[40%] right-[25%] w-16 h-16 bg-success/10 rounded-2xl backdrop-blur-sm border border-success/20"
        />
      </div>

      <div className="container relative pt-32 pb-20 md:pt-40 md:pb-32">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8"
          >
            <Flame className="w-4 h-4" />
            <span>Start your fitness journey today</span>
            <ArrowRight className="w-4 h-4" />
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-foreground leading-[1.1] tracking-tight mb-6"
          >
            Transform Your
            <br />
            <span className="relative">
              <span className="relative z-10 bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
                Nutrition
              </span>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="absolute -bottom-2 left-0 right-0 h-3 bg-primary/20 rounded-full origin-left"
              />
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12"
          >
            Track calories, discover foods, and build sustainable habits with 
            the simplest nutrition platform designed for results.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Button 
              variant="hero" 
              size="xl" 
              className="group text-lg px-8"
              onClick={() => navigate('/auth')}
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline" 
              size="xl" 
              className="text-lg px-8"
              onClick={() => navigate('/calculator')}
            >
              Calculate Calories
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-8 md:gap-16"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                className="text-center"
              >
                <p className="text-4xl md:text-5xl font-bold text-foreground mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Feature cards floating */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 md:mt-32"
        >
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border-border/50 hover:border-primary/30 transition-all">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Fitness imagery section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-24 md:mt-32"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { emoji: "🏋️", label: "Strength Training", color: "from-primary/20 to-primary/5" },
              { emoji: "🥗", label: "Healthy Eating", color: "from-success/20 to-success/5" },
              { emoji: "🏃", label: "Cardio Fitness", color: "from-accent/20 to-accent/5" },
              { emoji: "🧘", label: "Mind & Body", color: "from-warning/20 to-warning/5" },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className={`aspect-square rounded-2xl bg-gradient-to-br ${item.color} border border-border/50 flex flex-col items-center justify-center cursor-pointer hover:shadow-lg transition-all`}
              >
                <span className="text-5xl md:text-6xl mb-3">{item.emoji}</span>
                <span className="text-sm font-medium text-foreground">{item.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-20 text-center"
        >
          <p className="text-muted-foreground mb-6">
            Ready to take control of your nutrition?
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/food-search')}>
              Search Foods →
            </Button>
            <Button variant="ghost" onClick={() => navigate('/calculator')}>
              Calculate Needs →
            </Button>
            <Button variant="ghost" onClick={() => navigate('/diet-planner')}>
              Get Meal Plan →
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
