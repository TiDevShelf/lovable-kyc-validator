
import { 
  AadhaarOtpResponse, 
  AadhaarVerifyResponse,
  PanVerifyResponse,
  CinVerifyResponse,
  DinVerifyResponse,
  GstinVerifyResponse,
  BankVerifyResponse
} from "@/types/verification";

const API_BASE_URL = "https://api.gridlines.io";
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'API request failed');
  }
  return await response.json() as T;
};

// Mock implementation for Aadhaar OTP generation
export const generateAadhaarOtp = async (aadhaarNumber: string): Promise<AadhaarOtpResponse> => {
  console.log(`Generating OTP for Aadhaar: ${aadhaarNumber}`);
  
  try {
    // In a real implementation, this would be a real API call
    // const response = await fetch(`${API_BASE_URL}/aadhaar-api/boson/generate-otp`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ aadhaarNumber })
    // });
    // return handleResponse<AadhaarOtpResponse>(response);
    
    // For demo purposes, simulating API response
    return {
      success: true,
      message: "OTP sent successfully",
      data: {
        txnId: "mock-txn-" + Math.random().toString(36).substring(2, 8)
      }
    };
  } catch (error) {
    console.error("Error generating Aadhaar OTP:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate OTP"
    };
  }
};

// Mock implementation for Aadhaar verification with OTP
export const verifyAadhaarWithOtp = async (
  aadhaarNumber: string, 
  otp: string, 
  txnId: string
): Promise<AadhaarVerifyResponse> => {
  console.log(`Verifying Aadhaar: ${aadhaarNumber} with OTP: ${otp}, txnId: ${txnId}`);
  
  try {
    // In a real implementation, this would be a real API call
    // const response = await fetch(`${API_BASE_URL}/aadhaar-api/boson/verify-otp`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ aadhaarNumber, otp, txnId })
    // });
    // return handleResponse<AadhaarVerifyResponse>(response);
    
    // Mock verification logic for demo
    if (otp === "123456" || otp === "000000") {
      return {
        success: true,
        message: "Aadhaar verified successfully",
        data: {
          name: "John Doe",
          gender: "M",
          dob: "1990-01-01",
          address: "123 Main St, Bangalore, Karnataka"
        }
      };
    } else {
      return {
        success: false,
        error: "Invalid OTP"
      };
    }
  } catch (error) {
    console.error("Error verifying Aadhaar:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to verify Aadhaar"
    };
  }
};

// Mock implementation for PAN verification (used for both owner and business PAN)
export const verifyPan = async (panNumber: string): Promise<PanVerifyResponse> => {
  console.log(`Verifying PAN: ${panNumber}`);
  
  try {
    // Mock verification for demo
    const isValid = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panNumber);
    
    if (isValid) {
      return {
        success: true,
        message: "PAN verified successfully",
        data: {
          name: "John Doe",
          panNumber: panNumber,
          panStatus: "Active"
        }
      };
    } else {
      return {
        success: false,
        error: "Invalid PAN format"
      };
    }
  } catch (error) {
    console.error("Error verifying PAN:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to verify PAN"
    };
  }
};

// Mock implementation for CIN verification
export const verifyCin = async (cinNumber: string): Promise<CinVerifyResponse> => {
  console.log(`Verifying CIN: ${cinNumber}`);
  
  try {
    // Mock verification for demo
    const isValid = /^[A-Z]{1}[0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/.test(cinNumber);
    
    if (isValid) {
      return {
        success: true,
        message: "CIN verified successfully",
        data: {
          companyName: "ABC Corporation",
          registrationNumber: cinNumber,
          status: "Active"
        }
      };
    } else {
      return {
        success: false,
        error: "Invalid CIN format"
      };
    }
  } catch (error) {
    console.error("Error verifying CIN:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to verify CIN"
    };
  }
};

// Mock implementation for DIN verification
export const verifyDin = async (dinNumber: string): Promise<DinVerifyResponse> => {
  console.log(`Verifying DIN: ${dinNumber}`);
  
  try {
    // Mock verification for demo
    const isValid = /^[0-9]{8}$/.test(dinNumber);
    
    if (isValid) {
      return {
        success: true,
        message: "DIN verified successfully",
        data: {
          directorName: "John Doe",
          dinNumber: dinNumber,
          status: "Active"
        }
      };
    } else {
      return {
        success: false,
        error: "Invalid DIN format"
      };
    }
  } catch (error) {
    console.error("Error verifying DIN:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to verify DIN"
    };
  }
};

// Mock implementation for GSTIN verification
export const verifyGstin = async (gstinNumber: string): Promise<GstinVerifyResponse> => {
  console.log(`Verifying GSTIN: ${gstinNumber}`);
  
  try {
    // Mock verification for demo
    const isValid = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/.test(gstinNumber);
    
    if (isValid) {
      return {
        success: true,
        message: "GSTIN verified successfully",
        data: {
          tradeName: "ABC Trading Co.",
          legalName: "ABC Corporation",
          gstinStatus: "Active"
        }
      };
    } else {
      return {
        success: false,
        error: "Invalid GSTIN format"
      };
    }
  } catch (error) {
    console.error("Error verifying GSTIN:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to verify GSTIN"
    };
  }
};

// Mock implementation for Bank Account verification
export const verifyBankAccount = async (accountNumber: string, ifsc: string): Promise<BankVerifyResponse> => {
  console.log(`Verifying Bank Account: ${accountNumber}, IFSC: ${ifsc}`);
  
  try {
    // Mock verification for demo
    const isAccountValid = /^[0-9]{9,18}$/.test(accountNumber);
    const isIfscValid = /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc);
    
    if (isAccountValid && isIfscValid) {
      return {
        success: true,
        message: "Bank account verified successfully",
        data: {
          accountExists: true,
          accountHolderName: "John Doe",
          bankName: "Example Bank"
        }
      };
    } else {
      const errorMsg = !isAccountValid 
        ? "Invalid account number" 
        : "Invalid IFSC code";
      
      return {
        success: false,
        error: errorMsg
      };
    }
  } catch (error) {
    console.error("Error verifying bank account:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to verify bank account"
    };
  }
};
