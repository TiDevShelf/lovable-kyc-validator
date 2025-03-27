
import { 
  AadhaarOtpResponse, 
  AadhaarVerifyResponse,
  PanVerifyResponse,
  CinVerifyResponse,
  DinVerifyResponse,
  GstinVerifyResponse,
  BankVerifyResponse
} from "@/types/verification";

const API_BASE_URL = import.meta.env.VITE_GRIDLINE_API_BASE_URL;
const API_KEY =  import.meta.env.VITE_GRIDLINE_API_KEY;

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "API request failed");
  }
  return await response.json() as T;
};
export const generateAadhaarOtp = async (aadhaar_number: string, consent: string = "Y"): Promise<AadhaarOtpResponse> => {
  console.log(`Generating OTP for Aadhaar: ${aadhaar_number} with consent: ${consent}`);  

  try {
    const response = await fetch(`${API_BASE_URL}/aadhaar-api/boson/generate-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY,
        'X-Auth-Type': 'API-Key',
        Accept: 'application/json'
      },
      body: JSON.stringify({ aadhaar_number, consent }),
    });

    const result = await response.json();

    if (response.ok && result.data?.code === "1001") {  
      return {
        success: true,
        message: result.data?.message || "OTP sent successfully",
        data: {
          transaction_id: result.data?.transaction_id,
          txnId: result.data?.transaction_id
        } 
      };
    } else {
      return {
        success: false,
        error: result.data?.message || "Failed to generate OTP",
      };
    }
  } catch (error) {
    console.error("Error generating Aadhaar OTP:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate OTP",
    };
  }
};
export const verifyAadhaarWithOtp = async (
  aadhaar_number: string,
  otp: string,
  transaction_id: string
): Promise<AadhaarVerifyResponse> => {
  console.log(`Verifying Aadhaar: ${aadhaar_number} with OTP: ${otp}, transaction_id: ${transaction_id}`);
  
  try {
    const response = await fetch(`${API_BASE_URL}/aadhaar-api/boson/submit-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY,
        'X-Auth-Type': 'API-Key',
        Accept: 'application/json'
      },
      body: JSON.stringify({ aadhaar_number, otp, transaction_id }), // ✅ Using transaction_id instead of txnId
    });
    
    const result = await response.json();

    if (response.ok && result.data?.code === "1002") {  
      return {
        success: true,
        message: result.data?.message || "PAN verified successfully",
        data: {
          name: result.data?.name,
          gender: result.data?.gender,
          dob: result.data?.date_of_birth,
          address: result.data?.locality
        
        }
      };
    } else {
      return {
        success: false,
        error: result.data?.message || "Failed to verify PAN",
      };
    }
  } catch (error) {
    console.error("Error verifying PAN:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to verify PAN",
    };
  }
};
export const verifyPan = async (panNumber: string,consent: string = "Y"): Promise<PanVerifyResponse> => {
  console.log(`Verifying PAN: ${panNumber}`);

  try {
    const response = await fetch(`${API_BASE_URL}/pan-api/fetch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY,
        'X-Auth-Type': 'API-Key',
        Accept: 'application/json'
      },
      body: JSON.stringify({ pan_number: panNumber,consent }),
    });

    const result = await response.json();

    if (response.ok && result.data?.code === "1000") {  
      return {
        success: true,
        message: result.data?.message || "PAN verified successfully",
        data: {
          panNumber: result.data?.pan_number,
          name: result.data?.name,
          panStatus: result.data?.status,
        }
      };
    } else {
      return {
        success: false,
        error: result.data?.message || "Failed to verify PAN",
      };
    }
  } catch (error) {
    console.error("Error verifying PAN:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to verify PAN",
    };
  }
};
export const verifyCin = async (cinNumber: string,consent: string = "Y"): Promise<CinVerifyResponse> => {
  console.log(`Verifying CIN: ${cinNumber}`);

  try {
    const response = await fetch(`${API_BASE_URL}/mca-api/fetch-company`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY,
        'X-Auth-Type': 'API-Key',
        Accept: 'application/json',
      },
      body: JSON.stringify({ company_id: cinNumber,consent }),
    });

    const result = await response.json();

    if (response.ok && result.data?.code === "1000") {
      return {
        success: true,
        message: result.data?.message || "CIN verified successfully",
        data: {
          companyName: result.data?.company_name,
          registrationNumber: result.data?.cin_number,
          status: result.data?.status,
        },
      };
    } else {
      return {
        success: false,
        error: result.data?.message || "Failed to verify CIN",
      };
    }
  } catch (error) {
    console.error("Error verifying CIN:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to verify CIN",
    };
  }
};
export const verifyDin = async (dinNumber: string,consent: string = "Y"): Promise<DinVerifyResponse> => {
  console.log(`Verifying DIN: ${dinNumber}`);

  try {
    const response = await fetch(`${API_BASE_URL}/mca-api/fetch-director`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY,
        'X-Auth-Type': 'API-Key',
        Accept: 'application/json',
      },
      body: JSON.stringify({ din: dinNumber,consent }),
    });

    const result = await response.json();

    if (response.ok && result.data?.code === "1000") {
      return {
        success: true,
        message: result.data?.message || "CIN verified successfully",
        data: {
          directorName: result.data?.company_name,
          dinNumber: result.data?.cin_number,
          status: result.data?.status,
        },
      };
    } else {
      return {
        success: false,
        error: result.data?.message || "Failed to verify CIN",
      };
    }
  } catch (error) {
    console.error("Error verifying CIN:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to verify CIN",
    };
  }
};
export const verifyGstin = async (gstinNumber: string,consent: string = "Y"): Promise<GstinVerifyResponse> => {
  console.log(`Verifying GSTIN: ${gstinNumber}`);

  try {
    const response = await fetch(`${API_BASE_URL}/gstin-api/fetch-lite`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY,
        'X-Auth-Type': 'API-Key',
        Accept: 'application/json',
      },
      body: JSON.stringify({ gstin: gstinNumber,consent }),
    });

    const result = await response.json();

    if (response.ok && result.data?.code === "1000") {
      return {
        success: true,
        message: result.data?.message || "GSTIN verified successfully",
        data: {
          tradeName: result.data?.trade_name,
          legalName: result.data?.legal_name,
          gstinStatus: result.data?.status,
        },
      };
    } else {
      return {
        success: false,
        error: result.data?.message || "Failed to verify GSTIN",
      };
    }
  } catch (error) {
    console.error("Error verifying GSTIN:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to verify GSTIN",
    };
  }
};
export const verifyBankAccount = async (accountNumber: string, ifsc: string, consent: string = "Y"): Promise<BankVerifyResponse> => {
  console.log(`Verifying Bank Account: ${accountNumber}, IFSC: ${ifsc}`);

  try {
    const response = await fetch(`${API_BASE_URL}/bank-api/verify`, {
      method: "POST",
      headers: {
        "X-Auth-Type": "API-Key",
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-API-Key": API_KEY,
      },
      body: JSON.stringify({
        account_number: accountNumber,
        ifsc,
        consent,
      }),
    });

    const result = await response.json();

    if (response.ok && result?.data?.code === "1000" && result?.data?.bank_account_data) {
      const accountData = result.data.bank_account_data;

      return {
        success: true,
        message: result.data.message || "Bank account verified successfully",
        data: {
          accountHolderName: accountData.name,
          bankName: accountData.bank_name,
        },
      };
    } else {
      return {
        success: false,
        error: result?.data?.message || "Failed to verify bank account",
      };
    }
  } catch (error) {
    console.error("Error verifying bank account:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to verify bank account",
    };
  }
};



