import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PartsController } from './parts.controller';
import { PartsService } from './parts.service';

@Module({
  imports: [HttpModule],
  controllers: [PartsController],
  providers: [PartsService],
})
export class PartsModule {}
