import { DIFFICULTIES } from '../../lib/constants.js';

export default function DifficultyRadio({ value, onChange }) {
  return (
    <div className="flex gap-8 sm:gap-12 pt-3 flex-wrap">
      {DIFFICULTIES.map((item) => {
        const checked = value === item.value;
        return (
          <label
            key={item.value}
            className="flex cursor-pointer items-center gap-2.5 text-sm font-semibold text-[#1F2937] select-none hover:text-[#4A72F6] transition duration-150"
          >
            <input
              type="radio"
              name="difficulty"
              value={item.value}
              checked={checked}
              onChange={(event) => onChange(event.target.value)}
              className="h-4.5 w-4.5 cursor-pointer accent-[#4A72F6]"
            />
            <span>{item.label}</span>
          </label>
        );
      })}
    </div>
  );
}

