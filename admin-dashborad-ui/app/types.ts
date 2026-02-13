// Shared types for the application
export interface Client {
  id: string;
  companyName: string;
  plan: "Basic" | "Pro" | "Enterprise";
  startDate: string;
  expirationDate: string;
  accessKey: string;
  status: "Active" | "Expiring Soon" | "Expired";
  modules: string[];
  email: string;
  contactNumber: string;
  contactPerson: string;
  address?: string;
}

export interface GeneratedKey {
  id: string;
  key: string;
  companyName: string;
  plan: string;
  expirationDate: string;
  generatedAt: string;
  modules: string[];
  email: string;
  contactNumber: string;
  contactPerson: string;
  address?: string;
}
