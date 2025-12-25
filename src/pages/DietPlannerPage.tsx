import { Helmet } from "react-helmet-async";
import { useSearchParams } from "react-router-dom";
import { Footer } from "@/components/Footer";
import { DietPlanner } from "@/components/DietPlanner";
import { BottomNav } from "@/components/BottomNav";

const DietPlannerPage = () => {
  const [searchParams] = useSearchParams();
  const calories = searchParams.get('calories');
  const goal = searchParams.get('goal');

  return (
    <>
      <Helmet>
        <title>AI Diet Planner - Personalized Meal Plans | NutriTrack</title>
        <meta
          name="description"
          content="Get AI-powered personalized meal plans based on your calorie goals, dietary preferences, and restrictions."
        />
      </Helmet>

      <div className="min-h-screen bg-background gradient-mesh">
        <main className="pt-8 pb-24">
          <DietPlanner 
            initialCalories={calories ? parseInt(calories) : undefined}
            initialGoal={goal as 'lose' | 'maintain' | 'gain' | undefined}
          />
        </main>
        <Footer />
        <BottomNav />
      </div>
    </>
  );
};

export default DietPlannerPage;
