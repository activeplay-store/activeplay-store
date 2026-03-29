// Автогенерация — НЕ РЕДАКТИРОВАТЬ ВРУЧНУЮ
// Обновлено: 2026-03-29T16:13:03.842Z

export type NewsCategory = 'news' | 'hype' | 'insider' | 'rumor' | 'video' | 'guide' | 'interview' | 'podcast' | 'review' | 'announcement';

export interface NewsCta {  gameId?: string;  productLink?: string;  title: string;  price?: string;  oldPrice?: string;  link: string;  subtitle?: string;}
export interface NewsItem {
  id: string;
  slug: string;
  category: NewsCategory;
  title: string;
  excerpt: string;
  content?: string;
  coverUrl: string;
  date: string;
  source?: string;
  author?: string;
  tags?: string[];
  youtubeUrl?: string;
  duration?: string;
  hot?: boolean;
  pinned?: boolean;
  metaTitle?: string;
  metaDescription?: string;
cta?: NewsCta;  cta2?: NewsCta;
}

export const NEWS_CATEGORIES: Record<NewsCategory, { label: string; color: string; icon: string }> = {
  news:         { label: 'Новость',   color: '#00D4FF', icon: '📰' },
  hype:         { label: 'Хайп',      color: '#FF4D6A', icon: '🔥' },
  insider:      { label: 'Инсайд',    color: '#A855F7', icon: '🕵️' },
  rumor:        { label: 'Слух',      color: '#F59E0B', icon: '🤫' },
  video:        { label: 'Видео',     color: '#EF4444', icon: '🎬' },
  guide:        { label: 'Гайд',      color: '#22C55E', icon: '📖' },
  interview:    { label: 'Интервью',  color: '#818CF8', icon: '🎙️' },
  podcast:      { label: 'Подкаст',   color: '#F97316', icon: '🎧' },
  review:       { label: 'Обзор',     color: '#FFD700', icon: '⭐' },
  announcement: { label: 'Анонс',     color: '#FF6B35', icon: '📢' },
};

