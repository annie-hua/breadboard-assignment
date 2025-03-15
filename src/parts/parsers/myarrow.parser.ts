import { AggregatedPart, Packaging } from '../interfaces/aggregated-part.interface';

export class MyArrowParser {
  parse(data: any): AggregatedPart {
    const leadTimeArray: number[] = [];

    const pricingResponses = Array.isArray(data.pricingResponse) ? data.pricingResponse : [];

    const firstResponse = pricingResponses.length > 0 ? pricingResponses[0] : {};
    function extractUrlByType(urlData: any, type: string): string {
      if (!Array.isArray(urlData)) return '';
      return urlData.find((urlObj: any) => urlObj.type === type)?.value || '';
    }

    const productDoc = extractUrlByType(firstResponse.urlData, 'Datasheet');
    const productUrl = extractUrlByType(firstResponse.urlData, 'Part Details');
    const productImageUrl = extractUrlByType(firstResponse.urlData, 'Image Large');

    var totalStock = 0;

    // Map over pricingResponses to extract packaging data.
    const packagingData: Packaging[] = pricingResponses.map((packagingObj: any) => {
      // Log keys for debugging (optional)
      // console.log(packagingObj);
      console.log(packagingObj.leadTime);

      if (packagingObj.leadTime?.supplierLeadTime != null) { // Exclude null or undefined values
        leadTimeArray.push(packagingObj.leadTime.supplierLeadTime);
      }

      // Ensure pricingTier is an array before mapping
      const priceBreaks = Array.isArray(packagingObj.pricingTier)
        ? packagingObj.pricingTier.map((priceBreakObj: any) => {
          const breakQuantity = priceBreakObj?.minQuantity;
          const unitPrice = priceBreakObj?.resalePrice;
          return {
            breakQuantity,
            unitPrice,
            totalPrice: breakQuantity * unitPrice,
          };
        })
        : [];

      totalStock += packagingObj.fohQuantity;
      return {
        type: packagingObj.pkg || '',
        minimumOrderQuantity: packagingObj.minOrderQuantity,
        quantityAvailable: packagingObj.fohQuantity,
        unitPrice: packagingObj.unitPrice,
        supplier: 'Arrow',
        priceBreaks,
        manufacturerLeadTime: packagingObj.leadTime?.supplierLeadTime,
      };
    });
    console.log(leadTimeArray)
    console.log(Math.min(...leadTimeArray))
    return {
      name: firstResponse.partNumber || '',
      description: firstResponse.description || '',
      totalStock,
      manufacturerLeadTime: Math.min(...leadTimeArray),
      manufacturerName: firstResponse.manufacturer || '',
      packaging: packagingData,
      productDoc: productDoc,
      productUrl: productUrl,
      productImageUrl,
      specifications: data.specifications || {},  //??
      sourceParts: ['Arrow'],
    };
  }
}
