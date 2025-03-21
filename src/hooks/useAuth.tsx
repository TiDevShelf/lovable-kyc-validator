
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, AuthState } from "@/types/auth";
import { toast } from "@/hooks/use-toast";

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data - in a real app, this would come from a backend
const MOCK_USERS = [
  { id: "1", email: "user@example.com", password: "password", name: "Demo User" },
  { id: "2", email: "admin@example.com", password: "admin123", name: "Admin User" },
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
  });

  useEffect(() => {
    // Check for existing user in localStorage
    const storedUser = localStorage.getItem("kyc_user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser) as User;
        setAuthState({ user, isLoading: false });
      } catch (error) {
        localStorage.removeItem("kyc_user");
        setAuthState({ user: null, isLoading: false });
      }
    } else {
      setAuthState({ user: null, isLoading: false });
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication - in a real app, this would be an API call
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    return new Promise(resolve => {
      // Simulate API delay
      setTimeout(() => {
        const user = MOCK_USERS.find(
          u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );
        
        if (user) {
          const authUser: User = {
            id: user.id,
            name: user.name,
            email: user.email,
            isAuthenticated: true,
          };
          
          localStorage.setItem("kyc_user", JSON.stringify(authUser));
          setAuthState({ user: authUser, isLoading: false });
          toast({
            title: "Login successful",
            description: `Welcome back, ${user.name}!`,
          });
          resolve(true);
        } else {
          setAuthState({ user: null, isLoading: false });
          toast({
            variant: "destructive",
            title: "Login failed",
            description: "Invalid email or password. Please try again.",
          });
          resolve(false);
        }
      }, 1000);
    });
  };

  const logout = () => {
    localStorage.removeItem("kyc_user");
    setAuthState({ user: null, isLoading: false });
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
