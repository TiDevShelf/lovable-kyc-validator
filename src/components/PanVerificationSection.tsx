
import VerificationField from "@/components/VerificationField";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PanVerification } from "@/types/verification";
import { CreditCard } from "lucide-react";

interface PanVerificationSectionProps {
  data: PanVerification;
  onOwnerPanChange: (value: string) => void;
  onBusinessPanChange: (value: string) => void;
  onVerifyOwnerPan: () => void;
  onVerifyBusinessPan: () => void;
  isVerifyingOwnerPan: boolean;
  isVerifyingBusinessPan: boolean;
}

const PanVerificationSection = ({
  data,
  onOwnerPanChange,
  onBusinessPanChange,
  onVerifyOwnerPan,
  onVerifyBusinessPan,
  isVerifyingOwnerPan,
  isVerifyingBusinessPan
}: PanVerificationSectionProps) => {
  return (
    <Card className="verification-section animate-fade-in">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-full bg-primary/10 text-primary">
            <CreditCard className="h-5 w-5" />
          </div>
          <CardTitle>PAN Verification</CardTitle>
        </div>
        <CardDescription>
          Verify your personal and business PAN details
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <VerificationField
          id="owner-pan"
          label="Owner's PAN"
          value={data.ownerPan.value}
          status={data.ownerPan.status}
          message={data.ownerPan.message}
          placeholder="Enter 10-character PAN"
          maxLength={10}
          onChange={onOwnerPanChange}
          onVerify={onVerifyOwnerPan}
          isLoading={isVerifyingOwnerPan}
        />
        
        <VerificationField
          id="business-pan"
          label="Business PAN"
          value={data.businessPan.value}
          status={data.businessPan.status}
          message={data.businessPan.message}
          placeholder="Enter 10-character PAN"
          maxLength={10}
          onChange={onBusinessPanChange}
          onVerify={onVerifyBusinessPan}
          isLoading={isVerifyingBusinessPan}
        />
      </CardContent>
    </Card>
  );
};

export default PanVerificationSection;
