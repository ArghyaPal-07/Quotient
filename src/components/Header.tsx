import { Button } from "@/components/ui/button";
import { PlusCircle, User as UserIcon, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Header() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-2 sm:px-4 h-16 flex flex-wrap items-center justify-between min-h-16">
        {/* Logo */}
        <div 
          className="flex items-center cursor-pointer"
          onClick={() => navigate("/")}
        >
          <h1 className="text-2xl font-quote font-bold text-foreground">
            Quotient
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-2 md:gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="font-ui"
            onClick={() => navigate("/submit")}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Submit Quote</span>
            <span className="sm:hidden">Submit</span>
          </Button>

          {!user && (
            <Button
              variant="default"
              size="sm"
              className="font-ui"
              onClick={() => navigate("/login")}
            >
              <LogIn className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Login</span>
            </Button>
          )}

          {user && (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="font-ui"
                onClick={() => navigate("/my-quotes")}
              >
                <UserIcon className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">My Quotes</span>
              </Button>
              <button
                className="flex items-center rounded-full p-0 focus:outline-none"
                onClick={() => navigate('/profile/me')}
                aria-label="Profile"
              >
                <Avatar>
                  {user.user_metadata?.avatar_url ? (
                    <AvatarImage src={user.user_metadata.avatar_url} alt={user.email ?? 'avatar'} />
                  ) : (
                    <AvatarFallback>{(user.email ?? user.id ?? 'U')[0].toUpperCase()}</AvatarFallback>
                  )}
                </Avatar>
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}