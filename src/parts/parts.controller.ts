import { Controller, Get, Query } from '@nestjs/common';
import { PartsService } from './parts.service';
import { AggregatedPart } from './interfaces/aggregated-part.interface';

@Controller('parts')
export class PartsController {
  constructor(private readonly partsService: PartsService) { }

  @Get()
  async getPart(@Query('partNumber') partNumber: string): Promise<AggregatedPart> {
    return await this.partsService.getAggregatedPart(partNumber);
  }
}
