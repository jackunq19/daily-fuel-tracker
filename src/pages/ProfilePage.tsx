import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { User, Mail, LogOut, Settings, Target, Flame, Calendar, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BottomNav } from "@/components/BottomNav";
import { Footer } from "@/components/Footer";
import type { User as SupabaseUser } from "@supabase/supabase-js";

const ProfilePage = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
      } else {
        navigate('/auth');
      }
      setLoading(false);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
      } else if (event === 'SIGNED_OUT') {
        navigate('/auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      navigate('/auth');
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoggingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background gradient-mesh flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  const userMetadata = user?.user_metadata || {};
  const displayName = userMetadata.full_name || userMetadata.name || user?.email?.split('@')[0] || 'User';
  const avatarUrl = userMetadata.avatar_url || userMetadata.picture;
  const joinDate = user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : 'Unknown';

  return (
    <>
      <Helmet>
        <title>Profile - NutriTrack</title>
        <meta name="description" content="Manage your NutriTrack profile and account settings." />
      </Helmet>

      <div className="min-h-screen bg-background gradient-mesh pb-24">
        <main className="pt-8 pb-12">
          <div className="container max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Your Profile</h1>
              <p className="text-muted-foreground">Manage your account and preferences</p>
            </motion.div>

            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card rounded-2xl border border-border p-6 md:p-8 mb-6"
            >
              <div className="flex flex-col items-center text-center mb-8">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    className="w-24 h-24 rounded-full object-cover border-4 border-primary/20 mb-4"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <User className="w-12 h-12 text-primary" />
                  </div>
                )}
                <h2 className="text-2xl font-bold text-foreground mb-1">{displayName}</h2>
                <p className="text-muted-foreground flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {user?.email}
                </p>
              </div>

              <div className="grid gap-4">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-muted/50 rounded-xl p-4 text-center">
                    <Calendar className="w-5 h-5 text-primary mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">Joined</p>
                    <p className="text-sm font-medium text-foreground">{joinDate.split(',')[0]}</p>
                  </div>
                  <div className="bg-muted/50 rounded-xl p-4 text-center">
                    <Target className="w-5 h-5 text-accent mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">Daily Goal</p>
                    <p className="text-sm font-medium text-foreground">2000 kcal</p>
                  </div>
                  <div className="bg-muted/50 rounded-xl p-4 text-center">
                    <Flame className="w-5 h-5 text-warning mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">Streak</p>
                    <p className="text-sm font-medium text-foreground">0 days</p>
                  </div>
                </div>

                {/* Account Info */}
                <div className="bg-muted/30 rounded-xl p-4 space-y-3">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Account Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email</span>
                      <span className="text-foreground">{user?.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Provider</span>
                      <span className="text-foreground capitalize">{user?.app_metadata?.provider || 'Email'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email Verified</span>
                      <span className={user?.email_confirmed_at ? "text-success" : "text-warning"}>
                        {user?.email_confirmed_at ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Logout Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Button
                variant="destructive"
                size="lg"
                className="w-full gap-2"
                onClick={handleLogout}
                disabled={loggingOut}
              >
                {loggingOut ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <LogOut className="w-5 h-5" />
                    Log Out
                  </>
                )}
              </Button>
            </motion.div>
          </div>
        </main>
        <Footer />
        <BottomNav />
      </div>
    </>
  );
};

export default ProfilePage;
