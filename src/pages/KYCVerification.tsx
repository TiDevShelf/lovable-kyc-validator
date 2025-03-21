
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { verifyAadhaarWithOtp, verifyBankAccount, verifyCin, verifyDin, verifyGstin, verifyPan, generateAadhaarOtp } from "@/services/verificationService";
import { VerificationState } from "@/types/verification";
import AadhaarVerificationSection from "@/components/AadhaarVerificationSection";
import PanVerificationSection from "@/components/PanVerificationSection";
import CompanyVerificationSection from "@/components/CompanyVerificationSection";
import GstinVerificationSection from "@/components/GstinVerificationSection";
import BankVerificationSection from "@/components/BankVerificationSection";
import VerificationStatusComponent from "@/components/VerificationStatus";
import VerificationSuccessMessage from "@/components/VerificationSuccessMessage";
import { Shield } from "lucide-react";

const KYCVerification = () => {
  const [verificationState, setVerificationState] = useState<VerificationState>({
    aadhaar: {
      aadhaar: { value: "", status: "idle", message: "" },
      isOtpRequested: false,
      otpDetails: { value: "", otp: "", status: "idle", message: "" },
    },
    pan: {
      ownerPan: { value: "", status: "idle", message: "" },
      businessPan: { value: "", status: "idle", message: "" },
    },
    company: {
      cin: { value: "", status: "idle", message: "" },
      din: { value: "", status: "idle", message: "" },
    },
    gstin: {
      gstin: { value: "", status: "idle", message: "" },
    },
    bank: {
      accountNumber: { value: "", status: "idle", message: "" },
      ifsc: { value: "", status: "idle", message: "" },
    },
    isFullyVerified: false,
  });

  const [isGeneratingAadhaarOtp, setIsGeneratingAadhaarOtp] = useState(false);
  const [isVerifyingAadhaarOtp, setIsVerifyingAadhaarOtp] = useState(false);
  const [isVerifyingOwnerPan, setIsVerifyingOwnerPan] = useState(false);
  const [isVerifyingBusinessPan, setIsVerifyingBusinessPan] = useState(false);
  const [isVerifyingCin, setIsVerifyingCin] = useState(false);
  const [isVerifyingDin, setIsVerifyingDin] = useState(false);
  const [isVerifyingGstin, setIsVerifyingGstin] = useState(false);
  const [isVerifyingBank, setIsVerifyingBank] = useState(false);

  const resetVerification = () => {
    setVerificationState({
      aadhaar: {
        aadhaar: { value: "", status: "idle", message: "" },
        isOtpRequested: false,
        otpDetails: { value: "", otp: "", status: "idle", message: "" },
      },
      pan: {
        ownerPan: { value: "", status: "idle", message: "" },
        businessPan: { value: "", status: "idle", message: "" },
      },
      company: {
        cin: { value: "", status: "idle", message: "" },
        din: { value: "", status: "idle", message: "" },
      },
      gstin: {
        gstin: { value: "", status: "idle", message: "" },
      },
      bank: {
        accountNumber: { value: "", status: "idle", message: "" },
        ifsc: { value: "", status: "idle", message: "" },
      },
      isFullyVerified: false,
    });
  };

  const handleAadhaarChange = (value: string) => {
    setVerificationState(prevState => ({
      ...prevState,
      aadhaar: {
        ...prevState.aadhaar,
        aadhaar: { value: value, status: "idle", message: "" },
        isOtpRequested: false,
        otpDetails: { value: "", otp: "", status: "idle", message: "" },
      },
    }));
  };

  const handleOtpChange = (value: string) => {
    setVerificationState(prevState => ({
      ...prevState,
      aadhaar: {
        ...prevState.aadhaar,
        otpDetails: { ...prevState.aadhaar.otpDetails, otp: value, status: "idle", message: "" },
      },
    }));
  };

  const handleGenerateOtp = async () => {
    setIsGeneratingAadhaarOtp(true);
    try {
      const aadhaarNumber = verificationState.aadhaar.aadhaar.value;
      const result = await generateAadhaarOtp(aadhaarNumber);

      if (result.success) {
        setVerificationState(prevState => ({
          ...prevState,
          aadhaar: {
            ...prevState.aadhaar,
            isOtpRequested: true,
            aadhaar: { ...prevState.aadhaar.aadhaar, status: "success" },
            otpDetails: { 
              ...prevState.aadhaar.otpDetails,
              value: result.data?.txnId || "",
              txnId: result.data?.txnId
            }
          },
        }));
        toast({
          title: "OTP Sent",
          description: result.message || "OTP has been sent to your Aadhaar-linked mobile number.",
        });
      } else {
        setVerificationState(prevState => ({
          ...prevState,
          aadhaar: {
            ...prevState.aadhaar,
            aadhaar: { ...prevState.aadhaar.aadhaar, status: "error", message: result.message || "Failed to generate OTP." },
            isOtpRequested: false,
            otpDetails: { value: "", otp: "", status: "idle", message: "" },
          },
        }));
        toast({
          variant: "destructive",
          title: "OTP Generation Failed",
          description: result.message || "Failed to generate OTP. Please try again.",
        });
      }
    } catch (error: any) {
      setVerificationState(prevState => ({
        ...prevState,
        aadhaar: {
          ...prevState.aadhaar,
          aadhaar: { ...prevState.aadhaar.aadhaar, status: "error", message: error.message || "An unexpected error occurred." },
          isOtpRequested: false,
          otpDetails: { value: "", otp: "", status: "idle", message: "" },
        },
      }));
      toast({
        variant: "destructive",
        title: "OTP Generation Error",
        description: error.message || "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsGeneratingAadhaarOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    setIsVerifyingAadhaarOtp(true);
    try {
      const aadhaarNumber = verificationState.aadhaar.aadhaar.value;
      const otp = verificationState.aadhaar.otpDetails.otp;
      const txnId = verificationState.aadhaar.otpDetails.txnId || "";
      const result = await verifyAadhaarWithOtp(aadhaarNumber, otp, txnId);

      if (result.success) {
        setVerificationState(prevState => ({
          ...prevState,
          aadhaar: {
            ...prevState.aadhaar,
            otpDetails: { 
              ...prevState.aadhaar.otpDetails,
              status: "success", 
              message: result.message || "Aadhaar verified successfully." 
            },
          },
        }));
        toast({
          title: "Aadhaar Verified",
          description: result.message || "Aadhaar has been successfully verified.",
        });
      } else {
        setVerificationState(prevState => ({
          ...prevState,
          aadhaar: {
            ...prevState.aadhaar,
            otpDetails: { 
              ...prevState.aadhaar.otpDetails,
              status: "error", 
              message: result.message || "Failed to verify OTP." 
            },
          },
        }));
        toast({
          variant: "destructive",
          title: "Aadhaar Verification Failed",
          description: result.message || "Failed to verify Aadhaar. Please try again.",
        });
      }
    } catch (error: any) {
      setVerificationState(prevState => ({
        ...prevState,
        aadhaar: {
          ...prevState.aadhaar,
          otpDetails: { 
            ...prevState.aadhaar.otpDetails,
            status: "error", 
            message: error.message || "An unexpected error occurred." 
          },
        },
      }));
      toast({
        variant: "destructive",
        title: "Aadhaar Verification Error",
        description: error.message || "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsVerifyingAadhaarOtp(false);
    }
  };

  const handleOwnerPanChange = (value: string) => {
    setVerificationState(prevState => ({
      ...prevState,
      pan: {
        ...prevState.pan,
        ownerPan: { value: value, status: "idle", message: "" },
      },
    }));
  };

  const handleBusinessPanChange = (value: string) => {
    setVerificationState(prevState => ({
      ...prevState,
      pan: {
        ...prevState.pan,
        businessPan: { value: value, status: "idle", message: "" },
      },
    }));
  };

  const handleVerifyOwnerPan = async () => {
    setIsVerifyingOwnerPan(true);
    try {
      const panNumber = verificationState.pan.ownerPan.value;
      const result = await verifyPan(panNumber);

      if (result.success) {
        setVerificationState(prevState => ({
          ...prevState,
          pan: {
            ...prevState.pan,
            ownerPan: { value: panNumber, status: "success", message: result.message || "Owner PAN verified successfully." },
          },
        }));
        toast({
          title: "Owner PAN Verified",
          description: result.message || "Owner PAN has been successfully verified.",
        });
      } else {
        setVerificationState(prevState => ({
          ...prevState,
          pan: {
            ...prevState.pan,
            ownerPan: { value: panNumber, status: "error", message: result.message || "Failed to verify Owner PAN." },
          },
        }));
        toast({
          variant: "destructive",
          title: "Owner PAN Verification Failed",
          description: result.message || "Failed to verify Owner PAN. Please try again.",
        });
      }
    } catch (error: any) {
      setVerificationState(prevState => ({
        ...prevState,
        pan: {
          ...prevState.pan,
          ownerPan: { value: verificationState.pan.ownerPan.value, status: "error", message: error.message || "An unexpected error occurred." },
        },
      }));
      toast({
        variant: "destructive",
        title: "Owner PAN Verification Error",
        description: error.message || "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsVerifyingOwnerPan(false);
    }
  };

  const handleVerifyBusinessPan = async () => {
    setIsVerifyingBusinessPan(true);
    try {
      const panNumber = verificationState.pan.businessPan.value;
      const result = await verifyPan(panNumber);

      if (result.success) {
        setVerificationState(prevState => ({
          ...prevState,
          pan: {
            ...prevState.pan,
            businessPan: { value: panNumber, status: "success", message: result.message || "Business PAN verified successfully." },
          },
        }));
        toast({
          title: "Business PAN Verified",
          description: result.message || "Business PAN has been successfully verified.",
        });
      } else {
        setVerificationState(prevState => ({
          ...prevState,
          pan: {
            ...prevState.pan,
            businessPan: { value: panNumber, status: "error", message: result.message || "Failed to verify Business PAN." },
          },
        }));
        toast({
          variant: "destructive",
          title: "Business PAN Verification Failed",
          description: result.message || "Failed to verify Business PAN. Please try again.",
        });
      }
    } catch (error: any) {
      setVerificationState(prevState => ({
        ...prevState,
        pan: {
          ...prevState.pan,
          businessPan: { value: verificationState.pan.businessPan.value, status: "error", message: error.message || "An unexpected error occurred." },
        },
      }));
      toast({
        variant: "destructive",
        title: "Business PAN Verification Error",
        description: error.message || "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsVerifyingBusinessPan(false);
    }
  };

  const handleCinChange = (value: string) => {
    setVerificationState(prevState => ({
      ...prevState,
      company: {
        ...prevState.company,
        cin: { value: value, status: "idle", message: "" },
      },
    }));
  };

  const handleDinChange = (value: string) => {
    setVerificationState(prevState => ({
      ...prevState,
      company: {
        ...prevState.company,
        din: { value: value, status: "idle", message: "" },
      },
    }));
  };

  const handleVerifyCin = async () => {
    setIsVerifyingCin(true);
    try {
      const cinNumber = verificationState.company.cin.value;
      const result = await verifyCin(cinNumber);

      if (result.success) {
        setVerificationState(prevState => ({
          ...prevState,
          company: {
            ...prevState.company,
            cin: { value: cinNumber, status: "success", message: result.message || "CIN verified successfully." },
          },
        }));
        toast({
          title: "CIN Verified",
          description: result.message || "CIN has been successfully verified.",
        });
      } else {
        setVerificationState(prevState => ({
          ...prevState,
          company: {
            ...prevState.company,
            cin: { value: cinNumber, status: "error", message: result.message || "Failed to verify CIN." },
          },
        }));
        toast({
          variant: "destructive",
          title: "CIN Verification Failed",
          description: result.message || "Failed to verify CIN. Please try again.",
        });
      }
    } catch (error: any) {
      setVerificationState(prevState => ({
        ...prevState,
        company: {
          ...prevState.company,
          cin: { value: verificationState.company.cin.value, status: "error", message: error.message || "An unexpected error occurred." },
        },
      }));
      toast({
        variant: "destructive",
        title: "CIN Verification Error",
        description: error.message || "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsVerifyingCin(false);
    }
  };

  const handleVerifyDin = async () => {
    setIsVerifyingDin(true);
    try {
      const dinNumber = verificationState.company.din.value;
      const result = await verifyDin(dinNumber);

      if (result.success) {
        setVerificationState(prevState => ({
          ...prevState,
          company: {
            ...prevState.company,
            din: { value: dinNumber, status: "success", message: result.message || "DIN verified successfully." },
          },
        }));
        toast({
          title: "DIN Verified",
          description: result.message || "DIN has been successfully verified.",
        });
      } else {
        setVerificationState(prevState => ({
          ...prevState,
          company: {
            ...prevState.company,
            din: { value: dinNumber, status: "error", message: result.message || "Failed to verify DIN." },
          },
        }));
        toast({
          variant: "destructive",
          title: "DIN Verification Failed",
          description: result.message || "Failed to verify DIN. Please try again.",
        });
      }
    } catch (error: any) {
      setVerificationState(prevState => ({
        ...prevState,
        company: {
          ...prevState.company,
          din: { value: verificationState.company.din.value, status: "error", message: error.message || "An unexpected error occurred." },
        },
      }));
      toast({
        variant: "destructive",
        title: "DIN Verification Error",
        description: error.message || "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsVerifyingDin(false);
    }
  };

  const handleGstinChange = (value: string) => {
    setVerificationState(prevState => ({
      ...prevState,
      gstin: {
        gstin: { value: value, status: "idle", message: "" },
      },
    }));
  };

  const handleVerifyGstin = async () => {
    setIsVerifyingGstin(true);
    try {
      const gstinNumber = verificationState.gstin.gstin.value;
      const result = await verifyGstin(gstinNumber);

      if (result.success) {
        setVerificationState(prevState => ({
          ...prevState,
          gstin: {
            gstin: { value: gstinNumber, status: "success", message: result.message || "GSTIN verified successfully." },
          },
        }));
        toast({
          title: "GSTIN Verified",
          description: result.message || "GSTIN has been successfully verified.",
        });
      } else {
        setVerificationState(prevState => ({
          ...prevState,
          gstin: {
            gstin: { value: gstinNumber, status: "error", message: result.message || "Failed to verify GSTIN." },
          },
        }));
        toast({
          variant: "destructive",
          title: "GSTIN Verification Failed",
          description: result.message || "Failed to verify GSTIN. Please try again.",
        });
      }
    } catch (error: any) {
      setVerificationState(prevState => ({
        ...prevState,
        gstin: {
          gstin: { value: verificationState.gstin.gstin.value, status: "error", message: error.message || "An unexpected error occurred." },
        },
      }));
      toast({
        variant: "destructive",
        title: "GSTIN Verification Error",
        description: error.message || "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsVerifyingGstin(false);
    }
  };

  const handleAccountNumberChange = (value: string) => {
    setVerificationState(prevState => ({
      ...prevState,
      bank: {
        ...prevState.bank,
        accountNumber: { value: value, status: "idle", message: "" },
      },
    }));
  };

  const handleIfscChange = (value: string) => {
    setVerificationState(prevState => ({
      ...prevState,
      bank: {
        ...prevState.bank,
        ifsc: { value: value, status: "idle", message: "" },
      },
    }));
  };

  const handleVerifyBankAccount = async () => {
    setIsVerifyingBank(true);
    try {
      const accountNumber = verificationState.bank.accountNumber.value;
      const ifscCode = verificationState.bank.ifsc.value;
      const result = await verifyBankAccount(accountNumber, ifscCode);

      if (result.success) {
        setVerificationState(prevState => ({
          ...prevState,
          bank: {
            ...prevState.bank,
            accountNumber: { value: accountNumber, status: "success", message: result.message || "Bank account verified successfully." },
            ifsc: { value: ifscCode, status: "success", message: result.message || "IFSC code verified successfully." },
          },
        }));
        toast({
          title: "Bank Account Verified",
          description: result.message || "Bank account has been successfully verified.",
        });
      } else {
        setVerificationState(prevState => ({
          ...prevState,
          bank: {
            ...prevState.bank,
            accountNumber: { value: accountNumber, status: "error", message: result.message || "Failed to verify bank account." },
            ifsc: { value: ifscCode, status: "error", message: result.message || "Failed to verify IFSC code." },
          },
        }));
        toast({
          variant: "destructive",
          title: "Bank Account Verification Failed",
          description: result.message || "Failed to verify bank account. Please try again.",
        });
      }
    } catch (error: any) {
      setVerificationState(prevState => ({
        ...prevState,
        bank: {
          ...prevState.bank,
          accountNumber: { value: verificationState.bank.accountNumber.value, status: "error", message: error.message || "An unexpected error occurred." },
          ifsc: { value: verificationState.bank.ifsc.value, status: "error", message: error.message || "An unexpected error occurred." },
        },
      }));
      toast({
        variant: "destructive",
        title: "Bank Account Verification Error",
        description: error.message || "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsVerifyingBank(false);
    }
  };

  useEffect(() => {
    const allVerificationsSuccessful =
      verificationState.aadhaar.otpDetails.status === "success" &&
      verificationState.pan.ownerPan.status === "success" &&
      verificationState.pan.businessPan.status === "success" &&
      verificationState.company.cin.status === "success" &&
      verificationState.company.din.status === "success" &&
      verificationState.gstin.gstin.status === "success" &&
      verificationState.bank.accountNumber.status === "success" &&
      verificationState.bank.ifsc.status === "success";

    if (allVerificationsSuccessful && !verificationState.isFullyVerified) {
      toast({
        title: "Verification Complete",
        description: "All identity verification checks have been successfully completed.",
      });
    }

    setVerificationState(prevState => ({
      ...prevState,
      isFullyVerified: allVerificationsSuccessful,
    }));
  }, [verificationState]);

  if (verificationState.isFullyVerified) {
    return (
      <Container className="py-12">
        <VerificationSuccessMessage />
      </Container>
    );
  }

  return (
    <Container className="py-12">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <VerificationStatusComponent state={verificationState} />
        <AadhaarVerificationSection
          data={verificationState.aadhaar}
          onAadhaarChange={handleAadhaarChange}
          onOtpChange={handleOtpChange}
          onGenerateOtp={handleGenerateOtp}
          onVerifyOtp={handleVerifyOtp}
          isGeneratingOtp={isGeneratingAadhaarOtp}
          isVerifyingOtp={isVerifyingAadhaarOtp}
        />
        <PanVerificationSection
          data={verificationState.pan}
          onOwnerPanChange={handleOwnerPanChange}
          onBusinessPanChange={handleBusinessPanChange}
          onVerifyOwnerPan={handleVerifyOwnerPan}
          onVerifyBusinessPan={handleVerifyBusinessPan}
          isVerifyingOwnerPan={isVerifyingOwnerPan}
          isVerifyingBusinessPan={isVerifyingBusinessPan}
        />
        <CompanyVerificationSection
          data={verificationState.company}
          onCinChange={handleCinChange}
          onDinChange={handleDinChange}
          onVerifyCin={handleVerifyCin}
          onVerifyDin={handleVerifyDin}
          isVerifyingCin={isVerifyingCin}
          isVerifyingDin={isVerifyingDin}
        />
        <GstinVerificationSection
          data={verificationState.gstin}
          onGstinChange={handleGstinChange}
          onVerifyGstin={handleVerifyGstin}
          isVerifyingGstin={isVerifyingGstin}
        />
        <BankVerificationSection
          data={verificationState.bank}
          onAccountNumberChange={handleAccountNumberChange}
          onIfscChange={handleIfscChange}
          onVerifyBankAccount={handleVerifyBankAccount}
          isVerifyingBank={isVerifyingBank}
        />
      </div>
    </Container>
  );
};

export default KYCVerification;
