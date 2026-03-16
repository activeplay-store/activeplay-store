export type Region = 'turkey' | 'ukraine';
export type Period = 1 | 3 | 12;

export interface PlanTier {
  name: string;
  color: string;
  features: string[];
  popular?: boolean;
  prices: {
    turkey?: Record<Period, number>;
    ukraine?: Record<Period, number>;
    global?: Record<Period, number>;
  };
}

export const psPlans: PlanTier[] = [
  {
    name: 'Essential',
    color: '#F5A623',
    features: [
      'Онлайн-мультиплеер',
      '2-3 игры каждый месяц',
      'Эксклюзивные скидки',
      'Облачное хранилище',
    ],
    prices: {
      turkey: { 1: 890, 3: 2190, 12: 4390 },
      ukraine: { 1: 790, 3: 1990, 12: 3990 },
    },
  },
  {
    name: 'Extra',
    color: '#1E6FD9',
    popular: true,
    features: [
      'Каталог 400+ игр',
      'Ubisoft+ Classics',
      'Хиты дня первого',
      '+ всё из Essential',
    ],
    prices: {
      turkey: { 1: 1490, 3: 3890, 12: 7490 },
      ukraine: { 1: 1390, 3: 3590, 12: 6990 },
    },
  },
  {
    name: 'Deluxe',
    color: '#4B2D8E',
    features: [
      'Классический каталог',
      'Пробные версии',
      'Стриминг из облака',
      '+ всё из Extra',
    ],
    prices: {
      turkey: { 1: 1690, 3: 4390, 12: 8490 },
      ukraine: { 1: 1590, 3: 4090, 12: 7990 },
    },
  },
];

export const xboxPlans: PlanTier[] = [
  {
    name: 'Core',
    color: '#107C10',
    features: [
      'Онлайн-мультиплеер',
      '2-3 игры каждый месяц',
      'Эксклюзивные скидки',
      'Совместная игра',
    ],
    prices: {
      global: { 1: 690, 3: 1790, 12: 3490 },
    },
  },
  {
    name: 'Standard',
    color: '#0078D4',
    features: [
      'Каталог сотен игр',
      'Игры дня первого',
      'Скидки до 20%',
      '+ всё из Core',
    ],
    prices: {
      global: { 1: 1190, 3: 2990, 12: 5790 },
    },
  },
  {
    name: 'Ultimate',
    color: '#7B2FA0',
    popular: true,
    features: [
      'EA Play включён',
      'Облачный гейминг',
      'PC Game Pass',
      '+ всё из Standard',
    ],
    prices: {
      global: { 1: 1590, 3: 3990, 12: 7690 },
    },
  },
];
