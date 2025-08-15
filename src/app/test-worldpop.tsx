'use client';

import { useState } from 'react';
import { testWorldPopAPI, debugWorldPopAPI, WorldPopClient } from '../lib/worldpop-client';

export default function WorldPopTest() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runTest = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('🧪 Running WorldPop API test...');
      const testResult = await testWorldPopAPI();
      setResult(testResult);
      console.log('✅ Test completed:', testResult);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('❌ Test failed:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const runDebug = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('🔍 Running WorldPop API debug...');
      const debugResult = await debugWorldPopAPI();
      setResult(debugResult);
      console.log('✅ Debug completed:', debugResult);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('❌ Debug failed:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const testDirectAPI = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('🚀 Testing direct API call...');
      
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
      
      setResult({
        status: response.status,
        data: data,
        taskId: data.taskid
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('❌ Direct API test failed:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">🧪 WorldPop API Test</h1>
      
      <div className="space-y-4 mb-6">
        <button
          onClick={runTest}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 mr-4"
        >
          {loading ? 'Testing...' : 'Run Test API'}
        </button>
        
        <button
          onClick={runDebug}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 mr-4"
        >
          {loading ? 'Debugging...' : 'Run Debug API'}
        </button>
        
        <button
          onClick={testDirectAPI}
          disabled={loading}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Direct API'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <strong>Result:</strong>
          <pre className="mt-2 text-sm overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Usage Examples:</h2>
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-medium mb-2">In your component:</h3>
          <pre className="text-sm">
{`import { testWorldPopAPI, debugWorldPopAPI } from '../lib/worldpop-client';

// Quick test
const result = await testWorldPopAPI();

// Or step-by-step debugging
const debug = await debugWorldPopAPI();`}
          </pre>
        </div>
      </div>
    </div>
  );
} 