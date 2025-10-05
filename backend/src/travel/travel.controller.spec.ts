import { Test, TestingModule } from '@nestjs/testing';
import { TravelController } from './travel.controller';
import { TravelService } from './travel.service';
import { IsCountryIdConstraint } from './country/is-country-id.validator';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Country } from './country/country.entity';
import { APP_PIPE } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { GetRecommendationDto } from './dto/get-recommendation.dto';
import { TravelPlan } from './dto/travel-plan.dto';
import { Repository } from 'typeorm';

describe('TravelController', () => {
  let controller: TravelController;
  let service: TravelService;
  let countryRepository: Repository<Country>;

  beforeEach(async () => {
    const mockTravelService = {
      getRecommendation: jest.fn().mockResolvedValue([]),
    };
    const mockCountryRepository = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TravelController],
      providers: [
        {
          provide: TravelService,
          useValue: mockTravelService,
        },
        {
          provide: APP_PIPE,
          useClass: ValidationPipe,
        },
        IsCountryIdConstraint,
        {
          provide: getRepositoryToken(Country),
          useValue: mockCountryRepository,
        },
      ],
    }).compile();

    // This is crucial for custom validators with DI to work in tests
    useContainer(module, { fallbackOnErrors: true });

    controller = module.get<TravelController>(TravelController);
    service = module.get<TravelService>(TravelService);
    countryRepository = module.get<Repository<Country>>(getRepositoryToken(Country));
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getRecommendation', () => {
    it('should look up country name and call travelService.getRecommendation', async () => {
      const query: GetRecommendationDto = { days: 5, country: 1 };
      const expectedResult: TravelPlan = [
        {
          day: 1,
          morning: 'Morning activity',
          afternoon: 'Afternoon activity',
          evening: 'Evening activity',
        },
      ];
      const countryEntity = { id: 1, name: 'France' };

      jest.spyOn(countryRepository, 'findOne').mockResolvedValue(countryEntity);
      const getRecommendationSpy = jest.spyOn(service, 'getRecommendation').mockResolvedValue(expectedResult);

      const result = await controller.getRecommendation(query);

      expect(countryRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(getRecommendationSpy).toHaveBeenCalledWith(5, 'France');
      expect(result).toEqual(expectedResult);
    });
  });
});
