import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Lightbulb, MessageCircle, Brain } from "lucide-react";

interface QuoteCardProps {
  id: string;
  text: string;
  author: string;
  submittedBy: string;
  reactions: {
    inspiring: number;
    thoughtProvoking: number;
    resonates: number;
  };
  commentsCount: number;
  tags?: string[];
  onClick?: () => void;
}

export function QuoteCard({
  text,
  author,
  submittedBy,
  reactions,
  commentsCount,
  tags,
  onClick,
}: QuoteCardProps) {
  return (
    <Card 
      className="w-full max-w-2xl mx-auto cursor-pointer hover:shadow-md transition-shadow duration-200 bg-card border border-border"
      onClick={onClick}
    >
      <CardContent className="p-4 sm:p-6 space-y-4 text-left break-words">
        {/* Quote Text */}
  <blockquote className="font-quote text-base sm:text-lg md:text-xl leading-relaxed text-foreground italic">
          "{text}"
        </blockquote>

        {/* Author */}
        <div className="text-right">
          <p className="font-ui text-muted-foreground text-sm sm:text-base">— {author}</p>
        </div>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs font-ui bg-muted text-muted-foreground rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-2 border-t border-border gap-2 sm:gap-0">
          <p className="text-xs sm:text-sm font-ui text-muted-foreground">
            Shared by <span className="text-foreground font-medium">{submittedBy}</span>
          </p>

          {/* Reactions & Comments */}
          <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm font-ui text-muted-foreground flex-wrap">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="flex items-center gap-1">
                <Lightbulb className="h-4 w-4" />
                {reactions.inspiring}
              </span>
              <span className="flex items-center gap-1">
                <Brain className="h-4 w-4" />
                {reactions.thoughtProvoking}
              </span>
              <span className="flex items-center gap-1">
                <Heart className="h-4 w-4" />
                {reactions.resonates}
              </span>
            </div>
            <span className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4" />
              {commentsCount}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}