import { Helmet } from "react-helmet-async";
import { Footer } from "@/components/Footer";
import { CalorieCalculator } from "@/components/CalorieCalculator";
import { BottomNav } from "@/components/BottomNav";

const CalculatorPage = () => {
  return (
    <>
      <Helmet>
        <title>Calorie Calculator - Calculate BMR & TDEE | NutriTrack</title>
        <meta
          name="description"
          content="Calculate your daily calorie needs using our smart calculator. Get your BMR, TDEE, and personalized macro recommendations based on your goals."
        />
      </Helmet>

      <div className="min-h-screen bg-background gradient-mesh">
        <main className="pt-8 pb-24">
          <CalorieCalculator />
        </main>
        <Footer />
        <BottomNav />
      </div>
    </>
  );
};

export default CalculatorPage;
