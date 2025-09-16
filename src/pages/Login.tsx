import { useState } from "react";
import { Header } from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/hooks/useAuth";
import { Github, Mail } from "lucide-react";

export default function Login() {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) throw error;
      setMessage("Check your email for the login link.");
    } catch (err: any) {
      setError(err.message ?? "Failed to send magic link");
    } finally {
      setLoading(false);
    }
  };

  const handleGithub = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider: "github" });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message ?? "GitHub login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="text-center">
                <h1 className="font-quote text-3xl font-bold text-foreground">Login</h1>
                <p className="font-ui text-muted-foreground mt-2">
                  {user ? `Signed in as ${user.email ?? user.id}` : "Sign in to share quotes"}
                </p>
              </div>

              <form onSubmit={handleMagicLink} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-ui">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="font-ui"
                  />
                </div>
                <Button type="submit" disabled={loading} className="w-full font-ui">
                  <Mail className="h-4 w-4 mr-2" />
                  Send magic link
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-background px-2 text-muted-foreground font-ui">or</span>
                </div>
              </div>

              <Button variant="outline" onClick={handleGithub} disabled={loading} className="w-full font-ui">
                <Github className="h-4 w-4 mr-2" />
                Continue with GitHub
              </Button>

              {message && <p className="text-sm text-green-600 font-ui">{message}</p>}
              {error && <p className="text-sm text-red-600 font-ui">{error}</p>}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}




