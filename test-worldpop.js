// Test file for WorldPop API
// Run with: node test-worldpop.js

// Note: This is a Node.js test file, not for browser use
// For browser testing, use the functions directly in your React component

console.log('🧪 Testing WorldPop API...');

// Example of how to use the test functions in a Node.js environment
// (You would need to convert this to TypeScript and import properly)

async function runTest() {
  try {
    console.log('Starting WorldPop API test...');
    
    // This would work in a proper TypeScript environment:
    // import { testWorldPopAPI, debugWorldPopAPI } from './src/lib/worldpop-client';
    
    // For now, let's test the API directly
    const response = await fetch('https://api.worldpop.org/v1/services/stats', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        dataset: 'wpgpas',
        year: 2020,
        geojson: {
          "type": "FeatureCollection",
          "features": [{
            "type": "Feature",
            "properties": {"name": "Test Area"},
            "geometry": {
              "type": "Polygon",
              "coordinates": [[
                [-0.1, 51.5], 
                [-0.1, 51.6], 
                [0.0, 51.6], 
                [0.0, 51.5], 
                [-0.1, 51.5]
              ]]
            }
          }]
        }
      })
    });

    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', data);

    if (data.taskid) {
      console.log('✅ Task created successfully! Task ID:', data.taskid);
    } else {
      console.log('❌ No task ID received');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

runTest(); 