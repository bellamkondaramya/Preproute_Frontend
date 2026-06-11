export default function Logo({ compact = false }) {
  return (
    <div className="flex items-center gap-2.5 select-none">
      <div className="relative flex items-center">
        {/* Curved route overlay path */}
        {!compact && (
          <svg
            className="absolute -top-[13px] left-[6px] h-[22px] w-[115px]"
            viewBox="0 0 115 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* The dotted path arching from P to o */}
            <path
              d="M 6,18 Q 30,-3 62,3 T 100,10"
              stroke="#1F2937"
              strokeWidth="2.2"
              strokeDasharray="3 3.5"
              strokeLinecap="round"
            />
            {/* The little node pins (blue dots with rings) */}
            <circle cx="6" cy="18" r="4.5" fill="#4A72F6" stroke="white" strokeWidth="1" />
            <circle cx="48" cy="4" r="3.5" fill="#4A72F6" stroke="white" strokeWidth="1" />
            <circle cx="85" cy="7" r="3.5" fill="#4A72F6" stroke="white" strokeWidth="1" />
          </svg>
        )}
        {/* Compact logo icon (looks like a tiny route loop) */}
        {compact ? (
          <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-[#4A72F6] to-[#6475F8] shadow-sm shadow-[#4A72F6]/20">
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="4" cy="19" r="2" />
              <circle cx="20" cy="5" r="2" />
              <path d="M4 17V9a4 4 0 0 1 4-4h8" />
            </svg>
          </div>
        ) : (
          <div className="flex items-baseline font-extrabold tracking-tight" style={{ fontFamily: 'Inter, sans-serif' }}>
            <span className="text-[28px] text-[#0A0923]">Prep</span>
            <span className="text-[28px] text-[#4A72F6]">route</span>
          </div>
        )}
      </div>
    </div>
  );
}

