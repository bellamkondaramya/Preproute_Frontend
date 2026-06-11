import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate as useRouterNavigate, useParams as useRouterParams } from 'react-router-dom';
import { api } from '../lib/api.js';
import QuestionEditor from '../components/forms/QuestionEditor.jsx';

export default function QuestionBuilder() {
  const { id } = useRouterParams();
  const navigate = useRouterNavigate();
  const [test, setTest] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const load = () => api.get(`/tests/${id}`).then((res) => setTest(res.data.data)).catch((err) => setError(err.message));
  useEffect(() => { load(); }, [id]);

  const saveQuestion = async (question) => {
    setSaving(true);
    setError('');
    try {
      const res = await api.post(`/tests/${id}/questions`, question);
      setTest(res.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!test) return <div className="card p-10 font-semibold text-center text-slate-500">Loading test...</div>;
  const completed = test.questions?.length || 0;

  return (
    <div className="space-y-6 select-none">
      {/* Top Header: Breadcrumbs & Publish action */}
      <div className="flex items-center justify-between pb-2 border-b border-line/50">
        <div>
          <p className="text-xs sm:text-sm font-semibold text-muted">Test Creation &nbsp;/&nbsp; Create Test &nbsp;/&nbsp; Chapter Wise</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(`/tests/${id}/publish`)} className="btn-primary py-2.5 px-6">Publish</button>
        </div>
      </div>
      
      {error && <p className="rounded-lg bg-red-50 p-4 text-sm font-semibold text-red-600 border border-red-100">{error}</p>}
      
      {/* Grid container with responsive layouts and transition animations */}
      <div className={`grid ${sidebarCollapsed ? 'grid-cols-[60px_1fr]' : 'grid-cols-1 lg:grid-cols-[280px_1fr]'} gap-6 transition-all duration-300`}>
        
        {/* Collapsible Sidebar */}
        <aside className="card p-4 flex flex-col min-h-[500px] transition-all duration-300 relative select-none">
          {/* Header row with Title and Toggle button */}
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
              
              {/* Question list container */}
              <div className="space-y-2.5 overflow-y-auto max-h-[460px] pr-1 scrollbar-thin">
                {Array.from({ length: test.totalQuestions }).map((_, index) => {
                  const done = index < completed;
                  const active = index === completed; // Next question to fill
                  
                  let itemClass = "border-line bg-white text-slate-400";
                  if (done) {
                    itemClass = "border-[#10B981]/30 bg-[#F0FDF4] text-[#15803D] font-semibold";
                  } else if (active) {
                    itemClass = "border-[#4A72F6] bg-[#ECEFFF] text-[#4A72F6] font-bold ring-2 ring-[#4A72F6]/10";
                  }

                  return (
                    <div 
                      key={index} 
                      className={`flex items-center justify-between rounded-lg border px-3 py-2 text-xs transition duration-150 ${itemClass}`}
                    >
                      <span className="flex items-center gap-2">
                        {done ? (
                          <span className="flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-[#10B981] text-white text-[9px] font-bold">
                            ✓
                          </span>
                        ) : (
                          <span className={`h-1.5 w-1.5 rounded-full ${active ? 'bg-[#4A72F6]' : 'bg-slate-300'}`} />
                        )}
                        Question {index + 1}
                      </span>
                      <span className="text-[14px]">›</span>
                    </div>
                  );
                })}
              </div>

              {/* Red Exit button at the bottom */}
              <button 
                onClick={() => navigate('/dashboard')} 
                className="mt-auto w-full rounded-lg bg-[#FF6B6B] hover:bg-[#FF5252] py-2.5 text-xs font-bold text-white transition hover:shadow-lg hover:shadow-red-500/10 active:scale-95"
              >
                Exit Test Creation
              </button>
            </>
          ) : (
            /* Collapsed Sidebar Compact Icons View */
            <div className="flex flex-col items-center gap-3.5 overflow-y-auto max-h-[480px]">
              {Array.from({ length: test.totalQuestions }).map((_, index) => {
                const done = index < completed;
                const active = index === completed;

                let iconClass = "border-line bg-white text-slate-300";
                if (done) {
                  iconClass = "bg-[#10B981] border-[#10B981] text-white font-bold";
                } else if (active) {
                  iconClass = "bg-[#4A72F6] border-[#4A72F6] text-white font-bold";
                }

                return (
                  <div 
                    key={index} 
                    className={`flex h-7 w-7 items-center justify-center rounded-full border text-[9px] transition duration-150 ${iconClass}`}
                    title={`Question ${index + 1}`}
                  >
                    {done ? "✓" : index + 1}
                  </div>
                );
              })}
            </div>
          )}
        </aside>

        {/* Main Content Area */}
        <section className="card p-6 sm:p-8">
          
          {/* Test Info Details Card */}
          <div className="mb-8 rounded-xl border border-line bg-white p-5 sm:p-6 relative overflow-hidden shadow-sm">
            
            {/* Edit Pencil Icon top right */}
            <RouterLink 
              to={`/tests/${id}/edit`} 
              className="absolute top-4 right-5 text-gray-400 hover:text-[#4A72F6] transition text-base p-1.5"
              title="Edit Test Details"
            >
              ✎
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
                
                {/* Details list fields styled with correct spacing */}
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

              {/* Stats Box: premium style with stopwatch, doc, bar-chart icons */}
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
                  <span className="text-[#4B5563]">{completed} Q's</span>
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

          {/* Question Editor component */}
          <QuestionEditor 
            key={test.questions?.length || 0}
            test={test} 
            onSave={saveQuestion} 
            saving={saving} 
            navigate={navigate} 
          />
        </section>
      </div>
    </div>
  );
}

