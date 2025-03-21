
import { useState } from "react";
import VerificationField from "@/components/VerificationField";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { AadhaarVerification } from "@/types/verification";
import { User, ShieldCheck, Fingerprint, KeyRound, Loader2 } from "lucide-react";

interface AadhaarVerificationSectionProps {
  data: AadhaarVerification;
  onAadhaarChange: (value: string) => void;
  onOtpChange: (value: string) => void;
  onGenerateOtp: () => void;
  onVerifyOtp: () => void;
  isGeneratingOtp: boolean;
  isVerifyingOtp: boolean;
}

const AadhaarVerificationSection = ({
  data,
  onAadhaarChange,
  onOtpChange,
  onGenerateOtp,
  onVerifyOtp,
  isGeneratingOtp,
  isVerifyingOtp
}: AadhaarVerificationSectionProps) => {
  return (
    <Card className="verification-section animate-fade-in">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-full bg-primary/10 text-primary">
            <Fingerprint className="h-5 w-5" />
          </div>
          <CardTitle>Aadhaar Verification</CardTitle>
        </div>
        <CardDescription>
          Verify your identity with Aadhaar OTP verification
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <VerificationField
          id="aadhaar-number"
          label="Aadhaar Number"
          value={data.aadhaar.value}
          status={data.aadhaar.status}
          message={data.aadhaar.message}
          placeholder="Enter 12-digit Aadhaar number"
          maxLength={12}
          onChange={onAadhaarChange}
          onVerify={onGenerateOtp}
          buttonLabel="Generate OTP"
          isLoading={isGeneratingOtp}
          disabled={data.isOtpRequested && data.otpDetails.status === "success"}
        />

        {data.isOtpRequested && (
          <div className="form-group animate-slide-up">
            <Label htmlFor="aadhaar-otp" className="block text-sm font-medium">
              OTP Verification
            </Label>
            <div className="flex gap-2">
              <div className="relative w-full">
                <Input
                  id="aadhaar-otp"
                  value={data.otpDetails.otp}
                  onChange={(e) => onOtpChange(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  disabled={data.otpDetails.status === "success"}
                  className={`
                    ${data.otpDetails.status === "success" ? "border-success" : ""}
                    ${data.otpDetails.status === "error" ? "border-destructive" : ""}
                  `}
                />
                {data.otpDetails.status === "success" && (
                  <ShieldCheck className="field-validation-icon text-success animate-fade-in" />
                )}
              </div>
              <Button
                onClick={onVerifyOtp}
                disabled={
                  data.otpDetails.otp.length !== 6 ||
                  data.otpDetails.status === "pending" ||
                  data.otpDetails.status === "success" ||
                  isVerifyingOtp
                }
              >
                {isVerifyingOtp ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying
                  </>
                ) : (
                  <>
                    <KeyRound className="mr-2 h-4 w-4" />
                    Verify OTP
                  </>
                )}
              </Button>
            </div>
            {data.otpDetails.message && data.otpDetails.status !== "success" && (
              <p className={`text-sm mt-1 ${
                data.otpDetails.status === "error" ? "text-destructive" : "text-muted-foreground"
              }`}>
                {data.otpDetails.message}
              </p>
            )}
            {data.otpDetails.status === "success" && (
              <p className="text-sm text-success mt-1">
                {data.otpDetails.message || "Aadhaar verified successfully"}
              </p>
            )}
          </div>
        )}
        
        {!data.isOtpRequested && (
          <p className="text-sm text-muted-foreground">
            Enter your Aadhaar number and generate OTP for verification.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default AadhaarVerificationSection;
