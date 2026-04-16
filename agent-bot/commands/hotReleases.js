async function handle(ctx) {
  await ctx.reply(
`🔥 Горящие новинки

Блок «Новинки» на сайте управляется вручную.
Текущие игры: Resident Evil Requiem, Crimson Desert, Nioh 3, Monster Hunter Stories 3.

Когда AI-агент будет полностью запущен — этот блок будет обновляться автоматически.`
  );
}

module.exports = { handle };
