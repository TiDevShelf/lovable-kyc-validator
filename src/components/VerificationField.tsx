
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { VerificationStatus } from "@/types/verification";
import { 
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

interface VerificationFieldProps {
  id: string;
  label: string;
  value: string;
  status: VerificationStatus;
  message?: string;
  placeholder?: string;
  maxLength?: number;
  onChange: (value: string) => void;
  onVerify: () => void;
  disabled?: boolean;
  className?: string;
  buttonLabel?: string;
  isLoading?: boolean;
}

const VerificationField = ({
  id,
  label,
  value,
  status,
  message,
  placeholder,
  maxLength,
  onChange,
  onVerify,
  disabled = false,
  className,
  buttonLabel = "Verify",
  isLoading = false
}: VerificationFieldProps) => {
  const [isFocused, setIsFocused] = useState(false);

  // Status icon based on verification status
  const StatusIcon = () => {
    if (value.length === 0) return null;
    
    switch (status) {
      case "success":
        return <CheckCircle2 className="field-validation-icon text-success animate-fade-in" />;
      case "error":
        return <XCircle className="field-validation-icon text-destructive animate-fade-in" />;
      case "pending":
        return <Loader2 className="field-validation-icon text-primary animate-spin" />;
      case "idle":
        return value.length > 0 ? <Clock className="field-validation-icon text-muted-foreground" /> : null;
      default:
        return null;
    }
  };

  // Badge for status
  const StatusBadge = () => {
    if (status === "idle" && !message) return null;
    
    let badgeClass = "";
    let statusText = "";
    
    switch (status) {
      case "success":
        badgeClass = "status-badge-success";
        statusText = message || "Verified";
        break;
      case "error":
        badgeClass = "status-badge-error";
        statusText = message || "Failed";
        break;
      case "pending":
        badgeClass = "status-badge-pending";
        statusText = message || "Verifying...";
        break;
      case "idle":
        if (message) {
          badgeClass = "status-badge-warning";
          statusText = message;
        }
        break;
    }
    
    return (
      <span className={cn("status-badge animate-fade-in", badgeClass)}>
        {statusText}
      </span>
    );
  };

  return (
    <div className={cn("form-group", className)}>
      <div className="flex items-center justify-between">
        <Label htmlFor={id} className="block text-sm font-medium">
          {label}
        </Label>
        <StatusBadge />
      </div>
      
      <div className="flex gap-2">
        <div className="relative w-full">
          <Input
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            maxLength={maxLength}
            disabled={disabled || status === "pending" || status === "success"}
            className={cn(
              "pr-10 transition-all",
              isFocused && "ring-2 ring-primary/30",
              status === "success" && "border-success",
              status === "error" && "border-destructive"
            )}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          <StatusIcon />
        </div>
        
        <Button 
          onClick={onVerify}
          disabled={
            disabled || 
            value.length === 0 || 
            status === "pending" || 
            status === "success" ||
            isLoading
          }
          className="whitespace-nowrap"
          variant={status === "success" ? "outline" : "default"}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying
            </>
          ) : buttonLabel}
        </Button>
      </div>
      
      {message && status !== "success" && status !== "idle" && (
        <p className={cn(
          "text-sm mt-1 animate-fade-in",
          status === "error" ? "text-destructive" : "text-muted-foreground"
        )}>
          {message}
        </p>
      )}
    </div>
  );
};

export default VerificationField;
