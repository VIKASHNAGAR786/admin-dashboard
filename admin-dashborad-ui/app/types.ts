// Shared types for the application
export interface Client {
  id: string;
  companyName: string;
  email: string;
  contactNumber: string;
  contactPerson: string;
  address?: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GeneratedKey {
  id: string;
  key: string;
  accessKey?: string;
  clientId: string;
  companyName: string;
  plan: string;
  status?: string;
  active: string;
  expirationDate: string;
  generatedAt: string;
  modules: string[];
  email: string;
  contactNumber: string;
  contactPerson: string;
  address?: string;
}
