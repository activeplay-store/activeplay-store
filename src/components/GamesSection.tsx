'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import MessengerPopup from './MessengerPopup';
import { dealsData, saleMeta } from '@/data/deals';
import type { DealGame } from '@/data/deals';

/* ── Helpers ──────────────────────────────────────────────────────────── */

function badgeColor(discount: number): string {
  if (discount >= 65) return '#EF4444';
  if (discount >= 40) return '#EAB308';
  return '#22C55E';
}

function formatEndDate(iso?: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  return `до ${d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }).replace('.', '')}`;
}

function getMostCommonEndDate(games: DealGame[]): string {
  const counts: Record<string, number> = {};
  for (const g of games) {
    if (g.saleEndDate) {
      counts[g.saleEndDate] = (counts[g.saleEndDate] || 0) + 1;
    }
  }
  let best = '';
  let bestCount = 0;
  for (const [date, count] of Object.entries(counts)) {
    if (count > bestCount) { best = date; bestCount = count; }
  }
  return best;
}

function formatPlatforms(platforms: string[]): string {
  const hasPS4 = platforms.some(p => p.includes('PS4'));
  const hasPS5 = platforms.some(p => p.includes('PS5'));
  if (hasPS4 && !hasPS5) return 'PS5 / PS4';
  if (hasPS5 && hasPS4) return 'PS5 / PS4';
  if (hasPS5) return 'PS5';
  return platforms.join(' / ');
}

/* ── Genre lookup (Russian) ───────────────────────────────────────────── */

