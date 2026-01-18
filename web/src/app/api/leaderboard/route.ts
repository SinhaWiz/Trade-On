import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { GameRecord, LeaderboardEntry, PlayerProfile } from '@/lib/playerTypes';

// Get leaderboard
export async function GET(request: NextRequest) {
  try {
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '10');
    
    const db = await getDatabase();
    const recordsCollection = db.collection<GameRecord>('game_records');
    const playersCollection = db.collection<PlayerProfile>('players');

    // Get top scores
    const topRecords = await recordsCollection
      .find({})
      .sort({ finalBalance: -1 })
      .limit(limit)
      .toArray();

    // Build leaderboard with player names
    const leaderboard: LeaderboardEntry[] = await Promise.all(
      topRecords.map(async (record, index) => {
        const player = await playersCollection.findOne({ email: record.playerEmail });
        return {
          rank: index + 1,
          playerName: player?.name || 'Unknown',
          playerEmail: record.playerEmail,
          score: record.finalBalance,
          date: record.completedAt,
        };
      })
    );

    return NextResponse.json({ leaderboard });
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    return NextResponse.json({ error: 'Failed to get leaderboard' }, { status: 500 });
  }
}
