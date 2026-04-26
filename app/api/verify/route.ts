import { NextRequest, NextResponse } from 'next/server'

// This is a mock verification endpoint for the hackathon demo.
// For production, replace with real World ID verification using:
// https://docs.world.org/world-id/idkit/integrate

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { proof, nullifier_hash, merkle_root, verification_level, trail_id } = body

    // In production — verify against World ID API:
    // const verifyRes = await fetch(`https://developer.worldcoin.org/api/v2/verify/${process.env.NEXT_PUBLIC_WLD_APP_ID}`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ nullifier_hash, merkle_root, proof, verification_level, action: 'checkin' }),
    // })

    // For hackathon demo — simulate successful verification
    console.log('Check-in verification request:', { trail_id, nullifier_hash, verification_level })

    // Simulate a unique check-in record
    const checkin = {
      id: `checkin_${Date.now()}`,
      trail_id,
      nullifier_hash: nullifier_hash || `mock_${Math.random().toString(36).slice(2)}`,
      verified_at: new Date().toISOString(),
      verification_level: verification_level || 'orb',
    }

    return NextResponse.json({
      success: true,
      checkin,
      message: 'Check-in verified by World ID',
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Verification failed' }, { status: 400 })
  }
}
