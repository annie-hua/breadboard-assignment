import { AggregatedPart, Packaging } from '../interfaces/aggregated-part.interface';

export class TTIParser {
  parse(data: any): AggregatedPart {
    const supplier = 'TTI';
    const firstResponse = data.recordCount > 0 ? data.parts[0] : {};
    let totalStock = 0;
let manufacturerLeadTimeArr: number[] = []; // Corrected declaration

// Safely map over parts to extract packaging data
const packagingData: Packaging[] = Array.isArray(data.parts)
  ? data.parts.map((part: any) => {
      if (part.availableToSell !== undefined && part.availableToSell !== null) {
        totalStock += part.availableToSell;
      }

      console.log(part.pricing);

      // Extract price breaks if pricing exists
      const priceBreaks = Array.isArray(part.pricing?.quantityPriceBreaks)
        ? part.pricing.quantityPriceBreaks.map((priceBreakObj: any) => {
            const breakQuantity = priceBreakObj?.quantity ?? null;
            const unitPrice = priceBreakObj?.price ?? null;
            return {
              breakQuantity,
              unitPrice,
              totalPrice: breakQuantity !== null && unitPrice !== null ? breakQuantity * parseFloat(unitPrice) : null,
            };
          })
        : [];

      const manufacturerLeadTime = parseInt(part.leadTime.split(' ')[0], 10) * 7;
      manufacturerLeadTimeArr.push(manufacturerLeadTime); // Push lead time to the array

      return {
        type: part.packaging,
        minimumOrderQuantity: part.salesMinimum !== undefined ? part.salesMinimum : null,
        quantityAvailable: part.availableToSell !== undefined ? part.availableToSell : null,
        unitPrice: part.pricing?.vipPrice !== undefined ? part.pricing.vipPrice : null,
        supplier,
        priceBreaks,
        manufacturerLeadTime,
      };
    })
  : [];

    return {
      name: firstResponse.manufacturerPartNumber !== undefined ? firstResponse.manufacturerPartNumber : null,
      description: firstResponse.description !== undefined ? firstResponse.description : null,
      totalStock,
      manufacturerLeadTime: Math.min(...manufacturerLeadTimeArr),
      manufacturerName: data.manufacturer !== undefined ? data.manufacturer : null,
      packaging: packagingData,
      productDoc: firstResponse.datasheetUrl !== undefined ? firstResponse.datasheetUrl : null,
      productUrl: firstResponse.buyUrl !== undefined ? firstResponse.buyUrl : null,
      productImageUrl: firstResponse.imageURL !== undefined ? firstResponse.imageURL : null,
      specifications: firstResponse.specifications !== undefined ? firstResponse.specifications : null,
      sourceParts: [supplier],
    };
  }
}