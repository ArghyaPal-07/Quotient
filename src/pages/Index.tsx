import { Header } from "@/components/Header";
import { QuoteFeed } from "@/components/QuoteFeed";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-2 sm:px-4">
        {/* Hero Section */}
        <section className="text-center py-8 sm:py-12 px-2 sm:px-4">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-quote font-bold text-foreground mb-4">
            Discover & Share
            <br />
            <span className="text-primary">Inspiring Quotes</span>
          </h1>
          <p className="text-base sm:text-lg font-ui text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A thoughtful community where words inspire, provoke thought, and resonate with the soul.
            Share your favorite quotes and discover wisdom from others.
          </p>
        </section>

        {/* Quote Feed */}
        <QuoteFeed />
      </main>
    </div>
  );
};

export default Index;
