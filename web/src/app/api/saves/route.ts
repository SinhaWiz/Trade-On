import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { SavedGame, SavedGameState } from '@/lib/playerTypes';

// Get all saved games for a player
export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email');
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const db = await getDatabase();
    const savesCollection = db.collection<SavedGame>('saved_games');

    const saves = await savesCollection
      .find({ playerEmail: email })
      .sort({ updatedAt: -1 })
      .limit(10)
      .toArray();

    return NextResponse.json({ saves });
  } catch (error) {
    console.error('Error getting saved games:', error);
    return NextResponse.json({ error: 'Failed to get saved games' }, { status: 500 });
  }
}

// Save a game
export async function POST(request: NextRequest) {
  try {
    const { email, playerId, name, gameState }: { 
      email: string; 
      playerId: string;
      name?: string; 
      gameState: SavedGameState;
    } = await request.json();
    
    if (!email || !gameState) {
      return NextResponse.json({ error: 'Email and game state are required' }, { status: 400 });
    }

    const db = await getDatabase();
    const savesCollection = db.collection<SavedGame>('saved_games');

    const saveId = `save_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const saveName = name || `Save ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`;

    const savedGame: SavedGame = {
      id: saveId,
      playerId,
      playerEmail: email,
      name: saveName,
      createdAt: new Date(),
      updatedAt: new Date(),
      gameState,
    };

    await savesCollection.insertOne(savedGame);

    return NextResponse.json({ save: savedGame });
  } catch (error) {
    console.error('Error saving game:', error);
    return NextResponse.json({ error: 'Failed to save game' }, { status: 500 });
  }
}

// Update an existing save
export async function PUT(request: NextRequest) {
  try {
    const { saveId, gameState }: { 
      saveId: string; 
      gameState: SavedGameState;
    } = await request.json();
    
    if (!saveId || !gameState) {
      return NextResponse.json({ error: 'Save ID and game state are required' }, { status: 400 });
    }

    const db = await getDatabase();
    const savesCollection = db.collection<SavedGame>('saved_games');

    await savesCollection.updateOne(
      { id: saveId },
      { 
        $set: { 
          gameState,
          updatedAt: new Date(),
        } 
      }
    );

    const save = await savesCollection.findOne({ id: saveId });

    return NextResponse.json({ save });
  } catch (error) {
    console.error('Error updating save:', error);
    return NextResponse.json({ error: 'Failed to update save' }, { status: 500 });
  }
}

// Delete a save
export async function DELETE(request: NextRequest) {
  try {
    const saveId = request.nextUrl.searchParams.get('saveId');
    
    if (!saveId) {
      return NextResponse.json({ error: 'Save ID is required' }, { status: 400 });
    }

    const db = await getDatabase();
    const savesCollection = db.collection<SavedGame>('saved_games');

    await savesCollection.deleteOne({ id: saveId });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting save:', error);
    return NextResponse.json({ error: 'Failed to delete save' }, { status: 500 });
  }
}
