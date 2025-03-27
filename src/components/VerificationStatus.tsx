import { useEffect, useState, useMemo } from "react";
import { VerificationState } from "@/types/verification";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, AlertCircle, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import Swal from "sweetalert2";

interface VerificationStatusProps {
  state: VerificationState;
  className?: string;
}

const STORAGE_KEY = "verificationStatus";
const apiUrl = import.meta.env.VITE_B2B_BASE_URL;

const VerificationStatusComponent = ({ state, className }: VerificationStatusProps) => {
  const [verificationStatus, setVerificationStatus] = useState<{ [key: string]: boolean }>({});
  const [isFullyVerified, setIsFullyVerified] = useState(false);

  // Dynamically compute verification status based on `state`
  const computedStatus = useMemo(() => ({
    aadhaar: state.aadhaar?.otpDetails?.status === "success",
    pan: state.pan?.ownerPan?.status === "success",
    cin: state.company?.cin?.status === "success",
    din: true,
    gstin: state.gstin?.gstin?.status === "success",
    bank: state.bank?.accountNumber?.status === "success" && state.bank?.ifsc?.status === "success",
  }), [state]);
  // const computedStatus = useMemo(() => ({
  //   aadhaar: true,
  //   pan: true,
  //   cin: true,
  //   din: true,
  //   gstin: true,
  //   bank: true,
  // }), []);
  useEffect(() => {
    const allVerified = Object.values(computedStatus).every(Boolean);
    const storedStatusStr = localStorage.getItem(STORAGE_KEY);
    const storedStatus = storedStatusStr ? JSON.parse(storedStatusStr) : {};
    if (JSON.stringify(storedStatus) !== JSON.stringify(computedStatus)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(computedStatus));
    }

    setVerificationStatus(computedStatus);
    setIsFullyVerified(allVerified);

    if (allVerified) {
      Swal.fire({
        title: "Verification Completed!",
        text: "All required verifications have been successfully completed.",
        icon: "success",
        confirmButtonText: "OK",
      });
      verifyClientKYC(computedStatus);
    }
  }, [computedStatus]);

  function getQueryParam(param: any) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

  const clientId = getQueryParam('clientId');
  if (clientId) {
      localStorage.setItem('clientId', clientId);
  }

  const verifyClientKYC = async (verificationData: { [key: string]: boolean }) => {
    const clientId = localStorage.getItem('clientId');

    const formattedData = {
      kycVerification: Object.fromEntries(
        Object.entries(verificationData).map(([key, value]) => [
          key,
          { isVerified: value },
        ])
      ),
    };
    try {
      const response = await fetch(`${apiUrl}/client/kyc/${clientId}/verify`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("KYC Verification Successful:", data);
        Swal.fire({
          title: "KYC Verified",
          text: "Client KYC verification was successful!",
          icon: "success",
          confirmButtonText: "OK",
        });
      } else {
        console.error("KYC Verification Failed:", data);
        Swal.fire({
          title: "Verification Failed",
          text: data.message || "Something went wrong.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error verifying KYC:", error);
      Swal.fire({
        title: "Error",
        text: "An error occurred while verifying KYC.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };


  return (
    <Card className={cn(
      "verification-section border overflow-hidden transition-all duration-500",
      isFullyVerified ? "border-success/50 shadow-xl" : "",
      className
    )}>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center transition-all",
            isFullyVerified 
              ? "bg-success/20 text-success animate-pulse"
              : "bg-muted text-muted-foreground"
          )}>
            {isFullyVerified ? (
              <Shield className="h-8 w-8" />
            ) : (
              <AlertCircle className="h-8 w-8" />
            )}
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h3 className={cn(
              "text-xl font-semibold mb-1 transition-all",
              isFullyVerified ? "text-success" : ""
            )}>
              {isFullyVerified 
                ? "Person Fully Verified" 
                : "Verification In Progress"}
            </h3>

            {/* Verification Badges */}
            <div className="flex flex-wrap gap-1 mt-3">
              {Object.entries(verificationStatus).map(([key, isVerified]) => (
                <span
                  key={key}
                  className={cn(
                    "inline-flex items-center gap-1 text-xs rounded-full py-0.5 px-2",
                    isVerified ? "bg-success/10 text-success" : "bg-red-100 text-red-600"
                  )}
                >
                  <CheckCircle2 className="h-3 w-3" />
                  <span>{key.toUpperCase()}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VerificationStatusComponent;
