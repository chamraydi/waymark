'use client'
import { useState } from 'react'

type HealthSource = 'mock' | 'apple'

const MOCK_DATA = {
  recovery: 84, hrv: 62, restingHR: 52, sleep: 7.6, strain: 14.2, calories: 2140,
  steps: 8432, vo2max: 48, readiness: 'Ready to push',
}

const APPLE_DATA = {
  recovery: 78, hrv: 58, restingHR: 55, sleep: 7.1, strain: 11.8, calories: 1980,
  steps: 6210, vo2max: 47, readiness: 'Moderate effort',
}

export default function HealthDashboard() {
  const [source, setSource] = useState<HealthSource>('mock')
  const [connected, setConnected] = useState(false)
  const [connecting, setConnecting] = useState(false)

  const data = connected && source === 'apple' ? APPLE_DATA : MOCK_DATA
  const recoveryColor = data.recovery >= 80 ? '#1D9E75' : data.recovery >= 60 ? '#EF9F27' : '#E24B4A'
  const sleepColor = data.sleep >= 7.5 ? '#1D9E75' : data.sleep >= 6 ? '#EF9F27' : '#E24B4A'

  const connectApple = () => {
    setConnecting(true)
    setTimeout(() => { setConnected(true); setSource('apple'); setConnecting(false) }, 2000)
  }

  return (
    <div className="px-5 pb-6">
      {/* Vision badge */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center gap-1.5 bg-[#191919] border border-white/10 rounded-full px-3 py-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#EF9F27]" />
          <span className="text-[11px] text-white/40 font-medium">V2 — Health layer</span>
        </div>
        {!connected ? (
          <button onClick={connectApple} disabled={connecting}
            className="flex items-center gap-1.5 bg-[#191919] border border-white/10 rounded-full px-3 py-1.5 text-[11px] font-medium text-white/50 hover:border-white/20 transition-all disabled:opacity-50"
          >
            {connecting ? <><div className="w-2.5 h-2.5 border border-white/30 border-t-white/80 rounded-full animate-spin" />Connecting…</> : <>🍎 Connect Apple Health</>}
          </button>
        ) : (
          <div className="flex items-center gap-1.5 bg-[#0a3d2a] border border-[#1D9E75]/30 rounded-full px-3 py-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#1D9E75]" />
            <span className="text-[11px] text-[#1D9E75] font-medium">Apple Health synced</span>
          </div>
        )}
      </div>

      {/* Recovery ring */}
      <div className="bg-[#111] border border-white/[0.07] rounded-2xl p-5 mb-3 flex items-center gap-5">
        <div className="flex-1">
          <p className="text-[10px] font-medium tracking-widest uppercase text-white/25 mb-1">Recovery Score</p>
          <p className="text-5xl font-semibold leading-none tracking-tight" style={{ color: recoveryColor }}>{data.recovery}</p>
          <p className="text-sm text-white/40 mt-1.5">{data.readiness}</p>
          <p className="text-[11px] font-mono text-white/20 mt-2">HRV {data.hrv}ms · HR {data.restingHR}bpm · Sleep {data.sleep}h</p>
          {connected && <p className="text-[10px] text-[#1D9E75]/50 mt-1">↑ Live from Apple Health</p>}
        </div>
        <svg width="80" height="80" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="34" fill="none" stroke="#191919" strokeWidth="8"/>
          <circle cx="40" cy="40" r="34" fill="none" stroke={recoveryColor} strokeWidth="8"
            strokeDasharray="213.6 213.6"
            strokeDashoffset={213.6 - (213.6 * data.recovery / 100)}
            strokeLinecap="round" transform="rotate(-90 40 40)"/>
          <text x="40" y="44" textAnchor="middle" fontFamily="DM Sans,sans-serif" fontSize="13" fontWeight="600" fill={recoveryColor}>{data.recovery}%</text>
        </svg>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {[
          { label: 'HRV', val: `${data.hrv}ms`, color: '#1D9E75' },
          { label: 'Resting HR', val: `${data.restingHR}`, color: 'white' },
          { label: 'Sleep', val: `${data.sleep}h`, color: sleepColor },
          { label: 'Strain', val: `${data.strain}`, color: '#EF9F27' },
          { label: 'Steps', val: data.steps.toLocaleString(), color: 'white' },
          { label: 'Calories', val: data.calories.toLocaleString(), color: 'white' },
        ].map(m => (
          <div key={m.label} className="bg-[#111] border border-white/[0.07] rounded-xl p-3 text-center">
            <p className="text-lg font-semibold leading-tight" style={{ color: m.color }}>{m.val}</p>
            <p className="text-[9px] text-white/25 mt-1 uppercase tracking-wider">{m.label}</p>
          </div>
        ))}
      </div>

      {/* VO2 Max */}
      <div className="bg-[#111] border border-white/[0.07] rounded-xl p-4 mb-3">
        <div className="flex justify-between items-center mb-2">
          <p className="text-[13px] font-medium text-white">VO2 Max</p>
          <span className="text-[11px] text-[#1D9E75] bg-[#1D9E75]/10 px-2 py-0.5 rounded-full">Above average</span>
        </div>
        <div className="flex items-end gap-2 mb-2">
          <p className="text-3xl font-semibold text-white">{data.vo2max}</p>
          <p className="text-sm text-white/30 mb-1">mL/kg/min</p>
        </div>
        <div className="h-1.5 bg-[#191919] rounded-full overflow-hidden">
          <div className="h-full bg-[#1D9E75] rounded-full transition-all duration-700" style={{ width: `${(data.vo2max / 60) * 100}%` }} />
        </div>
      </div>

      {/* Readiness note */}
      <div className="bg-[#0a3d2a] border border-[#1D9E75]/20 rounded-xl p-4 mb-3">
        <p className="text-sm text-[#1D9E75] font-medium mb-0.5">
          {data.recovery >= 75 ? "You're ready for an adventure today" : "Take it easy today"}
        </p>
        <p className="text-xs text-[#1D9E75]/50">
          {data.recovery >= 75
            ? "High recovery + good sleep. Bukit Tabur West is a great match for your current load."
            : "Your recovery is lower. Consider Titiwangsa Lake Gardens — an easy 4.1km walk."}
        </p>
      </div>

      {/* Connect sources */}
      <div className="bg-[#111] border border-white/[0.07] rounded-xl p-4">
        <p className="text-[13px] font-medium text-white mb-3">Health sources</p>
        {[
          { name: 'Apple Health', icon: '🍎', available: true, desc: 'Steps, HR, HRV, Sleep' },
          { name: 'Garmin Connect', icon: '⌚', available: false, desc: 'GPS, VO2, Training load' },
          { name: 'Whoop', icon: '💪', available: false, desc: 'Recovery, Strain, Sleep' },
          { name: 'Fitbit', icon: '📊', available: false, desc: 'Steps, Sleep, HR' },
        ].map(s => (
          <div key={s.name} className="flex items-center gap-3 py-2.5 border-b border-white/[0.05] last:border-0">
            <span className="text-lg w-7">{s.icon}</span>
            <div className="flex-1">
              <p className="text-[13px] text-white/60">{s.name}</p>
              <p className="text-[10px] text-white/20">{s.desc}</p>
            </div>
            {s.available ? (
              connected ? (
                <span className="text-[11px] font-medium text-[#1D9E75] bg-[#1D9E75]/10 px-2 py-1 rounded-full">Connected</span>
              ) : (
                <button onClick={connectApple} className="text-[11px] font-medium text-[#1D9E75] bg-[#1D9E75]/10 px-3 py-1 rounded-full">Connect</button>
              )
            ) : (
              <span className="text-[10px] text-white/20 bg-[#191919] px-2 py-1 rounded-full">V2</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
