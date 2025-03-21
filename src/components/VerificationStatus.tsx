
import { VerificationState } from "@/types/verification";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, XCircle, AlertCircle, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface VerificationStatusProps {
  state: VerificationState;
}

const VerificationStatusComponent = ({ state }: VerificationStatusProps) => {
  // Count all the successful verifications
  const getSuccessCount = () => {
    let count = 0;
    
    // Aadhaar verification
    if (state.aadhaar.otpDetails.status === "success") count++;
    
    // PAN verifications
    if (state.pan.ownerPan.status === "success") count++;
    if (state.pan.businessPan.status === "success") count++;
    
    // Company verifications
    if (state.company.cin.status === "success") count++;
    if (state.company.din.status === "success") count++;
    
    // GSTIN verification
    if (state.gstin.gstin.status === "success") count++;
    
    // Bank verification
    if (state.bank.accountNumber.status === "success" && 
        state.bank.ifsc.status === "success") count++;
    
    return count;
  };

  const totalVerifications = 7; // Total number of verifications
  const successCount = getSuccessCount();
  const percentage = Math.round((successCount / totalVerifications) * 100);

  return (
    <Card className={cn(
      "verification-section border overflow-hidden transition-all duration-500",
      state.isFullyVerified ? "border-success/50 shadow-md" : ""
    )}>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center transition-all",
            state.isFullyVerified 
              ? "bg-success/20 text-success animate-pulse-light"
              : "bg-muted text-muted-foreground"
          )}>
            {state.isFullyVerified ? (
              <Shield className="h-8 w-8" />
            ) : (
              <AlertCircle className="h-8 w-8" />
            )}
          </div>
          
          <div className="flex-1 text-center sm:text-left">
            <h3 className={cn(
              "text-xl font-semibold mb-1 transition-all",
              state.isFullyVerified ? "text-success" : ""
            )}>
              {state.isFullyVerified 
                ? "Person Validated" 
                : "Validation In Progress"}
            </h3>
            
            <p className="text-muted-foreground text-sm mb-3">
              {state.isFullyVerified 
                ? "All verification checks have been successfully completed" 
                : `${successCount} out of ${totalVerifications} verifications completed (${percentage}%)`}
            </p>
            
            <div className="w-full bg-muted rounded-full h-2 mb-2">
              <div 
                className={cn(
                  "h-2 rounded-full transition-all duration-700 ease-out",
                  state.isFullyVerified ? "bg-success" : "bg-primary"
                )}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VerificationStatusComponent;
