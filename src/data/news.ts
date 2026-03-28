// Автогенерация — НЕ РЕДАКТИРОВАТЬ ВРУЧНУЮ
// Обновлено: 2026-03-28T21:44:03.482Z

export type NewsCategory = 'news' | 'insider' | 'video' | 'guide' | 'interview' | 'podcast' | 'review' | 'announcement';

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
}

export const NEWS_CATEGORIES: Record<NewsCategory, { label: string; color: string; icon: string }> = {
  news:         { label: 'Новость',   color: '#00D4FF', icon: '📰' },
  insider:      { label: 'Инсайд',   color: '#FF9500', icon: '🔍' },
  video:        { label: 'Видео',     color: '#FF4D6A', icon: '🎬' },
  guide:        { label: 'Гайд',      color: '#22C55E', icon: '📖' },
  interview:    { label: 'Интервью',  color: '#A855F7', icon: '🎙️' },
  podcast:      { label: 'Подкаст',   color: '#F59E0B', icon: '🎧' },
  review:       { label: 'Обзор',     color: '#FFD700', icon: '⭐' },
  announcement: { label: 'Анонс',     color: '#FF6B35', icon: '📢' },
};

export const newsData: NewsItem[] = [
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
    category: 'insider' as NewsCategory,
    title: 'Lords of the Fallen возглавит PS Plus Essential в апреле 2026',
    excerpt: 'Утечка раскрыла одну из игр, которая появится в PS Plus Essential в апреле. По информации от Dealabs, главной игрой станет Lords of the Fallen. Важно: речь о перезапуске 2023 года, а не об оригинально',
    content: `<p>Утечка раскрыла одну из игр, которая появится в <a href="/ps-plus-essential" class="text-[#00D4FF] hover:underline">PS Plus Essential</a> в апреле. По информации от Dealabs, главной игрой станет Lords of the Fallen. Важно: речь о перезапуске 2023 года, а не об оригинальной игре 2014-го.</p>
<p>Это souls-like экшен с мрачным фэнтези и хардкорными боссами. Разработчик: Hexworks. У игры 73 балла на Metacritic.</p>
<p>Официальный анонс стоит ждать на следующей неделе.</p>`,
    coverUrl: '',
    date: '2026-03-28',
    source: 'Push Square',
    author: 'ActivePlay',
    tags: ["PS Plus","Lords of the Fallen","игры","слухи","анонс"],
    metaDescription: 'Утечка: Lords of the Fallen станет одной из бесплатных игр PS Plus Essential в апреле. Подробности и детали.',
  }
];
