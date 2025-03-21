
import React, { useState, useEffect } from "react";
import { toast } from "@/components/ui/sonner";
import { 
  VerificationState, 
  VerificationStatus as Status,
  VerificationField 
} from "@/types/verification";
import AadhaarVerificationSection from "@/components/AadhaarVerificationSection";
import PanVerificationSection from "@/components/PanVerificationSection";
import CompanyVerificationSection from "@/components/CompanyVerificationSection";
import GstinVerificationSection from "@/components/GstinVerificationSection";
import BankVerificationSection from "@/components/BankVerificationSection";
import VerificationStatus from "@/components/VerificationStatus";
import {
  generateAadhaarOtp,
  verifyAadhaarWithOtp,
  verifyPan,
  verifyCin,
  verifyDin,
  verifyGstin,
  verifyBankAccount
} from "@/services/verificationService";
import { CheckCircle2, CircleX } from "lucide-react";

// Helper function to create a verification field
const createField = (value = '', status: Status = 'idle', message = ''): VerificationField => ({
  value,
  status,
  message
});

const KYCVerification = () => {
  // Loading states
  const [isGeneratingOtp, setIsGeneratingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isVerifyingOwnerPan, setIsVerifyingOwnerPan] = useState(false);
  const [isVerifyingBusinessPan, setIsVerifyingBusinessPan] = useState(false);
  const [isVerifyingCin, setIsVerifyingCin] = useState(false);
  const [isVerifyingDin, setIsVerifyingDin] = useState(false);
  const [isVerifyingGstin, setIsVerifyingGstin] = useState(false);
  const [isVerifyingBank, setIsVerifyingBank] = useState(false);

  // Initialize verification state
  const [verificationState, setVerificationState] = useState<VerificationState>({
    aadhaar: {
      aadhaar: createField(),
      otpDetails: {
        otp: '',
        status: 'idle',
        value: '',
      },
      isOtpRequested: false
    },
    pan: {
      ownerPan: createField(),
      businessPan: createField()
    },
    company: {
      cin: createField(),
      din: createField()
    },
    gstin: {
      gstin: createField()
    },
    bank: {
      accountNumber: createField(),
      ifsc: createField()
    },
    isFullyVerified: false
  });

  // Check if fully verified whenever verification state changes
  useEffect(() => {
    const isAadhaarVerified = verificationState.aadhaar.otpDetails.status === 'success';
    const isPanVerified = 
      verificationState.pan.ownerPan.status === 'success' && 
      verificationState.pan.businessPan.status === 'success';
    const isCompanyVerified = 
      verificationState.company.cin.status === 'success' && 
      verificationState.company.din.status === 'success';
    const isGstinVerified = verificationState.gstin.gstin.status === 'success';
    const isBankVerified = 
      verificationState.bank.accountNumber.status === 'success' && 
      verificationState.bank.ifsc.status === 'success';
    
    const fullyVerified = 
      isAadhaarVerified && 
      isPanVerified && 
      isCompanyVerified && 
      isGstinVerified && 
      isBankVerified;
    
    if (fullyVerified !== verificationState.isFullyVerified) {
      setVerificationState(prev => ({
        ...prev,
        isFullyVerified: fullyVerified
      }));
      
      if (fullyVerified) {
        toast("Verification Complete", {
          description: "All verification checks have been successfully completed.",
          icon: <CheckCircle2 className="h-5 w-5 text-success" />,
        });
      }
    }
  }, [verificationState]);

  // Aadhaar handlers
  const handleAadhaarChange = (value: string) => {
    setVerificationState(prev => ({
      ...prev,
      aadhaar: {
        ...prev.aadhaar,
        aadhaar: {
          ...prev.aadhaar.aadhaar,
          value,
          status: 'idle',
          message: ''
        },
        isOtpRequested: prev.aadhaar.isOtpRequested && value === prev.aadhaar.aadhaar.value
      }
    }));
  };

  const handleGenerateOtp = async () => {
    const aadhaarNumber = verificationState.aadhaar.aadhaar.value;
    
    // Basic validation
    if (!/^\d{12}$/.test(aadhaarNumber)) {
      setVerificationState(prev => ({
        ...prev,
        aadhaar: {
          ...prev.aadhaar,
          aadhaar: {
            ...prev.aadhaar.aadhaar,
            status: 'error',
            message: 'Please enter a valid 12-digit Aadhaar number'
          }
        }
      }));
      return;
    }
    
    // Update state to show loading
    setVerificationState(prev => ({
      ...prev,
      aadhaar: {
        ...prev.aadhaar,
        aadhaar: {
          ...prev.aadhaar.aadhaar,
          status: 'pending',
          message: 'Generating OTP...'
        }
      }
    }));
    
    setIsGeneratingOtp(true);
    
    try {
      // Call API to generate OTP
      const response = await generateAadhaarOtp(aadhaarNumber);
      
      if (response.success) {
        setVerificationState(prev => ({
          ...prev,
          aadhaar: {
            ...prev.aadhaar,
            aadhaar: {
              ...prev.aadhaar.aadhaar,
              status: 'success',
              message: 'OTP sent successfully'
            },
            isOtpRequested: true,
            otpDetails: {
              ...prev.aadhaar.otpDetails,
              txnId: response.data?.txnId,
              status: 'idle',
              message: ''
            }
          }
        }));
        
        toast("OTP Sent", {
          description: "An OTP has been sent for Aadhaar verification.",
        });
      } else {
        setVerificationState(prev => ({
          ...prev,
          aadhaar: {
            ...prev.aadhaar,
            aadhaar: {
              ...prev.aadhaar.aadhaar,
              status: 'error',
              message: response.error || 'Failed to generate OTP'
            }
          }
        }));
        
        toast("OTP Generation Failed", {
          description: response.error || "Failed to generate OTP. Please try again.",
          icon: <CircleX className="h-5 w-5 text-destructive" />,
        });
      }
    } catch (error) {
      setVerificationState(prev => ({
        ...prev,
        aadhaar: {
          ...prev.aadhaar,
          aadhaar: {
            ...prev.aadhaar.aadhaar,
            status: 'error',
            message: 'An error occurred while generating OTP'
          }
        }
      }));
      
      toast("Error", {
        description: "An error occurred while generating OTP. Please try again.",
        icon: <CircleX className="h-5 w-5 text-destructive" />,
      });
    } finally {
      setIsGeneratingOtp(false);
    }
  };

  const handleOtpChange = (value: string) => {
    setVerificationState(prev => ({
      ...prev,
      aadhaar: {
        ...prev.aadhaar,
        otpDetails: {
          ...prev.aadhaar.otpDetails,
          otp: value,
          status: value === prev.aadhaar.otpDetails.otp ? prev.aadhaar.otpDetails.status : 'idle',
          message: value === prev.aadhaar.otpDetails.otp ? prev.aadhaar.otpDetails.message : ''
        }
      }
    }));
  };

  const handleVerifyOtp = async () => {
    const { aadhaar, otpDetails } = verificationState.aadhaar;
    
    // Update state to show loading
    setVerificationState(prev => ({
      ...prev,
      aadhaar: {
        ...prev.aadhaar,
        otpDetails: {
          ...prev.aadhaar.otpDetails,
          status: 'pending',
          message: 'Verifying OTP...'
        }
      }
    }));
    
    setIsVerifyingOtp(true);
    
    try {
      // Call API to verify OTP
      const response = await verifyAadhaarWithOtp(
        aadhaar.value,
        otpDetails.otp,
        otpDetails.txnId || ''
      );
      
      if (response.success) {
        setVerificationState(prev => ({
          ...prev,
          aadhaar: {
            ...prev.aadhaar,
            otpDetails: {
              ...prev.aadhaar.otpDetails,
              status: 'success',
              message: 'Aadhaar verified successfully'
            }
          }
        }));
        
        toast("Aadhaar Verified", {
          description: "Your Aadhaar has been successfully verified.",
          icon: <CheckCircle2 className="h-5 w-5 text-success" />,
        });
      } else {
        setVerificationState(prev => ({
          ...prev,
          aadhaar: {
            ...prev.aadhaar,
            otpDetails: {
              ...prev.aadhaar.otpDetails,
              status: 'error',
              message: response.error || 'Invalid OTP'
            }
          }
        }));
        
        toast("Verification Failed", {
          description: response.error || "OTP verification failed. Please try again.",
          icon: <CircleX className="h-5 w-5 text-destructive" />,
        });
      }
    } catch (error) {
      setVerificationState(prev => ({
        ...prev,
        aadhaar: {
          ...prev.aadhaar,
          otpDetails: {
            ...prev.aadhaar.otpDetails,
            status: 'error',
            message: 'An error occurred while verifying OTP'
          }
        }
      }));
      
      toast("Error", {
        description: "An error occurred while verifying OTP. Please try again.",
        icon: <CircleX className="h-5 w-5 text-destructive" />,
      });
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // PAN handlers
  const handleOwnerPanChange = (value: string) => {
    setVerificationState(prev => ({
      ...prev,
      pan: {
        ...prev.pan,
        ownerPan: {
          value,
          status: 'idle',
          message: ''
        }
      }
    }));
  };

  const handleBusinessPanChange = (value: string) => {
    setVerificationState(prev => ({
      ...prev,
      pan: {
        ...prev.pan,
        businessPan: {
          value,
          status: 'idle',
          message: ''
        }
      }
    }));
  };

  const handleVerifyOwnerPan = async () => {
    const panNumber = verificationState.pan.ownerPan.value;
    
    // Basic validation
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panNumber)) {
      setVerificationState(prev => ({
        ...prev,
        pan: {
          ...prev.pan,
          ownerPan: {
            ...prev.pan.ownerPan,
            status: 'error',
            message: 'Please enter a valid PAN number'
          }
        }
      }));
      return;
    }
    
    // Update state to show loading
    setVerificationState(prev => ({
      ...prev,
      pan: {
        ...prev.pan,
        ownerPan: {
          ...prev.pan.ownerPan,
          status: 'pending',
          message: 'Verifying PAN...'
        }
      }
    }));
    
    setIsVerifyingOwnerPan(true);
    
    try {
      // Call API to verify PAN
      const response = await verifyPan(panNumber);
      
      if (response.success) {
        setVerificationState(prev => ({
          ...prev,
          pan: {
            ...prev.pan,
            ownerPan: {
              ...prev.pan.ownerPan,
              status: 'success',
              message: 'PAN verified successfully'
            }
          }
        }));
        
        toast("PAN Verified", {
          description: "Owner's PAN has been successfully verified.",
          icon: <CheckCircle2 className="h-5 w-5 text-success" />,
        });
      } else {
        setVerificationState(prev => ({
          ...prev,
          pan: {
            ...prev.pan,
            ownerPan: {
              ...prev.pan.ownerPan,
              status: 'error',
              message: response.error || 'Invalid PAN'
            }
          }
        }));
        
        toast("Verification Failed", {
          description: response.error || "PAN verification failed. Please check and try again.",
          icon: <CircleX className="h-5 w-5 text-destructive" />,
        });
      }
    } catch (error) {
      setVerificationState(prev => ({
        ...prev,
        pan: {
          ...prev.pan,
          ownerPan: {
            ...prev.pan.ownerPan,
            status: 'error',
            message: 'An error occurred while verifying PAN'
          }
        }
      }));
      
      toast("Error", {
        description: "An error occurred while verifying PAN. Please try again.",
        icon: <CircleX className="h-5 w-5 text-destructive" />,
      });
    } finally {
      setIsVerifyingOwnerPan(false);
    }
  };

  const handleVerifyBusinessPan = async () => {
    const panNumber = verificationState.pan.businessPan.value;
    
    // Basic validation
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panNumber)) {
      setVerificationState(prev => ({
        ...prev,
        pan: {
          ...prev.pan,
          businessPan: {
            ...prev.pan.businessPan,
            status: 'error',
            message: 'Please enter a valid PAN number'
          }
        }
      }));
      return;
    }
    
    // Update state to show loading
    setVerificationState(prev => ({
      ...prev,
      pan: {
        ...prev.pan,
        businessPan: {
          ...prev.pan.businessPan,
          status: 'pending',
          message: 'Verifying PAN...'
        }
      }
    }));
    
    setIsVerifyingBusinessPan(true);
    
    try {
      // Call API to verify PAN
      const response = await verifyPan(panNumber);
      
      if (response.success) {
        setVerificationState(prev => ({
          ...prev,
          pan: {
            ...prev.pan,
            businessPan: {
              ...prev.pan.businessPan,
              status: 'success',
              message: 'Business PAN verified successfully'
            }
          }
        }));
        
        toast("PAN Verified", {
          description: "Business PAN has been successfully verified.",
          icon: <CheckCircle2 className="h-5 w-5 text-success" />,
        });
      } else {
        setVerificationState(prev => ({
          ...prev,
          pan: {
            ...prev.pan,
            businessPan: {
              ...prev.pan.businessPan,
              status: 'error',
              message: response.error || 'Invalid PAN'
            }
          }
        }));
        
        toast("Verification Failed", {
          description: response.error || "Business PAN verification failed. Please check and try again.",
          icon: <CircleX className="h-5 w-5 text-destructive" />,
        });
      }
    } catch (error) {
      setVerificationState(prev => ({
        ...prev,
        pan: {
          ...prev.pan,
          businessPan: {
            ...prev.pan.businessPan,
            status: 'error',
            message: 'An error occurred while verifying PAN'
          }
        }
      }));
      
      toast("Error", {
        description: "An error occurred while verifying Business PAN. Please try again.",
        icon: <CircleX className="h-5 w-5 text-destructive" />,
      });
    } finally {
      setIsVerifyingBusinessPan(false);
    }
  };

  // CIN handlers
  const handleCinChange = (value: string) => {
    setVerificationState(prev => ({
      ...prev,
      company: {
        ...prev.company,
        cin: {
          value,
          status: 'idle',
          message: ''
        }
      }
    }));
  };

  const handleVerifyCin = async () => {
    const cinNumber = verificationState.company.cin.value;
    
    // Basic validation
    if (!/^[A-Z]{1}[0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/.test(cinNumber)) {
      setVerificationState(prev => ({
        ...prev,
        company: {
          ...prev.company,
          cin: {
            ...prev.company.cin,
            status: 'error',
            message: 'Please enter a valid CIN number'
          }
        }
      }));
      return;
    }
    
    // Update state to show loading
    setVerificationState(prev => ({
      ...prev,
      company: {
        ...prev.company,
        cin: {
          ...prev.company.cin,
          status: 'pending',
          message: 'Verifying CIN...'
        }
      }
    }));
    
    setIsVerifyingCin(true);
    
    try {
      // Call API to verify CIN
      const response = await verifyCin(cinNumber);
      
      if (response.success) {
        setVerificationState(prev => ({
          ...prev,
          company: {
            ...prev.company,
            cin: {
              ...prev.company.cin,
              status: 'success',
              message: 'CIN verified successfully'
            }
          }
        }));
        
        toast("CIN Verified", {
          description: "Company Identification Number has been successfully verified.",
          icon: <CheckCircle2 className="h-5 w-5 text-success" />,
        });
      } else {
        setVerificationState(prev => ({
          ...prev,
          company: {
            ...prev.company,
            cin: {
              ...prev.company.cin,
              status: 'error',
              message: response.error || 'Invalid CIN'
            }
          }
        }));
        
        toast("Verification Failed", {
          description: response.error || "CIN verification failed. Please check and try again.",
          icon: <CircleX className="h-5 w-5 text-destructive" />,
        });
      }
    } catch (error) {
      setVerificationState(prev => ({
        ...prev,
        company: {
          ...prev.company,
          cin: {
            ...prev.company.cin,
            status: 'error',
            message: 'An error occurred while verifying CIN'
          }
        }
      }));
      
      toast("Error", {
        description: "An error occurred while verifying CIN. Please try again.",
        icon: <CircleX className="h-5 w-5 text-destructive" />,
      });
    } finally {
      setIsVerifyingCin(false);
    }
  };

  // DIN handlers
  const handleDinChange = (value: string) => {
    setVerificationState(prev => ({
      ...prev,
      company: {
        ...prev.company,
        din: {
          value,
          status: 'idle',
          message: ''
        }
      }
    }));
  };

  const handleVerifyDin = async () => {
    const dinNumber = verificationState.company.din.value;
    
    // Basic validation
    if (!/^[0-9]{8}$/.test(dinNumber)) {
      setVerificationState(prev => ({
        ...prev,
        company: {
          ...prev.company,
          din: {
            ...prev.company.din,
            status: 'error',
            message: 'Please enter a valid 8-digit DIN number'
          }
        }
      }));
      return;
    }
    
    // Update state to show loading
    setVerificationState(prev => ({
      ...prev,
      company: {
        ...prev.company,
        din: {
          ...prev.company.din,
          status: 'pending',
          message: 'Verifying DIN...'
        }
      }
    }));
    
    setIsVerifyingDin(true);
    
    try {
      // Call API to verify DIN
      const response = await verifyDin(dinNumber);
      
      if (response.success) {
        setVerificationState(prev => ({
          ...prev,
          company: {
            ...prev.company,
            din: {
              ...prev.company.din,
              status: 'success',
              message: 'DIN verified successfully'
            }
          }
        }));
        
        toast("DIN Verified", {
          description: "Director Identification Number has been successfully verified.",
          icon: <CheckCircle2 className="h-5 w-5 text-success" />,
        });
      } else {
        setVerificationState(prev => ({
          ...prev,
          company: {
            ...prev.company,
            din: {
              ...prev.company.din,
              status: 'error',
              message: response.error || 'Invalid DIN'
            }
          }
        }));
        
        toast("Verification Failed", {
          description: response.error || "DIN verification failed. Please check and try again.",
          icon: <CircleX className="h-5 w-5 text-destructive" />,
        });
      }
    } catch (error) {
      setVerificationState(prev => ({
        ...prev,
        company: {
          ...prev.company,
          din: {
            ...prev.company.din,
            status: 'error',
            message: 'An error occurred while verifying DIN'
          }
        }
      }));
      
      toast("Error", {
        description: "An error occurred while verifying DIN. Please try again.",
        icon: <CircleX className="h-5 w-5 text-destructive" />,
      });
    } finally {
      setIsVerifyingDin(false);
    }
  };

  // GSTIN handlers
  const handleGstinChange = (value: string) => {
    setVerificationState(prev => ({
      ...prev,
      gstin: {
        ...prev.gstin,
        gstin: {
          value,
          status: 'idle',
          message: ''
        }
      }
    }));
  };

  const handleVerifyGstin = async () => {
    const gstinNumber = verificationState.gstin.gstin.value;
    
    // Basic validation
    if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/.test(gstinNumber)) {
      setVerificationState(prev => ({
        ...prev,
        gstin: {
          ...prev.gstin,
          gstin: {
            ...prev.gstin.gstin,
            status: 'error',
            message: 'Please enter a valid GSTIN number'
          }
        }
      }));
      return;
    }
    
    // Update state to show loading
    setVerificationState(prev => ({
      ...prev,
      gstin: {
        ...prev.gstin,
        gstin: {
          ...prev.gstin.gstin,
          status: 'pending',
          message: 'Verifying GSTIN...'
        }
      }
    }));
    
    setIsVerifyingGstin(true);
    
    try {
      // Call API to verify GSTIN
      const response = await verifyGstin(gstinNumber);
      
      if (response.success) {
        setVerificationState(prev => ({
          ...prev,
          gstin: {
            ...prev.gstin,
            gstin: {
              ...prev.gstin.gstin,
              status: 'success',
              message: 'GSTIN verified successfully'
            }
          }
        }));
        
        toast("GSTIN Verified", {
          description: "GSTIN has been successfully verified.",
          icon: <CheckCircle2 className="h-5 w-5 text-success" />,
        });
      } else {
        setVerificationState(prev => ({
          ...prev,
          gstin: {
            ...prev.gstin,
            gstin: {
              ...prev.gstin.gstin,
              status: 'error',
              message: response.error || 'Invalid GSTIN'
            }
          }
        }));
        
        toast("Verification Failed", {
          description: response.error || "GSTIN verification failed. Please check and try again.",
          icon: <CircleX className="h-5 w-5 text-destructive" />,
        });
      }
    } catch (error) {
      setVerificationState(prev => ({
        ...prev,
        gstin: {
          ...prev.gstin,
          gstin: {
            ...prev.gstin.gstin,
            status: 'error',
            message: 'An error occurred while verifying GSTIN'
          }
        }
      }));
      
      toast("Error", {
        description: "An error occurred while verifying GSTIN. Please try again.",
        icon: <CircleX className="h-5 w-5 text-destructive" />,
      });
    } finally {
      setIsVerifyingGstin(false);
    }
  };

  // Bank account handlers
  const handleAccountNumberChange = (value: string) => {
    setVerificationState(prev => ({
      ...prev,
      bank: {
        ...prev.bank,
        accountNumber: {
          value,
          status: 'idle',
          message: ''
        }
      }
    }));
  };

  const handleIfscChange = (value: string) => {
    setVerificationState(prev => ({
      ...prev,
      bank: {
        ...prev.bank,
        ifsc: {
          value,
          status: 'idle',
          message: ''
        }
      }
    }));
  };

  const handleVerifyBankAccount = async () => {
    const accountNumber = verificationState.bank.accountNumber.value;
    const ifsc = verificationState.bank.ifsc.value;
    
    // Basic validation
    if (accountNumber.length < 9 || accountNumber.length > 18) {
      setVerificationState(prev => ({
        ...prev,
        bank: {
          ...prev.bank,
          accountNumber: {
            ...prev.bank.accountNumber,
            status: 'error',
            message: 'Please enter a valid account number'
          }
        }
      }));
      return;
    }
    
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc)) {
      setVerificationState(prev => ({
        ...prev,
        bank: {
          ...prev.bank,
          ifsc: {
            ...prev.bank.ifsc,
            status: 'error',
            message: 'Please enter a valid IFSC code'
          }
        }
      }));
      return;
    }
    
    // Update state to show loading
    setVerificationState(prev => ({
      ...prev,
      bank: {
        ...prev.bank,
        accountNumber: {
          ...prev.bank.accountNumber,
          status: 'pending',
          message: 'Verifying account...'
        },
        ifsc: {
          ...prev.bank.ifsc,
          status: 'pending',
          message: 'Verifying IFSC...'
        }
      }
    }));
    
    setIsVerifyingBank(true);
    
    try {
      // Call API to verify bank account
      const response = await verifyBankAccount(accountNumber, ifsc);
      
      if (response.success) {
        setVerificationState(prev => ({
          ...prev,
          bank: {
            ...prev.bank,
            accountNumber: {
              ...prev.bank.accountNumber,
              status: 'success',
              message: 'Account verified successfully'
            },
            ifsc: {
              ...prev.bank.ifsc,
              status: 'success',
              message: 'IFSC verified successfully'
            }
          }
        }));
        
        toast("Bank Account Verified", {
          description: "Bank account details have been successfully verified.",
          icon: <CheckCircle2 className="h-5 w-5 text-success" />,
        });
      } else {
        const errorMessage = response.error || 'Bank verification failed';
        
        setVerificationState(prev => ({
          ...prev,
          bank: {
            ...prev.bank,
            accountNumber: {
              ...prev.bank.accountNumber,
              status: 'error',
              message: errorMessage
            },
            ifsc: {
              ...prev.bank.ifsc,
              status: 'error',
              message: errorMessage
            }
          }
        }));
        
        toast("Verification Failed", {
          description: errorMessage,
          icon: <CircleX className="h-5 w-5 text-destructive" />,
        });
      }
    } catch (error) {
      const errorMessage = 'An error occurred while verifying bank account';
      
      setVerificationState(prev => ({
        ...prev,
        bank: {
          ...prev.bank,
          accountNumber: {
            ...prev.bank.accountNumber,
            status: 'error',
            message: errorMessage
          },
          ifsc: {
            ...prev.bank.ifsc,
            status: 'error',
            message: errorMessage
          }
        }
      }));
      
      toast("Error", {
        description: errorMessage,
        icon: <CircleX className="h-5 w-5 text-destructive" />,
      });
    } finally {
      setIsVerifyingBank(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 pb-16">
      <div className="container max-w-4xl px-4 sm:px-6">
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-block p-3 rounded-full bg-primary/10 text-primary mb-4">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            KYC Verification
          </h1>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Complete the verification process by validating your identity and business details. All fields are securely verified using government databases.
          </p>
        </div>

        <div className="mb-8">
          <VerificationStatus state={verificationState} />
        </div>

        <div className="space-y-6">
          <AadhaarVerificationSection
            data={verificationState.aadhaar}
            onAadhaarChange={handleAadhaarChange}
            onOtpChange={handleOtpChange}
            onGenerateOtp={handleGenerateOtp}
            onVerifyOtp={handleVerifyOtp}
            isGeneratingOtp={isGeneratingOtp}
            isVerifyingOtp={isVerifyingOtp}
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
        
        {verificationState.isFullyVerified && (
          <div className="mt-8 text-center animate-slide-up">
            <div className="bg-success/10 text-success py-6 px-4 rounded-lg border border-success/20">
              <CheckCircle2 className="h-12 w-12 mx-auto mb-2" />
              <h2 className="text-2xl font-bold">Person Validated</h2>
              <p className="mt-2">All verification checks have been successfully completed.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KYCVerification;
