'use client'
import { useState } from 'react'
import { Trail, getDifficultyBg, getTypeIcon } from '@/app/data/trails'

interface Props {
  trail: Trail
  onClose: () => void
  onVerified: (trail: Trail) => void
}

type Step = 'detail' | 'conditions' | 'worldid' | 'verifying' | 'success'

const CONDITIONS = ['Clear', 'Muddy', 'Flooded', 'Scenic', 'Rocky', 'Crowded', 'Windy']

export default function CheckinModal({ trail, onClose, onVerified }: Props) {
  const [step, setStep] = useState<Step>('detail')
  const [selectedConditions, setSelectedConditions] = useState<string[]>(trail.conditions.slice(0, 1))
  const [error, setError] = useState('')

  const toggleCondition = (c: string) => {
    setSelectedConditions(prev =>
      prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]
    )
  }

  const handleVerify = async () => {
    setStep('verifying')
    setError('')
    try {
      // Simulate World ID verification flow
      // In production: integrate @worldcoin/idkit IDKitWidget here
      await new Promise(r => setTimeout(r, 2500))

      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trail_id: trail.id,
          proof: 'mock_proof',
          nullifier_hash: `mock_${Date.now()}`,
          verification_level: 'orb',
        }),
      })
      const data = await res.json()
      if (data.success) {
        setStep('success')
        setTimeout(() => onVerified(trail), 2000)
      } else {
        throw new Error('Verification failed')
      }
    } catch {
      setError('Something went wrong. Please try again.')
      setStep('worldid')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-[420px] bg-[#111] border border-white/10 rounded-t-3xl p-6 pb-10 animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="w-9 h-1 bg-white/10 rounded-full mx-auto mb-6" />

        {/* STEP: Detail */}
        {step === 'detail' && (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-xl bg-[#0F6E56] flex items-center justify-center text-2xl">
                {getTypeIcon(trail.type)}
              </div>
              <div>
                <h2 className="text-lg font-semibold">{trail.name}</h2>
                <p className="text-sm text-white/40">{trail.location} · {trail.distance}</p>
              </div>
            </div>

            <p className="text-sm text-white/50 leading-relaxed mb-5">{trail.description}</p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 mb-5">
              {[
                { label: 'Distance', val: trail.distance },
                { label: 'Elevation', val: trail.elevationGain },
                { label: 'Est. time', val: trail.estimatedTime },
              ].map(s => (
                <div key={s.label} className="bg-[#191919] rounded-xl p-3 text-center">
                  <p className="text-[15px] font-semibold text-white">{s.val}</p>
                  <p className="text-[10px] text-white/30 mt-0.5 uppercase tracking-wider">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 mb-5">
              <span className={`text-xs font-medium px-3 py-1 rounded-full ${getDifficultyBg(trail.difficulty)}`}>
                {trail.difficulty}
              </span>
              <span className="text-xs text-white/30">·</span>
              <span className="text-xs text-white/40">{trail.type}</span>
            </div>

            <div className="flex items-center gap-2 mb-6 bg-[#0a3d2a] rounded-xl p-3">
              <div className="w-2 h-2 rounded-full bg-[#1D9E75] flex-shrink-0" />
              <p className="text-sm text-[#1D9E75] font-medium">
                {trail.verifiedHumans.toLocaleString()} verified humans have been here
              </p>
            </div>

            <button
              onClick={() => setStep('conditions')}
              className="w-full bg-[#1D9E75] text-white font-semibold text-[15px] py-4 rounded-2xl hover:opacity-90 transition-opacity"
            >
              Check in here →
            </button>
          </div>
        )}

        {/* STEP: Conditions */}
        {step === 'conditions' && (
          <div>
            <button onClick={() => setStep('detail')} className="flex items-center gap-1 text-sm text-white/40 mb-4">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Back
            </button>
            <h2 className="text-lg font-semibold mb-1">Trail conditions</h2>
            <p className="text-sm text-white/40 mb-5">How does it look out there? Select all that apply.</p>

            <div className="flex flex-wrap gap-2 mb-6">
              {CONDITIONS.map(c => (
                <button
                  key={c}
                  onClick={() => toggleCondition(c)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                    selectedConditions.includes(c)
                      ? 'bg-[#1D9E75]/15 border-[#1D9E75] text-[#1D9E75]'
                      : 'bg-[#191919] border-white/10 text-white/50'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep('worldid')}
              disabled={selectedConditions.length === 0}
              className="w-full bg-[#1D9E75] text-white font-semibold text-[15px] py-4 rounded-2xl hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continue →
            </button>
          </div>
        )}

        {/* STEP: World ID */}
        {step === 'worldid' && (
          <div>
            <button onClick={() => setStep('conditions')} className="flex items-center gap-1 text-sm text-white/40 mb-4">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Back
            </button>

            <div className="flex justify-center mb-5">
              <div className="relative">
                <div className="w-20 h-20 rounded-3xl bg-[#1D9E75]/10 border border-[#1D9E75]/30 flex items-center justify-center">
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                    <circle cx="20" cy="20" r="16" stroke="#1D9E75" strokeWidth="2"/>
                    <circle cx="20" cy="20" r="6" fill="#1D9E75"/>
                  </svg>
                </div>
              </div>
            </div>

            <h2 className="text-lg font-semibold text-center mb-1">Verify with World ID</h2>
            <p className="text-sm text-white/40 text-center mb-6">
              Prove you're a real human — privately. Zero personal data shared.
            </p>

            <div className="space-y-3 mb-6">
              {[
                'Open your World App',
                'Confirm your identity with iris scan',
                'Your check-in is recorded on World Chain',
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-[#191919] rounded-xl">
                  <div className="w-6 h-6 rounded-full bg-[#1D9E75]/10 border border-[#1D9E75]/30 flex items-center justify-center text-[11px] font-semibold text-[#1D9E75] flex-shrink-0">
                    {i + 1}
                  </div>
                  <p className="text-sm text-white/60">{s}</p>
                </div>
              ))}
            </div>

            {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}

            {/* 
              Production: Replace this button with <IDKitWidget> from @worldcoin/idkit
              See: https://docs.world.org/world-id/idkit/integrate
              
              <IDKitWidget
                app_id={process.env.NEXT_PUBLIC_WLD_APP_ID}
                action="checkin"
                onSuccess={handleVerify}
                verification_level={VerificationLevel.Orb}
              >
                {({ open }) => <button onClick={open}>Open World App</button>}
              </IDKitWidget>
            */}
            <button
              onClick={handleVerify}
              className="w-full bg-[#1D9E75] text-white font-semibold text-[15px] py-4 rounded-2xl hover:opacity-90 transition-opacity flex items-center justify-center gap-3"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="8" stroke="white" strokeWidth="1.5"/>
                <circle cx="10" cy="10" r="3" fill="white"/>
              </svg>
              Open World App to verify
            </button>

            <p className="text-[11px] text-white/20 text-center mt-3">
              Powered by World ID · Zero-knowledge proof · No biometric data stored
            </p>
          </div>
        )}

        {/* STEP: Verifying */}
        {step === 'verifying' && (
          <div className="py-8 flex flex-col items-center">
            <div className="relative mb-6">
              <div className="w-20 h-20 rounded-full border-2 border-[#1D9E75]/20 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full border-t-2 border-[#1D9E75] absolute animate-spin" />
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="12" stroke="#1D9E75" strokeWidth="1.5" opacity="0.3"/>
                  <circle cx="16" cy="16" r="5" fill="#1D9E75"/>
                </svg>
              </div>
            </div>
            <h2 className="text-lg font-semibold mb-2">Verifying with World ID</h2>
            <p className="text-sm text-white/40 text-center">Generating zero-knowledge proof…</p>
          </div>
        )}

        {/* STEP: Success */}
        {step === 'success' && (
          <div className="py-8 flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-[#1D9E75]/10 border border-[#1D9E75]/30 flex items-center justify-center mb-6">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <path d="M8 18l7 7 13-13" stroke="#1D9E75" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">Check-in verified!</h2>
            <p className="text-sm text-white/40 text-center mb-1">You've been added to {trail.name}</p>
            <p className="text-xs text-[#1D9E75]/60 text-center">Recorded on World Chain · Proof of human presence confirmed</p>
          </div>
        )}
      </div>
    </div>
  )
}
