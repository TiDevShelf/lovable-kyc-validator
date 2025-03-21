
import VerificationField from "@/components/VerificationField";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CompanyVerification } from "@/types/verification";
import { Building2, Users } from "lucide-react";

interface CompanyVerificationSectionProps {
  data: CompanyVerification;
  onCinChange: (value: string) => void;
  onDinChange: (value: string) => void;
  onVerifyCin: () => void;
  onVerifyDin: () => void;
  isVerifyingCin: boolean;
  isVerifyingDin: boolean;
}

const CompanyVerificationSection = ({
  data,
  onCinChange,
  onDinChange,
  onVerifyCin,
  onVerifyDin,
  isVerifyingCin,
  isVerifyingDin
}: CompanyVerificationSectionProps) => {
  return (
    <Card className="verification-section animate-fade-in">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-full bg-primary/10 text-primary">
            <Building2 className="h-5 w-5" />
          </div>
          <CardTitle>Company Verification</CardTitle>
        </div>
        <CardDescription>
          Verify your company and director identification numbers
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <VerificationField
          id="cin-number"
          label="CIN Number"
          value={data.cin.value}
          status={data.cin.status}
          message={data.cin.message}
          placeholder="Enter 21-character CIN"
          onChange={onCinChange}
          onVerify={onVerifyCin}
          isLoading={isVerifyingCin}
        />
        
        <VerificationField
          id="din-number"
          label="DIN Number"
          value={data.din.value}
          status={data.din.status}
          message={data.din.message}
          placeholder="Enter 8-digit DIN"
          maxLength={8}
          onChange={onDinChange}
          onVerify={onVerifyDin}
          isLoading={isVerifyingDin}
        />
      </CardContent>
    </Card>
  );
};

export default CompanyVerificationSection;
