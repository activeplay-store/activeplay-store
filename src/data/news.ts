// Автогенерация — НЕ РЕДАКТИРОВАТЬ ВРУЧНУЮ
// Обновлено: 2026-03-28T21:44:03.482Z

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
  insider:      { label: 'Инсайд',   color: '#FF9500', icon: '🔍' },
  rumor:        { label: 'Слух',      color: '#F59E0B', icon: '🤫' },
  video:        { label: 'Видео',     color: '#FF4D6A', icon: '🎬' },
  guide:        { label: 'Гайд',      color: '#22C55E', icon: '📖' },
  interview:    { label: 'Интервью',  color: '#A855F7', icon: '🎙️' },
  podcast:      { label: 'Подкаст',   color: '#F59E0B', icon: '🎧' },
  review:       { label: 'Обзор',     color: '#FFD700', icon: '⭐' },
  announcement: { label: 'Анонс',     color: '#FF6B35', icon: '📢' },
};

export const newsData: NewsItem[] = [
  {
    id: 'news-arc-raiders-flashpoint-2026',
    slug: 'arc-raiders-flashpoint-update',
    category: 'news' as NewsCategory,
    title: 'ARC Raiders выпускает крупное обновление Flashpoint',
    excerpt: 'Кооперативный шутер ARC Raiders от Embark Studios готовится к крупному апдейту. Обновление Flashpoint выходит 31 марта и обещает серьёзно встряхнуть игру.',
    content: `<p>Кооперативный шутер ARC Raiders от Embark Studios готовится к крупному апдейту. Обновление Flashpoint выходит 31 марта и обещает серьёзно встряхнуть игру: новые квесты, враги, проекты, улучшения геймплея и качество жизни. По слухам, появится новый ARC-противник Bishop и локация Toxic Swamp. Плюс свежая косметика в магазине и проекты с эксклюзивными наградами.</p>
<p>ARC Raiders — это PvE-шутер на 21 игрока, где команды выживают на Земле против агрессивных роботов ARC. Игра вышла в раннем доступе и за короткое время собрала 55 тысяч оценок в <a href="/sale" class="text-[#00D4FF] hover:underline">PS Store</a> со средним баллом 4.22 — цифра для мультиплеерного шутера отличная. Визуал на уровне, PS5 Pro Enhanced, и Embark активно обновляют контент.</p>
<p>Обновление Flashpoint бесплатное для всех владельцев игры. А сама ARC Raiders сейчас идёт со скидкой 20% в PS Store Турция и Украина — через ActivePlay это примерно 3 050\u20BD вместо обычных 3 750\u20BD. Акция до 9 апреля. Хороший момент зайти перед крупным апдейтом.</p>`,
    coverUrl: '/images/covers/arc-raiders.jpg',
    date: '2026-03-29',
    source: 'ActivePlay',
    author: 'ActivePlay',
    tags: ["ARC Raiders","Flashpoint","обновление","кооператив","PS5","скидки PS Store"],
    metaDescription: 'ARC Raiders получает крупное обновление Flashpoint 31 марта — новые квесты, враги и локации. Игра со скидкой 20% в PS Store.',
    cta: {
      gameId: 'arc-raiders',
      title: 'Купить ARC Raiders',
      link: '/sale',
      subtitle: 'Скидка 20%. Турция и Украина. Активация за 5 минут.',
    },
  },
  {
    id: 'news-1774732310559-fk9u',
    slug: 'igroki-raznosyat-dlc-dlya-borderlands-4-iz-za-ceny-i-dlitelnosti',
    category: 'hype' as NewsCategory,
    title: 'Borderlands 4 DLC Mad Ellie: игроки уничтожили сразу после выхода',
    excerpt: 'Новое DLC для Borderlands 4 под названием Mad Ellie and the Vault of the Damned столкнулось с разгромными отзывами в Steam. Геймеры недовольны ценой в 30$ и короткой продолжительностью. У дополнения "',
    content: `<p>Первое сюжетное дополнение для Borderlands 4 не продержалось и суток. Mad Ellie and the Vault of the Damned вышло — и тут же утонуло в негативе. В Steam у дополнения статус «в основном отрицательные», соцсети кипят, а игроки не стесняются в выражениях. Главная претензия простая: за $30 они получили контента на два часа.</p>
<p>Формально в DLC есть всё что обещали: новый охотник, новая карта, боссы и снаряжение. Проблема в том, что всё это пролетает за пару вечерних часов. Для сравнения — дополнение Blood and Wine для Ведьмака 3 стоило $20 и давало 40 часов отдельной истории с целым новым регионом. Здесь же $30 за контент, который заканчивается раньше, чем успеваешь распробовать. Сюжет тоже хвалят не все — многим он показался скучным и предсказуемым.</p>
<p>При этом сама Borderlands 4 — отличный лутер-шутер и одна из самых ожидаемых игр года. Gearbox вернулись к корням серии: безумный юмор, тонны оружия, кооп на четверых. Mad Ellie — это первый из запланированных Story Pack, так что у студии ещё есть шанс исправиться со вторым дополнением Legend of the Stone Demon. А пока DLC можно спокойно подождать до скидки.</p>
<p>Кстати, сама Borderlands 4 сейчас продаётся со скидкой 30% в <a href="/sale" class="text-[#00D4FF] hover:underline">PS Store</a> Турция и Украина — через ActivePlay это примерно 4 250\u20BD вместо обычных 5 950\u20BD. Акция до 9 апреля. DLC Mad Ellie обойдётся в ~2 800\u20BD. Если давно хотел попробовать — самое время взять базу по скидке, а дополнение прикупить позже, когда подешевеет.</p>`,
    coverUrl: 'https://image.api.playstation.com/vulcan/ap/rnd/202603/1108/ea43bd79bb5cb00f3d728a02ea78e32956050f8998594a4c.png',
    date: '2026-03-28',
    source: 'Destructoid',
    author: 'ActivePlay',
    tags: ["Borderlands 4", "DLC", "Mad Ellie", "Gearbox", "лутер-шутер", "PS5", "скидки PS Store"],
    metaDescription: 'Новое DLC для Borderlands 4 получило плохие отзывы в Steam из-за высокой цены и короткой продолжительности.',
    cta: {
      gameId: 'borderlands4',
      title: 'Купить Borderlands 4',
      link: '/sale',
    },
  },
  {
    id: 'news-1774728153215-k8b5',
    slug: 'lords-of-the-fallen-vozglavit-ps-plus-essential-v-aprele-2026',
    category: 'insider' as NewsCategory,
    title: 'Lords of the Fallen возглавит PS Plus Essential в апреле 2026',
    excerpt: 'Утечка раскрыла одну из игр, которая появится в PS Plus Essential в апреле. По информации от Dealabs, главной игрой станет Lords of the Fallen. Важно: речь о перезапуске 2023 года, а не об оригинально',
    content: `<p>Инсайдер billbill-kun опубликовал на Dealabs утечку: главной игрой <a href="/ps-plus-essential" class="text-[#00D4FF] hover:underline">PS Plus Essential</a> в апреле станет Lords of the Fallen. Речь о перезапуске 2023 года от студии Hexworks, а не об оригинале 2014-го. billbill-kun — один из самых надёжных источников по составу PS Plus, его сливы подтверждаются уже два года подряд.</p>
<p>Для тех, кто пропустил: Lords of the Fallen — жёсткий action RPG с двумя параллельными мирами. Мир живых Axiom и мир мёртвых Umbral переплетаются прямо во время боя, и переключаться между ними можно в любой момент. На старте игра получила смешанные отзывы, но после серии крупных патчей преобразилась — стала плавнее, красивее и затягивает по-настоящему. Кооп на двоих, десятки боссов, около 30 часов на прохождение. Если нравится Dark Souls или Elden Ring — зайдёт однозначно.</p>
<p>Напомним, PS Plus Essential — базовая подписка PlayStation, которая помимо онлайн-мультиплеера каждый месяц дарит подписчикам бесплатные игры для PS5 и PS4. Прямо сейчас, в марте, можно забрать Monster Hunter Rise, PGA Tour 2K25, Slime Rancher 2 и The Elder Scrolls Online. Каталог обновляется в первый вторник месяца, так что Lords of the Fallen стоит ждать 7 апреля. Если подписки ещё нет — самое время оформить, чтобы не пропустить.</p>`,
    coverUrl: 'https://image.api.playstation.com/vulcan/ap/rnd/202308/2307/5b5caedff1afc1f8e36bafb49abe2a55baf873e0fd84fcd8.png',
    date: '2026-03-28',
    source: 'Push Square',
    author: 'ActivePlay',
    tags: ["PS Plus", "PS Plus Essential", "Lords of the Fallen", "апрель 2026", "бесплатные игры PlayStation"],
    metaDescription: 'Утечка: Lords of the Fallen станет одной из бесплатных игр PS Plus Essential в апреле. Подробности и детали.',
    cta: {
      productLink: '/ps-plus-essential',
      title: 'Оформить PS Plus Essential',
      price: '1 250 ₽/мес',
      link: '/ps-plus-essential',
      subtitle: 'Активация на турецком аккаунте за 5 минут.',
    },
  }
];
