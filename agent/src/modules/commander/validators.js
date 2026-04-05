function validateParams(intent) {
  const { intent: intentName, params } = intent;

  switch (intentName) {
    case "edit_news_title":
      if (!params?.newTitle || params.newTitle.length < 10) {
        return { valid: false, error: "Новый заголовок слишком короткий (минимум 10 символов)" };
      }
      break;

    case "edit_news_paragraph":
      if (!params?.paragraphNumber || params.paragraphNumber < 1 || params.paragraphNumber > 10) {
        return { valid: false, error: "Укажи номер абзаца (1-4)" };
      }
      if (!params?.instruction) {
        return { valid: false, error: "Укажи что изменить в абзаце" };
      }
      break;

    case "subs_price_update":
      if (!params?.newPrice || params.newPrice < 100 || params.newPrice > 50000) {
        return { valid: false, error: "Цена должна быть от 100 до 50 000₽" };
      }
      break;

    case "rates_set_markup":
      if (params?.markup < 0 || params?.markup > 1) {
        return { valid: false, error: "Наценка должна быть от 0 до 1₽" };
      }
      break;
  }

  return { valid: true };
}

module.exports = { validateParams };
