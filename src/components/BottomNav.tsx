import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Home, Search, Calculator, UtensilsCrossed, LogIn, Moon, Sun, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { useTheme } from "@/hooks/useTheme";

const navItemsLeft = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Search, label: "Foods", path: "/food-search" },
];

const navItemsRight = [
  { icon: Calculator, label: "Calculate", path: "/calculator" },
  { icon: UtensilsCrossed, label: "Diet", path: "/diet-planner" },
];

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const NavButton = ({ item }: { item: { icon: any; label: string; path: string } }) => {
    const active = isActive(item.path);
    return (
      <motion.button
        onClick={() => navigate(item.path)}
        className={`relative flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 ${
          active 
            ? "text-primary" 
            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {active && (
          <motion.div
            layoutId="activeTab"
            className="absolute inset-0 bg-primary/10 rounded-2xl"
            initial={false}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        )}
        <item.icon className={`w-5 h-5 relative z-10 ${active ? "stroke-[2.5px]" : ""}`} />
        <span className={`text-[10px] mt-0.5 font-medium relative z-10 ${
          active ? "text-primary" : ""
        }`}>
          {item.label}
        </span>
      </motion.button>
    );
  };

  return (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 md:bottom-6"
    >
      <div className="flex items-center gap-1 px-2 py-2 rounded-[28px] bg-background/60 backdrop-blur-2xl border border-border/30 shadow-lg shadow-foreground/5">
        {/* Left nav items */}
        {navItemsLeft.map((item) => (
          <NavButton key={item.path} item={item} />
        ))}

        {/* Theme Toggle - Center */}
        <motion.button
          onClick={toggleTheme}
          className="relative flex flex-col items-center justify-center w-14 h-14 rounded-2xl text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            key={theme}
            initial={{ rotate: -180, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 180, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
              <Moon className="w-5 h-5 text-slate-600" />
            )}
          </motion.div>
          <span className="text-[10px] mt-0.5 font-medium">
            {theme === "dark" ? "Light" : "Dark"}
          </span>
        </motion.button>

        {/* Right nav items */}
        {navItemsRight.map((item) => (
          <NavButton key={item.path} item={item} />
        ))}

        {/* Divider */}
        <div className="w-px h-8 bg-border/50 mx-1" />

        {/* Profile/Login */}
        <motion.button
          onClick={() => navigate(user ? '/profile' : '/auth')}
          className={`relative flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 ${
            location.pathname === '/auth' || location.pathname === '/profile'
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {(location.pathname === '/auth' || location.pathname === '/profile') && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-primary/10 rounded-2xl"
              initial={false}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          {user ? (
            <>
              <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[10px] text-primary-foreground font-semibold relative z-10">
                {user.email?.charAt(0).toUpperCase()}
              </div>
              <span className="text-[10px] mt-0.5 font-medium relative z-10">Profile</span>
            </>
          ) : (
            <>
              <LogIn className="w-5 h-5 relative z-10" />
              <span className="text-[10px] mt-0.5 font-medium relative z-10">Login</span>
            </>
          )}
        </motion.button>
      </div>
    </motion.nav>
  );
}
