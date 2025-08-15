'use client';

import { useState, useEffect } from 'react';
import { WorldPopClient, type WorldPopAgeGenderData } from '../lib/worldpop-client';

interface PopulationInsight {
  id: number;
  title: string;
  insight: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  tags: string[];
  created_at: string;
}

export default function InsightBox() {
  const [populationData, setPopulationData] = useState<WorldPopAgeGenderData | null>(null);
  const [insights, setInsights] = useState<PopulationInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);

  const worldPopClient = new WorldPopClient();

  // Fetch WorldPop data for US 2000
  const fetchWorldPopData = async () => {
    try {
      setFetching(true);
      console.log('🔄 Fetching WorldPop data for US 2000...');
      console.log('🔧 Using REAL API calls (not mock data) - VERSION 2.0');
      console.log('🚀 This should make actual network requests to WorldPop API');
      
      // Test direct API call first
      console.log('🧪 Testing direct API call...');
      const testResponse = await fetch('https://api.worldpop.org/v1/services/stats?dataset=wpgpas&year=2000&geojson=%7B%22type%22%3A%22FeatureCollection%22%2C%22features%22%3A%5B%7B%22type%22%3A%22Feature%22%2C%22properties%22%3A%7B%22name%22%3A%22USA%20Continental%22%7D%2C%22geometry%22%3A%7B%22type%22%3A%22Polygon%22%2C%22coordinates%22%3A%5B%5B-125.0%2C48.0%5D%2C%5B-125.0%2C25.0%5D%2C%5B-66.0%2C25.0%5D%2C%5B-66.0%2C48.0%5D%2C%5B-125.0%2C48.0%5D%5D%5D%7D%7D%5D%7D');
      console.log('📡 Direct API response status:', testResponse.status);
      const testData = await testResponse.json();
      console.log('📡 Direct API response data:', testData);
      
      if (!testData.taskid) {
        throw new Error('No task ID received from WorldPop API');
      }
      
      console.log('📋 Task ID received:', testData.taskid);
      
      console.log('⏳ Polling for results...');
      const data = await worldPopClient.pollTaskResult(testData.taskid);
      
      console.log('✅ WorldPop data received:', data);
      setPopulationData(data);
      
      // Generate insights from the data
      const generatedInsights = generateInsightsFromData(data);
      setInsights(generatedInsights);
      
    } catch (error) {
      console.error('❌ Error fetching WorldPop data:', error);
      console.error('🔍 Full error details:', error);
      
      // Set loading to false immediately to stop the spinner
      setLoading(false);
      setFetching(false);
      
      // Fallback to error insight
      setInsights([
        {
          id: 1,
          title: 'WorldPop API Error',
          insight: `Failed to fetch population data: ${error instanceof Error ? error.message : 'Unknown error'}. The API may be temporarily unavailable.`,
          severity: 'medium',
          tags: ['api', 'error'],
          created_at: new Date().toISOString()
        }
      ]);
      return; // Exit early to prevent further processing
    } finally {
      setLoading(false);
      setFetching(false);
    }
  };

  // Generate insights from WorldPop data
  const generateInsightsFromData = (data: WorldPopAgeGenderData): PopulationInsight[] => {
    const totalPopulation = data.total_population;
    const ageGroups = data.age_groups;
    
    // Calculate key demographics
    const youth = Object.entries(ageGroups)
      .filter(([age]) => parseInt(age) < 25)
      .reduce((sum, [_, data]) => sum + data.male + data.female, 0);
      
    const workingAge = Object.entries(ageGroups)
      .filter(([age]) => {
        const ageNum = parseInt(age);
        return ageNum >= 25 && ageNum < 65;
      })
      .reduce((sum, [_, data]) => sum + data.male + data.female, 0);
      
    const seniors = Object.entries(ageGroups)
      .filter(([age]) => parseInt(age) >= 65)
      .reduce((sum, [_, data]) => sum + data.male + data.female, 0);

    const density = Math.round(totalPopulation / data.metadata.area_km2);

    return [
      {
        id: 1,
        title: 'US Population Overview',
        insight: `Total US population in ${data.metadata.year}: ${totalPopulation.toLocaleString()} people`,
        severity: 'low',
        tags: ['population', 'demographics'],
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        title: 'Age Distribution Analysis',
        insight: `Youth (0-24): ${youth.toLocaleString()} (${Math.round((youth/totalPopulation)*100)}%), Working Age (25-64): ${workingAge.toLocaleString()} (${Math.round((workingAge/totalPopulation)*100)}%), Seniors (65+): ${seniors.toLocaleString()} (${Math.round((seniors/totalPopulation)*100)}%)`,
        severity: 'medium',
        tags: ['age-groups', 'demographics'],
        created_at: new Date().toISOString()
      },
      {
        id: 3,
        title: 'Population Density',
        insight: `Population density: ${density} people per km² across ${data.metadata.area_km2.toLocaleString()} km²`,
        severity: 'low',
        tags: ['density', 'geography'],
        created_at: new Date().toISOString()
      },
      {
        id: 4,
        title: 'Gender Distribution',
        insight: `Male: ${Object.values(ageGroups).reduce((sum, group) => sum + group.male, 0).toLocaleString()}, Female: ${Object.values(ageGroups).reduce((sum, group) => sum + group.female, 0).toLocaleString()}`,
        severity: 'low',
        tags: ['gender', 'demographics'],
        created_at: new Date().toISOString()
      },
      {
        id: 5,
        title: 'Data Source',
        insight: `WorldPop dataset: ${data.metadata.dataset} for year ${data.metadata.year}`,
        severity: 'low',
        tags: ['data-source', 'metadata'],
        created_at: new Date().toISOString()
      }
    ];
  };

  useEffect(() => {
    fetchWorldPopData();
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    fetchWorldPopData();
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-black';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-6xl font-bold mb-4">🍳 InsightBox</h1>
          <p className="text-xl mb-8">
            {fetching ? 'Fetching WorldPop data...' : 'Loading insights...'}
          </p>
          <div className="flex justify-center space-x-2">
            <span className="w-2 h-2 bg-white rounded-full animate-bounce"></span>
            <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></span>
            <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-gray-900">🍳 InsightBox</h1>
              <span className="ml-3 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                MasterDev Edition
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleRefresh}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Refreshing...' : 'Refresh Data'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Population Data Overview */}
        {populationData && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">US Population Data (2000)</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {populationData.total_population.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Total Population</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {Math.round(populationData.total_population / populationData.metadata.area_km2)}
                </div>
                <div className="text-sm text-gray-600">People per km²</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {populationData.metadata.area_km2.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Area (km²)</div>
              </div>
            </div>
          </div>
        )}

        {/* Insights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {insights.map((insight) => (
            <div key={insight.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{insight.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(insight.severity)}`}>
                    {insight.severity}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{insight.insight}</p>
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {insight.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(insight.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {insights.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🍳</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No data available</h3>
            <p className="text-gray-600 mb-6">Click "Refresh Data" to fetch WorldPop data</p>
            <button 
              onClick={handleRefresh}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Fetching...' : 'Fetch WorldPop Data'}
            </button>
          </div>
        )}
      </main>
    </div>
  );
} 