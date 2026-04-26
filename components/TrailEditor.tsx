'use client'
import { useState } from 'react'
import { Trail, trails } from '@/app/data/trails'

type EditField = 'difficulty' | 'distance' | 'conditions' | 'description'

const CONDITIONS_ALL = ['Clear', 'Muddy', 'Flooded', 'Scenic', 'Rocky', 'Crowded', 'Windy', 'Slippery', 'Well-maintained']

export default function TrailEditor({ onClose }: { onClose: () => void }) {
  const [selectedTrail, setSelectedTrail] = useState<Trail | null>(null)
  const [field, setField] = useState<EditField | null>(null)
  const [editValue, setEditValue] = useState('')
  const [editConditions, setEditConditions] = useState<string[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [pendingEdits, setPendingEdits] = useState<{trail: string, field: string, value: string}[]>([])

  const startEdit = (t: Trail, f: EditField) => {
    setSelectedTrail(t)
    setField(f)
    setEditValue(f === 'difficulty' ? t.difficulty : f === 'distance' ? t.distance : f === 'description' ? t.description : '')
    setEditConditions(f === 'conditions' ? [...t.conditions] : [])
    setSubmitted(false)
  }

  const handleSubmit = () => {
    if (!selectedTrail || !field) return
    const value = field === 'conditions' ? editConditions.join(', ') : editValue
    setPendingEdits(prev => [...prev, { trail: selectedTrail.name, field, value }])
    setSubmitted(true)
    setTimeout(() => {
      setField(null)
      setSelectedTrail(null)
    }, 1800)
  }

  if (field && selectedTrail) {
    return (
      <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm">
        <div className="w-full max-w-[420px] bg-[#111] border border-white/10 rounded-t-3xl p-6 pb-10 animate-slide-up">
          <div className="w-9 h-1 bg-white/10 rounded-full mx-auto mb-5" />

          {!submitted ? (
            <>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-[#1D9E75]" />
                <p className="text-[11px] text-[#1D9E75] font-medium">Edit requires World ID verification</p>
              </div>
              <h2 className="text-lg font-semibold mb-1">
                Edit {field} — {selectedTrail.name}
              </h2>
              <p className="text-sm text-white/30 mb-5">Your edit will be reviewed by the community. Your World ID proves you're a real human.</p>

              {field === 'difficulty' && (
                <div className="flex gap-2 mb-5">
                  {(['Easy', 'Moderate', 'Hard'] as const).map(d => (
                    <button key={d} onClick={() => setEditValue(d)}
                      className={`flex-1 py-3 rounded-xl text-sm font-medium border transition-all ${
                        editValue === d ? 'bg-[#1D9E75]/15 border-[#1D9E75] text-[#1D9E75]' : 'bg-[#191919] border-white/10 text-white/40'
                      }`}
                    >{d}</button>
                  ))}
                </div>
              )}

              {field === 'distance' && (
                <input
                  value={editValue}
                  onChange={e => setEditValue(e.target.value)}
                  placeholder="e.g. 5.4 km"
                  className="w-full bg-[#191919] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none mb-5 focus:border-[#1D9E75]/40"
                />
              )}

              {field === 'conditions' && (
                <div className="flex flex-wrap gap-2 mb-5">
                  {CONDITIONS_ALL.map(c => (
                    <button key={c} onClick={() => setEditConditions(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])}
                      className={`px-3 py-1.5 rounded-full text-[12px] font-medium border transition-all ${
                        editConditions.includes(c) ? 'bg-[#1D9E75]/15 border-[#1D9E75] text-[#1D9E75]' : 'bg-[#191919] border-white/10 text-white/40'
                      }`}
                    >{c}</button>
                  ))}
                </div>
              )}

              {field === 'description' && (
                <textarea
                  value={editValue}
                  onChange={e => setEditValue(e.target.value)}
                  rows={4}
                  className="w-full bg-[#191919] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none mb-5 focus:border-[#1D9E75]/40 resize-none"
                />
              )}

              <button onClick={handleSubmit}
                className="w-full bg-[#1D9E75] text-white font-semibold py-4 rounded-2xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <circle cx="9" cy="9" r="7" stroke="white" strokeWidth="1.5"/>
                  <circle cx="9" cy="9" r="2.5" fill="white"/>
                </svg>
                Submit edit with World ID
              </button>
            </>
          ) : (
            <div className="py-6 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-[#1D9E75]/10 border border-[#1D9E75]/30 flex items-center justify-center mb-4">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <path d="M6 14l6 6 10-10" stroke="#1D9E75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="text-lg font-semibold mb-1">Edit submitted!</p>
              <p className="text-sm text-white/40 text-center">Verified by World ID · Under community review</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="px-5 pb-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-2 rounded-full bg-[#1D9E75]" />
        <p className="text-[11px] text-white/30">World ID required to submit edits · No bots, no spam</p>
      </div>

      {pendingEdits.length > 0 && (
        <div className="bg-[#0a3d2a] border border-[#1D9E75]/20 rounded-2xl p-4 mb-4">
          <p className="text-sm text-[#1D9E75] font-medium mb-2">Your pending edits</p>
          {pendingEdits.map((e, i) => (
            <div key={i} className="flex items-center gap-2 py-1.5 border-b border-[#1D9E75]/10 last:border-0">
              <div className="w-1 h-1 rounded-full bg-[#1D9E75]" />
              <p className="text-[12px] text-white/50">
                <span className="text-white/70">{e.trail}</span> · {e.field} → {e.value}
              </p>
            </div>
          ))}
        </div>
      )}

      <p className="text-[13px] font-medium text-white/40 mb-3">Select a trail to edit</p>

      {trails.map(t => (
        <div key={t.id} className="bg-[#111] border border-white/[0.07] rounded-2xl p-4 mb-3">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#0F6E56] flex items-center justify-center text-lg flex-shrink-0">
              {t.type === 'Trail' ? '🏔' : t.type === 'Peak' ? '⛰' : t.type === 'Urban' ? '🏙' : t.type === 'Marathon' ? '🏃' : '💧'}
            </div>
            <div>
              <p className="text-[14px] font-medium text-white">{t.name}</p>
              <p className="text-[11px] text-white/30">{t.location} · {t.distance}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {(['difficulty', 'distance', 'conditions', 'description'] as EditField[]).map(f => (
              <button key={f} onClick={() => startEdit(t, f)}
                className="bg-[#191919] border border-white/10 rounded-xl p-2.5 text-left hover:border-[#1D9E75]/30 transition-all group"
              >
                <p className="text-[11px] text-white/25 mb-0.5 capitalize">{f}</p>
                <p className="text-[12px] font-medium text-white/60 group-hover:text-[#1D9E75] transition-colors truncate">
                  {f === 'difficulty' ? t.difficulty
                    : f === 'distance' ? t.distance
                    : f === 'conditions' ? t.conditions.slice(0,2).join(', ')
                    : 'Edit description →'}
                </p>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
