import { Helmet } from "react-helmet-async";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>NutriTrack - Simple Calorie & Nutrition Tracker</title>
        <meta
          name="description"
          content="Track your calories and nutrition effortlessly. Search 10,000+ foods, calculate daily needs, and get personalized meal plans. Free calorie tracker for beginners."
        />
        <meta
          name="keywords"
          content="calorie tracker, nutrition tracker, food calories, macro tracker, diet planner, calorie calculator, BMR calculator, TDEE calculator"
        />
        <link rel="canonical" href="https://nutritrack.app" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <Hero />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
