import { Test, TestingModule } from '@nestjs/testing';
import { TravelController } from './travel.controller';
import { TravelService } from './travel.service';
import { GetRecommendationDto } from './dto/get-recommendation.dto';
import { TravelPlan } from './dto/travel-plan.dto';

describe('TravelController', () => {
  let controller: TravelController;
  let service: TravelService;

  beforeEach(async () => {
    const mockTravelService = {
      getRecommendation: jest.fn().mockResolvedValue([]),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TravelController],
      providers: [
        {
          provide: TravelService,
          useValue: mockTravelService,
        },
      ],
    }).compile();

    controller = module.get<TravelController>(TravelController);
    service = module.get<TravelService>(TravelService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getRecommendation', () => {
    it('should call travelService.getRecommendation with correct parameters', async () => {
      const query: GetRecommendationDto = { days: 5, country: 'France' };
      const expectedResult: TravelPlan = [
        {
          day: 1,
          morning: 'Morning activity',
          afternoon: 'Afternoon activity',
          evening: 'Evening activity',
        },
      ];
      jest.spyOn(service, 'getRecommendation').mockResolvedValue(expectedResult);

      const result = await controller.getRecommendation(query);

      expect(service.getRecommendation).toHaveBeenCalledWith(5, 'France');
      expect(result).toEqual(expectedResult);
    });
  });
});
