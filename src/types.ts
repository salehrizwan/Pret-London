export interface DupattaAddon {
  available: boolean;
  name: string;
  description: string;
  prices: {
    PK: number;
    AE: number;
    US: number;
    GB: number;
  };
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  fabric: string;
  embroidery: string;
  stitching: string;
  careInstructions: string;
  note?: string;
  sizeChart?: string;
  deliveryChargesNote?: string;
  images: string[];
  availableSizes: string[];
  prices: {
    PK: number;
    AE: number;
    US: number;
    GB: number;
  };
  deliveryTime: {
    PK: string;
    AE: string;
    US: string;
    GB: string;
  };
  stockStatus: string;
  featured?: boolean;
  dupattaAddon?: DupattaAddon;
}

export interface BasketItem {
  id: string; // unique item id in basket (combines product id, size, and dupatta addon selection)
  product: Product;
  size: string;
  withDupatta: boolean;
  quantity: number;
  unitPrice: number;
}

export interface Review {
  id: string;
  productName: string;
  customerName: string;
  city: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Order {
  id?: string;
  orderNumber?: string;
  date?: string;
  customerName: string;
  email: string;
  phone: string;
  country: "PK" | "AE" | "US" | "GB";
  address: string;
  city: string;
  state: string;
  postalCode: string;
  items: Array<{
    productId: string;
    productName: string;
    size: string;
    quantity: number;
    withDupatta: boolean;
    price: number;
  }>;
  totalPrice: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  trackingNumber?: string;
  screenshotUrl?: string; // PK orders payment verification
  customMeasurements?: {
    bust?: string;
    waist?: string;
    hips?: string;
    shoulder?: string;
    sleeves?: string;
    length?: string;
    additionalDetails?: string;
  };
}

export type RegionCode = "PK" | "AE" | "US" | "GB";

export interface Region {
  code: RegionCode;
  name: string;
  flag: string;
  currency: string;
  currencySymbol: string;
  shippingNote: string;
  paymentOptions: string[];
}
