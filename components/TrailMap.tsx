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

    // Dynamic import to avoid SSR
    import('leaflet').then(L => {
      // Fix default icon
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      })

      const map = L.map(mapRef.current!, {
        center: center || [3.1478, 101.6953],
        zoom: 11,
        zoomControl: false,
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map)

      L.control.zoom({ position: 'bottomright' }).addTo(map)

      mapInstanceRef.current = map

      // Add markers
      trails.forEach(trail => {
        const icon = L.divIcon({
          className: '',
          html: `
            <div style="
              background: #1D9E75;
              border: 2px solid rgba(29,158,117,0.4);
              border-radius: 50%;
              width: 14px;
              height: 14px;
              box-shadow: 0 0 0 6px rgba(29,158,117,0.12);
              cursor: pointer;
            "></div>
          `,
          iconSize: [14, 14],
          iconAnchor: [7, 7],
        })

        const marker = L.marker([trail.lat, trail.lng], { icon })
          .addTo(map)
          .bindPopup(`
            <div style="background:#111;border:0.5px solid rgba(255,255,255,0.1);border-radius:12px;padding:12px;min-width:180px;font-family:'DM Sans',sans-serif;color:white;">
              <p style="font-weight:600;font-size:14px;margin:0 0 4px;">${trail.name}</p>
              <p style="color:rgba(255,255,255,0.4);font-size:12px;margin:0 0 8px;">${trail.distance} · ${trail.difficulty}</p>
              <div style="display:flex;align-items:center;gap:5px;background:rgba(29,158,117,0.1);border-radius:20px;padding:3px 8px;display:inline-flex;">
                <div style="width:6px;height:6px;border-radius:50%;background:#1D9E75;"></div>
                <span style="font-size:11px;color:#1D9E75;font-weight:500;">${trail.verifiedHumans.toLocaleString()} verified</span>
              </div>
            </div>
          `, {
            className: 'custom-popup',
            closeButton: false,
          })
          .on('click', () => onTrailClick(trail))

        markersRef.current.push({ trail, marker })
      })
    })

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  // Pan to selected trail
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedTrail) return
    mapInstanceRef.current.flyTo([selectedTrail.lat, selectedTrail.lng], 13, { duration: 0.8 })
  }, [selectedTrail])

  return (
    <div ref={mapRef} className="w-full h-full" style={{ background: '#111' }} />
  )
}
