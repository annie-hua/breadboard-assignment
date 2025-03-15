export type SupplierName = 'Arrow' | 'TTI';

export interface PriceBreak {
  breakQuantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Packaging {
  type: string;
  minimumOrderQuantity: number;
  quantityAvailable: number;
  unitPrice: number;
  supplier: SupplierName;
  priceBreaks: PriceBreak[];
  manufacturerLeadTime?: string;
}

export interface AggregatedPart {
  name: string;
  description: string;
  totalStock: number;
  manufacturerLeadTime: number;
  manufacturerName: string;
  packaging: Packaging[];
  productDoc: string;
  productUrl: string;
  productImageUrl: string;
  specifications: any;
  sourceParts: SupplierName[];
}
