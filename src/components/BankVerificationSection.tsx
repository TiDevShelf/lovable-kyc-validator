
import VerificationField from "@/components/VerificationField";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BankVerification } from "@/types/verification";
import { Landmark } from "lucide-react";

interface BankVerificationSectionProps {
  data: BankVerification;
  onAccountNumberChange: (value: string) => void;
  onIfscChange: (value: string) => void;
  onVerifyBankAccount: () => void;
  isVerifyingBank: boolean;
}

const BankVerificationSection = ({
  data,
  onAccountNumberChange,
  onIfscChange,
  onVerifyBankAccount,
  isVerifyingBank
}: BankVerificationSectionProps) => {
  return (
    <Card className="verification-section animate-fade-in">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-full bg-primary/10 text-primary">
            <Landmark className="h-5 w-5" />
          </div>
          <CardTitle>Bank Account Verification</CardTitle>
        </div>
        <CardDescription>
          Verify your bank account details
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <VerificationField
          id="account-number"
          label="Account Number"
          value={data.accountNumber.value}
          status={data.accountNumber.status}
          message={data.accountNumber.message}
          placeholder="Enter bank account number"
          onChange={onAccountNumberChange}
          onVerify={onVerifyBankAccount}
          isLoading={isVerifyingBank}
          // disabled={data.ifsc.value === ""}
        />
        
        <VerificationField
          id="ifsc-code"
          label="IFSC Code"
          value={data.ifsc.value}
          status={data.ifsc.status}
          message={data.ifsc.message}
          placeholder="Enter IFSC code"
          maxLength={11}
          onChange={onIfscChange}
          onVerify={onVerifyBankAccount}
          isLoading={isVerifyingBank}
          // disabled={data.accountNumber.value === ""}
        />
      </CardContent>
    </Card>
  );
};

export default BankVerificationSection;
