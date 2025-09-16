import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Lightbulb, Brain, MessageCircle, ArrowLeft } from "lucide-react";
import { Header } from "@/components/Header";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/hooks/useAuth";

type Quote = {
  id: string;
  text: string;
  author?: string | null;
  tags?: string[] | null;
  user_id?: string | null;
  submittedBy?: string | null;
  inserted_at?: string | null;
};

export default function QuotePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const [deleting, setDeleting] = useState(false);
  const handleDelete = async () => {
    if (!quote?.id) return;
    setDeleting(true);
    try {
      const { error } = await supabase.from('quotes').delete().eq('id', quote.id);
      if (error) throw error;
      navigate('/');
    } catch (err: any) {
      alert(err.message ?? 'Failed to delete quote');
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);

    const fetchQuote = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from("quotes")
          .select("*")
          .eq("id", id)
          .single();

        if (fetchError) throw fetchError;
        const fetched = data as Quote | null;
        if (fetched && fetched.user_id) {
          const { data: profile } = await supabase.from('profiles').select('username').eq('id', fetched.user_id).single();
          (fetched as any).submittedBy = (profile as any)?.username ?? fetched.user_id;
        }
        setQuote(fetched as Quote | null);
      } catch (err: any) {
        console.error(err);
        setError(err.message ?? "Failed to load quote");
      } finally {
        setLoading(false);
      }
    };

    fetchQuote();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">Loading...</div>
      </div>
    );
  }

  if (error || !quote) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-ui font-bold text-foreground mb-4">Quote Not Found</h1>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button onClick={() => navigate("/")} className="font-ui">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/")}
          className="font-ui mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Feed
        </Button>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Quote Card */}
          <Card className="w-full">
            <CardContent className="p-8 space-y-6">
              {/* Quote Text */}
              <blockquote className="font-quote text-2xl md:text-3xl leading-relaxed text-foreground italic text-center">
                "{quote.text}"
              </blockquote>

              {/* Author */}
              <div className="text-center">
                <p className="font-ui text-lg text-muted-foreground">— {quote.author}</p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap justify-center gap-2">
                {(quote.tags ?? []).map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-sm font-ui bg-muted text-muted-foreground rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Meta Info */}
              <div className="text-center pt-4 border-t border-border">
                <p className="text-sm font-ui text-muted-foreground">
                  Shared by <span className="text-foreground font-medium cursor-pointer hover:text-primary">{quote.submittedBy ?? quote.user_id}</span>
                </p>
              </div>

              {/* Reaction Buttons */}
              <div className="flex items-center justify-center gap-4 pt-4">
                <Button variant="outline" size="sm" className="font-ui">
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Inspiring
                </Button>
                <Button variant="outline" size="sm" className="font-ui">
                  <Brain className="h-4 w-4 mr-2" />
                  Thought-Provoking
                </Button>
                <Button variant="outline" size="sm" className="font-ui">
                  <Heart className="h-4 w-4 mr-2" />
                  Resonates
                </Button>
              </div>

              {/* Delete button for owner */}
              {user && quote.user_id === user.id && (
                <div className="pt-6 text-center">
                  <Button variant="destructive" onClick={handleDelete} disabled={deleting} className="font-ui">
                    {deleting ? "Deleting..." : "Delete Quote"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Comments Section (placeholder) */}
          <Card className="w-full">
            <CardContent className="p-6">
              <h3 className="text-xl font-ui font-semibold text-foreground mb-4 flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Comments
              </h3>

              <div className="space-y-4">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <p className="font-ui text-foreground mb-2">No comments yet.</p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border">
                <p className="text-sm font-ui text-muted-foreground text-center">
                  <Button variant="link" className="font-ui p-0">Log in</Button> to add a comment
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}