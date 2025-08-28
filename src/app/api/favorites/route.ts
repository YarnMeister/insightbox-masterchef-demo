import { NextRequest, NextResponse } from 'next/server';
import { withClient } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { imageUrl, breedName } = await request.json();
    
    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }

    const result = await withClient(async (client) => {
      const query = `
        INSERT INTO favorite_dogs (image_url, breed_name) 
        VALUES ($1, $2) 
        RETURNING id, image_url, breed_name, saved_at
      `;
      const result = await client.query(query, [imageUrl, breedName || null]);
      return result.rows[0];
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error saving favorite dog:', error);
    return NextResponse.json({ error: 'Failed to save favorite dog' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const favorites = await withClient(async (client) => {
      const query = `
        SELECT id, image_url, breed_name, saved_at 
        FROM favorite_dogs 
        ORDER BY saved_at DESC
      `;
      const result = await client.query(query);
      return result.rows;
    });

    return NextResponse.json(favorites);
  } catch (error) {
    console.error('Error fetching favorite dogs:', error);
    return NextResponse.json({ error: 'Failed to fetch favorite dogs' }, { status: 500 });
  }
}
