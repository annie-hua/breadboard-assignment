import { AggregatedPart, Packaging } from '../interfaces/aggregated-part.interface';

export interface SupplierDataParser {
  parse(data: any): AggregatedPart;
}
