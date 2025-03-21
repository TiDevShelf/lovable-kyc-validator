
import { VerificationState } from "@/types/verification";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, XCircle, AlertCircle, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface VerificationStatusProps {
  state: VerificationState;
  className?: string;
}

const VerificationStatusComponent = ({ state, className }: VerificationStatusProps) => {
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
      state.isFullyVerified ? "border-success/50 shadow-xl" : "",
      className
    )}>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center transition-all",
            state.isFullyVerified 
              ? "bg-success/20 text-success animate-pulse"
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
                  "h-2 rounded-full transition-colors",
                  state.isFullyVerified ? "bg-success" : "bg-primary"
                )}
                style={{ width: `${percentage}%`, transition: 'width 0.7s ease-out' }}
              />
            </div>
            
            {/* Verification badges */}
            {successCount > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {state.aadhaar.otpDetails.status === "success" && (
                  <span className="inline-flex items-center gap-1 text-xs bg-success/10 text-success rounded-full py-0.5 px-2">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Aadhaar</span>
                  </span>
                )}
                {state.pan.ownerPan.status === "success" && (
                  <span className="inline-flex items-center gap-1 text-xs bg-success/10 text-success rounded-full py-0.5 px-2">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Owner PAN</span>
                  </span>
                )}
                {state.pan.businessPan.status === "success" && (
                  <span className="inline-flex items-center gap-1 text-xs bg-success/10 text-success rounded-full py-0.5 px-2">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Business PAN</span>
                  </span>
                )}
                {state.company.cin.status === "success" && (
                  <span className="inline-flex items-center gap-1 text-xs bg-success/10 text-success rounded-full py-0.5 px-2">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>CIN</span>
                  </span>
                )}
                {state.company.din.status === "success" && (
                  <span className="inline-flex items-center gap-1 text-xs bg-success/10 text-success rounded-full py-0.5 px-2">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>DIN</span>
                  </span>
                )}
                {state.gstin.gstin.status === "success" && (
                  <span className="inline-flex items-center gap-1 text-xs bg-success/10 text-success rounded-full py-0.5 px-2">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>GSTIN</span>
                  </span>
                )}
                {state.bank.accountNumber.status === "success" && state.bank.ifsc.status === "success" && (
                  <span className="inline-flex items-center gap-1 text-xs bg-success/10 text-success rounded-full py-0.5 px-2">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Bank</span>
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VerificationStatusComponent;
