
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { User, LogOut, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  className?: string;
}

const Header = ({ className }: HeaderProps) => {
  const { user, logout } = useAuth();

  return (
    <header className={cn("bg-white dark:bg-gray-900 border-b border-border sticky top-0 z-10 transition-all", className)}>
      <div className="container py-4 px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              KYCVerify
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
              Home
            </Link>
            {user?.isAuthenticated && (
              <Link to="/kyc" className="text-sm font-medium hover:text-primary transition-colors">
                Verification
              </Link>
            )}
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
              About
            </a>
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
              Contact
            </a>
          </nav>
          
          <div className="flex items-center gap-4">
            {user?.isAuthenticated ? (
              <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{user.name}</span>
                </div>
                <Button variant="outline" size="sm" onClick={logout} className="gap-2">
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button variant="default" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  <span>Login</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
