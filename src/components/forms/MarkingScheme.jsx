import { Field } from './Field.jsx';

function SpinInput({ value, onChange }) {
  const parsed = Number(value) || 0;
  const displayValue = parsed >= 0 ? `+${parsed}` : `${parsed}`;

  const increment = () => onChange(parsed + 1);
  const decrement = () => onChange(parsed - 1);

  const handleTextChange = (e) => {
    const clean = e.target.value.replace(/[^-+0-9]/g, '');
    const num = Number(clean);
    if (!isNaN(num)) {
      onChange(num);
    }
  };

  return (
    <div className="relative flex items-center w-full select-none">
      <input
        type="text"
        value={displayValue}
        onChange={handleTextChange}
        className="w-full rounded-lg border border-line bg-white pl-4 pr-8 py-3 text-sm font-bold outline-none transition duration-200 focus:border-[#4A72F6] focus:ring-4 focus:ring-[#4A72F6]/10 text-[#1F2937]"
      />
      {/* Custom Spin Buttons */}
      <div className="absolute right-2.5 flex flex-col items-center justify-center gap-0.5 border-l border-line/80 pl-2">
        <button
          type="button"
          onClick={increment}
          className="text-[8px] text-[#94A3B8] hover:text-[#4A72F6] transition active:scale-90"
        >
          ▲
        </button>
        <button
          type="button"
          onClick={decrement}
          className="text-[8px] text-[#94A3B8] hover:text-[#4A72F6] transition active:scale-90"
        >
          ▼
        </button>
      </div>
    </div>
  );
}

export default function MarkingScheme({ value, onChange }) {
  const update = (key, nextValue) => onChange({ ...value, [key]: Number(nextValue) });
  return (
    <div className="col-span-2 lg:col-span-1">
      <p className="mb-4 text-sm font-bold text-[#1F2937]">Marking Scheme:</p>
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <Field label="Wrong Answer">
          <SpinInput value={value.wrong} onChange={(val) => update('wrong', val)} />
        </Field>
        <Field label="Unattempted">
          <SpinInput value={value.unattempted} onChange={(val) => update('unattempted', val)} />
        </Field>
        <Field label="Correct Answer">
          <SpinInput value={value.correct} onChange={(val) => update('correct', val)} />
        </Field>
      </div>
    </div>
  );
}

