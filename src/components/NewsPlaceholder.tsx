const placeholderNews = [
  {
    id: 1,
    gradient: 'from-blue-600/30 to-purple-600/30',
    title: 'Новые игры в каталоге PS Plus Extra в марте 2025',
    preview: 'Sony анонсировала мартовское обновление каталога PlayStation Plus Extra — 15 новых игр уже доступны подписчикам.',
    date: '10 марта 2025',
    tag: 'PlayStation',
    tagColor: 'text-blue-400 bg-blue-500/10',
  },
  {
    id: 2,
    gradient: 'from-green-600/30 to-teal-600/30',
    title: 'Xbox Game Pass получил крупное обновление библиотеки',
    preview: 'Microsoft добавила 12 новых проектов в Game Pass, включая долгожданные AAA-релизы этого месяца.',
    date: '8 марта 2025',
    tag: 'Xbox',
    tagColor: 'text-green-400 bg-green-500/10',
  },
  {
    id: 3,
    gradient: 'from-orange-600/30 to-red-600/30',
    title: 'GTA 6 — новый трейлер подтвердил дату релиза',
    preview: 'Rockstar Games опубликовала третий трейлер Grand Theft Auto VI, подтвердив выход 26 сентября 2025 года.',
    date: '5 марта 2025',
    tag: 'Общее',
    tagColor: 'text-orange-400 bg-orange-500/10',
  },
];

export default function NewsPlaceholder() {
  return (
    <section id="news" className="relative z-10 pt-12 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold gradient-text text-center mb-3">
          Новости
        </h2>
        <p className="text-center text-sm text-[var(--text-secondary)] mb-10">
          Актуальное из мира PlayStation и Xbox — обновляется автоматически из 15+ источников
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {placeholderNews.map((news) => (
            <div
              key={news.id}
              className="rounded-xl bg-[var(--bg-card)] border border-white/[0.06] overflow-hidden card-hover"
            >
              {/* Gradient placeholder image */}
              <div className={`h-40 bg-gradient-to-br ${news.gradient}`} />

              <div className="p-5">
                <h4 className="text-base font-bold text-white mb-2 line-clamp-2">
                  {news.title}
                </h4>
                <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-4">
                  {news.preview}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--text-muted)]">{news.date}</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${news.tagColor}`}>
                    {news.tag}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Social links */}
        <div className="mt-10 text-center">
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            Новости публикуются автоматически в Telegram @PS_PLUS_RUS и VK /activeplay
          </p>
          <div className="flex items-center justify-center gap-3">
            <a
              href="https://t.me/PS_PLUS_RUS"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-sm"
            >
              Telegram-канал
            </a>
            <a
              href="https://vk.com/activeplay"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-sm"
            >
              VK сообщество
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
