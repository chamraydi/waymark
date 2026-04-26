'use client'
import { useState } from 'react'

type ShopTab = 'gear' | 'guides' | 'permits'

const GEAR = [
  { id: 'g1', name: 'Kinvara 14 Running Shoes', brand: 'Saucony', emoji: '👟', price: 45, badge: 'Sale' },
  { id: 'g2', name: 'Trail Running Vest 5L', brand: 'Salomon', emoji: '🎽', price: 38, badge: 'New' },
  { id: 'g3', name: 'Forerunner 265 GPS Watch', brand: 'Garmin', emoji: '⌚', price: 120, badge: 'Sale' },
  { id: 'g4', name: 'Dri-FIT Trail Tee', brand: 'Nike', emoji: '👕', price: 18, badge: null },
  { id: 'g5', name: 'Trekking Pole Set', brand: 'Black Diamond', emoji: '🥢', price: 55, badge: 'Sale' },
  { id: 'g6', name: 'Trail Running Shorts', brand: 'Patagonia', emoji: '🩳', price: 22, badge: null },
  { id: 'g7', name: 'Heart Rate Monitor', brand: 'Polar', emoji: '💓', price: 30, badge: 'Sale' },
  { id: 'g8', name: 'Trail Headlamp 400lm', brand: 'Petzl', emoji: '🔦', price: 25, badge: 'New' },
]

const GUIDES = [
  { id: 'gd1', name: 'Ahmad Zulkifli', specialty: 'Summit expeditions', rating: 4.9, reviews: 128, emoji: '🧗', price: 35, badge: 'Top rated', trails: ['Gunung Nuang', 'Bukit Tabur', 'G. Tahan'] },
  { id: 'gd2', name: 'Priya Nair', specialty: 'Trail running coach', rating: 4.8, reviews: 94, emoji: '🏃', price: 25, badge: null, trails: ['KL Marathon', 'KLCC Park', 'Broga Hill'] },
  { id: 'gd3', name: 'Lee Wei Xiang', specialty: 'Night hikes & navigation', rating: 4.7, reviews: 67, emoji: '🌙', price: 28, badge: 'New', trails: ['Bukit Tabur', 'Gasing Hill', 'FRIM'] },
  { id: 'gd4', name: 'Siti Rahimah', specialty: 'Family & beginner hikes', rating: 5.0, reviews: 43, emoji: '🌿', price: 20, badge: 'Top rated', trails: ['Titiwangsa', 'Gasing Hill', 'FRIM'] },
]

const PERMITS = [
  { id: 'p1', name: 'Gunung Nuang Summit Permit', authority: 'Hulu Langat District', emoji: '⛰', price: 8, duration: 'Valid 1 day', quota: '50 hikers/day', avail: 12, badge: 'Limited' },
  { id: 'p2', name: 'Bukit Tabur Entry Pass', authority: 'Ampang Jaya Municipal', emoji: '🏔', price: 5, duration: 'Valid 1 day', quota: '200 hikers/day', avail: 87, badge: null },
  { id: 'p3', name: 'FRIM Forest Research Permit', authority: 'Forest Research Institute', emoji: '🌲', price: 10, duration: 'Valid 3 days', quota: 'Unlimited', avail: 999, badge: null },
  { id: 'p4', name: 'KL Marathon Race Entry', authority: 'KL City Hall', emoji: '🏃', price: 20, duration: 'Race day only', quota: '30,000 runners', avail: 234, badge: 'Popular' },
]

