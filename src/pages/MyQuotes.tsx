import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabaseClient";
import { Header } from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function MyQuotes() {
  const { user } = useAuth();
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    supabase
      .from("quotes")
      .select("id, text, author, tags, inserted_at")
      .eq("user_id", user.id)
      .order("inserted_at", { ascending: false })
      .then(({ data }) => {
        setQuotes(data ?? []);
        setLoading(false);
      });
  }, [user]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const { error } = await supabase.from("quotes").delete().eq("id", id);
    if (!error) setQuotes((prev) => prev.filter((q) => q.id !== id));
    setDeletingId(null);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <p className="text-center">You must be signed in to view your quotes.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-2 sm:px-4 py-8 sm:py-12">
        <h1 className="text-xl sm:text-2xl font-bold mb-6 text-center font-quote">My Submitted Quotes</h1>
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : quotes.length === 0 ? (
          <div className="text-center text-muted-foreground">No quotes submitted yet.</div>
        ) : (
          <div className="space-y-4 sm:space-y-6 max-w-2xl mx-auto">
            {quotes.map((quote) => (
              <Card key={quote.id}>
                <CardContent className="p-4 sm:p-6 space-y-2">
                  <blockquote className="font-quote text-base sm:text-lg text-foreground italic">"{quote.text}"</blockquote>
                  <div className="text-right text-muted-foreground text-xs sm:text-sm">— {quote.author}</div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {(quote.tags ?? []).map((tag: string) => (
                      <span key={tag} className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded-full">#{tag}</span>
                    ))}
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-4 gap-2 sm:gap-0">
                    <span className="text-xs text-muted-foreground">{new Date(quote.inserted_at).toLocaleString()}</span>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(quote.id)} disabled={deletingId === quote.id}>
                      {deletingId === quote.id ? "Deleting..." : "Delete"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
