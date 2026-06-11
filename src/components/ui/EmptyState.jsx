export default function EmptyState({ title, description, action }) {
  return (
    <div className="card flex min-h-64 flex-col items-center justify-center p-10 text-center">
      <div className="mb-4 rounded-full bg-soft px-5 py-4 text-3xl">📝</div>
      <h3 className="text-lg font-bold text-ink">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-muted">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
