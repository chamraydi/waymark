'use client'
import { useState } from 'react'

type Period = 'week' | 'month' | 'alltime'
type Category = 'adventures' | 'distance' | 'wld'

type LeaderboardEntry = {
  rank: number
  user: string
  initials: string
  avatarColor: string
  location: string
  adventures: number
  distance: number
  wld: number
  isYou?: boolean
}

const DATA: LeaderboardEntry[] = [
  { rank: 1, user: 'Amir Hassan', initials: 'AH', avatarColor: '#0F6E56', location: 'KL', adventures: 34, distance: 287, wld: 68 },
  { rank: 2, user: 'Siti Nur', initials: 'SN', avatarColor: '#185FA5', location: 'PJ', adventures: 29, distance: 241, wld: 58 },
  { rank: 3, user: 'Wei Ling', initials: 'WL', avatarColor: '#634AB7', location: 'KL', adventures: 26, distance: 198, wld: 52 },
  { rank: 4, user: 'Dani Roslan', initials: 'DR', avatarColor: '#7A3E10', location: 'Subang', adventures: 22, distance: 176, wld: 44 },
  { rank: 5, user: 'Priya Menon', initials: 'PM', avatarColor: '#0F6E56', location: 'KL', adventures: 19, distance: 154, wld: 38 },
  { rank: 6, user: 'Farid Aziz', initials: 'FA', avatarColor: '#185FA5', location: 'Shah Alam', adventures: 17, distance: 142, wld: 34 },
  { rank: 12, user: 'Raydi Cham', initials: 'RC', avatarColor: '#0F6E56', location: 'KL', adventures: 10, distance: 84, wld: 20, isYou: true },
]

const RANK_COLORS = ['#EF9F27', '#aaa', '#C07A3A']
const RANK_LABELS = ['🥇', '🥈', '🥉']

export default function Leaderboard() {
  const [period, setPeriod] = useState<Period>('week')
  const [category, setCategory] = useState<Category>('adventures')

  const getValue = (entry: LeaderboardEntry) => {
    if (category === 'adventures') return `${entry.adventures}`
    if (category === 'distance') return `${entry.distance}km`
    return `${entry.wld} WLD`
  }

  const top3 = DATA.slice(0, 3)
  const rest = DATA.slice(3)

  return (
    <div className="px-5 pb-6">
      {/* Verified notice */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-[#1D9E75]" />
        <p className="text-[11px] text-white/30">Only World ID verified humans appear here</p>
      </div>

      {/* Period toggle */}
      <div className="flex gap-1 bg-[#191919] rounded-xl p-1 mb-3">
        {(['week', 'month', 'alltime'] as Period[]).map(p => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`flex-1 py-2 rounded-lg text-[12px] font-medium transition-all ${
              period === p ? 'bg-[#111] text-white' : 'text-white/30'
            }`}
          >
            {p === 'week' ? 'This week' : p === 'month' ? 'This month' : 'All time'}
          </button>
        ))}
      </div>

      {/* Category toggle */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {(['adventures', 'distance', 'wld'] as Category[]).map(c => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-4 py-1.5 rounded-full text-[12px] font-medium flex-shrink-0 border transition-all ${
              category === c
                ? 'bg-[#1D9E75]/15 border-[#1D9E75] text-[#1D9E75]'
                : 'bg-[#191919] border-white/10 text-white/40'
            }`}
          >
            {c === 'adventures' ? '🏔 Adventures' : c === 'distance' ? '📍 Distance' : '⚡ WLD Earned'}
          </button>
        ))}
      </div>

      {/* Podium */}
      <div className="flex items-end justify-center gap-3 mb-6 pt-2">
        {/* 2nd */}
        <div className="flex flex-col items-center gap-2">
          <div className="text-lg">{RANK_LABELS[1]}</div>
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold" style={{ background: top3[1].avatarColor }}>
            {top3[1].initials}
          </div>
          <p className="text-[11px] text-white/50 text-center max-w-[60px] truncate">{top3[1].user.split(' ')[0]}</p>
          <div className="bg-[#191919] w-16 h-14 rounded-t-xl flex items-end justify-center pb-2">
            <p className="text-[11px] font-semibold text-white/60">{getValue(top3[1])}</p>
          </div>
        </div>
        {/* 1st */}
        <div className="flex flex-col items-center gap-2">
          <div className="text-2xl">{RANK_LABELS[0]}</div>
          <div className="w-14 h-14 rounded-full flex items-center justify-center text-base font-semibold border-2 border-[#EF9F27]/40" style={{ background: top3[0].avatarColor }}>
            {top3[0].initials}
          </div>
          <p className="text-[11px] text-white/70 text-center max-w-[60px] truncate">{top3[0].user.split(' ')[0]}</p>
          <div className="bg-[#191919] border border-[#EF9F27]/20 w-16 h-20 rounded-t-xl flex items-end justify-center pb-2">
            <p className="text-[12px] font-semibold text-[#EF9F27]">{getValue(top3[0])}</p>
          </div>
        </div>
        {/* 3rd */}
        <div className="flex flex-col items-center gap-2">
          <div className="text-lg">{RANK_LABELS[2]}</div>
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold" style={{ background: top3[2].avatarColor }}>
            {top3[2].initials}
          </div>
          <p className="text-[11px] text-white/50 text-center max-w-[60px] truncate">{top3[2].user.split(' ')[0]}</p>
          <div className="bg-[#191919] w-16 h-10 rounded-t-xl flex items-end justify-center pb-2">
            <p className="text-[11px] font-semibold text-white/60">{getValue(top3[2])}</p>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="bg-[#111] border border-white/[0.07] rounded-2xl overflow-hidden mb-3">
        {rest.map((entry, i) => (
          <div
            key={entry.rank}
            className={`flex items-center gap-3 p-4 border-b border-white/[0.05] last:border-0 ${entry.isYou ? 'bg-[#0a3d2a]/50' : ''}`}
          >
            <span className="text-[13px] font-mono text-white/25 w-5 text-center">{entry.rank}</span>
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0" style={{ background: entry.avatarColor }}>
              {entry.initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-[13px] font-medium text-white">{entry.user}</p>
                {entry.isYou && <span className="text-[10px] text-[#1D9E75] bg-[#1D9E75]/10 px-2 py-0.5 rounded-full">You</span>}
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <circle cx="5" cy="5" r="4" stroke="#1D9E75" strokeWidth="0.8"/>
                  <circle cx="5" cy="5" r="1.5" fill="#1D9E75"/>
                </svg>
              </div>
              <p className="text-[11px] text-white/25">{entry.location}</p>
            </div>
            <p className="text-[13px] font-semibold text-white/60">{getValue(entry)}</p>
          </div>
        ))}
      </div>

      {/* WLD note */}
      <div className="bg-[#111] border border-white/[0.07] rounded-xl p-3 flex items-center gap-3">
        <span className="text-lg">⚡</span>
        <p className="text-[11px] text-white/30 leading-relaxed">
          WLD rewards are earned per verified check-in. Only humans verified by World ID can earn and appear on this leaderboard.
        </p>
      </div>
    </div>
  )
}
