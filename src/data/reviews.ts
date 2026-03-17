export interface Review {
  id: number;
  text: string;
  author: string;
  avatarImg: string;
  product: string;
  date: string;
  rating: number;
  source: string;
}

export const reviews: Review[] = [
  {
    id: 1,
    text: 'Оформил за 10 минут через Telegram. Менеджер всё объяснил, подписка заработала сразу. Цена в 2.5 раза дешевле, чем если покупать напрямую. Буду продлевать.',
    author: 'Алексей К.',
    avatarImg: 'https://i.pravatar.cc/80?img=12',
    product: 'PS Plus Extra, 12 мес',
    date: 'Март 2025',
    rating: 5,
    source: 'Telegram',
  },
  {
    id: 2,
    text: 'Третий раз продлеваю через ActivePlay. Ни разу не было проблем — подписка активируется моментально. Поддержка отвечает даже ночью.',
    author: 'Дмитрий В.',
    avatarImg: 'https://i.pravatar.cc/80?img=33',
    product: 'Game Pass Ultimate, 12 мес',
    date: 'Февраль 2025',
    rating: 5,
    source: 'Telegram',
  },
  {
    id: 3,
    text: 'Сначала боялась — первый раз покупала подписку не напрямую. Менеджер скинул видеоинструкцию, всё прошло гладко. Теперь подругам советую.',
    author: 'Марина С.',
    avatarImg: 'https://i.pravatar.cc/80?img=5',
    product: 'PS Plus Essential, 3 мес',
    date: 'Январь 2025',
    rating: 5,
    source: 'VK',
  },
  {
    id: 4,
    text: 'Покупал Game Pass на пробу. Активация заняла 5 минут, цена вдвое ниже. Уже оформил на год.',
    author: 'Игорь Л.',
    avatarImg: 'https://i.pravatar.cc/80?img=51',
    product: 'Game Pass Ultimate, 1 мес',
    date: 'Март 2025',
    rating: 5,
    source: 'Telegram',
  },
  {
    id: 5,
    text: 'Перешёл с Essential на Deluxe — каталог игр огромный. Экономия за год больше 5000 рублей по сравнению с официальным PS Store.',
    author: 'Андрей Р.',
    avatarImg: 'https://i.pravatar.cc/80?img=68',
    product: 'PS Plus Deluxe, 12 мес',
    date: 'Февраль 2025',
    rating: 5,
    source: 'Telegram',
  },
];
