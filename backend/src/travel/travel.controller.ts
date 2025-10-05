import { Controller, Get, Query, NotFoundException } from '@nestjs/common';
import { TravelService } from './travel.service';
import { GetRecommendationDto } from './dto/get-recommendation.dto';
import { TravelPlan } from './dto/travel-plan.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Country } from '../travel/country/country.entity';
import { Repository } from 'typeorm';

@Controller('travel')
export class TravelController {
  constructor(
    private readonly travelService: TravelService,
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
  ) {}

  @Get('recommendation')
  async getRecommendation(
    @Query() query: GetRecommendationDto,
  ): Promise<TravelPlan> {
    const countryEntity = await this.countryRepository.findOne({
      where: { id: query.country },
    });

    if (!countryEntity) {
      throw new NotFoundException(`Country with ID ${query.country} not found.`);
    }

    return await this.travelService.getRecommendation(
      query.days,
      countryEntity.name,
    );
  }
}
