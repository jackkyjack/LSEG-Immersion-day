import { IsInt, Max, Min } from 'class-validator';
import { IsCountryId } from '../country/is-country-id.validator';
import { Type } from 'class-transformer';

export class GetRecommendationDto {
  @IsInt()
  @Min(1)
  @Max(10)
  @Type(() => Number)
  days: number;

  @IsInt()
  @Type(() => Number)
  @IsCountryId()
  country: number;
}