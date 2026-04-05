// Справочник intent-ов
const INTENTS = {
  // Новости
  edit_news_title: { domain: "news", description: "Поменять заголовок", requiresDeploy: true },
  edit_news_paragraph: { domain: "news", description: "Переписать абзац", requiresDeploy: true },
  edit_news_fix: { domain: "news", description: "Исправить ошибку", requiresDeploy: true },
  delete_news: { domain: "news", description: "Удалить новость", requiresDeploy: true },
  regenerate_news: { domain: "news", description: "Перегенерировать текст", requiresDeploy: true },

  // Главная
  home_hot_replace: { domain: "home", description: "Заменить игру в новинках", requiresDeploy: true },
  home_hot_reorder: { domain: "home", description: "Изменить порядок новинок", requiresDeploy: true },
  home_top_update: { domain: "home", description: "Обновить топ продаж", requiresDeploy: true },

  // Подписки
  subs_price_update: { domain: "subs", description: "Обновить цену подписки", requiresDeploy: true },

  // Скидки
  deals_add: { domain: "deals", description: "Добавить игру в скидки", requiresDeploy: true },
  deals_remove: { domain: "deals", description: "Убрать из скидок", requiresDeploy: true },

  // Предзаказы
  preorders_add: { domain: "preorders", description: "Добавить предзаказ", requiresDeploy: true },
  preorders_remove: { domain: "preorders", description: "Убрать предзаказ", requiresDeploy: true },

  // Курсы
  rates_update: { domain: "rates", description: "Обновить курс", requiresDeploy: false },
  rates_set_markup: { domain: "rates", description: "Изменить наценку", requiresDeploy: false },

  // Сайт
  site_status: { domain: "site", description: "Статус сервисов", requiresDeploy: false },
  site_deploy: { domain: "site", description: "Принудительный деплой", requiresDeploy: true },

  // Превью
  preview_edit_title: { domain: "preview", description: "Поменять заголовок превью", requiresDeploy: false },
  preview_edit_paragraph: { domain: "preview", description: "Поменять абзац превью", requiresDeploy: false },
  preview_edit_fix: { domain: "preview", description: "Исправить ошибку в превью", requiresDeploy: false },
};

module.exports = { INTENTS };