const dealGenres: Record<string, string> = {
  "ea-sports-fc-26-ps4-ps5": "Спорт",
  "astro-bot": "Платформер",
  "battlefield-6": "Шутер",
  "red-dead-redemption-2": "Экшен / Open World",
  "split-fiction": "Кооп-адвенчура",
  "it-takes-two-ps4-ps5": "Кооп-адвенчура",
  "forza-horizon-5": "Гонки",
  "nba-2k26-for-ps5": "Спорт",
  "call-of-duty-black-ops-6-cross-gen-bundle": "Шутер",
  "a-way-out": "Кооп-адвенчура",
  "grand-theft-auto-v": "Экшен / Open World",
  "f1-25": "Гонки",
  "arc-raiders": "Шутер / Кооп",
  "elden-ring-ps4-ps5": "Экшен-RPG",
  "gran-turismo-7": "Гонки",
  "claws-of-awaji-assassin-s-creed-shadows": "Экшен-RPG",
  "silent-hill-f": "Survival Horror",
  "mafia-the-old-country": "Экшен",
  "tekken-8": "Файтинг",
  "the-crew-motorfest-3": "Гонки",
  "ufc-5": "Файтинг",
  "kingdom-come-deliverance-ii-expansion-pass": "RPG",
  "mortal-kombat-1": "Файтинг",
  "diablo-iv": "Экшен-RPG",
  "clair-obscur-expedition-33": "RPG",
  "marvel-s-spider-man-remastered": "Экшен",
  "the-last-of-us-part-ii-remastered": "Экшен",
  "resident-evil-3": "Survival Horror",
  "dying-light-the-beast": "Экшен / Open World",
  "nhl-26-ps5": "Спорт",
  "grand-theft-auto-the-trilogy-the-definitive-edition-ps5-ps4": "Экшен",
  "kingdom-come-deliverance-royal-edition": "RPG",
  "atomic-heart-ps4-ps5": "Шутер",
  "dying-light-2-stay-human-ps4-ps5": "Экшен / Open World",
  "the-witcher-3-wild-hunt": "RPG",
  "s-t-a-l-k-e-r-2-heart-of-chornobyl": "Шутер",
  "doom-the-dark-ages-premium-upgrade": "Шутер",
  "stray": "Приключения",
  "mortal-kombat-11": "Файтинг",
  "gang-beasts": "Аркада",
  "cyberpunk-2077-phantom-liberty": "RPG",
  "warhammer-40-000-space-marine-2": "Экшен",
  "cuphead-the-delicious-last-course": "Платформер",
  "helldivers-2": "Шутер / Кооп",
  "minecraft-dungeons": "Экшен-RPG",
  "need-for-speed-unbound-ultimate-collection": "Гонки",
  "marvel-s-spider-man-2": "Экшен",
  "unravel-two": "Платформер",
  "avatar-frontiers-of-pandora": "Экшен / Open World",
  "gears-of-war-reloaded": "Шутер",
  "the-last-of-us-part-i": "Экшен",
  "baldur-s-gate-3": "RPG",
  "sea-of-thieves": "Приключения",
  "resident-evil-6": "Экшен",
  "star-wars-jedi-cross-gen-bundle-edition": "Экшен",
  "indiana-jones-and-the-great-circle": "Приключения",
  "call-of-duty-vanguard-cross-gen-bundle": "Шутер",
  "age-of-empires-iv-anniversary-edition": "Стратегия",
  "hogwarts-legacy-ps5-version": "RPG",
  "ark-survival-ascended": "Выживание",
  "mafia-trilogy": "Экшен",
  "dispatch": "Симулятор",
  "assassin-s-creed-valhalla": "Экшен-RPG",
  "resident-evil-5": "Экшен",
  "cronos-the-new-dawn": "RPG",
  "elden-ring-nightreign": "Экшен-RPG",
  "borderlands4": "Шутер / RPG",
  "creed-rise-to-glory-championship-edition": "Спорт / VR",
  "snowrunner": "Симулятор",
  "star-wars-outlaws": "Экшен / Open World",
  "teardown": "Песочница",
  "senua-s-saga-hellblade-ii": "Экшен",
  "crash-team-racing-nitro-fueled": "Гонки",
  "overcooked-2": "Аркада",
  "dead-space": "Survival Horror",
  "tom-clancy-s-the-division-2": "Шутер / RPG",
  "stellar-blade": "Экшен",
  "hell-is-us": "Экшен-RPG",
  "lies-of-p": "Souls-like",
  "satisfactory": "Симулятор",
  "atomfall-ps4-ps5": "Экшен-RPG",
  "red-dead-redemption-ps4-ps5": "Экшен / Open World",
  "little-nightmares-iii": "Платформер",
  "assassin-s-creed-mirage": "Экшен",
  "mass-effect-legendary-edition": "RPG",
  "subnautica-ps4-ps5": "Выживание",
  "final-fantasy-xvi-complete-edition": "RPG",
  "final-fantasy-vii-rebirth": "RPG",
  "untitled-goose-game": "Аркада",
  "nascar-25": "Гонки",
  "persona-3-reload-ps4-ps5": "RPG",
  "avowed": "RPG",
  "yakuza-kiwami-ps4-ps5": "Экшен-RPG",
  "undisputed": "Файтинг",
  "the-first-berserker-khazan": "Souls-like",
  "plants-vs-zombies-replanted": "Аркада",
  "call-of-duty-black-ops-iii-zombies-chronicles": "Шутер",
  "sid-meier-s-civilization-vii-settler-s-edition": "Стратегия",
  "anno-117-pax-romana": "Стратегия",
  "lego-ps4-ps5": "Приключения",
  "the-elder-scrolls-iv-oblivion-remastered": "RPG",
  "need-for-speed-heat": "Гонки",
  "party-animals": "Аркада",
  "my-hero-academia-all-s-justice": "Файтинг",
  "dragon-ball-sparking-zero": "Файтинг",
  "lego-harry-potter-collection": "Приключения",
  "the-outer-worlds-2": "RPG",
  "mafia-definitive-edition": "Экшен",
  "just-dance-2026-edition": "Музыкальная",
  "guilty-gear-strive-blazing-edition": "Файтинг",
  "bloodborne-game-of-the-year-edition": "Souls-like",
  "mortal-kombat-xl": "Файтинг",
  "resident-evil-revelations": "Survival Horror",
  "goat-simulator-3": "Аркада",
  "wuchang-fallen-feathers": "Souls-like",
  "raft": "Выживание",
  "resident-evil": "Survival Horror",
  "ace-combat-7-skies-unknown": "Авиасимулятор",
  "jurassic-world-evolution-3": "Симулятор",
  "sonic-racing-crossworlds-ps4-ps5": "Гонки",
  "ninja-gaiden-2-black": "Экшен",
  "bleach-rebirth-of-souls-ps4-ps5": "Файтинг",
  "sniper-ghost-warrior-contracts-1-2-double-pack": "Шутер",
  "among-us": "Аркада",
  "resident-evil-revelations-2": "Survival Horror",
  "crysis-3-remastered": "Шутер",
  "far-cry-6-game-of-the-year-edition": "Шутер / Open World",
  "topspin-2k25-cross-gen-digital-edition": "Спорт",
  "sniper-ghost-warrior-3-season-pass-edition": "Шутер",
  "rayman-legends": "Платформер",
  "cars-3-driven-to-win": "Гонки",
  "warhammer-40-000-inquisitor": "Экшен-RPG",
  "demon-slayer-kimetsu-no-yaiba-the-hinokami-chronicles-2-ps4-ps5": "Файтинг",
  "jujutsu-kaisen-cursed-clash": "Файтинг",
  "rematch-elite-edition": "Спорт",
  "sifu": "Экшен",
  "ninja-gaiden-4": "Экшен",
  "supraland-six-inches-under": "Платформер",
  "slime-rancher": "Приключения",
  "the-elder-scrolls-v-skyrim-special-edition-ps5-ps4": "RPG",
  "crash-bandicoot-n-sane-trilogy": "Платформер",
  "bioshock-the-collection": "Шутер",
  "asterix-maxi-collection": "Аркада",
  "crysis-remastered-trilogy": "Шутер",
  "dungeons-4": "Стратегия",
  "nier-automata-game-of-the-yorha-edition": "Экшен-RPG",
  "need-for-speed-hot-pursuit-remastered": "Гонки",
  "final-fantasy-xv-royal-edition": "RPG",
  "dead-island-2": "Экшен",
  "a-plague-tale-innocence": "Приключения",
  "fallout-4-anniversary-edition-upgrade": "RPG",
  "degrees-of-separation": "Платформер",
  "code-vein-ii": "Souls-like",
  "watch-dogs-legion-ps4-ps5": "Экшен / Open World",
  "l-a-noire": "Экшен",
  "alien-rogue-incursion-vr": "Шутер / VR",
  "resident-evil-0": "Survival Horror",
  "expeditions-a-mudrunner-game-supreme-edition-ps4-ps5": "Симулятор",
  "moving-out-2": "Аркада",
  "sniper-elite-4": "Шутер",
  "like-a-dragon-pirate-yakuza-in-hawaii-ps4-ps5": "Экшен-RPG",
  "judgment": "Экшен",
  "destiny-2-year-of-prophecy": "Шутер / MMO",
  "sonic-superstars": "Платформер",
  "test-drive-unlimited-solar-crown": "Гонки",
  "warhammer-40-000-rogue-trader": "RPG",
  "borderlands-3-ps4-ps5": "Шутер / RPG",
  "the-sims-4-get-famous": "Симулятор",
  "final-fantasy-tactics-the-ivalice-chronicles-ps4-ps5": "RPG / Стратегия",
  "dirt-5-ps4-ps5": "Гонки",
  "life-is-strange-double-exposure": "Приключения",
  "dying-light-definitive-edition": "Экшен / Open World",
  "sonic-x-shadow-generations-ps4-ps5": "Платформер",
  "sniper-elite-3": "Шутер",
  "truck-and-logistics-simulator": "Симулятор",
  "car-mechanic-simulator-2021": "Симулятор",
  "disco-elysium-the-final-cut": "RPG",
  "tsukihime-a-piece-of-blue-glass-moon": "Визуальная новелла",
  "shinobi-art-of-vengeance-ps4-ps5": "Экшен",
  "middle-earth-shadow-of-war": "Экшен-RPG",
  "age-of-empires-ii-definitive-edition": "Стратегия",
  "call-of-duty-ghosts-and-season-pass-bundle": "Шутер",
  "naruto-x-boruto-ultimate-ninja-storm-connections-ps4-ps5": "Файтинг",
  "assetto-corsa": "Гонки",
  "wrc-9-fia-world-rally-championship-ps4-ps5": "Гонки",
  "borderlands-collection-pandora-s-box": "Шутер / RPG",
  "styx-master-of-stealth-collection": "Стелс",
  "lego-party": "Аркада",
  "of-lies-and-rain": "Souls-like",
  "matchpoint-tennis-championships-ps4-ps5": "Спорт",
  "deliver-us-mars-ps4-ps5": "Приключения",
  "ghostrunner": "Экшен",
  "desperados-iii": "Стратегия",
  "disciples-liberation-ps4-ps5": "RPG / Стратегия",
  "tropico-6-el-prez-edition": "Стратегия",
  "tennis-world-tour-2-ace-edition-ps4-ps5": "Спорт",
  "creaks": "Головоломка",
  "king-of-seas": "RPG",
  "kingdoms-of-amalur-re-reckoning-fate-edition": "Экшен-RPG",
  "date-a-live-rio-reincarnation": "Визуальная новелла",
  "moonfall-ultimate": "Платформер",
  "soul-axiom": "Приключения",
  "sherlock-holmes-chapter-one-season-pass": "Приключения",
  "evil-genius-2-season-pass": "Стратегия",
  "prison-architect-going-green": "Стратегия",
  "deck-of-ashes-complete-edition": "RPG",
  "my-name-is-mayo": "Аркада",
  "pool-and-snooker-bundle": "Спорт",
  "sports-bar-vr-2-0": "Спорт / VR",
  "football-nation-vr-tournament-2018": "Спорт / VR",
  "the-jekoos": "Аркада",
  "warhammer-quest-2-the-end-times": "RPG / Стратегия",
  "mr-massagy": "Аркада",
  "dwarrows": "Приключения",
  "aery-little-bird-adventure": "Приключения",
  "mekorama": "Головоломка",
  "allison-s-diary-rebirth": "Хоррор",
  "pressure-overdrive": "Аркада",
  "cybxus-heart": "Приключения",
  "dustoff-heli-rescue-2": "Аркада",
  "birdcakes": "Аркада",
  "dead-by-daylight-ps4-ps5": "Хоррор",
  "tom-clancy-s-ghost-recon-breakpoint": "Шутер / Open World",
  "need-for-speed-ultimate-bundle": "Гонки",
  "dirt-rally-2-0-year-one-pass": "Гонки",
  "dragon-ball-z-kakarot-daima-edition": "Экшен-RPG",
  "train-sim-world-6-special-edition-ps4-ps5": "Симулятор",
  "age-of-mythology-retold": "Стратегия",
  "need-for-speed-rivals-complete-edition": "Гонки",
  "resident-evil-4-2005": "Survival Horror",
  "call-of-duty-infinite-warfare-legacy-edition": "Шутер",
  "one-piece-pirate-warriors-4-legendary-edition": "Экшен",
  "metro-awakening": "Шутер / VR",
  "drums-rock-ultimate-music-edition": "Музыкальная / VR",
  "the-settlers-new-allies": "Стратегия",
  "thehunter-call-of-the-wild-ultimate-hunting-bundle": "Симулятор",
  "call-of-duty-wwii": "Шутер",
  "call-of-duty-advanced-warfare-digital-pro-edition-day-zero": "Шутер",
  "metro-2033-redux": "Шутер",
  "metro-last-light-redux": "Шутер",
  "project-motor-racing": "Гонки",
  "arken-age": "Приключения / VR",
  "lego-voyagers": "Приключения",
  "crossfire-sierra-squad": "Шутер / VR",
  "digimon-story-time-stranger": "RPG",
  "dragon-quest-i-ii-hd-2d-remake": "RPG",
  "fairy-tail": "RPG",
  "insurgency-sandstorm-4-year-anniversary-edition": "Шутер",
  "divinity-original-sin-2-definitive-edition-ps4-ps5": "RPG",
  "high-on-life": "Шутер",
  "fairy-tail-2-ps4-ps5": "RPG",
  "madison-vr": "Хоррор / VR",
  "wolfenstein-alt-history-collection": "Шутер",
  "berserk-and-the-band-of-the-hawk": "Экшен",
  "liftoff-drone-racing": "Гонки",
  "robocop-rogue-city-unfinished-business": "Шутер",
  "nobody-wants-to-die": "Приключения",
  "metro-exodus-expansion-pass": "Шутер",
  "alien-rogue-incursion-evolved-edition": "Шутер / VR",
  "commandos-origins": "Стратегия",
  "warhammer-40-000-chaos-gate-daemonhunters-purifier-edition-ps4-ps5": "RPG / Стратегия",
  "doom-anthology": "Шутер",
  "trailmakers": "Песочница",
  "arizona-sunshine-2": "Шутер / VR",
  "jusant": "Приключения",
  "zero-caliber-vr": "Шутер / VR",
  "nier-replicant-ver-1-22474487139": "Экшен-RPG",
  "metaphor-refantazio-35-atlus-ps4-ps5": "RPG",
  "the-midnight-walk": "Приключения / VR",
  "alien-isolation": "Survival Horror",
};

