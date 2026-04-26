'use client'
import { useState, useEffect, lazy, Suspense } from 'react'
import { trails, Trail } from './data/trails'
import TrailCard from '@/components/TrailCard'
import CheckinModal from '@/components/CheckinModal'
import HealthDashboard from '@/components/HealthDashboard'
import SocialFeed from '@/components/SocialFeed'
import Leaderboard from '@/components/Leaderboard'
import TrailEditor from '@/components/TrailEditor'

const TrailMap = lazy(() => import('@/components/TrailMap'))

type Tab = 'home' | 'explore' | 'feed' | 'health' | 'profile'
type Filter = 'All' | 'Trail' | 'Peak' | 'Urban' | 'Marathon'
type ExploreView = 'discover' | 'leaderboard' | 'edit'

const FILTERS: Filter[] = ['All', 'Trail', 'Peak', 'Urban', 'Marathon']

const VERIFIED_CHECKINS = [
  { trail: 'Bukit Tabur West', time: '2h ago', emoji: '🏔', wld: 2 },
  { trail: 'KLCC Park Run', time: 'Yesterday', emoji: '🏙', wld: 1 },
  { trail: 'Gasing Hill Loop', time: '3 days ago', emoji: '🌿', wld: 2 },
]

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('home')
  const [selectedTrail, setSelectedTrail] = useState<Trail | null>(null)
  const [checkinTrail, setCheckinTrail] = useState<Trail | null>(null)
  const [filter, setFilter] = useState<Filter>('All')
  const [search, setSearch] = useState('')
  const [verifiedTrails, setVerifiedTrails] = useState<string[]>([])
  const [toast, setToast] = useState('')
  const [wldBalance, setWldBalance] = useState(20)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [exploreView, setExploreView] = useState<ExploreView>('discover')
  const [showEditor, setShowEditor] = useState(false)

  useEffect(() => { setMapLoaded(true) }, [])

  const filteredTrails = trails.filter(t => {
    const matchFilter = filter === 'All' || t.type === filter
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.location.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  const handleCheckinClick = (trail: Trail) => {
    setCheckinTrail(trail)
    setSelectedTrail(trail)
  }

  const handleVerified = (trail: Trail) => {
    setVerifiedTrails(prev => [...prev, trail.id])
    const reward = trail.type === 'Marathon' ? 20 : trail.difficulty === 'Hard' ? 5 : 2
    setWldBalance(prev => prev + reward)
    setCheckinTrail(null)
    setToast(`✓ Checked in · +${reward} WLD earned`)
    setTimeout(() => setToast(''), 3500)
  }

  return (
    <main className="max-w-[420px] mx-auto min-h-screen flex flex-col bg-[#0a0a0a] relative">

      {/* Status bar */}
      <div className="flex justify-between items-center px-5 pt-3 pb-1">
        <span className="text-[12px] font-medium text-white/40">9:41</span>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-[#1D9E75]/10 border border-[#1D9E75]/20 rounded-full px-2.5 py-0.5">
            <span className="text-[10px] font-semibold text-[#1D9E75]">⚡ {wldBalance} WLD</span>
          </div>
          <span className="text-[11px] text-white/20">▮▮▮</span>
        </div>
      </div>

      {/* ═══ HOME ═══ */}
      {activeTab === 'home' && (
        <div className="flex-1 overflow-y-auto pb-24 animate-fade-up">
          <div className="px-5 pt-3 pb-2 flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Waymark</h1>
              <p className="text-sm text-white/30 mt-0.5">Good morning, Raydi</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-[#0F6E56] flex items-center justify-center text-sm font-semibold">RC</div>
          </div>

          {/* Recovery */}
          <div className="mx-5 mb-3 bg-[#111] border border-white/[0.07] rounded-2xl p-4 flex items-center gap-4">
            <div className="flex-1">
              <p className="text-[10px] tracking-widest uppercase text-white/25 mb-0.5">Recovery</p>
              <p className="text-4xl font-semibold text-[#1D9E75] leading-none">84</p>
              <p className="text-xs text-white/30 mt-1">HRV 62ms · Sleep 7h 40m</p>
            </div>
            <svg width="64" height="64" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="26" fill="none" stroke="#191919" strokeWidth="6"/>
              <circle cx="32" cy="32" r="26" fill="none" stroke="#1D9E75" strokeWidth="6"
                strokeDasharray="163.4 163.4" strokeDashoffset="26"
                strokeLinecap="round" transform="rotate(-90 32 32)"/>
              <text x="32" y="36" textAnchor="middle" fontFamily="DM Sans,sans-serif" fontSize="11" fontWeight="600" fill="#1D9E75">84%</text>
            </svg>
          </div>

          {/* Metrics */}
          <div className="mx-5 grid grid-cols-3 gap-2 mb-4">
            {[
              { label: 'HRV', val: '62ms', color: '#1D9E75' },
              { label: 'HR', val: '52bpm', color: 'white' },
              { label: 'Sleep', val: '7.6h', color: '#EF9F27' },
            ].map(m => (
              <div key={m.label} className="bg-[#111] border border-white/[0.07] rounded-xl p-3 text-center">
                <p className="text-base font-semibold" style={{ color: m.color }}>{m.val}</p>
                <p className="text-[9px] text-white/25 mt-0.5 uppercase tracking-wider">{m.label}</p>
              </div>
            ))}
          </div>

          {/* WLD balance card */}
          <div className="mx-5 mb-4 bg-[#111] border border-[#1D9E75]/20 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#1D9E75]/10 flex items-center justify-center text-xl flex-shrink-0">⚡</div>
            <div className="flex-1">
              <p className="text-[10px] tracking-widest uppercase text-white/25 mb-0.5">WLD Earned</p>
              <p className="text-2xl font-semibold text-[#1D9E75] leading-none">{wldBalance} <span className="text-sm font-normal text-white/30">WLD</span></p>
              <p className="text-[11px] text-white/25 mt-0.5">Earned from {verifiedTrails.length + 3} verified check-ins</p>
            </div>
            <button onClick={() => setActiveTab('explore')} className="text-[12px] font-medium text-[#1D9E75] bg-[#1D9E75]/10 px-3 py-2 rounded-xl">
              Earn more →
            </button>
          </div>

          {/* Check-in CTA */}
          <button onClick={() => setActiveTab('explore')}
            className="mx-5 mb-5 w-[calc(100%-2.5rem)] bg-[#1D9E75] rounded-2xl p-4 flex items-center gap-3 hover:opacity-90 transition-opacity text-left"
          >
            <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <circle cx="11" cy="11" r="9" stroke="white" strokeWidth="1.5"/>
                <circle cx="11" cy="11" r="3.5" fill="white"/>
              </svg>
            </div>
            <div>
              <p className="text-[14px] font-semibold text-white">Find an adventure to check in</p>
              <p className="text-[11px] text-white/60 mt-0.5">Earn WLD · Verified by World ID</p>
            </div>
          </button>

          {/* Recent verified */}
          {verifiedTrails.length > 0 && (
            <div className="mx-5 mb-4">
              <p className="text-[13px] font-medium text-white/40 mb-2">Your recent check-ins</p>
              {verifiedTrails.map(id => {
                const t = trails.find(x => x.id === id)
                if (!t) return null
                const reward = t.type === 'Marathon' ? 20 : t.difficulty === 'Hard' ? 5 : 2
                return (
                  <div key={id} className="flex items-center gap-3 py-2.5 border-b border-white/[0.05] last:border-0">
                    <div className="w-8 h-8 rounded-lg bg-[#0F6E56] flex items-center justify-center text-sm">✓</div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{t.name}</p>
                      <p className="text-[11px] text-white/30">Just now · World ID verified</p>
                    </div>
                    <div className="text-[11px] font-semibold text-[#1D9E75]">+{reward} WLD</div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Nearby */}
          <div className="px-5">
            <p className="text-[13px] font-medium text-white/40 mb-3">Nearby adventures</p>
            {trails.slice(0, 4).map(t => (
              <TrailCard key={t.id} trail={t} onClick={handleCheckinClick} />
            ))}
          </div>
        </div>
      )}

      {/* ═══ EXPLORE ═══ */}
      {activeTab === 'explore' && (
        <div className="flex-1 flex flex-col overflow-hidden animate-fade-up">
          <div className="px-5 pt-3 pb-3">
            <h1 className="text-2xl font-semibold tracking-tight mb-3">Explore</h1>

            {/* Sub-tabs */}
            <div className="flex gap-1 bg-[#191919] rounded-xl p-1 mb-3">
              {([
                { id: 'discover', label: 'Discover' },
                { id: 'leaderboard', label: '🏆 Board' },
                { id: 'edit', label: '✏️ Edit trails' },
              ] as const).map(v => (
                <button key={v.id} onClick={() => setExploreView(v.id)}
                  className={`flex-1 py-2 rounded-lg text-[11px] font-medium transition-all ${
                    exploreView === v.id ? 'bg-[#111] text-white' : 'text-white/30'
                  }`}
                >{v.label}</button>
              ))}
            </div>
          </div>

          {exploreView === 'discover' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="px-5 pb-3">
                <div className="flex items-center gap-2.5 bg-[#191919] border border-white/10 rounded-xl px-3 py-2.5 mb-3">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="7" cy="7" r="5" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/>
                    <path d="M11 11l3 3" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <input type="text" placeholder="Search trails, peaks, cities..." value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="bg-transparent border-none outline-none text-[14px] text-white placeholder:text-white/25 flex-1"/>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {FILTERS.map(f => (
                    <button key={f} onClick={() => setFilter(f)}
                      className={`px-4 py-1.5 rounded-full text-[12px] font-medium flex-shrink-0 border transition-all ${
                        filter === f ? 'bg-[#1D9E75]/15 border-[#1D9E75] text-[#1D9E75]' : 'bg-[#191919] border-white/10 text-white/40'
                      }`}
                    >{f}</button>
                  ))}
                </div>
              </div>

              <div className="mx-5 mb-3 rounded-2xl overflow-hidden border border-white/[0.07]" style={{ height: '200px' }}>
                {mapLoaded && (
                  <Suspense fallback={<div className="w-full h-full bg-[#111] flex items-center justify-center"><p className="text-white/20 text-sm">Loading map…</p></div>}>
                    <TrailMap trails={filteredTrails} selectedTrail={selectedTrail} onTrailClick={handleCheckinClick} />
                  </Suspense>
                )}
              </div>

              <div className="flex-1 overflow-y-auto px-5 pb-24">
                <p className="text-[13px] font-medium text-white/40 mb-3">
                  {filteredTrails.length} adventures {search ? `for "${search}"` : 'in Malaysia'}
                </p>
                {filteredTrails.map(t => <TrailCard key={t.id} trail={t} onClick={handleCheckinClick} />)}
              </div>
            </div>
          )}

          {exploreView === 'leaderboard' && (
            <div className="flex-1 overflow-y-auto pb-24">
              <Leaderboard />
            </div>
          )}

          {exploreView === 'edit' && (
            <div className="flex-1 overflow-y-auto pb-24">
              <TrailEditor onClose={() => setExploreView('discover')} />
            </div>
          )}
        </div>
      )}

      {/* ═══ FEED ═══ */}
      {activeTab === 'feed' && (
        <div className="flex-1 overflow-y-auto pb-24 animate-fade-up">
          <div className="px-5 pt-3 pb-2">
            <h1 className="text-2xl font-semibold tracking-tight">Feed</h1>
            <p className="text-sm text-white/30 mt-0.5">Real adventures, verified humans only</p>
          </div>
          <SocialFeed recentCheckins={verifiedTrails} />
        </div>
      )}

      {/* ═══ HEALTH ═══ */}
      {activeTab === 'health' && (
        <div className="flex-1 overflow-y-auto pb-24 animate-fade-up">
          <div className="px-5 pt-3 pb-2">
            <h1 className="text-2xl font-semibold tracking-tight">Health</h1>
            <p className="text-sm text-white/30 mt-0.5">Your body, your adventure readiness</p>
          </div>
          <HealthDashboard />
        </div>
      )}

      {/* ═══ PROFILE ═══ */}
      {activeTab === 'profile' && (
        <div className="flex-1 overflow-y-auto pb-24 animate-fade-up">
          <div className="px-5 pt-3">
            <div className="flex items-center gap-4 mb-5 pt-1">
              <div className="w-16 h-16 rounded-full bg-[#0F6E56] flex items-center justify-center text-xl font-semibold border-2 border-[#1D9E75]/30">RC</div>
              <div>
                <h2 className="text-xl font-semibold">Raydi Cham</h2>
                <p className="text-sm text-white/30">Kuala Lumpur, Malaysia</p>
                <div className="flex items-center gap-1.5 mt-1.5 bg-[#1D9E75]/10 border border-[#1D9E75]/20 rounded-full px-3 py-1 w-fit">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <circle cx="5" cy="5" r="4" stroke="#1D9E75" strokeWidth="1"/>
                    <circle cx="5" cy="5" r="1.5" fill="#1D9E75"/>
                  </svg>
                  <span className="text-[11px] text-[#1D9E75] font-medium">World ID verified</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-px bg-white/[0.05] border border-white/[0.07] rounded-2xl overflow-hidden mb-4">
              {[
                { label: 'Adventures', val: String(verifiedTrails.length + 24) },
                { label: 'km', val: '142' },
                { label: 'WLD', val: String(wldBalance) },
                { label: 'Verified', val: '100%' },
              ].map(s => (
                <div key={s.label} className="bg-[#111] py-4 text-center">
                  <p className="text-xl font-semibold text-white">{s.val}</p>
                  <p className="text-[9px] text-white/25 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            {/* WLD history */}
            <div className="bg-[#0a3d2a] border border-[#1D9E75]/20 rounded-2xl p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-[#1D9E75]">⚡ WLD Rewards</p>
                <p className="text-xl font-semibold text-[#1D9E75]">{wldBalance} WLD</p>
              </div>
              <p className="text-[11px] text-[#1D9E75]/50">Earned from verified real-world check-ins. Each verified adventure = WLD reward on World Chain.</p>
            </div>

            <p className="text-[13px] font-medium text-white/40 mb-3">Recent check-ins</p>
            <div className="bg-[#111] border border-white/[0.07] rounded-2xl overflow-hidden mb-4">
              {[
                ...verifiedTrails.map(id => {
                  const t = trails.find(x => x.id === id)
                  const reward = t?.type === 'Marathon' ? 20 : t?.difficulty === 'Hard' ? 5 : 2
                  return t ? { trail: t.name, time: 'Just now', emoji: '✓', wld: reward } : null
                }).filter(Boolean),
                ...VERIFIED_CHECKINS,
              ].slice(0, 6).map((item: any, i: number) => (
                <div key={i} className="flex items-center gap-3 p-4 border-b border-white/[0.05] last:border-0">
                  <div className="w-9 h-9 rounded-xl bg-[#0F6E56] flex items-center justify-center text-sm flex-shrink-0">{item.emoji}</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.trail}</p>
                    <p className="text-[11px] text-white/25 mt-0.5">{item.time}</p>
                  </div>
                  <span className="text-[12px] font-semibold text-[#1D9E75]">+{item.wld} WLD</span>
                </div>
              ))}
            </div>

            <div className="bg-[#111] border border-[#1D9E75]/20 rounded-2xl p-4">
              <p className="text-sm font-medium text-[#1D9E75] mb-0.5">Proof of presence on World Chain</p>
              <p className="text-[11px] text-white/30 leading-relaxed">
                Every check-in is a zero-knowledge proof on World Chain. Your adventures are verified, tamper-proof, and human-guaranteed.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ═══ TAB BAR ═══ */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] bg-[#0a0a0a]/90 backdrop-blur-xl border-t border-white/[0.07] flex justify-around px-1 pt-3 pb-6 z-40">
        {([
          { id: 'home', label: 'Home', icon: (a: boolean) => <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="7" stroke={a?'#1D9E75':'#444'} strokeWidth="1.5"/><circle cx="11" cy="11" r="2.5" fill={a?'#1D9E75':'#444'}/></svg> },
          { id: 'explore', label: 'Explore', icon: (a: boolean) => <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect x="3" y="3" width="16" height="16" rx="4" stroke={a?'#1D9E75':'#444'} strokeWidth="1.5"/><circle cx="11" cy="11" r="3" stroke={a?'#1D9E75':'#444'} strokeWidth="1.5"/></svg> },
          { id: 'feed', label: 'Feed', icon: (a: boolean) => <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M3 6h16M3 11h16M3 16h10" stroke={a?'#1D9E75':'#444'} strokeWidth="1.5" strokeLinecap="round"/></svg> },
          { id: 'health', label: 'Health', icon: (a: boolean) => <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M3 11h3l2-5 3 9 2-7 2 3h4" stroke={a?'#1D9E75':'#444'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> },
          { id: 'profile', label: 'Me', icon: (a: boolean) => <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="8" r="3.5" stroke={a?'#1D9E75':'#444'} strokeWidth="1.5"/><path d="M4 19c0-3.9 3.1-7 7-7s7 3.1 7 7" stroke={a?'#1D9E75':'#444'} strokeWidth="1.5" strokeLinecap="round"/></svg> },
        ] as const).map(tab => {
          const active = activeTab === tab.id
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as Tab)} className="flex flex-col items-center gap-1 px-2">
              {tab.icon(active)}
              <span className="text-[9px] font-medium" style={{ color: active ? '#1D9E75' : '#444' }}>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {checkinTrail && (
        <CheckinModal trail={checkinTrail} onClose={() => setCheckinTrail(null)} onVerified={handleVerified} />
      )}

      {toast && (
        <div className="fixed bottom-28 left-1/2 -translate-x-1/2 bg-[#1D9E75] text-white text-[13px] font-medium px-5 py-3 rounded-full z-50 shadow-lg animate-fade-up whitespace-nowrap">
          {toast}
        </div>
      )}
    </main>
  )
}
