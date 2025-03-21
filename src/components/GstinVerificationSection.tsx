
import VerificationField from "@/components/VerificationField";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GstinVerification } from "@/types/verification";
import { Receipt } from "lucide-react";

interface GstinVerificationSectionProps {
  data: GstinVerification;
  onGstinChange: (value: string) => void;
  onVerifyGstin: () => void;
  isVerifyingGstin: boolean;
}

const GstinVerificationSection = ({
  data,
  onGstinChange,
  onVerifyGstin,
  isVerifyingGstin
}: GstinVerificationSectionProps) => {
  return (
    <Card className="verification-section animate-fade-in">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-full bg-primary/10 text-primary">
            <Receipt className="h-5 w-5" />
          </div>
          <CardTitle>GSTIN Verification</CardTitle>
        </div>
        <CardDescription>
          Verify your Goods and Services Tax Identification Number
        </CardDescription>
      </CardHeader>
      <CardContent>
        <VerificationField
          id="gstin-number"
          label="GSTIN Number"
          value={data.gstin.value}
          status={data.gstin.status}
          message={data.gstin.message}
          placeholder="Enter 15-character GSTIN"
          maxLength={15}
          onChange={onGstinChange}
          onVerify={onVerifyGstin}
          isLoading={isVerifyingGstin}
        />
      </CardContent>
    </Card>
  );
};

export default GstinVerificationSection;
