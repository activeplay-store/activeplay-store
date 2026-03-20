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

// Dynamic badge per period + plan (PS only)
function getPsBadge(planName: string, period: Period, region?: Region): { text: string; bg: string; glow: string } | null {
  if (period === 1 && planName === 'Extra') {
    return { text: 'Популярный выбор', bg: 'linear-gradient(135deg, #00D4FF, #0070D1)', glow: 'rgba(0,212,255,0.35)' };
  }
  if (period === 3 && planName === 'Deluxe') {
    return { text: 'Мы рекомендуем', bg: 'linear-gradient(135deg, #8B5CF6, #6D28D9)', glow: 'rgba(139,92,246,0.35)' };
  }
  if (period === 12 && planName === 'Essential' && region !== 'ukraine') {
    return { text: 'Максимальная выгода', bg: 'linear-gradient(135deg, #00E676, #00C853)', glow: 'rgba(0,230,118,0.35)' };
  }
  return null;
}

// Xbox dynamic badge — mirrors PS badge logic
function getXboxBadge(planName: string, period: Period): { text: string; bg: string; glow: string } | null {
  if (period === 1 && planName === 'Ultimate') {
    return { text: 'Популярный выбор', bg: 'linear-gradient(135deg, #00D4FF, #0070D1)', glow: 'rgba(0,212,255,0.35)' };
  }
  if (period === 3 && planName === 'Ultimate') {
    return { text: 'Мы рекомендуем', bg: 'linear-gradient(135deg, #8B5CF6, #6D28D9)', glow: 'rgba(139,92,246,0.35)' };
  }
  if (period === 12 && planName === 'Essential') {
    return { text: 'Максимальная выгода', bg: 'linear-gradient(135deg, #00E676, #00C853)', glow: 'rgba(0,230,118,0.35)' };
  }
  return null;
}

export default function PlanCard({ plan, period, region, platform, onOrder }: PlanCardProps) {
  const prices = platform === 'ps'
    ? plan.prices[region || 'turkey']
    : plan.prices.global;

  if (!prices) return null;

  const price = prices[period];
  if (!price) return null;

  const monthlyPrice = period > 1 ? Math.round(price / period) : null;
  const savings = period === 12 && prices[1] && prices[12] ? prices[1] * 12 - prices[12] : 0;

  const isPs = platform === 'ps';
  const psCheckColor = isPs ? getPsCheckColor(plan.name) : null;
  const psTitleColor = isPs ? getPsTitleColor(plan.name) : null;
  const checkColor = psCheckColor || plan.color;
  const titleColor = psTitleColor || plan.color;

  const psBadge = isPs ? getPsBadge(plan.name, period, region) : null;
  const xboxBadge = !isPs ? getXboxBadge(plan.name, period) : null;
  const hasBadge = !!psBadge || !!xboxBadge;

  const cardId = platform === 'ps'
    ? `ps-${plan.name.toLowerCase()}`
    : `xbox-${plan.name.toLowerCase()}`;

  return (
    <div
      id={cardId}
      className={`relative flex flex-col card-base min-w-[280px] w-full snap-start cursor-pointer ${
        hasBadge ? 'card-popular z-10' : ''
      }`}
      onClick={() => {
        const fullName = platform === 'ps'
          ? `PS Plus ${plan.name} (${period} мес, ${region === 'ukraine' ? 'Украина' : 'Турция'})`
          : `Xbox Game Pass ${plan.name} (${period} мес)`;
        onOrder(fullName, price);
      }}
    >
      {/* Dynamic PS badge */}
      {psBadge && (
        <div
          className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full text-xs font-bold uppercase text-white whitespace-nowrap tracking-wide animate-fade-in-up"
          style={{
            background: psBadge.bg,
            boxShadow: `0 0 20px ${psBadge.glow}`,
          }}
        >
          {psBadge.text}
        </div>
      )}

      {/* Dynamic Xbox badge */}
      {xboxBadge && (
        <div
          className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full text-xs font-bold uppercase text-white whitespace-nowrap tracking-wide animate-fade-in-up"
          style={{
            background: xboxBadge.bg,
            boxShadow: `0 0 20px ${xboxBadge.glow}`,
          }}
        >
          {xboxBadge.text}
        </div>
      )}

      {/* Top color stripe */}
      <div
        className="h-1 rounded-t-2xl"
        style={{ background: plan.color }}
      />

      <div className="flex flex-col flex-1 p-6">
        {/* Plan name */}
        <div className="flex items-center gap-2 mb-1">
          <h3
            className="text-[18px] font-semibold font-display"
            style={{ color: titleColor, fontStyle: 'normal' }}
          >
            {plan.name}
          </h3>
        </div>
        {plan.subtitle && (
          <p className="mb-1" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{plan.subtitle}</p>
        )}

        {/* Price — DOMINANT */}
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
          {savings > 0 && (
            <p className="text-sm text-[var(--success)] font-medium mt-1 tabular-nums">
              Экономия {savings.toLocaleString('ru-RU')} ₽ за год
            </p>
          )}
        </div>

        {/* Features */}
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

        {/* Order button */}
        <button
          onClick={() => {
            const fullName = platform === 'ps'
              ? `PS Plus ${plan.name} (${period} мес, ${region === 'ukraine' ? 'Украина' : 'Турция'})`
              : `Xbox Game Pass ${plan.name} (${period} мес)`;
            onOrder(fullName, price);
          }}
          className={`${hasBadge ? 'btn-primary-orange' : 'btn-primary'} w-full py-3.5 rounded-xl`}
        >
          Оформить заказ
        </button>

        <p className="text-xs text-[var(--text-muted)] text-center mt-2">
          Менеджер ответит за 2–3 минуты
        </p>
      </div>
    </div>
  );
}
