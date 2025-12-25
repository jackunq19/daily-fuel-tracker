import { Helmet } from "react-helmet-async";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CalorieCalculator } from "@/components/CalorieCalculator";

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

      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20">
          <CalorieCalculator />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default CalculatorPage;
