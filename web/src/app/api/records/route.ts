import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { GameRecord, PlayerProfile } from '@/lib/playerTypes';

// Record a completed game
export async function POST(request: NextRequest) {
  try {
    const { email, playerId, finalBalance, turnsUsed }: { 
      email: string; 
      playerId: string;
      finalBalance: number; 
      turnsUsed: number;
    } = await request.json();
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const db = await getDatabase();
    const recordsCollection = db.collection<GameRecord>('game_records');
    const playersCollection = db.collection<PlayerProfile>('players');

    const INITIAL_BALANCE = 1000000;
    const won = finalBalance >= INITIAL_BALANCE;
    const profit = finalBalance - INITIAL_BALANCE;

    const record: GameRecord = {
      id: `record_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      playerId,
      playerEmail: email,
      completedAt: new Date(),
      finalBalance,
      turnsUsed,
      won,
      profit,
    };

    await recordsCollection.insertOne(record);

    // Update player stats
    const player = await playersCollection.findOne({ email });
    if (player) {
      const newGamesPlayed = player.stats.gamesPlayed + 1;
      const newGamesWon = player.stats.gamesWon + (won ? 1 : 0);
      const newGamesLost = player.stats.gamesLost + (won ? 0 : 1);
      const newBestScore = Math.max(player.stats.bestScore, finalBalance);
      const newTotalProfit = player.stats.totalProfit + profit;
      const newAverageScore = (player.stats.averageScore * player.stats.gamesPlayed + finalBalance) / newGamesPlayed;

      await playersCollection.updateOne(
        { email },
        {
          $set: {
            'stats.gamesPlayed': newGamesPlayed,
            'stats.gamesWon': newGamesWon,
            'stats.gamesLost': newGamesLost,
            'stats.bestScore': newBestScore,
            'stats.totalProfit': newTotalProfit,
            'stats.averageScore': newAverageScore,
          },
        }
      );
    }

    return NextResponse.json({ record });
  } catch (error) {
    console.error('Error recording game:', error);
    return NextResponse.json({ error: 'Failed to record game' }, { status: 500 });
  }
}

// Get player's game history
export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email');
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '10');
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const db = await getDatabase();
    const recordsCollection = db.collection<GameRecord>('game_records');

    const records = await recordsCollection
      .find({ playerEmail: email })
      .sort({ completedAt: -1 })
      .limit(limit)
      .toArray();

    return NextResponse.json({ records });
  } catch (error) {
    console.error('Error getting game records:', error);
    return NextResponse.json({ error: 'Failed to get game records' }, { status: 500 });
  }
}
