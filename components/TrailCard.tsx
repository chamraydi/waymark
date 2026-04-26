'use client'
import { Trail, getDifficultyBg, getTypeIcon } from '@/app/data/trails'

interface Props {
  trail: Trail
  onClick: (trail: Trail) => void
  compact?: boolean
}

export default function TrailCard({ trail, onClick, compact }: Props) {
  return (
    <button
      onClick={() => onClick(trail)}
      className="w-full text-left bg-[#111] border border-white/[0.07] rounded-2xl p-4 mb-3 flex items-center gap-3 hover:border-white/20 transition-all duration-200 active:scale-[0.99]"
    >
      {/* Icon */}
      <div className="w-12 h-12 rounded-xl bg-[#0F6E56] flex items-center justify-center text-xl flex-shrink-0">
        {getTypeIcon(trail.type)}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="font-medium text-white text-[15px] leading-tight truncate">{trail.name}</p>
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${getDifficultyBg(trail.difficulty)}`}>
            {trail.difficulty}
          </span>
        </div>
        <p className="text-[12px] text-white/40 mt-0.5">{trail.location} · {trail.distance}</p>
        <div className="flex items-center gap-1 mt-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#1D9E75]" />
          <span className="text-[11px] text-[#1D9E75] font-medium">
            {trail.verifiedHumans.toLocaleString()} verified humans
          </span>
        </div>
      </div>

      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0 text-white/20">
        <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  )
}
