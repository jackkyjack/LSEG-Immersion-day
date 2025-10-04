import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { TravelService } from './travel.service';
import { GetRecommendationDto } from './dto/get-recommendation.dto';
import { TravelPlan } from './dto/travel-plan.dto';

@Controller('travel')
export class TravelController {
  constructor(private readonly travelService: TravelService) {}

  @Get('recommendation')
  async getRecommendation(
    @Query(new ValidationPipe({ transform: true }))
    query: GetRecommendationDto,
  ): Promise<TravelPlan> {
    return await this.travelService.getRecommendation(query.days, query.country);
  }
}
