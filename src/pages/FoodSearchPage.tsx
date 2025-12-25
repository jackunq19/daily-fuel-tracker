import { Helmet } from "react-helmet-async";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FoodSearch } from "@/components/FoodSearch";

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

      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20">
          <FoodSearch />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default FoodSearchPage;
