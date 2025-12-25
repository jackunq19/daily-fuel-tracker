import { Helmet } from "react-helmet-async";
import { useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { DietPlanner } from "@/components/DietPlanner";

const DietPlannerPage = () => {
  const [searchParams] = useSearchParams();
  const calories = searchParams.get('calories');
  const goal = searchParams.get('goal');

  return (
    <>
      <Helmet>
        <title>Diet Planner - Personalized Meal Plans | NutriTrack</title>
        <meta
          name="description"
          content="Get a personalized meal plan based on your calorie goals. Vegetarian and non-vegetarian options with realistic, everyday foods."
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20">
          <DietPlanner 
            initialCalories={calories ? parseInt(calories) : undefined}
            initialGoal={goal as 'lose' | 'maintain' | 'gain' | undefined}
          />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default DietPlannerPage;
