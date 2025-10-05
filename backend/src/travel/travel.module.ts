import { Module } from '@nestjs/common';
import { TravelController } from './travel.controller';
import { TravelService } from './travel.service';
import { CountryModule } from '../travel/country/country.module';

@Module({
  imports: [CountryModule],
  controllers: [TravelController],
  providers: [TravelService],
})
export class TravelModule {}
