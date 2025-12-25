import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "#food-search", label: "Food Search" },
  { href: "#calculator", label: "Calculator" },
  { href: "#diet-planner", label: "Diet Planner" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">NutriTrack</span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" size="sm">
              Log In
            </Button>
            <Button variant="default" size="sm">
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-muted"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden py-4 border-t border-border"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-3 rounded-lg text-foreground hover:bg-muted transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="flex gap-3 px-4 pt-4 mt-2 border-t border-border">
                <Button variant="outline" size="sm" className="flex-1">
                  Log In
                </Button>
                <Button variant="default" size="sm" className="flex-1">
                  Get Started
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
}
