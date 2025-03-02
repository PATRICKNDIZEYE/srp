export interface Sale {
  id?: string;
  date: string;
  productType: string;
  quantity: number;
  pricePerUnit: number;
  totalAmount: number;
  customer: string;
  paymentMethod: string;
  status: string;
  pricePerLiter?: number; // If this is a derived or optional field
  depance: number;
  description: string;
  dairyId: string;
} 