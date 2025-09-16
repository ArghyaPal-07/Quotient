import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabaseClient";

export default function Profile() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", user.id)
          .single();
        if (error) throw error;
        setUsername((data as any)?.username ?? "");
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };
    fetchProfile();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <p className="text-center">You must be signed in to view your profile.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-2 sm:px-4 py-8 sm:py-12">
        <div className="max-w-md mx-auto">
          <Card>
            <CardContent className="p-4 sm:p-6 space-y-6">
              <div className="flex items-center gap-4">
                <Avatar>
                  {user.user_metadata?.avatar_url ? (
                    <AvatarImage src={user.user_metadata.avatar_url} alt={user.email ?? "avatar"} />
                  ) : (
                    <AvatarFallback>{(user.email ?? user.id ?? "U")[0].toUpperCase()}</AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <h2 className="font-quote text-lg font-bold">{user.email ?? user.id}</h2>
                  <p className="text-sm text-muted-foreground">Member</p>
                </div>
              </div>

              <div className="space-y-2">
                <div>
                  <Label className="font-ui">Username</Label>
                  <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="choose a username" />
                </div>

                <div>
                  <strong>User ID:</strong>
                  <div className="text-sm text-muted-foreground break-all">{user.id}</div>
                </div>

                <div className="space-y-2">
                  <Button
                    onClick={async () => {
                      setLoading(true);
                      setMessage(null);
                      try {
                        // upsert into profiles table
                        const { error } = await supabase.from('profiles').upsert({ id: user.id, username, avatar_url: user.user_metadata?.avatar_url ?? null });
                        if (error) throw error;
                        setMessage('Profile saved');
                      } catch (err: any) {
                        console.error(err);
                        setMessage(err.message ?? 'Failed to save profile');
                      } finally {
                        setLoading(false);
                      }
                    }}
                    className="w-full"
                    disabled={loading}
                  >
                    Save Profile
                  </Button>

                  <Button onClick={async () => { await signOut(); navigate('/'); }} className="w-full">
                    Sign out
                  </Button>
                </div>

                {message && <p className="text-sm text-muted-foreground">{message}</p>}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
