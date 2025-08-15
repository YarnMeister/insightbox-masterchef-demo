import { NextRequest, NextResponse } from 'next/server';

const WORLDPOP_BASE_URL = 'https://api.worldpop.org/v1';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, dataset, year, geojson, taskId } = body;

    console.log(`WorldPop API Route: ${action} action`);
    console.log('Request body:', { action, dataset, year, taskId });

    if (action === 'submit') {
      // Submit new WorldPop query using GET with URL parameters
      const geojsonParam = encodeURIComponent(JSON.stringify(geojson));
      const url = `${WORLDPOP_BASE_URL}/services/stats?dataset=${dataset}&year=${year}&geojson=${geojsonParam}`;
      
      console.log('WorldPop submit URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      console.log(`WorldPop submit response status: ${response.status}`);
      console.log(`WorldPop submit response headers:`, Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('WorldPop submit error:', errorText);
        return NextResponse.json(
          { error: `WorldPop API error: ${response.status} ${response.statusText} - ${errorText}` },
          { status: response.status }
        );
      }

      const data = await response.json();
      console.log('WorldPop task created:', data);

      return NextResponse.json(data);

    } else if (action === 'check') {
      // Check task status using GET
      const url = `${WORLDPOP_BASE_URL}/tasks/${taskId}`;
      
      console.log('WorldPop check URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      console.log(`WorldPop check response status: ${response.status}`);
      console.log(`WorldPop check response headers:`, Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('WorldPop check error:', errorText);
        return NextResponse.json(
          { error: `WorldPop check error: ${response.status} ${response.statusText} - ${errorText}` },
          { status: response.status }
        );
      }

      const data = await response.json();
      console.log('WorldPop task status:', data);
      
      // Log the actual data structure if it exists
      if (data.data && data.data.agesexpyramid) {
        console.log('📊 Agesex pyramid data structure:');
        console.log('First few items:', data.data.agesexpyramid.slice(0, 3));
        console.log('Total items:', data.data.agesexpyramid.length);
      }

      return NextResponse.json(data);

    } else {
      return NextResponse.json(
        { error: 'Invalid action. Use "submit" or "check".' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('WorldPop API route error:', error);
    return NextResponse.json(
      { error: `Server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
} 