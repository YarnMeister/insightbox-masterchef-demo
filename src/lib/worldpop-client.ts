// lib/worldpop-client.ts - Updated to use Next.js API route

export interface WorldPopAgeGenderData {
  total_population: number;
  age_groups?: {
    [key: string]: {
      male: number;
      female: number;
    };
  };
  agesexpyramid?: Array<{
    class: string;
    age: string;
    male: number;
    female: number;
  }>;
  metadata?: {
    year: number;
    dataset: string;
    area_km2: number;
  };
}

export class WorldPopClient {
  private apiUrl = '/api/worldpop'; // Use your Next.js API route

  // Submit query via your API route (avoids CORS)
  async submitPopulationQuery(
    dataset: 'wpgppop' | 'wpgpas' = 'wpgpas',
    year: number = 2020,
    geojson: any
  ): Promise<string> {
    try {
      console.log('Submitting WorldPop query via API route...');
      
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'submit',
          dataset,
          year,
          geojson
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API Error: ${errorData.error} (${response.status})`);
      }

      const data = await response.json();
      console.log('Task created:', data);

      if (data.error) {
        throw new Error(data.error_message || 'WorldPop API error');
      }

      return data.taskid;
    } catch (error) {
      console.error('Error submitting WorldPop query:', error);
      throw error;
    }
  }

  // Check task status via your API route
  async checkTaskStatus(taskId: string): Promise<any> {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'check',
          taskId
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Task check failed: ${errorData.error}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error checking task status:', error);
      throw error;
    }
  }

  // Poll for results with better error handling
  async pollTaskResult(taskId: string, maxAttempts: number = 15): Promise<any> {
    console.log(`Polling task ${taskId}...`);
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        console.log(`Attempt ${attempt}/${maxAttempts}`);
        
        const data = await this.checkTaskStatus(taskId);
        console.log(`Task status: ${data.status}`);

        if (data.status === 'finished') {
          console.log('Task completed successfully');
          
          // Check if there was an error in the finished task
          if (data.error) {
            throw new Error(data.error_message || 'WorldPop task failed');
          }
          
          return data.data;
        }
        
        if (data.status === 'failed') {
          throw new Error(data.error_message || 'WorldPop task failed');
        }

        // Still pending, wait before next attempt
        console.log('Task still pending, waiting 8 seconds...');
        await this.sleep(8000); // Longer wait time

      } catch (error) {
        console.error(`Poll attempt ${attempt} error:`, error);
        
        // If it's a server error, wait longer before retry
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        if (errorMessage.includes('500') || errorMessage.includes('Internal')) {
          console.log('Server error detected, waiting longer...');
          await this.sleep(15000); // Wait 15 seconds for server issues
        } else if (attempt === maxAttempts) {
          throw error;
        } else {
          await this.sleep(5000); // Normal retry delay
        }
      }
    }
    
    throw new Error(`Task ${taskId} timed out after ${maxAttempts} attempts`);
  }

  // Combined method with fallback strategies
  async getPopulationData(
    dataset: 'wpgppop' | 'wpgpas' = 'wpgpas',
    year: number = 2020,
    geojson: any
  ): Promise<any> {
    try {
      console.log('🚀 Starting WorldPop data retrieval...');
      const taskId = await this.submitPopulationQuery(dataset, year, geojson);
      console.log('📋 Task ID received:', taskId);
      
      const result = await this.pollTaskResult(taskId);
      console.log('✅ Final result from WorldPop:', result);
      
      // Check if result has the expected structure
      if (!result || typeof result !== 'object') {
        console.error('❌ Invalid result structure:', result);
        throw new Error('Invalid result structure from WorldPop API');
      }
      
      return result;
    } catch (error) {
      console.error('WorldPop data retrieval failed:', error);
      
      // Return mock data for demo purposes if API fails
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (errorMessage.includes('500') || errorMessage.includes('CORS')) {
        console.warn('🎭 Using mock data for demo due to API issues');
        return this.getMockPopulationData(geojson, year);
      }
      
      throw error;
    }
  }

  // Mock data fallback for demo reliability
  getMockPopulationData(geojson: any, year: number = 2020): any {
    return {
      total_population: 8900000,
      agesexpyramid: [
        {"class": "0", "age": "0 to 1", "male": 285000, "female": 272000},
        {"class": "1", "age": "1 to 5", "male": 295000, "female": 281000},
        {"class": "2", "age": "5 to 10", "male": 305000, "female": 291000},
        {"class": "3", "age": "10 to 15", "male": 315000, "female": 301000},
        {"class": "4", "age": "15 to 20", "male": 425000, "female": 411000},
        {"class": "5", "age": "20 to 25", "male": 475000, "female": 461000},
        {"class": "6", "age": "25 to 30", "male": 465000, "female": 451000},
        {"class": "7", "age": "30 to 35", "male": 435000, "female": 421000},
        {"class": "8", "age": "35 to 40", "male": 415000, "female": 401000},
        {"class": "9", "age": "40 to 45", "male": 395000, "female": 381000},
        {"class": "10", "age": "45 to 50", "male": 375000, "female": 361000},
        {"class": "11", "age": "50 to 55", "male": 345000, "female": 331000},
        {"class": "12", "age": "55 to 60", "male": 315000, "female": 321000},
        {"class": "13", "age": "60 to 65", "male": 285000, "female": 301000},
        {"class": "14", "age": "65 to 70", "male": 235000, "female": 261000},
        {"class": "15", "age": "70 to 75", "male": 185000, "female": 221000},
        {"class": "16", "age": "75 to 80", "male": 135000, "female": 191000},
        {"class": "17", "age": "80 and over", "male": 95000, "female": 161000}
      ],
      metadata: {
        year: year,
        dataset: "wpgpas_mock",
        area_km2: 1572,
        note: "Mock data used due to API availability issues"
      }
    };
  }

  // Get US boundary for 2000 data - using a smaller area to fit within limits
  getUSBoundary(): any {
    return {
      type: "FeatureCollection",
      features: [{
        type: "Feature",
        properties: {"name": "Small US Test Area"},
        geometry: {
          type: "Polygon",
          coordinates: [[
            [-74.0, 40.0],  // New York area
            [-74.0, 41.0], 
            [-73.0, 41.0], 
            [-73.0, 40.0], 
            [-74.0, 40.0]
          ]]
        }
      }]
    };
  }

  sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Simplified test function
export async function testWorldPopAPI() {
  const client = new WorldPopClient();

  // Very small test area to minimize processing time
  const testGeoJSON = {
    "type": "FeatureCollection",
    "features": [{
      "type": "Feature",
      "properties": {"name": "Test Area"},
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [-0.05, 51.5], 
          [-0.05, 51.52], 
          [-0.03, 51.52], 
          [-0.03, 51.5], 
          [-0.05, 51.5]
        ]]
      }
    }]
  };

  try {
    console.log('🧪 Testing WorldPop API...');
    const result = await client.getPopulationData('wpgpas', 2020, testGeoJSON);
    console.log('✅ Success! Population data received');
    return result;
  } catch (error) {
    console.error('❌ WorldPop test failed:', error);
    // Still return mock data to keep demo moving
    return client.getMockPopulationData(testGeoJSON, 2020);
  }
}

// Alternative: Step-by-step debugging
export async function debugWorldPopAPI() {
  const client = new WorldPopClient();
  
  const testGeoJSON = {
    "type": "FeatureCollection",
    "features": [{
      "type": "Feature",
      "properties": {},
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
  };

  try {
    // Step 1: Submit job
    console.log('Step 1: Submitting job...');
    const taskId = await client.submitPopulationQuery('wpgpas', 2020, testGeoJSON);
    console.log('✅ Job submitted, Task ID:', taskId);

    // Step 2: Wait a bit
    console.log('Step 2: Waiting 10 seconds...');
    await client.sleep(10000);

    // Step 3: Check status
    console.log('Step 3: Checking task status...');
    const result = await client.pollTaskResult(taskId, 5);
    console.log('✅ Task completed:', result);

    return { taskId, result };
  } catch (error) {
    console.error('❌ Debug failed:', error instanceof Error ? error.message : 'Unknown error');
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
} 