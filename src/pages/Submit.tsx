import { useState } from "react";
import { Header } from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Submit() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [author, setAuthor] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("quotes")
        .insert({
          text,
          author,
          tags: tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          user_id: user.id
        })
        .select()
        .single();

  if (error) throw error;
  console.log("Inserted quote:", data);
  // navigate to home so the feed (which fetches from Supabase) can show the new quote
  navigate("/");
    } catch (err: any) {
      setError(err.message ?? "Failed to submit quote");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="text-center">
                <h1 className="font-quote text-3xl font-bold text-foreground">Submit a Quote</h1>
                <p className="font-ui text-muted-foreground mt-2">
                  Share wisdom with the community.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="text" className="font-ui">Quote</Label>
                  <Textarea
                    id="text"
                    required
                    rows={4}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Write the quote text here..."
                    className="font-ui"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="author" className="font-ui">Author</Label>
                  <Input
                    id="author"
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="e.g., Maya Angelou"
                    className="font-ui"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags" className="font-ui">Tags</Label>
                  <Input
                    id="tags"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="comma, separated, tags"
                    className="font-ui"
                  />
                  <p className="text-xs text-muted-foreground font-ui">Optional. Separate with commas.</p>
                </div>

                <Button type="submit" disabled={loading} className="font-ui">
                  {loading ? "Submitting..." : "Submit Quote"}
                </Button>
              </form>

              {!user && (
                <p className="text-sm text-muted-foreground font-ui">
                  You need to be logged in to submit. You will be redirected to login.
                </p>
              )}

              {error && <p className="text-sm text-red-600 font-ui">{error}</p>}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}




