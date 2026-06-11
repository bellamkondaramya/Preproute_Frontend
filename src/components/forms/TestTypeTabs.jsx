import { TEST_TYPES } from '../../lib/constants.js';

export default function TestTypeTabs({ value, onChange }) {
  return (
    <div className="inline-flex rounded-xl border border-line bg-[#F8FAFC] p-1 shadow-sm select-none">
      {TEST_TYPES.map((type) => {
        const active = value === type.value;
        return (
          <button
            type="button"
            key={type.value}
            onClick={() => onChange(type.value)}
            className={`rounded-lg px-6 py-2 text-xs sm:text-sm font-bold tracking-wide transition-all duration-200 ${
              active
                ? 'bg-[#ECEFFF] text-[#4A72F6] shadow-sm'
                : 'text-gray-400 hover:text-[#475569] hover:bg-slate-100/50'
            }`}
          >
            {type.label}
          </button>
        );
      })}
    </div>
  );
}

