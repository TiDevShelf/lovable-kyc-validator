
export type VerificationStatus = 'idle' | 'pending' | 'success' | 'error';

export interface VerificationField {
  value: string;
  status: VerificationStatus;
  message?: string;
}

export interface OtpVerification extends VerificationField {
  otp: string;
  txnId?: string;
}

export interface AadhaarVerification {
  aadhaar: VerificationField;
  otpDetails: OtpVerification;
  isOtpRequested: boolean;
}

export interface PanVerification {
  ownerPan: VerificationField;
  businessPan: VerificationField;
}

export interface CompanyVerification {
  cin: VerificationField;
  din: VerificationField;
}

export interface GstinVerification {
  gstin: VerificationField;
}

export interface BankVerification {
  accountNumber: VerificationField;
  ifsc: VerificationField;
}

export interface VerificationState {
  aadhaar: AadhaarVerification;
  pan: PanVerification;
  company: CompanyVerification;
  gstin: GstinVerification;
  bank: BankVerification;
  isFullyVerified: boolean;
}

// API Response Types
export interface ApiResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: any;
}

export interface AadhaarOtpResponse extends ApiResponse {
  data?: {
    txnId: string;
  };
}

export interface AadhaarVerifyResponse extends ApiResponse {
  data?: {
    name: string;
    gender: string;
    dob: string;
    address: string;
  };
}

export interface PanVerifyResponse extends ApiResponse {
  data?: {
    name: string;
    panNumber: string;
    panStatus: string;
  };
}

export interface CinVerifyResponse extends ApiResponse {
  data?: {
    companyName: string;
    registrationNumber: string;
    status: string;
  };
}

export interface DinVerifyResponse extends ApiResponse {
  data?: {
    directorName: string;
    dinNumber: string;
    status: string;
  };
}

export interface GstinVerifyResponse extends ApiResponse {
  data?: {
    tradeName: string;
    legalName: string;
    gstinStatus: string;
  };
}

export interface BankVerifyResponse extends ApiResponse {
  data?: {
    accountExists: boolean;
    accountHolderName?: string;
    bankName?: string;
  };
}
