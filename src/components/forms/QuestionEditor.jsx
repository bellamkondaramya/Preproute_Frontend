import { useState } from 'react';
import { Field, Select } from './Field.jsx';
import { DIFFICULTIES } from '../../lib/constants.js';

const emptyQuestion = {
  questionText: '',
  options: [
    { text: '', isCorrect: true },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false }
  ],
  solution: '',
  difficulty: 'EASY',
  topic: '',
  subTopic: ''
};

export default function QuestionEditor({ initialValue, test, onSave, saving, navigate }) {
  const [form, setForm] = useState(initialValue || { ...emptyQuestion, topic: test?.topic || '', subTopic: test?.subTopic || '' });
  const [localError, setLocalError] = useState('');
  
  const setOption = (index, patch) => {
    setForm((prev) => ({ ...prev, options: prev.options.map((option, idx) => idx === index ? { ...option, ...patch } : option) }));
  };
  
  const chooseCorrect = (index) => {
    setForm((prev) => ({ ...prev, options: prev.options.map((option, idx) => ({ ...option, isCorrect: idx === index })) }));
  };

  const deleteOption = (index) => {
    if (form.options.length <= 2) {
      setLocalError('MCQ must have at least 2 options.');
      return;
    }
    setLocalError('');
    setForm((prev) => {
      const newOptions = prev.options.filter((_, idx) => idx !== index);
      // If we deleted the correct option, set the first option as correct
      const hasCorrect = newOptions.some(opt => opt.isCorrect);
      if (!hasCorrect && newOptions.length > 0) {
        newOptions[0].isCorrect = true;
      }
      return { ...prev, options: newOptions };
    });
  };

  const addOption = () => {
    setLocalError('');
    setForm((prev) => ({
      ...prev,
      options: [...prev.options, { text: '', isCorrect: false }]
    }));
  };
  
  const reset = () => {
    setLocalError('');
    setForm({ ...emptyQuestion, topic: test?.topic || '', subTopic: test?.subTopic || '' });
  };

  const handleSave = () => {
    setLocalError('');
    const cleanOptions = form.options
      .map(opt => ({ ...opt, text: opt.text.trim() }))
      .filter(opt => opt.text !== '');

    if (!form.questionText.trim()) {
      setLocalError('Question text is required.');
      return;
    }
    if (cleanOptions.length < 2) {
      setLocalError('Please enter at least 2 options.');
      return;
    }
    if (!cleanOptions.some(opt => opt.isCorrect)) {
      setLocalError('Please choose which option is the correct answer.');
      return;
    }

    onSave({
      ...form,
      questionText: form.questionText.trim(),
      options: cleanOptions,
      solution: form.solution.trim()
    });
  };

  return (
    <div className="space-y-6 select-none">
      {/* Editor Header: Question index, action buttons */}
      <div className="flex items-center justify-between pb-2">
        <p className="text-base font-bold text-[#4A72F6]">
          Question {test?.questions?.length ? test.questions.length + 1 : 1}/{test?.totalQuestions || 50}
        </p>
        <div className="flex items-center gap-3">
          <button type="button" className="btn-secondary py-2.5 px-4 text-xs">+ MCQ</button>
          <button type="button" className="btn-secondary py-2.5 px-4 text-xs">🛠 CSV</button>
        </div>
      </div>

      {localError && (
        <p className="rounded-lg bg-red-50 p-4 text-sm font-semibold text-red-600 border border-red-100">
          {localError}
        </p>
      )}

      {/* Delete All Edits option */}
      <div className="flex items-center justify-between text-xs text-red-500 font-semibold cursor-pointer hover:text-red-600 transition select-none">
        <span className="flex items-center gap-1.5" onClick={reset}>🗑 Delete All Edits</span>
      </div>

      {/* Mock Rich Text Editor Container */}
      <div className="border border-line rounded-lg overflow-hidden focus-within:border-[#4A72F6] focus-within:ring-4 focus-within:ring-[#4A72F6]/10 transition duration-200">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 bg-slate-50 border-b border-line px-3 py-2">
          <button type="button" className="text-xs font-serif font-semibold italic text-slate-500 hover:text-[#4A72F6] px-2 py-1 rounded hover:bg-slate-200/50">I</button>
          <button type="button" className="text-xs font-bold text-slate-500 hover:text-[#4A72F6] px-2 py-1 rounded hover:bg-slate-200/50">B</button>
          <button type="button" className="text-xs font-bold underline text-slate-500 hover:text-[#4A72F6] px-2 py-1 rounded hover:bg-slate-200/50">U</button>
          <button type="button" className="text-xs font-bold line-through text-slate-500 hover:text-[#4A72F6] px-2 py-1 rounded hover:bg-slate-200/50">S</button>
          <span className="text-slate-300">|</span>
          <button type="button" className="text-xs text-slate-500 hover:text-[#4A72F6] px-2 py-1 rounded hover:bg-slate-200/50">🔗</button>
          <span className="text-slate-300">|</span>
          <button type="button" className="text-[10px] text-slate-500 hover:text-[#4A72F6] px-2 py-1 rounded hover:bg-slate-200/50">◀</button>
          <button type="button" className="text-[10px] text-slate-500 hover:text-[#4A72F6] px-2 py-1 rounded hover:bg-slate-200/50">▲</button>
          <button type="button" className="text-[10px] text-slate-500 hover:text-[#4A72F6] px-2 py-1 rounded hover:bg-slate-200/50">▶</button>
          <span className="text-slate-300">|</span>
          <button type="button" className="text-xs text-slate-500 hover:text-[#4A72F6] px-2 py-1 rounded hover:bg-slate-200/50">☰</button>
          <button type="button" className="text-xs text-slate-500 hover:text-[#4A72F6] px-2 py-1 rounded hover:bg-slate-200/50">▤</button>
          <span className="text-slate-300">|</span>
          <button type="button" className="text-xs text-slate-500 hover:text-[#4A72F6] px-2 py-1 rounded hover:bg-slate-200/50">🎨</button>
          <button type="button" className="text-xs text-slate-500 hover:text-[#4A72F6] px-2 py-1 rounded hover:bg-slate-200/50">Tx</button>
        </div>
        <textarea 
          placeholder="Type here" 
          value={form.questionText} 
          onChange={(e) => setForm({ ...form, questionText: e.target.value })} 
          className="w-full min-h-[140px] bg-white px-4 py-3 text-sm font-semibold outline-none text-[#1F2937] placeholder:text-slate-400 placeholder:font-normal resize-y"
        />
      </div>

      {/* Options Builder */}
      <div>
        <p className="mb-4 text-sm font-bold text-[#1F2937]">Type the options below</p>
        <div className="space-y-4">
          {form.options.map((option, index) => (
            <div key={index} className="flex items-center gap-4 group">
              {/* Hollow/Filled Circle Radio */}
              <button
                type="button"
                onClick={() => chooseCorrect(index)}
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition duration-150 ${
                  option.isCorrect
                    ? 'border-[#4A72F6] bg-white before:h-2.5 before:w-2.5 before:rounded-full before:bg-[#4A72F6]'
                    : 'border-[#94A3B8] hover:border-[#4A72F6]'
                }`}
              />
              <input
                type="text"
                placeholder="Type Option here"
                value={option.text}
                onChange={(e) => setOption(index, { text: e.target.value })}
                className="w-full rounded-lg border border-line bg-white px-4 py-3 text-sm font-bold outline-none transition duration-200 focus:border-[#4A72F6] focus:ring-4 focus:ring-[#4A72F6]/10 text-[#1F2937] placeholder:text-slate-400 placeholder:font-normal"
              />
              <button
                type="button"
                onClick={() => deleteOption(index)}
                className="text-slate-300 hover:text-red-500 transition duration-150 p-1.5 cursor-pointer"
                title="Delete Option"
              >
                🗑
              </button>
            </div>
          ))}
        </div>

        {/* Add option button below options list */}
        <div className="mt-3.5 flex justify-start">
          <button
            type="button"
            onClick={addOption}
            className="text-xs font-bold text-[#4A72F6] hover:text-[#3B61E6] transition flex items-center gap-1 cursor-pointer"
          >
            + Add Option
          </button>
        </div>
      </div>

      {/* Solution Section */}
      <div>
        <p className="mb-3 text-sm font-bold text-[#1F2937]">Add Solution</p>
        <textarea 
          placeholder="Type here" 
          value={form.solution} 
          onChange={(e) => setForm({ ...form, solution: e.target.value })} 
          className="w-full min-h-[100px] rounded-lg border border-line bg-white px-4 py-3 text-sm font-semibold outline-none transition duration-200 focus:border-[#4A72F6] focus:ring-4 focus:ring-[#4A72F6]/10 text-[#1F2937] placeholder:text-slate-400 placeholder:font-normal resize-y"
        />
      </div>

      {/* Navigation Control Bar */}
      <div className="flex items-center justify-center gap-6 py-4">
        <button 
          type="button" 
          className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white text-slate-500 hover:bg-slate-50 hover:text-[#4A72F6] transition active:scale-90 font-bold"
          title="Previous Question"
        >
          ‹
        </button>
        <button 
          type="button" 
          className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white text-slate-500 hover:bg-slate-50 hover:text-[#4A72F6] transition active:scale-90 font-bold"
          title="Next Question"
        >
          ›
        </button>
      </div>

      {/* Question settings */}
      <div className="pt-6 border-t border-line/80">
        <p className="mb-4 text-sm font-bold text-[#1F2937]">Question settings</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <Field label="Level of Difficulty">
            <Select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })}>
              {DIFFICULTIES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
            </Select>
          </Field>
          
          <Field label="Topic">
            <Select value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })}>
              <option value="">Choose from Drop-down</option>
              <option value={test?.topic}>{test?.topic}</option>
            </Select>
          </Field>
          
          <Field label="Sub-topic">
            <Select value={form.subTopic} onChange={(e) => setForm({ ...form, subTopic: e.target.value })}>
              <option value="">Choose from Drop-down</option>
              <option value={test?.subTopic}>{test?.subTopic}</option>
            </Select>
          </Field>
        </div>
      </div>

      {/* Footer Navigation Buttons */}
      <div className="flex justify-between items-center pt-8 border-t border-line/80">
        <button 
          type="button" 
          onClick={() => navigate('/dashboard')} 
          className="rounded-lg bg-[#FF6B6B] hover:bg-[#FF5252] px-6 py-3 text-sm font-bold text-white transition hover:shadow-lg hover:shadow-red-500/10 active:scale-95"
        >
          Exit Test Creation
        </button>
        
        <div className="flex gap-4">
          <button type="button" onClick={reset} className="btn-secondary py-3 px-6">Reset</button>
          <button 
            type="button" 
            onClick={handleSave} 
            disabled={saving} 
            className="btn-primary py-3 px-8"
          >
            {saving ? 'Saving...' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}

