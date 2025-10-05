import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class GetRecommendationDto {
  @IsInt()
  @Min(1)
  @Max(7) // Let's limit to a week for this example
  @Type(() => Number)
  days: number;

  @IsString()
  @IsNotEmpty()
  country: string;
}
