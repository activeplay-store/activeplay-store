export interface Review {
  id: number;
  text: string;
  author: string;
  date: string;
  rating: number;
}

export const reviews: Review[] = [
  {
    id: 1,
    text: 'Оформил PS Plus Extra за 10 минут, всё работает. Рекомендую!',
    author: 'Алексей',
    date: 'Март 2025',
    rating: 5,
  },
  {
    id: 2,
    text: 'Третий раз продлеваю через ActivePlay, ни разу не подвели.',
    author: 'Дмитрий',
    date: 'Февраль 2025',
    rating: 5,
  },
  {
    id: 3,
    text: 'Менеджер ответил за минуту, подписка заработала сразу. Топ сервис!',
    author: 'Марина',
    date: 'Январь 2025',
    rating: 5,
  },
  {
    id: 4,
    text: 'Покупал Game Pass Ultimate — цена ниже, чем где-либо ещё. Спасибо!',
    author: 'Игорь',
    date: 'Декабрь 2024',
    rating: 5,
  },
  {
    id: 5,
    text: 'Сначала сомневался, но после первой покупки стал постоянным клиентом.',
    author: 'Кирилл',
    date: 'Ноябрь 2024',
    rating: 5,
  },
];
