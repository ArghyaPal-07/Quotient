import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QuoteCard } from "./QuoteCard";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

type Quote = {
  id: string;
  text: string;
  author?: string | null;
  tags?: string[] | null;
  user_id?: string | null;
  submittedBy?: string | null;
  inserted_at?: string | null;
};

export function QuoteFeed() {
  const [activeTab, setActiveTab] = useState("trending");
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleQuoteClick = (quoteId: string) => {
    navigate(`/quote/${quoteId}`);
  };

  useEffect(() => {
    let isMounted = true;
    const fetchQuotes = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("quotes")
          .select("id, text, author, tags, user_id, inserted_at")
          .order("inserted_at", { ascending: false })
          .limit(100);

        if (error) throw error;
        if (!isMounted) return;
        const fetched = (data as Quote[]) ?? [];

        // fetch associated profiles for usernames
        const userIds = Array.from(new Set(fetched.map((q) => q.user_id).filter(Boolean)));
        let profilesById: Record<string, string> = {};
        if (userIds.length > 0) {
          const { data: profiles } = await supabase.from('profiles').select('id, username').in('id', userIds as string[]);
          (profiles as any[] | null)?.forEach((p) => { profilesById[p.id] = p.username; });
        }

        // map fetched quotes to include username as submittedBy
        const mapped = fetched.map((q) => ({ ...q, submittedBy: profilesById[q.user_id ?? ''] ?? 'anonymous' }));
        setQuotes(mapped as Quote[]);
      } catch (err) {
        console.error("Failed to fetch quotes", err);
        setQuotes([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchQuotes();

    return () => {
      isMounted = false;
    };
  }, []);

  // derive trending by simple reaction heuristic (placeholder)
  const trendingQuotes = [...quotes];
  const latestQuotes = [...quotes].sort((a, b) => (new Date(b.inserted_at ?? 0).getTime() - new Date(a.inserted_at ?? 0).getTime()));

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
          <TabsTrigger value="trending" className="font-ui">
            Trending
          </TabsTrigger>
          <TabsTrigger value="latest" className="font-ui">
            Latest
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trending" className="space-y-6">
          {loading ? <div>Loading...</div> : trendingQuotes.map((quote) => (
            <QuoteCard
              key={quote.id}
              id={quote.id}
              text={quote.text}
              author={quote.author ?? "Unknown"}
              submittedBy={quote.submittedBy ?? quote.user_id ?? "anonymous"}
              reactions={{ inspiring: 0, thoughtProvoking: 0, resonates: 0 }}
              commentsCount={0}
              tags={quote.tags ?? []}
              onClick={() => handleQuoteClick(quote.id)}
            />
          ))}
        </TabsContent>

        <TabsContent value="latest" className="space-y-6">
          {loading ? <div>Loading...</div> : latestQuotes.map((quote) => (
            <QuoteCard
              key={quote.id}
              id={quote.id}
              text={quote.text}
              author={quote.author ?? "Unknown"}
              submittedBy={quote.submittedBy ?? quote.user_id ?? "anonymous"}
              reactions={{ inspiring: 0, thoughtProvoking: 0, resonates: 0 }}
              commentsCount={0}
              tags={quote.tags ?? []}
              onClick={() => handleQuoteClick(quote.id)}
            />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}