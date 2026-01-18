import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { PlayerProfile, PlayerStats } from '@/lib/playerTypes';

// Get or create player profile
export async function POST(request: NextRequest) {
  try {
    const { email, name, image } = await request.json();
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const db = await getDatabase();
    const playersCollection = db.collection<PlayerProfile>('players');

    // Try to find existing player
    let player = await playersCollection.findOne({ email });

    if (player) {
      // Update last login
      await playersCollection.updateOne(
        { email },
        { 
          $set: { 
            lastLoginAt: new Date(),
            name: name || player.name,
            image: image || player.image,
          } 
        }
      );
      player = await playersCollection.findOne({ email });
    } else {
      // Create new player
      const newPlayer: PlayerProfile = {
        id: `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        email,
        name: name || 'Trader',
        image,
        createdAt: new Date(),
        lastLoginAt: new Date(),
        stats: {
          gamesPlayed: 0,
          gamesWon: 0,
          gamesLost: 0,
          bestScore: 0,
          totalProfit: 0,
          averageScore: 0,
        },
      };

      await playersCollection.insertOne(newPlayer as any);
      player = await playersCollection.findOne({ email });
    }

    return NextResponse.json({ player });
  } catch (error) {
    console.error('Error getting/creating player:', error);
    return NextResponse.json({ error: 'Failed to get/create player' }, { status: 500 });
  }
}

// Get player profile by email
export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email');
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const db = await getDatabase();
    const playersCollection = db.collection<PlayerProfile>('players');

    const player = await playersCollection.findOne({ email });

    if (!player) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    }

    return NextResponse.json({ player });
  } catch (error) {
    console.error('Error getting player:', error);
    return NextResponse.json({ error: 'Failed to get player' }, { status: 500 });
  }
}

// Update player stats
export async function PUT(request: NextRequest) {
  try {
    const { email, stats }: { email: string; stats: Partial<PlayerStats> } = await request.json();
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const db = await getDatabase();
    const playersCollection = db.collection<PlayerProfile>('players');

    await playersCollection.updateOne(
      { email },
      { $set: { stats } as any }
    );

    const player = await playersCollection.findOne({ email });

    return NextResponse.json({ player });
  } catch (error) {
    console.error('Error updating player stats:', error);
    return NextResponse.json({ error: 'Failed to update player stats' }, { status: 500 });
  }
}
