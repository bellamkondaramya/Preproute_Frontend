import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../lib/api.js';
import { Field, Input, Select } from '../components/forms/Field.jsx';
import TestTypeTabs from '../components/forms/TestTypeTabs.jsx';
import DifficultyRadio from '../components/forms/DifficultyRadio.jsx';
import MarkingScheme from '../components/forms/MarkingScheme.jsx';

const initialForm = {
  type: 'CHAPTER_WISE',
  name: '',
  subject: '',
  topic: '',
  subTopic: '',
  durationMinutes: '',
  difficulty: 'EASY',
  markingScheme: { wrong: -1, unattempted: 0, correct: 5 },
  totalQuestions: '',
  totalMarks: ''
};

export default function CreateTest({ editMode = false }) {
  const [form, setForm] = useState(initialForm);
  const [subjects, setSubjects] = useState([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    api.get('/lookups/subjects').then((res) => setSubjects(res.data.data)).catch((err) => setError(err.message));
    if (editMode && id) {
      api.get(`/tests/${id}`).then((res) => setForm({ ...res.data.data, id: res.data.data._id })).catch((err) => setError(err.message));
    }
  }, [editMode, id]);

  const selectedSubject = useMemo(() => subjects.find((subject) => subject.name === form.subject), [subjects, form.subject]);
  const selectedTopic = useMemo(() => selectedSubject?.topics?.find((topic) => topic.name === form.topic), [selectedSubject, form.topic]);

  const setValue = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
  const autoMarks = () => {
    const marks = Number(form.totalQuestions || 0) * Number(form.markingScheme.correct || 0);
    setValue('totalMarks', marks || '');
  };

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setSaving(true);
    try {
      const payload = {
        ...form,
        durationMinutes: Number(form.durationMinutes),
        totalQuestions: Number(form.totalQuestions),
        totalMarks: Number(form.totalMarks)
      };
      const res = editMode ? await api.put(`/tests/${id}`, payload) : await api.post('/tests', payload);
      if (editMode) {
        navigate(`/tests/${id}/questions`);
      } else {
        navigate(`/tests/${res.data.data._id}/questions`);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (editMode) {
      navigate(-1);
    } else {
      navigate('/dashboard');
    }
  };

  const FormContent = (
    <>
      <TestTypeTabs value={form.type} onChange={(value) => setValue('type', value)} />
      {error && <p className="mt-5 rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</p>}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
        <Field label="Subject">
          <Select value={form.subject} onChange={(e) => { setValue('subject', e.target.value); setValue('topic', ''); setValue('subTopic', ''); }}>
            <option value="">Choose from Drop-down</option>
            {subjects.map((subject) => <option key={subject.slug} value={subject.name}>{subject.name}</option>)}
          </Select>
        </Field>
        
        <Field label="Name of Test">
          <Input placeholder="Enter name of Test" value={form.name} onChange={(e) => setValue('name', e.target.value)} />
        </Field>
        
        <Field label="Topic">
          <Select value={form.topic} onChange={(e) => { setValue('topic', e.target.value); setValue('subTopic', ''); }}>
            <option value="">Choose from Drop-down</option>
            {selectedSubject?.topics?.map((topic) => <option key={topic.slug} value={topic.name}>{topic.name}</option>)}
          </Select>
        </Field>
        
        <Field label="Sub Topic">
          <Select value={form.subTopic} onChange={(e) => setValue('subTopic', e.target.value)}>
            <option value="">Choose from Drop-down</option>
            {selectedTopic?.subTopics?.map((subTopic) => <option key={subTopic.slug} value={subTopic.name}>{subTopic.name}</option>)}
          </Select>
        </Field>
        
        <Field label="Duration (Minutes)">
          <Input type="number" placeholder="Enter the time" value={form.durationMinutes} onChange={(e) => setValue('durationMinutes', e.target.value)} />
        </Field>
        
        <div>
          <span className="form-label">Test Difficulty Level</span>
          <DifficultyRadio value={form.difficulty} onChange={(value) => setValue('difficulty', value)} />
        </div>
        
        <MarkingScheme value={form.markingScheme} onChange={(value) => setValue('markingScheme', value)} />
        
        <div className="grid grid-cols-2 gap-4 sm:gap-6">
          <Field label="No of Questions">
            <Input type="number" placeholder="Ex:250 Marks" value={form.totalQuestions} onBlur={autoMarks} onChange={(e) => setValue('totalQuestions', e.target.value)} />
          </Field>
          <Field label="Total Marks">
            <input 
              type="number" 
              placeholder="Ex:250 Marks" 
              value={form.totalMarks} 
              readOnly 
              className="form-input bg-[#F8FAFC] border-[#E2E8F0] text-[#94A3B8] cursor-not-allowed font-bold"
            />
          </Field>
        </div>
      </div>
      
      <div className="mt-10 flex justify-end gap-4">
        <button 
          type="button" 
          onClick={handleCancel} 
          className="rounded-xl bg-[#F5F7FF] text-[#4A72F6] hover:bg-[#ECEFFF] px-8 py-3 text-sm font-bold transition duration-200"
        >
          Cancel
        </button>
        <button 
          disabled={saving} 
          className="rounded-xl bg-[#4A72F6] hover:bg-[#3B61E6] text-white px-8 py-3 text-sm font-bold transition duration-200 disabled:opacity-50"
        >
          {saving ? 'Saving...' : editMode ? 'Save' : 'Next'}
        </button>
      </div>
    </>
  );

  if (editMode) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[2px] overflow-y-auto">
        <form onSubmit={submit} className="relative bg-white w-full max-w-[960px] rounded-2xl border border-line p-6 sm:p-10 md:p-12 shadow-2xl overflow-y-auto max-h-[90vh]">
          {/* Close X Button */}
          <button 
            type="button" 
            onClick={handleCancel} 
            className="absolute top-5 right-6 text-gray-400 hover:text-ink text-xl font-bold transition cursor-pointer p-1"
          >
            ✕
          </button>
          
          <h2 className="text-xl sm:text-2xl font-bold text-ink mb-6 font-sans">Edit Test creation</h2>
          {FormContent}
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs sm:text-sm font-semibold text-muted">Test Creation &nbsp;/&nbsp; Create Test &nbsp;/&nbsp; Chapter Wise</p>
      </div>
      <form onSubmit={submit} className="card p-6 sm:p-10 md:p-12">
        {FormContent}
      </form>
    </div>
  );
}

