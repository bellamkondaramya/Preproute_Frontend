import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { api } from '../lib/api.js';
import { Field, Select } from '../components/forms/Field.jsx';

export default function PublishTest() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  
  // Publish Mode: NOW or SCHEDULE
  const [mode, setMode] = useState('NOW');
  const [liveUntilType, setLiveUntilType] = useState('CUSTOM');
  
  // Date & Time states
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    api.get(`/tests/${id}`).then((res) => setTest(res.data.data)).catch((err) => setError(err.message));
  }, [id]);

  const publish = async () => {
    setSaving(true);
    setError('');
    
    // Combine date and time
    const startAtStr = startDate && startTime ? `${startDate}T${startTime}:00` : null;
    const endAtStr = endDate && endTime ? `${endDate}T${endTime}:00` : null;
    
    try {
      await api.post(`/tests/${id}/publish`, {
        mode: mode === 'NOW' ? 'NOW' : 'SCHEDULE',
        liveUntilType,
        startAt: startAtStr ? new Date(startAtStr).toISOString() : null,
        endAt: endAtStr ? new Date(endAtStr).toISOString() : null
      });
      navigate('/tracking');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!test) return <div className="card p-10 font-semibold text-center text-slate-500">Loading publish screen...</div>;
  const completedCount = test.questions?.length || 0;

  // Render collapsible question list where ALL questions are done (since we are publishing)
  const renderSidebar = (
    <aside className="card p-4 flex flex-col min-h-[500px] transition-all duration-300 relative select-none">
      <div className="flex items-center justify-between border-b border-line/80 pb-3 mb-4">
        {!sidebarCollapsed && <p className="text-sm font-bold text-[#1F2937]">Question creation</p>}
        <button 
          type="button" 
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="flex h-7 w-7 items-center justify-center rounded-full border border-line bg-slate-50 text-slate-400 hover:text-[#4A72F6] hover:bg-[#ECEFFF] transition cursor-pointer"
          title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {sidebarCollapsed ? "»" : "«"}
        </button>
      </div>

      {!sidebarCollapsed ? (
        <>
          <p className="mb-4 text-xs font-semibold text-slate-400">Total Questions . {test.totalQuestions}</p>
          
          <div className="space-y-2.5 overflow-y-auto max-h-[460px] pr-1 scrollbar-thin">
            {Array.from({ length: test.totalQuestions }).map((_, index) => {
              // ALL questions are marked green (done) in publish screen
              return (
                <div 
                  key={index} 
                  className="flex items-center justify-between rounded-lg border border-[#10B981]/30 bg-[#F0FDF4] text-[#15803D] font-semibold px-3 py-2 text-xs"
                >
                  <span className="flex items-center gap-2">
                    <span className="flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-[#10B981] text-white text-[9px] font-bold">
                      ✓
                    </span>
                    Question {index === 0 ? "x" : index === 3 ? "x" : index === 4 ? "x" : index + 1}
                  </span>
                  <span className="text-[14px]">›</span>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        /* Collapsed Sidebar Compact Icons View */
        <div className="flex flex-col items-center gap-3.5 overflow-y-auto max-h-[480px]">
          {Array.from({ length: test.totalQuestions }).map((_, index) => (
            <div 
              key={index} 
              className="flex h-7 w-7 items-center justify-center rounded-full border border-[#10B981] bg-[#10B981] text-white font-bold text-[9px]"
              title={`Question ${index + 1}`}
            >
              ✓
            </div>
          ))}
        </div>
      )}
    </aside>
  );

  return (
    <div className="space-y-6 select-none">
      {/* Top Header: Breadcrumbs & Confirmation screen */}
      <div className="pb-2">
        <p className="text-xs sm:text-sm font-semibold text-[#9CA3AF]">Test creation</p>
      </div>

      {error && <p className="rounded-lg bg-red-50 p-4 text-sm font-semibold text-red-600 border border-red-100">{error}</p>}

      {/* Responsive Grid with Collapsible Sidebar */}
      <div className={`grid ${sidebarCollapsed ? 'grid-cols-[60px_1fr]' : 'grid-cols-1 lg:grid-cols-[280px_1fr]'} gap-6 transition-all duration-300`}>
        
        {/* Render Collapsible Sidebar */}
        {renderSidebar}

        {/* Confirmation Form panel */}
        <section className="card p-6 sm:p-8 space-y-8">
          
          {/* Header Row: Test Created Title & Green Tick Badge */}
          <div className="flex flex-wrap items-center gap-3 select-none">
            <h3 className="text-lg font-bold text-[#1F2937]">Test created</h3>
            <span className="badge bg-[#D1FAE5] text-[#065F46] border border-[#A7F3D0] text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#10B981] text-white text-[9px] font-bold">✓</span>
              All {test.totalQuestions || 50} Questions done
            </span>
          </div>

          {/* Test Info Details Card */}
          <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 sm:p-6 relative overflow-hidden shadow-sm">
            <RouterLink 
              to={`/tests/${id}/edit`} 
              className="absolute top-5 right-6 text-[#4A72F6] hover:text-[#3B61E6] transition text-lg p-1.5"
              title="Edit Test Details"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-2.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </RouterLink>

            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="badge bg-[#0B0A21] text-white text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-md">
                    Chapter Wise
                  </span>
                  <span className="badge bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded-full select-none ml-2">
                    {test.difficulty || 'Easy'}
                  </span>
                </div>
                
                <h3 className="text-xl font-extrabold text-[#0B0A21] font-sans flex items-center gap-2">
                  <span>📚</span> {test.name || 'Chapter 1'}
                </h3>
                
                <div className="space-y-2 text-xs sm:text-sm text-slate-500 font-semibold pt-1">
                  <p className="flex items-center">
                    Subject &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: &nbsp;
                    <span className="font-extrabold text-[#0B0A21] ml-1">{test.subject}</span>
                  </p>
                  <p className="flex items-center">
                    Topic &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: &nbsp;
                    <span className="badge bg-[#FFF7ED] text-[#EA580C] border border-[#FFEDD5] text-[11px] font-bold px-2.5 py-0.5 rounded-lg select-none ml-1">
                      {test.topic || 'Grammar'}
                    </span>
                    <span className="badge bg-[#FFF7ED] text-[#EA580C] border border-[#FFEDD5] text-[11px] font-bold px-2.5 py-0.5 rounded-lg select-none ml-1.5">
                      Writing
                    </span>
                  </p>
                  <p className="flex items-center">
                    Sub Topic &nbsp;&nbsp;: &nbsp;
                    <span className="badge bg-[#FEF9C3] text-[#CA8A04] border border-[#FEF08A] text-[11px] font-bold px-2.5 py-0.5 rounded-lg select-none ml-1">
                      {test.subTopic || 'Application'}
                    </span>
                  </p>
                </div>
              </div>

              {/* Stats Box: exactly matching screenshots with stopwatch, doc, bar-chart icons */}
              <div className="flex items-center gap-3.5 rounded-lg border border-[#F3F4F6] bg-[#FAFAFB] px-3.5 py-1.5 text-xs font-bold text-[#9CA3AF] shrink-0 self-end select-none">
                <span className="flex items-center gap-1.5">
                  <svg className="h-3.5 w-3.5 text-[#9CA3AF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <circle cx="12" cy="12" r="9"/>
                    <polyline points="12 7 12 12 15 15"/>
                  </svg>
                  <span className="text-[#4B5563]">{test.durationMinutes} Min</span>
                </span>
                <span className="text-[#E5E7EB]">|</span>
                <span className="flex items-center gap-1.5">
                  <svg className="h-3.5 w-3.5 text-[#9CA3AF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-[#4B5563]">{test.totalQuestions || 50} Q's</span>
                </span>
                <span className="text-[#E5E7EB]">|</span>
                <span className="flex items-center gap-1.5">
                  <svg className="h-3.5 w-3.5 text-[#9CA3AF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span className="text-[#4B5563]">{test.totalMarks} Marks</span>
                </span>
              </div>
            </div>
          </div>

          {/* Tab/Toggle Buttons Group switcher — exactly matches slides */}
          <div className="flex items-center gap-2 select-none">
            <button
              type="button"
              onClick={() => setMode('NOW')}
              className={`rounded-lg px-4 py-2 text-xs sm:text-sm font-bold transition-all duration-150 ${
                mode === 'NOW'
                  ? 'bg-white border border-[#CBD5E1]/80 text-[#1F2937] shadow-sm'
                  : 'text-[#9CA3AF] hover:text-[#4B5563]'
              }`}
            >
              Publish Now
            </button>
            <button
              type="button"
              onClick={() => setMode('SCHEDULE')}
              className={`rounded-lg px-4 py-2 text-xs sm:text-sm font-bold transition-all duration-150 ${
                mode === 'SCHEDULE'
                  ? 'bg-white border border-[#CBD5E1]/80 text-[#1F2937] shadow-sm'
                  : 'text-[#9CA3AF] hover:text-[#4B5563]'
              }`}
            >
              Schedule Publish
            </button>
          </div>

          {/* Conditional Schedule Publish — no box, just label + inputs (matches Slide 1) */}
          {mode === 'SCHEDULE' && (
            <div className="space-y-3">
              <p className="text-sm font-bold text-[#1F2937]">Select Date and Time</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Date Input — placeholder text via value trick */}
                <div className="relative flex items-center">
                  <input
                    type={startDate ? "date" : "text"}
                    onFocus={(e) => (e.target.type = "date")}
                    onBlur={(e) => {
                      if (!startDate) e.target.type = "text";
                    }}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    placeholder="Select Date"
                    className="w-full rounded-lg border border-line bg-white px-4 py-3 text-sm font-medium outline-none focus:border-[#4A72F6] focus:ring-4 focus:ring-[#4A72F6]/10 text-slate-500"
                  />
                  {/* Calendar icon on the right */}
                  <svg className="absolute right-4 h-4 w-4 text-[#9CA3AF] pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                </div>

                {/* Select Time dropdown with styled chevron */}
                <select
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className={`form-input ${!startTime ? 'text-slate-400' : 'text-[#1F2937]'}`}
                >
                  <option value="">Select Time</option>
                  {['06:00','06:30','07:00','07:30','08:00','08:30','09:00','09:30','10:00','10:30',
                    '11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30',
                    '16:00','16:30','17:00','17:30','18:00','18:30','19:00','19:30','20:00','20:30',
                    '21:00','21:30','22:00','22:30','23:00','23:30'].map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Live Until Section */}
          <div className="pt-2">
            <h4 className="text-base font-bold text-[#1F2937] font-sans">Live Until</h4>
            <p className="mt-1 text-sm font-medium text-muted">Choose how long this test should remain available on the platform.</p>
            
            {/* Native radio grid — matches slides exactly */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5 select-none">
              {[
                ['ALWAYS', 'Always Available'],
                ['THREE_WEEKS', '3 Weeks'],
                ['ONE_WEEK', '1 Week'],
                ['ONE_MONTH', '1 Month'],
                ['TWO_WEEKS', '2 Weeks'],
                ['CUSTOM', 'Custom Duration']
              ].map(([val, label]) => (
                <label
                  key={val}
                  className="flex cursor-pointer items-center gap-3 text-sm font-semibold text-[#1F2937] hover:text-[#4A72F6] transition duration-150"
                >
                  <input
                    type="radio"
                    name="liveUntil"
                    value={val}
                    checked={liveUntilType === val}
                    onChange={() => setLiveUntilType(val)}
                    className="h-4 w-4 cursor-pointer accent-[#4A72F6] shrink-0"
                  />
                  {label}
                </label>
              ))}
            </div>

            {/* Custom End Date and Time — no box wrapper, just inputs (matches Slide 2 bottom section) */}
            {liveUntilType === 'CUSTOM' && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Select End Date */}
                <div className="relative flex items-center">
                  <input
                    type={endDate ? "date" : "text"}
                    onFocus={(e) => (e.target.type = "date")}
                    onBlur={(e) => {
                      if (!endDate) e.target.type = "text";
                    }}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    placeholder="Select End Date"
                    className="w-full rounded-lg border border-line bg-white px-4 py-3 text-sm font-medium outline-none focus:border-[#4A72F6] focus:ring-4 focus:ring-[#4A72F6]/10 text-slate-500"
                  />
                  <svg className="absolute right-4 h-4 w-4 text-[#9CA3AF] pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                </div>

                {/* Select End Time */}
                <select
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className={`form-input ${!endTime ? 'text-slate-400' : 'text-[#1F2937]'}`}
                >
                  <option value="">Select End Time</option>
                  {['06:00','06:30','07:00','07:30','08:00','08:30','09:00','09:30','10:00','10:30',
                    '11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30',
                    '16:00','16:30','17:00','17:30','18:00','18:30','19:00','19:30','20:00','20:30',
                    '21:00','21:30','22:00','22:30','23:00','23:30'].map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Footer Actions buttons */}
          <div className="pt-6 border-t border-line flex justify-end gap-4">
            <button 
              type="button"
              onClick={() => navigate(`/tests/${id}/questions`)} 
              className="rounded-xl bg-[#F5F7FF] text-[#4A72F6] hover:bg-[#ECEFFF] px-8 py-3 text-sm font-bold transition duration-200"
            >
              Cancel
            </button>
            <button 
              onClick={publish} 
              disabled={saving} 
              className="rounded-xl bg-[#4A72F6] hover:bg-[#3B61E6] text-white px-8 py-3 text-sm font-bold transition duration-200 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Confirm'}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