export default function Shop({ wldBalance, onPurchase }: { wldBalance: number; onPurchase: (amount: number, name: string) => void }) {
  const [tab, setTab] = useState<ShopTab>('gear')
  const [purchased, setPurchased] = useState<Set<string>>(new Set())
  const [selected, setSelected] = useState<any>(null)
  const [showConfirm, setShowConfirm] = useState(false)

  const buy = (item: any, price: number) => {
    if (purchased.has(item.id)) return
    setSelected({ ...item, price, insufficient: wldBalance < price })
    setShowConfirm(true)
  }

  const confirmBuy = () => {
    if (!selected || selected.insufficient) { setShowConfirm(false); return }
    setPurchased(prev => new Set([...prev, selected.id]))
    onPurchase(selected.price, selected.name)
    setShowConfirm(false)
  }

  return (
    <div className="pb-4">
      <div className="mx-4 mb-4 rounded-2xl p-4 flex items-center gap-4" style={{ background: 'linear-gradient(135deg,#0a2a1e 0%,#0F6E56 100%)', border: '0.5px solid rgba(29,158,117,0.3)' }}>
        <div className="flex-1">
          <p className="text-[10px] font-medium tracking-widest uppercase text-white/40 mb-1">Your WLD balance</p>
          <p className="text-3xl font-semibold text-white leading-none">⚡ {wldBalance}</p>
          <p className="text-[11px] text-white/40 mt-1">Earn more by checking in to adventures</p>
        </div>
        <div className="text-4xl">🏪</div>
      </div>

      <div className="flex gap-1 bg-[#191919] rounded-xl p-1 mx-4 mb-4">
        {([['gear','🎒 Gear'],['guides','🧗 Guides'],['permits','📋 Permits']] as const).map(([id,label]) => (
          <button key={id} onClick={() => setTab(id)} className="flex-1 py-2 rounded-lg text-[12px] font-medium transition-all" style={{ background: tab===id?'#111':'none', color: tab===id?'white':'rgba(255,255,255,0.3)' }}>{label}</button>
        ))}
      </div>

      {tab === 'gear' && (
        <div className="grid grid-cols-2 gap-3 px-4">
          {GEAR.map(item => (
            <div key={item.id} className="rounded-2xl overflow-hidden cursor-pointer" style={{ background:'#111', border:'0.5px solid rgba(255,255,255,0.06)' }} onClick={() => buy(item, item.price)}>
              <div className="h-[110px] flex items-center justify-center text-5xl" style={{ background:'#181818' }}>{item.emoji}</div>
              <div className="p-3">
                <div className="flex items-start justify-between gap-1 mb-0.5">
                  <p className="text-[13px] font-medium text-white leading-tight">{item.name}</p>
                  {item.badge && <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded flex-shrink-0" style={{ background: item.badge==='Sale'?'rgba(239,159,39,0.2)':'rgba(29,158,117,0.2)', color: item.badge==='Sale'?'#EF9F27':'#1D9E75' }}>{item.badge}</span>}
                </div>
                <p className="text-[10px] text-white/30 mb-2">{item.brand}</p>
                <div className="flex items-center justify-between">
                  <p className="text-[14px] font-semibold" style={{ color:'#1D9E75' }}>⚡{item.price} <span className="text-[10px] font-normal opacity-60">WLD</span></p>
                  <button className="text-[11px] font-semibold px-2.5 py-1.5 rounded-lg" style={{ background: purchased.has(item.id)?'rgba(255,255,255,0.05)':'rgba(29,158,117,0.15)', color: purchased.has(item.id)?'rgba(255,255,255,0.3)':'#1D9E75', border:'0.5px solid rgba(29,158,117,0.3)' }} onClick={e => { e.stopPropagation(); buy(item, item.price) }}>{purchased.has(item.id)?'✓':'Buy'}</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'guides' && (
        <div className="px-4 space-y-3">
          <p className="text-[11px] text-white/30 mb-1">All guides are World ID verified humans</p>
          {GUIDES.map(guide => (
            <div key={guide.id} className="rounded-2xl p-4" style={{ background:'#111', border:'0.5px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0" style={{ background:'#0F6E56' }}>{guide.emoji}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-[14px] font-medium text-white">{guide.name}</p>
                    {guide.badge && <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded" style={{ background:'rgba(239,159,39,0.15)', color:'#EF9F27' }}>{guide.badge}</span>}
                  </div>
                  <p className="text-[11px] text-white/40">{guide.specialty}</p>
                  <p className="text-[11px] text-white/30 mt-0.5">⭐ {guide.rating} · {guide.reviews} reviews</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-[15px] font-semibold" style={{ color:'#1D9E75' }}>⚡{guide.price}</p>
                  <p className="text-[9px] text-white/30">WLD/day</p>
                </div>
              </div>
              <div className="flex gap-1.5 flex-wrap mb-3">
                {guide.trails.map(t => <span key={t} className="text-[10px] px-2 py-1 rounded-full" style={{ background:'#191919', color:'rgba(255,255,255,0.35)', border:'0.5px solid rgba(255,255,255,0.08)' }}>{t}</span>)}
              </div>
              <button onClick={() => buy(guide, guide.price)} className="w-full py-2.5 rounded-xl text-[13px] font-semibold" style={{ background: purchased.has(guide.id)?'rgba(255,255,255,0.05)':'rgba(29,158,117,0.15)', color: purchased.has(guide.id)?'rgba(255,255,255,0.3)':'#1D9E75', border:'0.5px solid rgba(29,158,117,0.25)' }}>
                {purchased.has(guide.id)?'✓ Booked':`Book guide · ⚡${guide.price} WLD`}
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === 'permits' && (
        <div className="px-4 space-y-3">
          <p className="text-[11px] text-white/30 mb-1">Permits verified on World Chain · Tamper-proof</p>
          {PERMITS.map(permit => (
            <div key={permit.id} className="rounded-2xl p-4" style={{ background:'#111', border:'0.5px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-start gap-3 mb-3">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background:'#0F6E56' }}>{permit.emoji}</div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[14px] font-medium text-white leading-tight">{permit.name}</p>
                    {permit.badge && <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded flex-shrink-0" style={{ background: permit.badge==='Limited'?'rgba(226,75,74,0.15)':'rgba(29,158,117,0.15)', color: permit.badge==='Limited'?'#E24B4A':'#1D9E75' }}>{permit.badge}</span>}
                  </div>
                  <p className="text-[11px] text-white/35 mt-0.5">{permit.authority}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {[['Duration',permit.duration],['Quota',permit.quota],['Available',String(permit.avail)]].map(([k,v]) => (
                  <div key={k} className="rounded-lg p-2 text-center" style={{ background:'#191919' }}>
                    <p className="text-[12px] font-medium text-white">{v}</p>
                    <p className="text-[9px] text-white/30 mt-0.5">{k}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <p className="text-[15px] font-semibold" style={{ color:'#1D9E75' }}>⚡{permit.price} <span className="text-[10px] font-normal opacity-60">WLD</span></p>
                <button onClick={() => buy(permit, permit.price)} className="px-4 py-2 rounded-xl text-[13px] font-semibold" style={{ background: purchased.has(permit.id)?'rgba(255,255,255,0.05)':'#1D9E75', color: purchased.has(permit.id)?'rgba(255,255,255,0.3)':'#fff' }}>
                  {purchased.has(permit.id)?'✓ Purchased':'Get permit'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showConfirm && selected && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm" onClick={() => setShowConfirm(false)}>
          <div className="w-full max-w-[420px] rounded-t-3xl p-6 pb-10" style={{ background:'#111', border:'0.5px solid rgba(255,255,255,0.1)' }} onClick={e => e.stopPropagation()}>
            <div className="w-9 h-1 rounded-full mx-auto mb-5" style={{ background:'rgba(255,255,255,0.1)' }} />
            {selected.insufficient ? (
              <>
                <div className="text-center mb-5">
                  <div className="text-4xl mb-3">⚡</div>
                  <p className="text-lg font-semibold text-white mb-2">Not enough WLD</p>
                  <p className="text-sm text-white/40">You need ⚡{selected.price} WLD but only have ⚡{wldBalance}. Check in to earn more.</p>
                </div>
                <button onClick={() => setShowConfirm(false)} className="w-full py-3.5 rounded-2xl text-[15px] font-semibold text-white" style={{ background:'#191919' }}>Close</button>
              </>
            ) : (
              <>
                <p className="text-lg font-semibold text-white mb-1">Confirm purchase</p>
                <p className="text-sm text-white/40 mb-5">{selected.name}</p>
                <div className="flex justify-between items-center p-4 rounded-xl mb-5" style={{ background:'#191919' }}>
                  <div><p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Price</p><p className="text-2xl font-semibold" style={{ color:'#1D9E75' }}>⚡{selected.price} WLD</p></div>
                  <div className="text-right"><p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Remaining</p><p className="text-xl font-semibold text-white">⚡{wldBalance - selected.price}</p></div>
                </div>
                <button onClick={confirmBuy} className="w-full py-3.5 rounded-2xl text-[15px] font-semibold text-white mb-3" style={{ background:'#1D9E75' }}>Confirm · ⚡{selected.price} WLD</button>
                <button onClick={() => setShowConfirm(false)} className="w-full py-2.5 rounded-2xl text-[13px] font-medium" style={{ background:'none', color:'rgba(255,255,255,0.3)' }}>Cancel</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}