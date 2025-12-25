import { Helmet } from "react-helmet-async";
import { Footer } from "@/components/Footer";
import { FoodSearch } from "@/components/FoodSearch";
import { BottomNav } from "@/components/BottomNav";

const FoodSearchPage = () => {
  return (
    <>
      <Helmet>
        <title>Food Search - Find Calories & Nutrition | NutriTrack</title>
        <meta
          name="description"
          content="Search our database of 10,000+ foods. Find accurate calories, protein, carbs, and fat information. No guesswork, verified nutrition data."
        />
      </Helmet>

      <div className="min-h-screen bg-background gradient-mesh">
        <main className="pt-8 pb-24">
          <FoodSearch />
        </main>
        <Footer />
        <BottomNav />
      </div>
    </>
  );
};

export default FoodSearchPage;
