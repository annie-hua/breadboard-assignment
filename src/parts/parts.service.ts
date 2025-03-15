import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { MyArrowParser } from './parsers/myarrow.parser';
import { TTIParser } from './parsers/tti.parser';
import { AggregatedPart } from './interfaces/aggregated-part.interface';

@Injectable()
export class PartsService {
  private readonly logger = new Logger(PartsService.name);

  constructor(private readonly httpService: HttpService) {}

  async getAggregatedPart(partNumber: string): Promise<AggregatedPart> {
    if (partNumber !== '0510210200') {
      throw new NotFoundException(`Part ${partNumber} not found`);
    }

    const myArrowUrl = 'https://backend-takehome.s3.us-east-1.amazonaws.com/myarrow.json';
    const ttiUrl = 'https://backend-takehome.s3.us-east-1.amazonaws.com/tti.json';

    const [myArrowResponse, ttiResponse] = await Promise.all([
      firstValueFrom(this.httpService.get(myArrowUrl)),
      firstValueFrom(this.httpService.get(ttiUrl)),
    ]);

    const myArrowParser = new MyArrowParser();
    const ttiParser = new TTIParser();

    const myArrowData = myArrowParser.parse(myArrowResponse.data);
    const ttiData = ttiParser.parse(ttiResponse.data);
    console.log(myArrowData)

    // Combine the parsed data fields.
    const aggregatedPart: AggregatedPart = {
      name: myArrowData.name || ttiData.name,
      description: myArrowData.description || ttiData.description,
      totalStock: myArrowData.totalStock + ttiData.totalStock,
      manufacturerLeadTime: Math.min(myArrowData.manufacturerLeadTime, ttiData.manufacturerLeadTime),
      manufacturerName: myArrowData.manufacturerName || ttiData.manufacturerName,
      packaging: [...(myArrowData.packaging || []), ...(ttiData.packaging || [])],
      productDoc: myArrowData.productDoc || ttiData.productDoc,
      productUrl: myArrowData.productUrl || ttiData.productUrl,
      productImageUrl: myArrowData.productImageUrl || ttiData.productImageUrl,
      specifications: { ...myArrowData.specifications, ...ttiData.specifications },
      sourceParts: [...myArrowData.sourceParts, ...ttiData.sourceParts],
    };

    this.logger.log(`Aggregated part: ${JSON.stringify(aggregatedPart)}`);

    return aggregatedPart;
  }
}
