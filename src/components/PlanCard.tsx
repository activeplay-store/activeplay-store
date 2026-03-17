'use client';

import type { PlanTier, Period, Region } from '@/data/subscriptions';

interface PlanCardProps {
  plan: PlanTier;
  period: Period;
  region?: Region;
  platform: 'ps' | 'xbox';
  onOrder: (planName: string, price: number) => void;
}

function getPsCheckColor(planName: string) {
  switch (planName) {
    case 'Essential': return '#C6A220';
    case 'Extra': return '#FFFFFF';
    case 'Deluxe': return '#FFFFFF';
    default: return null;
  }
}

function getPsTitleColor(planName: string) {
  switch (planName) {
    case 'Essential': return '#C6A220';
    case 'Extra': return '#FFFFFF';
    case 'Deluxe': return '#E8E8E8';
    default: return null;
  }
}

// FOMO badge config
function getFomoBadge(platform: string, planName: string): { text: string; sub: string } | null {
  if (platform === 'ps' && planName === 'Extra') {
    return { text: '\uD83D\uDD25 Хит продаж', sub: 'Выбирают 70% наших клиентов' };
  }
  if (platform === 'xbox' && planName === 'Ultimate') {
    return { text: '\uD83D\uDD25 Лучшая цена', sub: 'EA Play + облачный гейминг в комплекте' };
  }
  return null;
}

export default function PlanCard({ plan, period, region, platform, onOrder }: PlanCardProps) {
  const prices = platform === 'ps'
    ? plan.prices[region || 'turkey']
    : plan.prices.global;

  if (!prices) return null;

  const price = prices[period];
  const monthlyPrice = period > 1 ? Math.round(price / period) : null;

  // Savings calculation for 12-month period
  const savings = period === 12 ? prices[1] * 12 - prices[12] : 0;

  const isPs = platform === 'ps';
  const psCheckColor = isPs ? getPsCheckColor(plan.name) : null;
  const psTitleColor = isPs ? getPsTitleColor(plan.name) : null;

  const checkColor = psCheckColor || plan.color;
  const titleColor = psTitleColor || plan.color;

  const fomo = getFomoBadge(platform, plan.name);

  // Generate anchor id for SEO links
  const cardId = platform === 'ps'
    ? `ps-${plan.name.toLowerCase()}`
    : `xbox-${plan.name.toLowerCase()}`;

  return (
    <div
      id={cardId}
      className={`relative flex flex-col card-base min-w-[280px] w-full snap-start cursor-pointer ${
        plan.popular ? 'card-popular z-10' : ''
      }`}
      onClick={() => {
        const fullName = platform === 'ps'
          ? `PS Plus ${plan.name} (${period} мес, ${region === 'ukraine' ? 'Украина' : 'Турция'})`
          : `Xbox Game Pass ${plan.name} (${period} мес)`;
        onOrder(fullName, price);
      }}
    >
      {/* Popular badge */}
      {plan.popular && (
        <div
          className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full text-xs font-bold uppercase text-white whitespace-nowrap tracking-wide"
          style={{
            background: 'linear-gradient(135deg, #00D4FF, #0070D1)',
            boxShadow: '0 0 20px rgba(0,212,255,0.35)',
          }}
        >
          Популярный выбор
        </div>
      )}

      {/* Top color stripe */}
      <div
        className="h-1 rounded-t-2xl"
        style={{ background: plan.color }}
      />

      <div className="flex flex-col flex-1 p-6">
        {/* Plan name + FOMO badge */}
        <div className="flex items-center gap-2 mb-1">
          <h3
            className="text-[18px] font-semibold font-display"
            style={{ color: titleColor, fontStyle: 'normal' }}
          >
            {plan.name}
          </h3>
          {fomo && (
            <span
              className="px-2.5 py-0.5 rounded-full text-[11px] font-bold text-white animate-fomo-pulse uppercase tracking-wide"
              style={{ background: 'linear-gradient(135deg, #FF6B00, #FF2D00)' }}
            >
              {fomo.text}
            </span>
          )}
        </div>
        {plan.popular && (
          <p className="text-xs text-[var(--brand)] font-medium mb-3">Рекомендуем</p>
        )}

        {/* Price — DOMINANT: Rajdhani 700, 48px */}
        <div className="mb-5">
          <div className="flex items-baseline gap-1.5">
            <span className="price-display text-[36px] sm:text-[48px]">
              {price.toLocaleString('ru-RU')}
            </span>
            <span className="text-base text-[var(--text-secondary)]">
              ₽ / {period === 1 ? 'мес' : `${period} мес`}
            </span>
          </div>
          {monthlyPrice && (
            <p className="text-sm text-[var(--text-muted)] mt-1 tabular-nums">
              = {monthlyPrice.toLocaleString('ru-RU')} ₽/мес
            </p>
          )}
          {/* Savings for 12-month */}
          {savings > 0 && (
            <p className="text-sm text-[var(--success)] font-medium mt-1 tabular-nums">
              Экономия {savings.toLocaleString('ru-RU')} ₽ за год
            </p>
          )}
          {/* FOMO sub-text */}
          {fomo && (
            <p className="text-xs text-[var(--text-muted)] mt-1">{fomo.sub}</p>
          )}
        </div>

        {/* Features — Inter 400, 15px */}
        <ul className="space-y-2.5 mb-6 flex-1">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5 text-[15px] text-[var(--text-secondary)]">
              <svg
                className="w-4 h-4 mt-0.5 shrink-0"
                fill="none"
                stroke={checkColor}
                viewBox="0 0 24 24"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {feature}
            </li>
          ))}
        </ul>

        {/* Order button — Orange for popular, blue for others */}
        <button
          onClick={() => {
            const fullName = platform === 'ps'
              ? `PS Plus ${plan.name} (${period} мес, ${region === 'ukraine' ? 'Украина' : 'Турция'})`
              : `Xbox Game Pass ${plan.name} (${period} мес)`;
            onOrder(fullName, price);
          }}
          className={`${plan.popular ? 'btn-primary-orange' : 'btn-primary'} w-full py-3.5 rounded-xl`}
        >
          Оформить за 5 мин
        </button>

        {/* Микротекст под кнопкой */}
        <p className="text-xs text-[var(--text-muted)] text-center mt-2">
          Менеджер ответит за 2–3 минуты
        </p>
      </div>
    </div>
  );
}
