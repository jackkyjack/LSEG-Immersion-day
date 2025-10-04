import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { TravelPlan } from './dto/travel-plan.dto';

@Injectable()
export class TravelService {
  private readonly logger = new Logger(TravelService.name);
  private genAI: GoogleGenerativeAI;

  constructor(private configService: ConfigService) {
    this.genAI = new GoogleGenerativeAI(
      this.configService.getOrThrow<string>('GEMINI_API_KEY'),
    );
  }

  async getRecommendation(days: number, country: string): Promise<TravelPlan> {
    const model = this.genAI.getGenerativeModel(
      { model: 'gemini-2.5-pro' }
    );

    const prompt = `
      Generate a travel recommendation for a ${days}-day trip to ${country}.
      The response must be a valid JSON array of objects.
      Each object in the array represents a day and must have the following keys: "day", "morning", "afternoon", and "evening".
      Your response should only contain the JSON array, with no other text or formatting.
      Do not include any text, introductory phrases, or markdown formatting like \`\`\`json before or after the JSON array.
      The output should be only the raw JSON array.

      Here is an example for a 2-day trip to France:
      [
        {
          "day": 1,
          "morning": "Visit the Eiffel Tower",
          "afternoon": "Explore the Louvre Museum",
          "evening": "Dinner in Montmartre"
        },
        {
          "day": 2,
          "morning": "Walk along the Seine River",
          "afternoon": "Visit Notre-Dame Cathedral",
          "evening": "Enjoy a show at Moulin Rouge"
        }
      ]
    `;

    try {
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
        },
      });
      const responseText = result.response.text();
      this.logger.log(`Gemini response for ${country}: ${responseText}`);
      return JSON.parse(responseText);
    } catch (error) {
      this.logger.error('Error fetching recommendation from Gemini API', error);
      throw new InternalServerErrorException(
        'Failed to generate travel recommendation.',
      );
    }
  }
}
