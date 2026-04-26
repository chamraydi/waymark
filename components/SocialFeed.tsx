'use client'
import { useState } from 'react'
import { getTypeIcon } from '@/app/data/trails'

type FeedItem = {
  id: string
  user: string
  initials: string
  avatarColor: string
  action: 'checkin' | 'edit' | 'completed'
  trail: string
  trailType: 'Trail' | 'Peak' | 'Urban' | 'Marathon'
  location: string
  time: string
  conditions?: string[]
  distance?: string
  wldEarned?: number
  isVerified: true // always true — only verified humans appear
}

const FEED: FeedItem[] = [
  {
    id: '1', user: 'Amir Hassan', initials: 'AH', avatarColor: '#0F6E56',
    action: 'checkin', trail: 'Bukit Tabur West', trailType: 'Trail',
    location: 'Kuala Lumpur', time: '12 min ago',
    conditions: ['Clear', 'Rocky'], distance: '5.2km', wldEarned: 2, isVerified: true,
  },
  {
    id: '2', user: 'Siti Nur', initials: 'SN', avatarColor: '#185FA5',
    action: 'completed', trail: 'KL Standard Chartered Marathon', trailType: 'Marathon',
    location: 'Kuala Lumpur', time: '1h ago',
    distance: '42.2km', wldEarned: 20, isVerified: true,
  },
  {
    id: '3', user: 'Dani Roslan', initials: 'DR', avatarColor: '#634AB7',
    action: 'checkin', trail: 'Gasing Hill Loop', trailType: 'Trail',
    location: 'Petaling Jaya', time: '2h ago',
    conditions: ['Muddy', 'Scenic'], distance: '3.8km', wldEarned: 2, isVerified: true,
  },
  {
    id: '4', user: 'Priya Menon', initials: 'PM', avatarColor: '#7A3E10',
    action: 'edit', trail: 'Gunung Nuang Summit', trailType: 'Peak',
    location: 'Hulu Langat', time: '3h ago', isVerified: true,
  },
  {
    id: '5', user: 'Khairul Nizam', initials: 'KN', avatarColor: '#0F6E56',
    action: 'checkin', trail: 'KLCC Park Run', trailType: 'Urban',
    location: 'Kuala Lumpur', time: '4h ago',
    conditions: ['Clear'], distance: '1.3km', wldEarned: 1, isVerified: true,
  },
  {
    id: '6', user: 'Wei Ling', initials: 'WL', avatarColor: '#185FA5',
    action: 'checkin', trail: 'Broga Hill', trailType: 'Peak',
    location: 'Semenyih', time: '5h ago',
    conditions: ['Clear', 'Scenic'], distance: '3.6km', wldEarned: 2, isVerified: true,
  },
  {
    id: '7', user: 'Farid Aziz', initials: 'FA', avatarColor: '#7A3E10',
    action: 'edit', trail: 'Titiwangsa Lake Gardens', trailType: 'Urban',
    location: 'Kuala Lumpur', time: '6h ago', isVerified: true,
  },
  {
    id: '8', user: 'Nurul Ain', initials: 'NA', avatarColor: '#634AB7',
    action: 'checkin', trail: 'FRIM Kepong Forest Loop', trailType: 'Trail',
    location: 'Kepong', time: '7h ago',
    conditions: ['Clear'], distance: '6.2km', wldEarned: 2, isVerified: true,
  },
]

export default function SocialFeed({ recentCheckins }: { recentCheckins: string[] }) {
  const [liked, setLiked] = useState<string[]>([])

  const toggleLike = (id: string) => {
    setLiked(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  return (
    <div className="px-5 pb-6">
      {/* Header note */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-[#1D9E75] animate-pulse" />
        <p className="text-[11px] text-white/30">Only verified humans appear in this feed</p>
      </div>

      {/* Your recent check-in at top if exists */}
      {recentCheckins.length > 0 && (
        <div className="bg-[#0a3d2a] border border-[#1D9E75]/20 rounded-2xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-[#1D9E75]" />
            <span className="text-[11px] text-[#1D9E75] font-medium">Your activity</span>
          </div>
          <p className="text-sm text-white font-medium">
            You just checked in — you're now part of the verified feed 🎉
          </p>
        </div>
      )}

      {/* Feed */}
      <div className="space-y-3">
        {FEED.map(item => (
          <div key={item.id} className="bg-[#111] border border-white/[0.07] rounded-2xl p-4">
            {/* User row */}
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
                style={{ background: item.avatarColor }}
              >
                {item.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-[13px] font-medium text-white">{item.user}</p>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <circle cx="6" cy="6" r="5" stroke="#1D9E75" strokeWidth="1"/>
                    <circle cx="6" cy="6" r="2" fill="#1D9E75"/>
                  </svg>
                </div>
                <p className="text-[11px] text-white/25">{item.time} · {item.location}</p>
              </div>
              {item.wldEarned && (
                <div className="bg-[#191919] border border-white/10 rounded-full px-2.5 py-1 flex items-center gap-1.5">
                  <span className="text-[10px] font-semibold text-[#1D9E75]">+{item.wldEarned} WLD</span>
                </div>
              )}
            </div>

            {/* Action */}
            <div className="flex items-center gap-2.5 bg-[#191919] rounded-xl p-3 mb-3">
              <span className="text-lg">{getTypeIcon(item.trailType)}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-white truncate">{item.trail}</p>
                <p className="text-[11px] text-white/30 mt-0.5">
                  {item.action === 'checkin' && `Checked in · ${item.distance}`}
                  {item.action === 'completed' && `Completed · ${item.distance}`}
                  {item.action === 'edit' && 'Updated trail info'}
                </p>
              </div>
            </div>

            {/* Conditions */}
            {item.conditions && item.conditions.length > 0 && (
              <div className="flex gap-1.5 mb-3 flex-wrap">
                {item.conditions.map(c => (
                  <span key={c} className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-[#191919] border border-white/10 text-white/40">
                    {c}
                  </span>
                ))}
              </div>
            )}

            {/* Like */}
            <div className="flex items-center gap-3 pt-1 border-t border-white/[0.05]">
              <button
                onClick={() => toggleLike(item.id)}
                className={`flex items-center gap-1.5 text-[12px] transition-colors ${liked.includes(item.id) ? 'text-[#1D9E75]' : 'text-white/25'}`}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 12S1.5 8.5 1.5 4.5a3 3 0 015.5-1.6A3 3 0 0112.5 4.5C12.5 8.5 7 12 7 12z"
                    stroke="currentColor" strokeWidth="1.2"
                    fill={liked.includes(item.id) ? 'currentColor' : 'none'}/>
                </svg>
                {liked.includes(item.id) ? 'Liked' : 'Like'}
              </button>
              <span className="text-white/10">·</span>
              <span className="text-[11px] text-white/20">Verified human check-in</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
