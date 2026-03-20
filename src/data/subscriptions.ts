export type Region = 'turkey' | 'ukraine';
export type Period = 1 | 3 | 12;

export interface PlanTier {
  name: string;
  subtitle?: string;
  color: string;
  features: string[];
  popular?: boolean;
  prices: {
    turkey?: Partial<Record<Period, number>>;
    ukraine?: Partial<Record<Period, number>>;
    global?: Partial<Record<Period, number>>;
  };
}

export const psPlans: PlanTier[] = [
  {
    name: 'Essential',
    subtitle: 'Основная',
    color: '#C6A220',
    features: [
      'Онлайн-мультиплеер',
      '3-4 бесплатные игры каждый месяц',
      'Эксклюзивные скидки в PS Store',
      'Облачное хранилище сохранений',
      'Шеринг подписки на 2 консоли',
    ],
    prices: {
      turkey: { 1: 1250, 3: 2150, 12: 5800 },
      ukraine: { 12: 5000 },
    },
  },
  {
    name: 'Extra',
    subtitle: 'Расширенная',
    color: '#2A2A2A',
    popular: true,
    features: [
      'Каталог 400+ игр для PS5 и PS4',
      'Ubisoft+ Classics',
      'Хиты в день релиза (Day One)',
      'Эксклюзивные скидки в PS Store',
      '+ всё из Essential',
    ],
    prices: {
      turkey: { 1: 1400, 3: 3250, 12: 9500 },
      ukraine: { 12: 7000 },
    },
  },
  {
    name: 'Deluxe',
    subtitle: 'Максимальная',
    color: '#E8E8E8',
    features: [
      'Каталог классических игр PS1, PS2, PS3',
      'Пробные версии AAA-игр (до 5ч)',
      'Облачный стриминг игр',
      'Ранний доступ и спецпредложения',
      '+ всё из Extra',
    ],
    prices: {
      turkey: { 1: 1550, 3: 3750, 12: 10750 },
      ukraine: { 12: 8000 },
    },
  },
];

export const xboxPlans: PlanTier[] = [
  {
    name: 'Essential',
    subtitle: 'Базовая (бывш. Core)',
    color: '#107C10',
    features: [
      'Онлайн-мультиплеер на консоли',
      'Библиотека 50+ игр',
      'Скидки на игры в Microsoft Store',
      'Облачный гейминг (базовый)',
      'Совместная игра с друзьями',
    ],
    prices: {
      global: { 1: 690, 3: 1790, 12: 3490 },
    },
  },
  {
    name: 'Premium',
    subtitle: 'Расширенная (бывш. Standard)',
    color: '#0078D4',
    features: [
      'Каталог 200+ игр для Xbox и ПК',
      'Xbox-эксклюзивы через 12 месяцев',
      'Скидки до 20% в Microsoft Store',
      'Облачный гейминг (улучшенный)',
      '+ всё из Essential',
    ],
    prices: {
      global: { 1: 1190, 3: 2990, 12: 5790 },
    },
  },
  {
    name: 'Ultimate',
    subtitle: 'Максимальная',
    color: '#7B2FA0',
    popular: true,
    features: [
      '500+ игр Day One — в день релиза',
      'EA Play + Ubisoft+ Classics включены',
      'Облачный гейминг на ТВ и телефоне',
      'PC Game Pass в комплекте',
      '+ всё из Premium',
    ],
    prices: {
      global: { 1: 1590, 3: 3990, 12: 7690 },
    },
  },
];
