export type Trail = {
  id: string
  name: string
  location: string
  country: string
  lat: number
  lng: number
  distance: string
  difficulty: 'Easy' | 'Moderate' | 'Hard'
  type: 'Trail' | 'Peak' | 'Waterfall' | 'Urban' | 'Marathon'
  verifiedHumans: number
  elevationGain: string
  estimatedTime: string
  conditions: string[]
  description: string
}

export const trails: Trail[] = [
  {
    id: 'bukit-tabur-west',
    name: 'Bukit Tabur West',
    location: 'Kuala Lumpur',
    country: 'Malaysia',
    lat: 3.2017,
    lng: 101.7740,
    distance: '5.2 km',
    difficulty: 'Moderate',
    type: 'Trail',
    verifiedHumans: 847,
    elevationGain: '320m',
    estimatedTime: '2h 30m',
    conditions: ['Clear', 'Rocky'],
    description: 'A dramatic quartz ridge hike with sweeping views of Klang Gates Dam and the KL skyline. One of the most iconic hikes in Malaysia.',
  },
  {
    id: 'gasing-hill-loop',
    name: 'Gasing Hill Loop',
    location: 'Petaling Jaya',
    country: 'Malaysia',
    lat: 3.1065,
    lng: 101.6520,
    distance: '3.8 km',
    difficulty: 'Easy',
    type: 'Trail',
    verifiedHumans: 1204,
    elevationGain: '120m',
    estimatedTime: '1h 15m',
    conditions: ['Clear', 'Muddy'],
    description: 'A lush urban forest loop popular with morning joggers and families. Well-maintained paths with gentle elevation.',
  },
  {
    id: 'titiwangsa-lake',
    name: 'Titiwangsa Lake Gardens',
    location: 'Kuala Lumpur',
    country: 'Malaysia',
    lat: 3.1738,
    lng: 101.7068,
    distance: '4.1 km',
    difficulty: 'Easy',
    type: 'Urban',
    verifiedHumans: 2081,
    elevationGain: '15m',
    estimatedTime: '45m',
    conditions: ['Clear', 'Scenic'],
    description: 'A flat lakeside loop through one of KL\'s most beloved parks. Perfect for evening walks with views of the city skyline.',
  },
  {
    id: 'klcc-park-run',
    name: 'KLCC Park Run',
    location: 'Kuala Lumpur',
    country: 'Malaysia',
    lat: 3.1579,
    lng: 101.7119,
    distance: '1.3 km',
    difficulty: 'Easy',
    type: 'Urban',
    verifiedHumans: 5320,
    elevationGain: '0m',
    estimatedTime: '15m',
    conditions: ['Clear'],
    description: 'The iconic lap around KLCC Park with the Petronas Twin Towers as your backdrop. Most popular verified check-in spot in Malaysia.',
  },
  {
    id: 'gunung-nuang',
    name: 'Gunung Nuang Summit',
    location: 'Hulu Langat',
    country: 'Malaysia',
    lat: 3.1250,
    lng: 101.9000,
    distance: '18.0 km',
    difficulty: 'Hard',
    type: 'Peak',
    verifiedHumans: 312,
    elevationGain: '1,493m',
    estimatedTime: '10h',
    conditions: ['Clear', 'Muddy'],
    description: 'The highest peak in Selangor. A challenging full-day expedition through dense rainforest to the summit at 1,493m.',
  },
  {
    id: 'kl-marathon-route',
    name: 'KL Standard Chartered Marathon',
    location: 'Kuala Lumpur',
    country: 'Malaysia',
    lat: 3.1478,
    lng: 101.6953,
    distance: '42.2 km',
    difficulty: 'Hard',
    type: 'Marathon',
    verifiedHumans: 18402,
    elevationGain: '180m',
    estimatedTime: '4h–6h',
    conditions: ['Clear'],
    description: 'The full KL marathon route through the heart of the city. Every checkpoint verified by World ID — tamper-proof results, no chip required.',
  },
  {
    id: 'broga-hill',
    name: 'Broga Hill',
    location: 'Semenyih',
    country: 'Malaysia',
    lat: 2.9833,
    lng: 101.9167,
    distance: '3.6 km',
    difficulty: 'Moderate',
    type: 'Peak',
    verifiedHumans: 623,
    elevationGain: '280m',
    estimatedTime: '1h 45m',
    conditions: ['Clear', 'Scenic'],
    description: 'Famous for its golden sunrise views over the valley. A short but steep climb rewarded with one of the best panoramas in Selangor.',
  },
  {
    id: 'forest-research-loop',
    name: 'FRIM Kepong Forest Loop',
    location: 'Kepong',
    country: 'Malaysia',
    lat: 3.2167,
    lng: 101.6333,
    distance: '6.2 km',
    difficulty: 'Easy',
    type: 'Trail',
    verifiedHumans: 891,
    elevationGain: '95m',
    estimatedTime: '1h 30m',
    conditions: ['Clear'],
    description: 'A research forest with a canopy walkway 30m above the ground. Excellent biodiversity and well-marked trails throughout.',
  },
]

export const getDifficultyColor = (diff: Trail['difficulty']) => {
  if (diff === 'Easy') return 'text-green-400'
  if (diff === 'Moderate') return 'text-amber-400'
  return 'text-red-400'
}

export const getDifficultyBg = (diff: Trail['difficulty']) => {
  if (diff === 'Easy') return 'bg-green-900/40 text-green-400'
  if (diff === 'Moderate') return 'bg-amber-900/40 text-amber-400'
  return 'bg-red-900/40 text-red-400'
}

export const getTypeIcon = (type: Trail['type']) => {
  const icons: Record<Trail['type'], string> = {
    Trail: '🏔',
    Peak: '⛰',
    Waterfall: '💧',
    Urban: '🏙',
    Marathon: '🏃',
  }
  return icons[type]
}
