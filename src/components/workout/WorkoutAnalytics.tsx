import { motion } from "framer-motion";
import { ArrowLeft, TrendingUp, Trophy, Target, Dumbbell } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface WorkoutAnalyticsProps {
  onBack: () => void;
}

const monthlyWorkouts = [
  { week: "W1", workouts: 4 },
  { week: "W2", workouts: 5 },
  { week: "W3", workouts: 3 },
  { week: "W4", workouts: 6 },
];

const strengthProgress = [
  { exercise: "Bench", week1: 135, week2: 140, week3: 145, week4: 150 },
  { exercise: "Squat", week1: 185, week2: 195, week3: 205, week4: 215 },
  { exercise: "Deadlift", week1: 225, week2: 235, week3: 245, week4: 255 },
];

const muscleDistribution = [
  { name: "Chest", value: 20, color: "hsl(var(--primary))" },
  { name: "Back", value: 20, color: "hsl(var(--accent))" },
  { name: "Legs", value: 25, color: "hsl(var(--warning))" },
  { name: "Shoulders", value: 15, color: "hsl(var(--success))" },
  { name: "Arms", value: 20, color: "hsl(var(--protein))" },
];

const chartConfig = {
  workouts: {
    label: "Workouts",
    color: "hsl(var(--primary))",
  },
  bench: {
    label: "Bench Press",
    color: "hsl(var(--primary))",
  },
};

export function WorkoutAnalytics({ onBack }: WorkoutAnalyticsProps) {
  const stats = {
    totalWorkouts: 18,
    personalBests: 3,
    consistency: 85,
  };

  return (
    <div className="container mx-auto px-4 pt-8 pb-32">
      {/* Header */}
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back</span>
      </button>

      <motion.h1 
        className="text-2xl font-bold text-foreground mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Workout Analytics
      </motion.h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-4 glass border-border/30 text-center">
            <Dumbbell className="w-5 h-5 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{stats.totalWorkouts}</p>
            <p className="text-xs text-muted-foreground">Workouts</p>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-4 glass border-border/30 text-center">
            <Trophy className="w-5 h-5 text-warning mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{stats.personalBests}</p>
            <p className="text-xs text-muted-foreground">PRs</p>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-4 glass border-border/30 text-center">
            <Target className="w-5 h-5 text-success mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{stats.consistency}%</p>
            <p className="text-xs text-muted-foreground">Consistency</p>
          </Card>
        </motion.div>
      </div>

      {/* Monthly Frequency Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="p-4 glass border-border/30 mb-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Monthly Frequency</h3>
          <ChartContainer config={chartConfig} className="h-40 w-full">
            <BarChart data={monthlyWorkouts}>
              <XAxis 
                dataKey="week" 
                axisLine={false} 
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar 
                dataKey="workouts" 
                fill="hsl(var(--primary))" 
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </Card>
      </motion.div>

      {/* Strength Progress Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="p-4 glass border-border/30 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">Strength Progress</h3>
            <div className="flex items-center gap-1 text-success text-xs">
              <TrendingUp className="w-3 h-3" />
              <span>+15 lbs avg</span>
            </div>
          </div>
          <ChartContainer config={chartConfig} className="h-40 w-full">
            <LineChart data={[
              { week: "W1", bench: 135, squat: 185, deadlift: 225 },
              { week: "W2", bench: 140, squat: 195, deadlift: 235 },
              { week: "W3", bench: 145, squat: 205, deadlift: 245 },
              { week: "W4", bench: 150, squat: 215, deadlift: 255 },
            ]}>
              <XAxis 
                dataKey="week" 
                axisLine={false} 
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line 
                type="monotone" 
                dataKey="bench" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))", strokeWidth: 0 }}
              />
              <Line 
                type="monotone" 
                dataKey="squat" 
                stroke="hsl(var(--warning))" 
                strokeWidth={2}
                dot={{ fill: "hsl(var(--warning))", strokeWidth: 0 }}
              />
              <Line 
                type="monotone" 
                dataKey="deadlift" 
                stroke="hsl(var(--accent))" 
                strokeWidth={2}
                dot={{ fill: "hsl(var(--accent))", strokeWidth: 0 }}
              />
            </LineChart>
          </ChartContainer>
          <div className="flex items-center justify-center gap-4 mt-3">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-xs text-muted-foreground">Bench</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-warning" />
              <span className="text-xs text-muted-foreground">Squat</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-accent" />
              <span className="text-xs text-muted-foreground">Deadlift</span>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Muscle Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="p-4 glass border-border/30">
          <h3 className="text-sm font-semibold text-foreground mb-4">Muscle Group Distribution</h3>
          <div className="flex items-center gap-4">
            <div className="w-32 h-32">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={muscleDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={50}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {muscleDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2">
              {muscleDistribution.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="text-xs font-medium text-foreground">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* AI Insight */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-6"
      >
        <Card className="p-4 glass border-primary/20 bg-primary/5">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <span className="text-sm">🤖</span>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground mb-1">AI Insight</p>
              <p className="text-xs text-muted-foreground">
                You're most consistent on weekdays. Consider adding a light cardio session on weekends to boost recovery!
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
