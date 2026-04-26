'use client'
import { useState, useEffect, useRef } from 'react'
import { Trail } from '@/app/data/trails'

interface Props {
  trail: Trail
  onClose: () => void
  onFinish: (dist: number, cal: number, duration: number) => void
}

export default function GPSTracking({ trail, onClose, onFinish }: Props) {
  const [playing, setPlaying] = useState(false)
  const [paused, setPaused] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [dist, setDist] = useState(0)
  const [speed, setSpeed] = useState(0)
  const [hr, setHr] = useState(142)
  const [cal, setCal] = useState(0)
  const [steps, setSteps] = useState(0)
  const [elev, setElev] = useState(180)
  const [showSOS, setShowSOS] = useState(false)
  const [sosElapsed, setSosElapsed] = useState(0)
  const [clock, setClock] = useState('')
  const [finished, setFinished] = useState(false)
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const trackLineRef = useRef<any>(null)
  const userMarkerRef = useRef<any>(null)
  const posRef = useRef([trail.lat, trail.lng])
  const timerRef = useRef<any>(null)
  const simRef = useRef<any>(null)
  const sosRef = useRef<any>(null)

  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (!mapRef.current) return
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link')
      link.id = 'leaflet-css'; link.rel = 'stylesheet'
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css'
      document.head.appendChild(link)
    }
    import('leaflet').then(L => {
      if (!mapRef.current || mapInstanceRef.current) return
      const map = L.map(mapRef.current, { center: [trail.lat, trail.lng], zoom: 15, zoomControl: false, attributionControl: false })
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map)
      const line = L.polyline([[trail.lat, trail.lng]], { color: '#1D9E75', weight: 4, opacity: 0.9 }).addTo(map)
      const icon = L.divIcon({ className: '', html: '<div style="width:18px;height:18px;border-radius:50%;background:#1D9E75;border:3px solid rgba(29,158,117,0.4);box-shadow:0 0 0 8px rgba(29,158,117,0.15)"></div>', iconSize: [18,18], iconAnchor: [9,9] })
      const marker = L.marker([trail.lat, trail.lng], { icon }).addTo(map)
      mapInstanceRef.current = map; trackLineRef.current = line; userMarkerRef.current = marker
    })
    return () => { clearInterval(timerRef.current); clearInterval(simRef.current); if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null } }
  }, [])

  useEffect(() => {
    if (showSOS) { sosRef.current = setInterval(() => setSosElapsed(s => s + 1), 1000) }
    else { clearInterval(sosRef.current); setSosElapsed(0) }
    return () => clearInterval(sosRef.current)
  }, [showSOS])

  const startTracking = () => {
    setPlaying(true); setPaused(false)
    timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000)
    simRef.current = setInterval(() => {
      const dLat = (Math.random() - 0.4) * 0.0002, dLng = (Math.random() - 0.4) * 0.0002
      posRef.current = [posRef.current[0] + dLat, posRef.current[1] + dLng]
      const p: [number,number] = [posRef.current[0], posRef.current[1]]
      if (trackLineRef.current) { const ll = trackLineRef.current.getLatLngs(); ll.push(p); trackLineRef.current.setLatLngs(ll) }
      if (userMarkerRef.current) userMarkerRef.current.setLatLng(p)
      if (mapInstanceRef.current) mapInstanceRef.current.panTo(p, { animate: true, duration: 0.5 })
      setDist(d => +(d + 0.008 + Math.random() * 0.006).toFixed(3))
      setSpeed(+(Math.max(3, Math.min(12, Math.random() * 8 + 4))).toFixed(1))
      setHr(h => Math.max(120, Math.min(175, Math.round(h + (Math.random() - 0.5) * 8))))
      setCal(c => c + Math.floor(Math.random() * 2 + 1))
      setSteps(s => s + Math.floor(Math.random() * 8 + 10))
      setElev(e => Math.max(50, Math.min(1500, e + Math.floor((Math.random() - 0.48) * 5))))
    }, 3000)
  }

  const togglePause = () => {
    if (!playing) { startTracking(); return }
    if (paused) {
      setPaused(false)
      timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000)
      simRef.current = setInterval(() => { setDist(d => +(d + 0.008 + Math.random() * 0.006).toFixed(3)); setSpeed(+(Math.max(3, Math.min(12, Math.random() * 8 + 4))).toFixed(1)); setHr(h => Math.max(120, Math.min(175, Math.round(h + (Math.random() - 0.5) * 8)))); setCal(c => c + 1); setSteps(s => s + 12) }, 3000)
    } else { setPaused(true); clearInterval(timerRef.current); clearInterval(simRef.current) }
  }

  const fmt = (s: number) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`
  const pace = dist > 0 ? `${Math.floor(elapsed/dist/60)}:${String(Math.round((elapsed/dist)%60)).padStart(2,'0')}` : '—'
  const hrColor = hr > 165 ? '#E24B4A' : '#EF9F27'

  if (finished) return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center max-w-[420px] mx-auto" style={{ background:'#090909' }}>
      <div className="w-20 h-20 rounded-full flex items-center justify-center mb-5" style={{ background:'rgba(29,158,117,0.12)', border:'1px solid rgba(29,158,117,0.3)' }}>
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><path d="M7 18l8 8 14-14" stroke="#1D9E75" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
      <p className="text-2xl font-semibold text-white mb-1">Activity saved!</p>
      <p className="text-sm text-white/40 mb-8">{trail.name}</p>
      <div className="grid grid-cols-3 gap-3 w-full px-8 mb-8">
        {[['Distance',`${dist.toFixed(2)}km`],['Duration',fmt(elapsed)],['Calories',`${cal} cal`]].map(([k,v]) => (
          <div key={k} className="rounded-2xl p-4 text-center" style={{ background:'#111', border:'0.5px solid rgba(255,255,255,0.06)' }}>
            <p className="text-xl font-semibold text-white">{v}</p>
            <p className="text-[10px] text-white/30 mt-1">{k}</p>
          </div>
        ))}
      </div>
      <button onClick={() => { onFinish(dist, cal, elapsed); onClose() }} className="px-10 py-4 rounded-2xl text-[15px] font-semibold text-white" style={{ background:'#1D9E75' }}>Done</button>
    </div>
  )

  return (
    <div className="fixed inset-0 z-[200] flex flex-col max-w-[420px] mx-auto" style={{ background:'#090909' }}>
      <style>{`.leaflet-tile{filter:brightness(.55) saturate(.45) hue-rotate(10deg)!important}.leaflet-container{background:#111!important}@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(1.3)}}@keyframes heartbeat{0%,100%{transform:scale(1)}50%{transform:scale(1.2)}}@keyframes sosring{from{box-shadow:0 0 0 0 rgba(226,75,74,0.4)}to{box-shadow:0 0 0 20px rgba(226,75,74,0)}}`}</style>

      <div className="relative flex-1 min-h-0">
        <div ref={mapRef} style={{ width:'100%', height:'100%' }} />
        <div className="absolute top-0 left-0 right-0 z-10" style={{ background:'linear-gradient(to bottom,rgba(9,9,9,0.95) 0%,rgba(9,9,9,0.6) 70%,transparent 100%)', padding:'48px 18px 20px' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[16px] font-semibold text-white">{trail.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 rounded-full" style={{ background: playing&&!paused?'#1D9E75':paused?'#EF9F27':'#444', animation: playing&&!paused?'pulse 1.8s infinite':'none' }} />
                <span className="text-[12px] font-medium" style={{ color: playing&&!paused?'#1D9E75':paused?'#EF9F27':'rgba(255,255,255,0.4)' }}>{!playing?'Ready':paused?'Paused':'Tracking active'}</span>
              </div>
            </div>
            <div className="px-3 py-1.5 rounded-full font-mono text-[12px] text-white/60" style={{ background:'rgba(9,9,9,0.7)', border:'0.5px solid rgba(255,255,255,0.1)' }}>{clock}</div>
          </div>
        </div>
        <button onClick={onClose} className="absolute z-20 top-12 right-4 w-8 h-8 rounded-full flex items-center justify-center" style={{ background:'rgba(9,9,9,0.8)', border:'0.5px solid rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.5)', fontSize:'18px' }}>✕</button>
        <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background:'rgba(9,9,9,0.85)', border:'0.5px solid rgba(255,255,255,0.1)' }}>
          <span style={{ fontSize:'16px', animation:'heartbeat .8s ease-in-out infinite' }}>❤️</span>
          <div><p className="text-[20px] font-semibold leading-none font-mono" style={{ color:hrColor }}>{playing?hr:'—'}</p><p className="text-[9px] text-white/30">bpm</p></div>
        </div>
      </div>

      <div className="flex-shrink-0" style={{ background:'#090909', borderTop:'0.5px solid rgba(255,255,255,0.08)', padding:'16px 18px 36px' }}>
        <div className="grid grid-cols-3 gap-px rounded-2xl overflow-hidden mb-3" style={{ background:'rgba(255,255,255,0.05)', border:'0.5px solid rgba(255,255,255,0.05)' }}>
          {[{label:'Distance',val:playing?`${dist.toFixed(2)}`:'0.00',unit:'km',color:'#1D9E75'},{label:'Pace',val:playing?pace:'—',unit:'min/km',color:'white'},{label:'Duration',val:fmt(elapsed),unit:' ',color:'#EF9F27'}].map(m => (
            <div key={m.label} className="text-center py-3" style={{ background:'#111' }}>
              <p className="text-[24px] font-semibold leading-none font-mono" style={{ color:m.color }}>{m.val}</p>
              <p className="text-[9px] text-white/30 mt-0.5">{m.unit}</p>
              <p className="text-[9px] text-white/20 uppercase tracking-wider mt-1">{m.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-4 gap-2 mb-4">
          {[{label:'Speed',val:playing?`${speed}km/h`:'—'},{label:'Elevation',val:playing?`${elev}m`:'—'},{label:'Calories',val:playing?`${cal}`:'0'},{label:'Steps',val:playing?steps.toLocaleString():'0'}].map(m => (
            <div key={m.label} className="rounded-xl py-2.5 text-center" style={{ background:'#111', border:'0.5px solid rgba(255,255,255,0.05)' }}>
              <p className="text-[13px] font-semibold text-white">{m.val}</p>
              <p className="text-[8px] text-white/25 uppercase tracking-wider mt-0.5">{m.label}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-4">
          <button onClick={() => setShowSOS(true)} className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background:'#E24B4A', border:'none' }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 5v7M10 14.5v1" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg>
          </button>
          <button onClick={togglePause} className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background:'#191919', border:'0.5px solid rgba(255,255,255,0.1)' }}>
            {playing&&!paused ? <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="4" y="3" width="4" height="14" rx="2" fill="rgba(255,255,255,0.7)"/><rect x="12" y="3" width="4" height="14" rx="2" fill="rgba(255,255,255,0.7)"/></svg> : <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M6 4l12 6-12 6V4z" fill="rgba(255,255,255,0.7)"/></svg>}
          </button>
          <button onClick={() => { if(!playing) startTracking() }} className="w-[72px] h-[72px] rounded-full flex items-center justify-center" style={{ background: playing?'rgba(29,158,117,0.25)':'#1D9E75', border:'none' }}>
            {playing ? <div className="w-2.5 h-2.5 rounded-full" style={{ background:'#1D9E75', animation:'pulse 1.5s infinite' }} /> : <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M9 7l14 7-14 7V7z" fill="white"/></svg>}
          </button>
          <button onClick={() => { clearInterval(timerRef.current); clearInterval(simRef.current); setFinished(true) }} className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background:'#191919', border:'0.5px solid rgba(226,75,74,0.3)' }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="4" y="4" width="10" height="10" rx="2" fill="rgba(226,75,74,0.8)"/></svg>
          </button>
          <button onClick={onClose} className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background:'#191919', border:'0.5px solid rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.3)', fontSize:'16px' }}>✕</button>
        </div>
      </div>

      {showSOS && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center" style={{ background:'rgba(0,0,0,0.9)', backdropFilter:'blur(12px)' }}>
          <div className="w-[300px] rounded-3xl p-7 text-center" style={{ background:'#1a0808', border:'1px solid rgba(226,75,74,0.4)' }}>
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl mx-auto mb-4" style={{ background:'rgba(226,75,74,0.15)', border:'2px solid #E24B4A', animation:'sosring 1s ease-in-out infinite alternate' }}>🆘</div>
            <p className="text-xl font-semibold mb-2" style={{ color:'#E24B4A' }}>Emergency SOS</p>
            <p className="text-sm text-white/40 mb-4 leading-relaxed">Your location is being shared. Emergency services will be notified.</p>
            <div className="rounded-xl p-3 mb-5 text-left" style={{ background:'rgba(226,75,74,0.08)', border:'0.5px solid rgba(226,75,74,0.2)' }}>
              <p className="font-mono text-[12px] text-white/60">📍 {trail.lat.toFixed(4)}°N, {trail.lng.toFixed(4)}°E</p>
              <p className="font-mono text-[12px] text-white/60 mt-1">🏔 {trail.name}</p>
              <p className="font-mono text-[12px] text-white/60 mt-1">⏱ Active {fmt(sosElapsed)}</p>
            </div>
            <button onClick={() => setShowSOS(false)} className="w-full py-3.5 rounded-2xl text-[15px] font-semibold text-white" style={{ background:'#E24B4A', border:'none' }}>Cancel SOS</button>
          </div>
        </div>
      )}
    </div>
  )
}
