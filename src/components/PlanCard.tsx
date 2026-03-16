'use client';

import type { PlanTier, Period, Region } from '@/data/subscriptions';

interface PlanCardProps {
  plan: PlanTier;
  period: Period;
  region?: Region;
  platform: 'ps' | 'xbox';
  onOrder: (planName: string, price: number) => void;
}

export default function PlanCard({ plan, period, region, platform, onOrder }: PlanCardProps) {
  const prices = platform === 'ps'
    ? plan.prices[region || 'turkey']
    : plan.prices.global;

  if (!prices) return null;

  const price = prices[period];
  const monthlyPrice = period > 1 ? Math.round(price / period) : null;

  return (
    <div
      className={`relative flex flex-col rounded-2xl border transition-all duration-300 min-w-[280px] w-full snap-start ${
        plan.popular
          ? 'border-[rgba(0,212,255,0.3)] scale-[1.03] z-10'
          : 'border-white/[0.06]'
      } bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] hover:-translate-y-1.5 hover:border-white/12`}
      style={{
        boxShadow: plan.popular
          ? '0 0 30px rgba(0,212,255,0.2), 0 8px 32px rgba(0,0,0,0.2)'
          : undefined,
      }}
    >
      {/* Popular badge */}
      {plan.popular && (
        <div
          className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full text-sm font-extrabold text-white whitespace-nowrap shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${plan.color}, ${plan.color}dd)`,
            boxShadow: `0 0 20px ${plan.color}50`,
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
        {/* Plan name */}
        <h3
          className="text-xl font-bold mb-4"
          style={{ color: plan.color, fontStyle: 'normal' }}
        >
          {plan.name}
        </h3>

        {/* Price */}
        <div className="mb-5">
          <div className="flex items-baseline gap-1.5">
            <span className="text-4xl font-extrabold text-white tabular-nums">
              {price.toLocaleString('ru-RU')}
            </span>
            <span className="text-sm text-[var(--text-secondary)]">
              ₽ / {period === 1 ? 'мес' : `${period} мес`}
            </span>
          </div>
          {monthlyPrice && (
            <p className="text-sm text-[var(--text-muted)] mt-1 tabular-nums">
              = {monthlyPrice.toLocaleString('ru-RU')} ₽/мес
            </p>
          )}
        </div>

        {/* Features */}
        <ul className="space-y-2.5 mb-6 flex-1">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5 text-sm text-[var(--text-primary)]">
              <svg
                className="w-4 h-4 mt-0.5 shrink-0"
                fill="none"
                stroke={plan.color}
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
              ? `PS Plus ${plan.name} (${period} мес, ${region === 'ukraine' ? '🇺🇦 Украина' : '🇹🇷 Турция'})`
              : `Xbox Game Pass ${plan.name} (${period} мес)`;
            onOrder(fullName, price);
          }}
          className="w-full py-3.5 rounded-xl font-bold text-white transition-all duration-250 cursor-pointer"
          style={{
            background: `linear-gradient(135deg, ${plan.color}, ${plan.color}cc)`,
            boxShadow: plan.popular ? `0 0 25px ${plan.color}40` : 'none',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.filter = 'brightness(1.12)';
            e.currentTarget.style.boxShadow = `0 0 35px ${plan.color}60`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = '';
            e.currentTarget.style.filter = '';
            e.currentTarget.style.boxShadow = plan.popular ? `0 0 25px ${plan.color}40` : 'none';
          }}
        >
          Оформить за 5 мин
        </button>

        {/* Микротекст под кнопкой (пункт 10) */}
        <p className="text-xs text-[var(--text-muted)] text-center mt-2">
          Менеджер ответит за 2–3 минуты
        </p>
      </div>
    </div>
  );
}
