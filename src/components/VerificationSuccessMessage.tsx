
import { Shield, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

interface VerificationSuccessMessageProps {
  className?: string;
  onReset?: () => void;
}

const VerificationSuccessMessage = ({ 
  className,
  onReset 
}: VerificationSuccessMessageProps) => {
  const { user } = useAuth();

  return (
    <Card className={cn("overflow-hidden border-success shadow-lg", className)}>
      <div className="bg-success/10 p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="p-3 bg-success text-success-foreground rounded-full animate-bounce">
            <Shield className="h-8 w-8" />
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-success">Verification Complete!</h2>
            <p className="text-muted-foreground mt-1">
              {user?.name}, your identity has been successfully verified.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {["Aadhaar", "PAN", "Company", "GSTIN", "Bank"].map((item) => (
              <div 
                key={item}
                className="flex items-center gap-1 bg-success/20 text-success text-xs py-1 px-2 rounded-full"
              >
                <CheckCircle className="h-3 w-3" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <CardContent className="p-6 text-center">
        <p className="mb-4">
          A verification certificate has been sent to your registered email address.
          You can now proceed to use our services with full access.
        </p>
        
        {onReset && (
          <Button 
            variant="outline" 
            onClick={onReset}
            className="mt-2"
          >
            Start New Verification
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default VerificationSuccessMessage;
