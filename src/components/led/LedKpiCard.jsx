import React from 'react';

export default function LedKpiCard({
  title,
  value,
  subvalue,
  icon: Icon,
  variant = 'blue',
  badgeText,
  onClick,
}) {
  const variantStyles = {
    navy: {
      cardBg: 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800',
      iconBg: 'bg-[#073B74]/10 text-[#073B74] dark:bg-[#073B74]/30 dark:text-blue-300',
      borderAccent: 'hover:border-[#073B74]',
      valueColor: 'text-[#073B74] dark:text-blue-400',
    },
    blue: {
      cardBg: 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800',
      iconBg: 'bg-[#0B5ED7]/10 text-[#0B5ED7] dark:bg-[#0B5ED7]/30 dark:text-blue-300',
      borderAccent: 'hover:border-[#0B5ED7]',
      valueColor: 'text-[#0B5ED7] dark:text-blue-400',
    },
    gold: {
      cardBg: 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800',
      iconBg: 'bg-[#C99A2E]/10 text-[#C99A2E] dark:bg-[#C99A2E]/30 dark:text-amber-300',
      borderAccent: 'hover:border-[#C99A2E]',
      valueColor: 'text-[#C99A2E] dark:text-amber-400',
    },
    amber: {
      cardBg: 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800',
      iconBg: 'bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400',
      borderAccent: 'hover:border-amber-400',
      valueColor: 'text-amber-600 dark:text-amber-400',
    },
    rose: {
      cardBg: 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800',
      iconBg: 'bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400',
      borderAccent: 'hover:border-rose-400',
      valueColor: 'text-rose-600 dark:text-rose-400',
    },
    emerald: {
      cardBg: 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800',
      iconBg: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400',
      borderAccent: 'hover:border-emerald-400',
      valueColor: 'text-emerald-600 dark:text-emerald-400',
    },
  }[variant] || {
    cardBg: 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800',
    iconBg: 'bg-blue-100 text-blue-600',
    borderAccent: 'hover:border-blue-400',
    valueColor: 'text-slate-900 dark:text-white',
  };

  return (
    <div
      onClick={onClick}
      className={`rounded-2xl border p-5 shadow-sm transition-all duration-200 ${variantStyles.cardBg} ${variantStyles.borderAccent} ${
        onClick ? 'cursor-pointer hover:shadow-md hover:-translate-y-0.5' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {title}
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl lg:text-3xl font-bold tracking-tight ${variantStyles.valueColor}`}>
              {typeof value === 'number' ? value.toLocaleString('th-TH') : value}
            </span>
            {badgeText && (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {badgeText}
              </span>
            )}
          </div>
          {subvalue && (
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {subvalue}
            </p>
          )}
        </div>

        {Icon && (
          <div className={`p-3 rounded-xl shrink-0 ${variantStyles.iconBg}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
}
