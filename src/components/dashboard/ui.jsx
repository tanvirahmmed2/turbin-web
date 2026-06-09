'use client';

export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center p-20 gap-3 text-text-3 font-semibold text-sm">
      <div className="w-8 h-8 rounded-full border-[3px] border-slate-100 border-t-primary animate-spin" />
      <span>Loading details...</span>
    </div>
  );
}

export function ErrorMessage({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center p-20 gap-4 text-center bg-danger/5 border border-danger/15 rounded-3xl max-w-xl mx-auto my-8 shadow-sm">
      <div className="text-4xl filter drop-shadow-[0_4px_8px_rgba(239,68,68,0.25)]">⚠️</div>
      <div>
        <p className="text-danger font-bold text-base">Failed to retrieve data</p>
        <p className="text-xs text-text-3 mt-1.5 leading-relaxed">{message}</p>
      </div>
      {onRetry && (
        <button 
          className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-5 hover:border-slate-350 transition-colors active:scale-[0.98] mt-2 shadow-sm" 
          onClick={onRetry}
        >
          Try Again
        </button>
      )}
    </div>
  );
}

export function StatCard({ label, value, icon }) {
  return (
    <div className="relative border border-slate-100 rounded-2xl p-6 bg-white shadow-sm shadow-slate-100/50 transition-all duration-300 hover:border-slate-250">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="text-xs font-bold uppercase tracking-wider text-text-3">{label}</div>
        {icon && <div className="text-2xl filter drop-shadow-[0_4px_8px_rgba(99,102,241,0.08)]">{icon}</div>}
      </div>
      <div className="text-3xl font-black text-text tracking-tight leading-none">
        {value}
      </div>
    </div>
  );
}

export function EmptyState({ icon = '📭', title = 'No data yet', subtitle }) {
  return (
    <div className="text-center px-6 py-16 text-text-3 flex flex-col items-center gap-2">
      <div className="text-5xl mb-2 opacity-50 filter drop-shadow-[0_4px_8px_rgba(99,102,241,0.08)]">{icon}</div>
      <p className="font-bold text-text-2 text-sm">{title}</p>
      {subtitle && <p className="text-xs max-w-[280px] leading-relaxed">{subtitle}</p>}
    </div>
  );
}

export function StatusBadge({ status }) {
  const map = {
    active:    'badge-success',
    confirmed: 'badge-success',
    paid:      'badge-success',
    open:      'badge-success',
    success:   'badge-success',
    pending:   'badge-warning',
    draft:     'badge-warning',
    inactive:  'badge-warning',
    trial:     'badge-warning',
    cancelled: 'badge-danger',
    suspended: 'badge-danger',
    failed:    'badge-danger',
    refunded:  'badge-danger',
  };
  const cls = map[status] || 'badge-primary';
  return <span className={`badge ${cls}`}>{status}</span>;
}
