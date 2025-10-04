export class ItineraryItem {
  day: number;
  morning: string;
  afternoon: string;
  evening: string;
}

export type TravelPlan = ItineraryItem[];
