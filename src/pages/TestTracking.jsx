import { useEffect, useState } from 'react';
import { api } from '../lib/api.js';

export default function TestTracking() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/tests/tracking').then((res) => setRows(res.data.data)).catch((err) => setError(err.message));
  }, []);

  return (
    <div className="space-y-6">
      <div><p className="text-sm text-muted">Test Tracking</p><h2 className="mt-2 text-2xl font-bold text-ink">Published & Scheduled Tests</h2></div>
      {error && <p className="rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</p>}
      <div className="card overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-soft text-xs uppercase tracking-wide text-muted">
            <tr><th className="p-4">Test</th><th className="p-4">Subject</th><th className="p-4">Status</th><th className="p-4">Questions</th><th className="p-4">Attempts</th><th className="p-4">Avg Score</th></tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((row) => (
              <tr key={row.id} className="hover:bg-soft">
                <td className="p-4 font-semibold text-ink">{row.name}</td><td className="p-4 text-muted">{row.subject}</td><td className="p-4"><span className="badge bg-green-50 text-green-700">{row.status}</span></td><td className="p-4 text-muted">{row.completedQuestions}/{row.totalQuestions}</td><td className="p-4 text-muted">{row.attempts}</td><td className="p-4 text-muted">{row.averageScore}%</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!rows.length && <div className="p-10 text-center text-muted">No published tests yet. Publish a test to see tracking data.</div>}
      </div>
    </div>
  );
}