/* ── Card ─────────────────────────────────────────────────────────────── */

function DiscountCard({ game, region, onBuy }: { game: DealGame; region: 'tr' | 'ua'; onBuy: () => void }) {
  const prices = region === 'tr' ? game.prices.TR : game.prices.UA;
  if (!prices) return null;

  const oldPrice = prices.clientBasePrice;
  const newPrice = prices.clientSalePrice;

  return (
    <div className="flex-shrink-0 w-[200px] rounded-xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer" style={{ background: '#0a1628', border: '1px solid rgba(255,255,255,0.06)' }}>
      {/* Cover */}
      <div className="relative overflow-hidden" style={{ height: '280px' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={game.coverUrl} alt={`Купить ${game.name} PS5 со скидкой ${game.discountPct}%`} className="w-full h-full object-cover" style={{ objectPosition: 'center top', borderRadius: '12px 12px 0 0' }} loading="lazy" decoding="async" />
        {/* Discount badge */}
        <span className="absolute top-2 right-2 px-2 py-1 rounded-lg text-xs font-bold text-white" style={{ background: badgeColor(game.discountPct) }}>
          -{game.discountPct}%
        </span>
        {/* End date badge */}
        {game.saleEndDate && (
          <span className="absolute bottom-2 left-2 text-[10px] font-bold rounded" style={{ background: '#00D4FF', color: '#0A0E17', padding: '4px 8px' }}>
            {formatEndDate(game.saleEndDate)}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="px-3 pt-2 pb-3 flex flex-col flex-1">
        <h4 className="text-white font-display font-bold text-[13px] leading-tight line-clamp-2" style={{ fontStyle: 'normal' }}>
          {game.name}
        </h4>
        <span className="text-gray-400 text-[10px] mt-0.5 block">{formatPlatforms(game.platforms)}</span>
        {dealGenres[game.id] && (
          <span style={{ color: '#00D4FF', fontSize: '11px', display: 'block', marginTop: '2px', fontWeight: 600 }}>{dealGenres[game.id]}</span>
        )}

        {/* Prices */}
        <div className="mt-auto pt-2">
          <span className="text-[#6B7280] line-through text-xs block">{oldPrice.toLocaleString('ru-RU')}&thinsp;₽</span>
          <span className="text-white font-bold text-[18px] font-display" style={{ fontStyle: 'normal' }}>{newPrice.toLocaleString('ru-RU')}&thinsp;₽</span>
        </div>

        <button onClick={(e) => { e.stopPropagation(); onBuy(); }} className="btn-primary w-full rounded-lg mt-2 text-sm whitespace-nowrap" style={{ height: '40px', fontWeight: 600 }}>
          Купить
        </button>
      </div>
    </div>
  );
}

/* ── Section ──────────────────────────────────────────────────────────── */

export default function GamesSection() {
  const [region, setRegion] = useState<'tr' | 'ua'>('tr');
  const [popup, setPopup] = useState<{ name: string; price: number } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  // Select top 40 games by saving (in rubles)
  const carouselGames = useMemo(() => {
    return dealsData
      .filter(g => g.prices.TR && g.discountPct >= 20)
      .sort((a, b) => {
        const savingA = (a.prices.TR?.clientBasePrice || 0) - (a.prices.TR?.clientSalePrice || 0);
        const savingB = (b.prices.TR?.clientBasePrice || 0) - (b.prices.TR?.clientSalePrice || 0);
        return savingB - savingA;
      })
      .slice(0, 40);
  }, []);

  const maxDiscount = useMemo(() => Math.max(...carouselGames.map(g => g.discountPct), 0), [carouselGames]);

  const footerDate = useMemo(() => {
    const d = getMostCommonEndDate(carouselGames);
    if (!d) return '';
    const date = new Date(d);
    return ` Скидки действуют до ${date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}`;
  }, [carouselGames]);

  // Auto-scroll
  const autoScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || paused) return;
    if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 10) {
      el.scrollLeft = 0;
    } else {
      el.scrollLeft += 1;
    }
  }, [paused]);

  useEffect(() => {
    const id = setInterval(autoScroll, 30);
    return () => clearInterval(id);
  }, [autoScroll]);

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === 'left' ? -440 : 440, behavior: 'smooth' });
    }
  };

  // Duplicate for infinite loop
  const doubled = [...carouselGames, ...carouselGames];

  if (carouselGames.length === 0) return null;

  return (
    <section id="games" className="relative z-10 pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <svg width="28" height="28" viewBox="0 0 24 24" className="flex-shrink-0">
            <circle cx="12" cy="4" r="3" fill="#EF4444" style={{ filter: 'drop-shadow(0 0 4px rgba(239,68,68,0.6))' }} />
            <circle cx="12" cy="12" r="3" fill="#EAB308" style={{ filter: 'drop-shadow(0 0 4px rgba(234,179,8,0.6))' }} />
            <circle cx="12" cy="20" r="3" fill="#22C55E" style={{ filter: 'drop-shadow(0 0 4px rgba(34,197,94,0.6))' }} />
          </svg>
          <div>
            <a href="/sale" className="block hover:opacity-80 transition-opacity">
              <h2
                className="text-[26px] sm:text-[32px] md:text-[36px] font-bold"
                style={{
                  background: 'linear-gradient(135deg, #ffffff 30%, #00D4FF 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Игры со скидкой для PS5, PS4 и Xbox
              </h2>
            </a>
            <p className="text-[15px] text-[var(--text-secondary)]">
              {saleMeta?.saleName || 'Распродажа PS Store'} — скидки до {saleMeta?.maxDiscount || maxDiscount}%
            </p>
          </div>
        </div>

        {/* Region switcher */}
        <div className="flex rounded-xl bg-[var(--bg-elevated)] border border-white/[0.06] overflow-hidden w-fit mb-8">
          <button onClick={() => setRegion('tr')} className={`px-4 py-2.5 text-sm font-medium transition-all cursor-pointer flex items-center gap-1.5 ${region === 'tr' ? 'bg-[var(--brand)] text-white' : 'text-[var(--text-secondary)] hover:text-white'}`}>
            <svg width="20" height="14" viewBox="0 0 20 14" className="shrink-0"><rect width="20" height="14" fill="#E30A17" rx="2"/><circle cx="8" cy="7" r="4" fill="white"/><circle cx="9.5" cy="7" r="3" fill="#E30A17"/><polygon points="12,4.5 12.5,6.5 14.5,6.5 13,7.8 13.5,9.5 12,8.2 10.5,9.5 11,7.8 9.5,6.5 11.5,6.5" fill="white"/></svg>
            Турция
          </button>
          <button onClick={() => setRegion('ua')} className={`px-4 py-2.5 text-sm font-medium transition-all cursor-pointer flex items-center gap-1.5 ${region === 'ua' ? 'bg-[var(--brand)] text-white' : 'text-[var(--text-secondary)] hover:text-white'}`}>
            <svg width="20" height="14" viewBox="0 0 20 14" className="shrink-0"><rect width="20" height="7" fill="#005BBB" rx="2"/><rect y="7" width="20" height="7" fill="#FFD500" rx="2"/></svg>
            Украина
          </button>
        </div>

        {/* Carousel */}
        <div
          className="relative group/carousel"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <button onClick={() => scroll('left')} className="hidden sm:flex absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full items-center justify-center bg-[var(--bg-card)] border border-white/10 text-white opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-[var(--bg-card-hover)] cursor-pointer" aria-label="Назад">◀</button>
          <button onClick={() => scroll('right')} className="hidden sm:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full items-center justify-center bg-[var(--bg-card)] border border-white/10 text-white opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-[var(--bg-card-hover)] cursor-pointer" aria-label="Вперёд">▶</button>

          <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 items-stretch">
            {doubled.map((game, idx) => {
              const prices = region === 'tr' ? game.prices.TR : game.prices.UA;
              if (!prices) return null;
              return (
                <DiscountCard
                  key={`${game.id}-${idx}`}
                  game={game}
                  region={region}
                  onBuy={() => setPopup({ name: game.name, price: prices.clientSalePrice })}
                />
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2 mt-6 text-xs text-[var(--text-muted)]">
          <span className="pulse-dot" />
          Цены пересчитаны по курсу ЦБ.{footerDate}
        </div>

        <div className="text-center mt-8">
          <a href="/sale" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 text-white/80 hover:text-white hover:border-[#00D4FF]/50 hover:shadow-[0_0_20px_rgba(0,212,255,0.15)] transition-all text-sm font-medium">
            Показать все игры со скидкой
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </a>
        </div>
      </div>

      <MessengerPopup isOpen={!!popup} onClose={() => setPopup(null)} planName={popup?.name || ''} price={popup?.price || 0} />
    </section>
  );
}
