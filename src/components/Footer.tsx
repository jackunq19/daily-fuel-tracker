import { Leaf, Mail, Twitter, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t border-border py-12 md:py-16">
      <div className="container">
        <div className="grid md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <a href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
                <Leaf className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">NutriTrack</span>
            </a>
            <p className="text-muted-foreground max-w-sm mb-6">
              Simple nutrition tracking that helps you reach your health goals without the complexity.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Features</h4>
            <ul className="space-y-3">
              <li><a href="#food-search" className="text-muted-foreground hover:text-foreground transition-colors">Food Search</a></li>
              <li><a href="#calculator" className="text-muted-foreground hover:text-foreground transition-colors">Calorie Calculator</a></li>
              <li><a href="#diet-planner" className="text-muted-foreground hover:text-foreground transition-colors">Diet Planner</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Support</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Help Center</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 NutriTrack. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Made with 💚 for a healthier you
          </p>
        </div>
      </div>
    </footer>
  );
}
