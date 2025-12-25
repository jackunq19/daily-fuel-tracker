import { useState, useEffect } from 'react';

interface DailyGoals {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

const STORAGE_KEY = 'nutritrack_daily_goals';

const DEFAULT_GOALS: DailyGoals = {
  calories: 2000,
  protein: 150,
  carbs: 250,
  fats: 65,
};

export function useDailyGoals() {
  const [goals, setGoals] = useState<DailyGoals>(DEFAULT_GOALS);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setGoals(JSON.parse(stored));
      } catch {
        // Use defaults if parse fails
      }
    }
  }, []);

  const updateGoals = (newGoals: Partial<DailyGoals>) => {
    const updated = { ...goals, ...newGoals };
    setGoals(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const setGoalsFromCalculator = (calories: number, protein: number, carbs: number, fats: number) => {
    const newGoals = { calories, protein, carbs, fats };
    setGoals(newGoals);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newGoals));
  };

  return { goals, updateGoals, setGoalsFromCalculator };
}
