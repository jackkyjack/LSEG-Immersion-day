import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class GetRecommendationDto {
  @IsInt()
  @Min(1)
  @Max(10)
  days: number;

  @IsString()
  @IsNotEmpty()
  country: string;
}