export const newsData: NewsItem[] = [
  {
    id: 'news-1774800734542-i94p',
    slug: 'ocenki-life-is-strange-reunion-kritiki-v-vostorge',
    category: 'review' as NewsCategory,
    title: 'Оценки Life is Strange: Reunion — критики в восторге',
    excerpt: 'В сети появились первые обзоры Life is Strange: Reunion. Игра вышла 26 марта на PC, PS5 и Xbox Series X/S. Проект получил высокие оценки. 

На Metacritic у тайтла 85 баллов из 100 на основе 4 обзоров.',
    content: `<p>В сети появились первые обзоры Life is Strange: Reunion. Игра вышла 26 марта на PC, PS5 и Xbox Series X/S. Проект получил высокие оценки.</p>
<p>На Metacritic у тайтла 85 баллов из 100 на основе 4 обзоров. OpenCritic выдал 83 балла и 100% «рекомендовано» на основе 5 рецензий. Обозреватели отмечают сильную историю, проработанных персонажей и приятную графику.</p>
<p>Стоит ли играть? Первые отзывы намекают, что да.</p>

<div class="mt-8 p-6 rounded-xl bg-gradient-to-r from-[#00D4FF]/10 to-transparent border border-[#00D4FF]/20">
<p class="text-lg font-semibold text-white mb-2">Купить Life is Strange: Double Exposure</p>
<p class="text-sm text-gray-400 mb-4">Цена в турецком <a href="/sale" class="text-[#00D4FF] hover:underline">PS Store</a>: 3000 ₽ (скидка с 6250 ₽). Активация за 5 минут.</p>
<a href="/sale" class="inline-block px-6 py-3 bg-[#00D4FF] text-black font-semibold rounded-lg hover:bg-[#00B8D9] transition">Купить за 3000 ₽ →</a>
</div>`,
    coverUrl: '/images/news/news-1774800734542-i94p.jpg',
    date: '2026-03-29T16:13:03.842Z',
    source: 'r/Games',
    author: 'ActivePlay',
    tags: ["Life is Strange: Reunion","обзор","оценки"],
    metaDescription: 'Первые оценки Life is Strange: Reunion. Metacritic 85 баллов, OpenCritic 83 балла и 100% рекомендовано.',
  },
  {
    id: 'news-1774796143853-imy7',
    slug: 'crimson-desert-vyshel-patch-1-01-00-s-novymi-mauntami-i-uluchsheniyami',
    category: 'news' as NewsCategory,
    title: 'Crimson Desert: вышел патч 1.01.00 с новыми маунтами и улучшениями',
    excerpt: 'Для Crimson Desert вышло обновление 1.01.00 на PC. Главное: в игре появились пять новых легендарных маунтов. Их можно получить после выполнения определенных условий. Разработчики также добавили сундук',
    content: `<p>Для Crimson Desert вышло обновление 1.01.00 на PC. Главное: в игре появились пять новых легендарных маунтов. Их можно получить после выполнения определенных условий. Разработчики также добавили сундуки с ресурсами в Pywel.</p>
<p>Еще одно важное нововведение: жетоны улучшения. С ними можно поднять уровень экипировки сразу до 4 стадии. Никаких дополнительных ресурсов не потребуется. Жетоны дают за выполнение основных и фракционных квестов. Появилась и функция быстрого создания предметов. Больше не нужно выбирать ингредиенты вручную.</p>
<p>Разработчики добавили функцию перемещения всех выбранных предметов в личное хранилище. Преступления больше не снижают уровень вклада фракции, если вас не поймали.</p>`,
    coverUrl: '/images/news/news-1774796143853-imy7.jpg',
    date: '2026-03-29T14:56:54.705Z',
    source: 'Destructoid',
    author: 'ActivePlay',
    tags: ["Crimson Desert","патч","обновление"],
    metaDescription: 'Патч 1.01.00 для Crimson Desert добавил новых маунтов, жетоны улучшения и исправил баланс.',
  },
  {
    id: 'news-1774734130936-omfv',
    slug: 'vo-chto-poigrat-6-novyh-igr-dlya-ps5-i-ps4-na-sleduyushchey-nedele',
    category: 'news' as NewsCategory,
    title: 'Во что поиграть: 6 новых игр для PS5 и PS4 на следующей неделе',
    excerpt: 'На следующей неделе выходит несколько интересных игр для PlayStation. South of Midnight, ранее анонсированная для Xbox, появится на PS5. Konami готовит к релизу Darwin\'s Paradox. Также стоит обратить ',
    content: `<p>На следующей неделе выходит несколько интересных игр для PlayStation. South of Midnight, ранее анонсированная для Xbox, появится на PS5. Konami готовит к релизу Darwin's Paradox.</p>
<p>Также стоит обратить внимание на Legacy of Kain. Конец финансового года обычно не богат на релизы, но в этот раз есть, во что поиграть. Подробные обзоры ищите на сайте.</p>`,
    coverUrl: '/images/news/news-1774734130936-omfv.jpg',
    date: '2026-03-28',
    source: 'Push Square',
    author: 'ActivePlay',
    tags: ["PS5","PS4","новые игры","South of Midnight","Darwin's Paradox"],
    metaDescription: 'Обзор новых игр для PS5 и PS4, выходящих на следующей неделе. South of Midnight, Darwin\'s Paradox и другие ожидаемые релизы.',
  },
  {
    id: 'news-1774732310559-fk9u',
    slug: 'igroki-raznosyat-dlc-dlya-borderlands-4-iz-za-ceny-i-dlitelnosti',
    category: 'news' as NewsCategory,
    title: 'Игроки разносят DLC для Borderlands 4 из-за цены и длительности',
    excerpt: 'Новое DLC для Borderlands 4 под названием Mad Ellie and the Vault of the Damned столкнулось с разгромными отзывами в Steam. Геймеры недовольны ценой в 30$ и короткой продолжительностью. У дополнения "',
    content: `<p>Новое DLC для Borderlands 4 под названием Mad Ellie and the Vault of the Damned столкнулось с разгромными отзывами в Steam. Геймеры недовольны ценой в 30\$ и короткой продолжительностью. У дополнения "в основном отрицательные" отзывы.</p>
<p>Игроки считают, что контента слишком мало для такой стоимости.  В DLC есть новый охотник, новая карта, боссы и снаряжение. Однако всё это проходится всего за пару часов. Многие уверены: это мало для полноценного расширения за полную цену.</p>
<p>Для сравнения, дополнение Blood and Wine для Witcher 3 стоило 20\$ на старте. При этом оно предлагало 40 часов геймплея и отдельную историю. Некоторые игроки отмечают скучный сюжет DLC.</p>`,
    coverUrl: '/images/news/news-1774732310559-fk9u.jpg',
    date: '2026-03-28',
    source: 'Destructoid',
    author: 'ActivePlay',
    tags: ["Borderlands 4","DLC","Steam","Обзор"],
    metaDescription: 'Новое DLC для Borderlands 4 получило плохие отзывы в Steam из-за высокой цены и короткой продолжительности.',
  },
  {
    id: 'news-1774728153215-k8b5',
    slug: 'lords-of-the-fallen-vozglavit-ps-plus-essential-v-aprele-2026',
    category: 'rumor' as NewsCategory,
    title: 'Lords of the Fallen возглавит PS Plus Essential в апреле 2026',
    excerpt: 'Утечка раскрыла одну из игр, которая появится в PS Plus Essential в апреле. По информации от Dealabs, главной игрой станет Lords of the Fallen. Важно: речь о перезапуске 2023 года, а не об оригинально',
    content: `<p>Утечка раскрыла одну из игр, которая появится в <a href="/ps-plus-essential" class="text-[#00D4FF] hover:underline">PS Plus Essential</a> в апреле. По информации от Dealabs, главной игрой станет Lords of the Fallen. Важно: речь о перезапуске 2023 года, а не об оригинальной игре 2014-го.</p>
<p>Это souls-like экшен с мрачным фэнтези и хардкорными боссами. Разработчик: Hexworks. У игры 73 балла на Metacritic.</p>
<p>Официальный анонс стоит ждать на следующей неделе.</p>`,
    coverUrl: '',
    date: '2026-03-29T16:13:03.842Z',
    source: 'Push Square',
    author: 'ActivePlay',
    tags: ["PS Plus","Lords of the Fallen","игры","слухи","анонс"],
    metaDescription: 'Утечка: Lords of the Fallen станет одной из бесплатных игр PS Plus Essential в апреле. Подробности и детали.',
  }
];
