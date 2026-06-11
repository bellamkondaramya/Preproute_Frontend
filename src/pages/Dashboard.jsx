import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api.js';
import EmptyState from '../components/ui/EmptyState.jsx';

// ── Icon SVGs ──────────────────────────────────────────────────────────────
const Icons = {
  total: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  ),
  draft: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  ),
  published: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  ),
  scheduled: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  arrow: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  ),
  plus: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  chart: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  ),
};

// ── Stat Card ──────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, bg, iconColor, trend }) {
  return (
    <div className="card p-5 flex flex-col gap-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-500">{label}</span>
        <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${bg} ${iconColor}`}>
          {icon}
        </span>
      </div>
      <div className="flex items-end justify-between">
        <span className="text-3xl font-extrabold text-[#0B0A21] tabular-nums">
          {value ?? <span className="text-slate-300 text-2xl">—</span>}
        </span>
        {trend !== undefined && (
          <span className="text-xs font-semibold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">
            +{trend} this week
          </span>
        )}
      </div>
    </div>
  );
}

// ── Status Badge ──────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const normStatus = (status || '').toUpperCase();
  const map = {
    PUBLISHED: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
    DRAFT: 'bg-amber-50 text-amber-700 border border-amber-100',
    SCHEDULED: 'bg-blue-50 text-blue-700 border border-blue-100',
  };
  const labels = { PUBLISHED: 'Published', DRAFT: 'Draft', SCHEDULED: 'Scheduled' };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${map[normStatus] || 'bg-slate-100 text-slate-600'}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${normStatus === 'PUBLISHED' ? 'bg-emerald-500' : normStatus === 'DRAFT' ? 'bg-amber-500' : 'bg-blue-500'}`}/>
      {labels[normStatus] || status}
    </span>
  );
}

// ── Difficulty Badge ──────────────────────────────────────────────────────
function DiffBadge({ diff }) {
  const map = {
    Easy: 'bg-green-100 text-green-700',
    Medium: 'bg-orange-100 text-orange-700',
    Hard: 'bg-red-100 text-red-700',
  };
  return diff ? (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${map[diff] || 'bg-slate-100 text-slate-600'}`}>
      {diff}
    </span>
  ) : null;
}

// ── Main Component ────────────────────────────────────────────────────────
export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/dashboard')
      .then((res) => setData(res.data.data))
      .catch((err) => setError(err.message));
  }, []);

  const stats = data?.stats || {};
  const recentTests = data?.recentTests || [];

  return (
    <div className="space-y-8">

      {/* ── Page Header ── */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Overview</p>
          <h2 className="mt-1 text-2xl font-extrabold text-[#0B0A21]">All Tests</h2>
        </div>
        <Link
          to="/tests/create"
          className="btn-primary flex items-center gap-2"
        >
          {Icons.plus}
          Create Test
        </Link>
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 border border-red-100 p-4 text-sm font-semibold text-red-600">
          {error}
        </p>
      )}

      {/* ── Stat Cards Grid ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          label="Total Tests"
          value={stats.total}
          icon={Icons.total}
          bg="bg-[#ECEFFF]"
          iconColor="text-[#4A72F6]"
          trend={2}
        />
        <StatCard
          label="Draft"
          value={stats.draft}
          icon={Icons.draft}
          bg="bg-amber-50"
          iconColor="text-amber-500"
        />
        <StatCard
          label="Published"
          value={stats.published}
          icon={Icons.published}
          bg="bg-emerald-50"
          iconColor="text-emerald-600"
          trend={1}
        />
        <StatCard
          label="Scheduled"
          value={stats.scheduled}
          icon={Icons.scheduled}
          bg="bg-blue-50"
          iconColor="text-blue-500"
        />
      </div>

      {/* ── Recent Tests Table ── */}
      <section className="card overflow-hidden">
        {/* Table Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line px-6 py-5">
          <h3 className="text-base font-bold text-[#0B0A21]">Recent Tests</h3>
          <Link
            to="/tracking"
            className="flex items-center gap-1 text-sm font-semibold text-[#4A72F6] hover:text-[#3B61E6] transition"
          >
            {Icons.chart}
            View Tracking
          </Link>
        </div>

        {recentTests.length ? (
          <div className="divide-y divide-line">
            {/* Column headers */}
            <div className="hidden md:grid md:grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-50/60">
              <span>Test</span>
              <span>Type</span>
              <span>Questions</span>
              <span>Status</span>
              <span></span>
            </div>

            {recentTests.map((test) => {
              const done = test.questions?.length || 0;
              const total = test.totalQuestions || 0;
              const pct = total > 0 ? Math.round((done / total) * 100) : 0;
              return (
                <div
                  key={test._id}
                  className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 items-center px-6 py-4 hover:bg-slate-50/50 transition-colors duration-150"
                >
                  {/* Test name + tags */}
                  <div className="space-y-1.5">
                    <p className="font-bold text-[#0B0A21] text-sm leading-snug">{test.name}</p>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="rounded-md bg-[#0B0A21] text-white text-[10px] font-bold px-2 py-0.5 tracking-wide">
                        {test.subject || '—'}
                      </span>
                      {test.topic && (
                        <span className="rounded-lg bg-[#FFF7ED] text-[#EA580C] border border-[#FFEDD5] text-[10px] font-bold px-2 py-0.5">
                          {test.topic}
                        </span>
                      )}
                      {test.subTopic && (
                        <span className="rounded-lg bg-[#FEF9C3] text-[#CA8A04] border border-[#FEF08A] text-[10px] font-bold px-2 py-0.5">
                          {test.subTopic}
                        </span>
                      )}
                      <DiffBadge diff={test.difficulty} />
                    </div>
                  </div>

                  {/* Test type */}
                  <div className="hidden md:block">
                    <span className="text-xs font-semibold text-slate-500 capitalize">
                      {test.testType?.replace(/_/g, ' ') || 'Chapter Wise'}
                    </span>
                  </div>

                  {/* Questions progress */}
                  <div className="hidden md:block space-y-1.5">
                    <p className="text-xs font-bold text-[#0B0A21]">{done}/{total}</p>
                    <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#4A72F6] transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  {/* Status */}
                  <div className="hidden md:block">
                    <StatusBadge status={test.status} />
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/tests/${test._id}/questions`}
                      className="flex items-center gap-1 rounded-lg border border-[#4A72F6]/20 bg-[#ECEFFF] px-3 py-1.5 text-xs font-bold text-[#4A72F6] hover:bg-[#4A72F6] hover:text-white transition duration-150"
                    >
                      Open {Icons.arrow}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="No tests yet"
            description="Create your first chapter wise, PYQ, or mock test to get started."
            action={
              <Link to="/tests/create" className="btn-primary flex items-center gap-2">
                {Icons.plus} Create Test
              </Link>
            }
          />
        )}
      </section>
    </div>
  );
}
