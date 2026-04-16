const allowedIds = (process.env.ALLOWED_IDS || '')
  .split(',')
  .map(id => parseInt(id.trim()))
  .filter(id => !isNaN(id));

function accessMiddleware() {
  return (ctx, next) => {
    // /id доступна всем — чтобы узнать свой ID
    if (ctx.message?.text?.startsWith('/id')) {
      return next();
    }

    const userId = ctx.from?.id;
    if (!userId || !allowedIds.includes(userId)) {
      return ctx.reply('⛔ Доступ запрещён');
    }

    return next();
  };
}

module.exports = { accessMiddleware, allowedIds };
