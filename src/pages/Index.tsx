import { Helmet } from "react-helmet-async";
import { Footer } from "@/components/Footer";
import { HeroSections } from "@/components/HeroSections";
import { BottomNav } from "@/components/BottomNav";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>NutriTrack - AI-Powered Calorie & Nutrition Tracker</title>
        <meta
          name="description"
          content="Track your calories and nutrition effortlessly with AI. Search real-time food data, calculate daily needs, and get personalized AI meal plans. Free calorie tracker for beginners."
        />
        <meta
          name="keywords"
          content="calorie tracker, nutrition tracker, food calories, macro tracker, diet planner, calorie calculator, BMR calculator, TDEE calculator, AI meal plan"
        />
        <link rel="canonical" href="https://nutritrack.app" />
      </Helmet>

      <div className="min-h-screen bg-background gradient-mesh">
        <main className="pb-24">
          <HeroSections />
        </main>
        <Footer />
        <BottomNav />
      </div>
    </>
  );
};

export default Index;
