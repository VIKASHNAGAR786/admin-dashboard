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
  clientId: string;
clientName: string;
 plan: string;
 expirationDate: string;
 daysRemaining: number;
 status: string;
 key ?: string;
 modules?: string[];
 email?: string;
 contactNumber?: string;
 contactPerson?: string;
 address?: string;
 createdAt?: string;
 updatedAt?: string;
 accessKey?: string; // For backward compatibility with API response
}
