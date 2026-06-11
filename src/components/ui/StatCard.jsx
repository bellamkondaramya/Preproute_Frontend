export default function StatCard({ label, value, tone = 'primary' }) {
  const tones = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    ink: 'bg-gray-100 text-ink'
  };
  return (
    <div className="card p-5">
      <div className={`mb-4 inline-flex rounded-xl px-3 py-2 text-sm font-semibold ${tones[tone]}`}>{label}</div>
      <div className="text-3xl font-bold text-ink">{value}</div>
    </div>
  );
}
