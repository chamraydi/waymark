'use client'
import { useEffect, useRef } from 'react'
import { Trail } from '@/app/data/trails'

interface Props {
  trails: Trail[]
  selectedTrail: Trail | null
  onTrailClick: (trail: Trail) => void
  center?: [number, number]
}

export default function TrailMap({ trails, selectedTrail, onTrailClick, center }: Props) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    // Inject Leaflet CSS
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link')
      link.id = 'leaflet-css'
      link.rel = 'stylesheet'
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css'
      document.head.appendChild(link)
    }

    // Inject custom map styles
    if (!document.getElementById('map-styles')) {
      const style = document.createElement('style')
      style.id = 'map-styles'
      style.textContent = `
        .leaflet-container { background: #111 !important; font-family: 'DM Sans', sans-serif !important; }
        .leaflet-tile { filter: brightness(0.65) saturate(0.5) hue-rotate(10deg) !important; }
        .leaflet-control-attribution { background: rgba(0,0,0,0.5) !important; color: #555 !important; font-size: 9px !important; }
        .leaflet-control-attribution a { color: #555 !important; }
        .leaflet-control-zoom a { background: #191919 !important; color: white !important; border-color: rgba(255,255,255,0.08) !important; }
        .waymark-popup .leaflet-popup-content-wrapper { background: #111; border: 0.5px solid rgba(255,255,255,0.1); border-radius: 12px; color: white; box-shadow: 0 4px 24px rgba(0,0,0,0.6); }
        .waymark-popup .leaflet-popup-tip { background: #111; }
        .waymark-popup .leaflet-popup-content { margin: 12px 14px; }
        .waymark-popup .leaflet-popup-close-button { color: rgba(255,255,255,0.3) !important; font-size: 16px !important; padding: 6px !important; }
      `
      document.head.appendChild(style)
    }

    import('leaflet').then(L => {
      if (!mapRef.current || mapInstanceRef.current) return

      const map = L.map(mapRef.current, {
        center: center || [3.15, 101.72],
        zoom: 11,
        zoomControl: false,
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
        maxZoom: 18,
      }).addTo(map)

      L.control.zoom({ position: 'bottomright' }).addTo(map)
      mapInstanceRef.current = map

      trails.forEach(trail => {
        const icon = L.divIcon({
          className: '',
          html: `<div style="width:14px;height:14px;border-radius:50%;background:#1D9E75;border:2.5px solid rgba(29,158,117,0.4);box-shadow:0 0 0 6px rgba(29,158,117,0.12);cursor:pointer;"></div>`,
          iconSize: [14, 14],
          iconAnchor: [7, 7],
          popupAnchor: [0, -10],
        })

        const marker = L.marker([trail.lat, trail.lng], { icon })
          .addTo(map)
          .bindPopup(`
            <div>
              <p style="font-weight:600;font-size:14px;margin:0 0 3px;color:white">${trail.name}</p>
              <p style="color:rgba(255,255,255,0.4);font-size:11px;margin:0 0 8px">${trail.distance} · ${trail.difficulty}</p>
              <div style="display:inline-flex;align-items:center;gap:5px;background:rgba(29,158,117,0.12);border-radius:20px;padding:3px 9px">
                <div style="width:5px;height:5px;border-radius:50%;background:#1D9E75"></div>
                <span style="font-size:11px;color:#1D9E75;font-weight:500">${trail.verifiedHumans.toLocaleString()} verified</span>
              </div>
            </div>
          `, { className: 'waymark-popup' })
          .on('click', () => onTrailClick(trail))

        markersRef.current.push({ trail, marker })
      })
    })

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
        markersRef.current = []
      }
    }
  }, [])

  useEffect(() => {
    if (!mapInstanceRef.current || !selectedTrail) return
    mapInstanceRef.current.flyTo([selectedTrail.lat, selectedTrail.lng], 13, { duration: 0.8 })
  }, [selectedTrail])

  return (
    <div
      ref={mapRef}
      style={{ width: '100%', height: '100%', background: '#111', minHeight: '200px' }}
    />
  )
}
