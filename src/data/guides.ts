export type GuideCategory = 'playstation' | 'xbox' | 'ea-fc' | 'payment' | 'general';

export interface GuideSection {
  id: string;
  title: string;
  content: string;
  tip?: string;
  warning?: string;
  imageUrl?: string;
}

export interface GuideItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverUrl: string;
  category: GuideCategory;
  date: string;
  updatedDate?: string;
  author: string;
  readTime: string;
  tags?: string[];
  sections: GuideSection[];
  metaTitle?: string;
  metaDescription?: string;
  schemaHowTo?: boolean;
}

export const GUIDE_CATEGORIES: Record<GuideCategory, { label: string; icon: string; color: string }> = {
  playstation: { label: 'PlayStation', icon: '🎮', color: '#0070D1' },
  xbox:        { label: 'Xbox',        icon: '🟢', color: '#107C10' },
  'ea-fc':     { label: 'EA FC',        icon: '⚽', color: '#2ECC40' },
  payment:     { label: 'Оплата',      icon: '💳', color: '#F59E0B' },
  general:     { label: 'Общее',       icon: '📋', color: '#6B7280' },
};

export const guidesData: GuideItem[] = [
  {
    id: 'g1',
    slug: 'kak-kupit-ps-plus-iz-rossii',
    title: 'Как купить PS Plus из России — пошаговая инструкция',
    excerpt: 'Полный гайд по покупке и активации PS Plus из России. Выбор региона, создание аккаунта, оплата через СБП.',
    coverUrl: '/images/guides/ps-plus-cover.webp',
    category: 'playstation',
    date: '2026-01-15',
    updatedDate: '2026-04-04',
    author: 'ActivePlay',
    readTime: '7 мин',
    tags: ['PS Plus', 'Турция', 'подписка', 'инструкция'],
    schemaHowTo: true,
    sections: [
      {
        id: 'zachem-turecckij-akkaunt',
        title: 'Зачем нужен турецкий аккаунт PSN?',
        content: `<p>После ухода Sony из России в 2022 году купить PS Plus напрямую стало невозможно. Однако подписка по-прежнему доступна через аккаунты других регионов — самый популярный вариант это Турция.</p>
<p>Преимущества турецкого региона:</p>
<ul>
<li><strong>Низкие цены</strong> — PS Plus Essential от 890₽/мес вместо европейских 2500₽</li>
<li><strong>Полный каталог</strong> — те же игры, что и в европейском PS Plus</li>
<li><strong>Простая активация</strong> — без VPN, работает сразу после покупки</li>
<li><strong>Безопасность</strong> — Sony не блокирует аккаунты за покупку в другом регионе</li>
</ul>`,
        tip: 'Турецкие цены — одни из самых низких в мире. Экономия по сравнению с европейскими ценами составляет 50–70%.',
      },
      {
        id: 'sozdanie-akkaunta',
        title: 'Шаг 1: Создание турецкого аккаунта PSN',
        content: `<p>Если у вас ещё нет турецкого аккаунта PlayStation Network, его нужно создать. Это бесплатно и занимает 5 минут.</p>
<ol>
<li>Перейдите на <a href="https://store.playstation.com" target="_blank" rel="noopener">store.playstation.com</a></li>
<li>Нажмите «Создать аккаунт»</li>
<li>В поле «Страна/регион» выберите <strong>Турция (Türkiye)</strong></li>
<li>Укажите email (лучше отдельный, не основной)</li>
<li>Придумайте пароль и заполните остальные поля</li>
<li>Подтвердите email — на почту придёт код</li>
</ol>
<p>Готово! Теперь добавьте этот аккаунт на вашу PS5 или PS4.</p>`,
        warning: 'Регион аккаунта нельзя изменить после создания. Убедитесь, что выбрали Турцию.',
        tip: 'Не нужно вводить реальный турецкий адрес — подойдёт любой. Можно найти адрес отеля в Стамбуле через Google Maps.',
        imageUrl: 'https://images.unsplash.com/photo-1625805866449-3589fe3f71a3?w=800&h=450&fit=crop',
      },
      {
        id: 'oformlenie-zakaza',
        title: 'Шаг 2: Оформление заказа в ActivePlay',
        content: `<p>Теперь нужно выбрать подходящий тариф PS Plus и оформить заказ:</p>
<ol>
<li>Перейдите на страницу нужного тарифа:
  <ul>
    <li><a href="/ps-plus-essential">PS Plus Essential</a> — онлайн-мультиплеер + 3 игры в месяц</li>
    <li><a href="/ps-plus-extra">PS Plus Extra</a> — каталог из 400+ игр</li>
    <li><a href="/ps-plus-deluxe">PS Plus Deluxe</a> — всё из Extra + классические игры + пробные версии</li>
  </ul>
</li>
<li>Нажмите «Оформить за 5 мин»</li>
<li>Выберите удобный способ связи — Telegram, VK или чат на сайте</li>
<li>Сообщите менеджеру выбранный тариф и период</li>
</ol>`,
        tip: 'Самый выгодный вариант — годовая подписка. Экономия до 40% по сравнению с ежемесячной оплатой.',
      },
      {
        id: 'oplata',
        title: 'Шаг 3: Оплата через СБП',
        content: `<p>ActivePlay принимает оплату в рублях через российские платёжные системы:</p>
<ul>
<li><strong>СБП</strong> (Система быстрых платежей) — моментальный перевод с любого банка</li>
<li><strong>Карты МИР</strong> — Сбер, Тинькофф, Альфа и другие</li>
</ul>
<p>После подтверждения заказа менеджер отправит реквизиты для оплаты. Перевод занимает менее минуты.</p>`,
        warning: 'Не переводите деньги до подтверждения заказа менеджером. Мы никогда не просим предоплату без диалога.',
      },
      {
        id: 'aktivaciya',
        title: 'Шаг 4: Активация подписки',
        content: `<p>После получения оплаты менеджер активирует подписку на вашем аккаунте:</p>
<ol>
<li>Менеджер пополнит кошелёк вашего турецкого PSN на нужную сумму в лирах</li>
<li>Вы самостоятельно оформите подписку в PS Store (менеджер подскажет как)</li>
<li>Подписка активируется мгновенно</li>
</ol>
<p>Весь процесс занимает 3–5 минут после оплаты. Пароль от вашего аккаунта не требуется.</p>`,
        tip: 'После активации подписки на турецком аккаунте все её преимущества (онлайн, игры) будут доступны на ВСЕХ аккаунтах вашей консоли.',
      },
      {
        id: 'chto-delat-posle',
        title: 'Что делать после активации',
        content: `<p>Поздравляем! Ваша подписка PS Plus активна. Вот что нужно знать:</p>
<ul>
<li><strong>Забирайте игры месяца</strong> — каждый первый вторник месяца Sony раздаёт 3 игры для подписчиков Essential</li>
<li><strong>Играйте онлайн</strong> — мультиплеер доступен на всех аккаунтах консоли</li>
<li><strong>Каталог Extra/Deluxe</strong> — сотни игр доступны для скачивания, пока подписка активна</li>
<li><strong>Скидки</strong> — подписчики получают дополнительные скидки в PS Store</li>
</ul>
<p>Для продления подписки просто напишите нам снова — процесс тот же, только создавать аккаунт уже не нужно.</p>`,
        tip: 'Подпишитесь на наш <a href="https://t.me/PS_PLUS_RUS" target="_blank" rel="noopener">Telegram-канал @PS_PLUS_RUS</a> — мы публикуем список игр месяца, скидки и акции.',
      },
    ],
  },
  {
    id: 'g2',
    slug: 'ps-plus-essential-extra-deluxe-otlichiya',
    title: 'PS Plus Essential, Extra и Deluxe — чем отличаются и какой выбрать',
    excerpt: 'Сравнение всех уровней подписки PlayStation Plus: что входит в каждый тариф, в чём разница между Essential, Extra и Deluxe, и какой выбрать в 2026 году.',
    coverUrl: '/images/guides/ps-plus-essential-extra-deluxe.webp',
    category: 'playstation',
    date: '2026-04-04',
    author: 'ActivePlay',
    readTime: '8 мин',
    tags: ['PS Plus', 'Essential', 'Extra', 'Deluxe', 'сравнение', 'какой выбрать'],
    sections: [],
  },
  {
    id: 'g3',
    slug: 'xbox-game-pass-kak-kupit-iz-rossii',
    title: 'Xbox Game Pass — все тарифы и покупка из России',
    excerpt: 'Как купить Xbox Game Pass из России в 2026 году. Тарифы Essential, Premium и Ultimate: что входит, цены, отличия. Конвертация, активация через подарочные карты.',
    coverUrl: '/images/guides/xbox-game-pass.webp',
    category: 'xbox',
    date: '2026-04-04',
    author: 'ActivePlay',
    readTime: '8 мин',
    tags: ['Game Pass', 'Xbox', 'подписка', 'гейм пасс'],
    sections: [],
  },
  {
    id: 'g4',
    slug: 'kak-kupit-fc-points-iz-rossii',
    title: 'Как купить FC Points из России — донат Ultimate Team',
    excerpt: 'Как купить ФК Поинтс для EA Sports FC 26 из России. Все номиналы, цены в рублях, оплата через СБП. Скидка 10% с EA Play.',
    coverUrl: '/images/covers/fc-points.webp',
    category: 'ea-fc',
    date: '2026-04-04',
    author: 'ActivePlay',
    readTime: '6 мин',
    tags: ['FC Points', 'EA FC', 'Ultimate Team', 'донат', 'из России'],
    sections: [],
  }
];