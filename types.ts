export enum Category {
  LOVE = '愛情',
  HEALTH = '健康',
  WEALTH = '財富',
  CAREER = '事業',
  FAMILY = '家庭',
  EDUCATION = '學業',
}

export interface TarotCard {
  id: number;
  name: string;
  nameEn: string;
  meaningUpright: string;
  meaningReversed: string;
  image: string;
}

export enum ReadingPhase {
  WELCOME = 'WELCOME',
  CATEGORY_SELECT = 'CATEGORY_SELECT',
  QUESTION_INPUT = 'QUESTION_INPUT',
  SHUFFLE = 'SHUFFLE',
  CARD_SELECTION = 'CARD_SELECTION',
  REVEAL = 'REVEAL',
}

export interface DrawnCard {
  card: TarotCard;
  position: 'Past' | 'Present' | 'Future';
  isReversed: boolean; // Simplified to upright for this version for clearer UI, but good to have type
}