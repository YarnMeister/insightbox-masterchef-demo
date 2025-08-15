module.exports = {

"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[project]/src/lib/worldpop-client.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

// lib/worldpop-client.ts - Updated to use Next.js API route
__turbopack_context__.s({
    "WorldPopClient": ()=>WorldPopClient,
    "debugWorldPopAPI": ()=>debugWorldPopAPI,
    "testWorldPopAPI": ()=>testWorldPopAPI
});
class WorldPopClient {
    apiUrl = '/api/worldpop';
    // Submit query via your API route (avoids CORS)
    async submitPopulationQuery(dataset = 'wpgpas', year = 2020, geojson) {
        try {
            console.log('Submitting WorldPop query via API route...');
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
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
    async checkTaskStatus(taskId) {
        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
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
    async pollTaskResult(taskId, maxAttempts = 15) {
        console.log(`Polling task ${taskId}...`);
        for(let attempt = 1; attempt <= maxAttempts; attempt++){
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
    async getPopulationData(dataset = 'wpgpas', year = 2020, geojson) {
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
    getMockPopulationData(geojson, year = 2020) {
        return {
            total_population: 8900000,
            agesexpyramid: [
                {
                    "class": "0",
                    "age": "0 to 1",
                    "male": 285000,
                    "female": 272000
                },
                {
                    "class": "1",
                    "age": "1 to 5",
                    "male": 295000,
                    "female": 281000
                },
                {
                    "class": "2",
                    "age": "5 to 10",
                    "male": 305000,
                    "female": 291000
                },
                {
                    "class": "3",
                    "age": "10 to 15",
                    "male": 315000,
                    "female": 301000
                },
                {
                    "class": "4",
                    "age": "15 to 20",
                    "male": 425000,
                    "female": 411000
                },
                {
                    "class": "5",
                    "age": "20 to 25",
                    "male": 475000,
                    "female": 461000
                },
                {
                    "class": "6",
                    "age": "25 to 30",
                    "male": 465000,
                    "female": 451000
                },
                {
                    "class": "7",
                    "age": "30 to 35",
                    "male": 435000,
                    "female": 421000
                },
                {
                    "class": "8",
                    "age": "35 to 40",
                    "male": 415000,
                    "female": 401000
                },
                {
                    "class": "9",
                    "age": "40 to 45",
                    "male": 395000,
                    "female": 381000
                },
                {
                    "class": "10",
                    "age": "45 to 50",
                    "male": 375000,
                    "female": 361000
                },
                {
                    "class": "11",
                    "age": "50 to 55",
                    "male": 345000,
                    "female": 331000
                },
                {
                    "class": "12",
                    "age": "55 to 60",
                    "male": 315000,
                    "female": 321000
                },
                {
                    "class": "13",
                    "age": "60 to 65",
                    "male": 285000,
                    "female": 301000
                },
                {
                    "class": "14",
                    "age": "65 to 70",
                    "male": 235000,
                    "female": 261000
                },
                {
                    "class": "15",
                    "age": "70 to 75",
                    "male": 185000,
                    "female": 221000
                },
                {
                    "class": "16",
                    "age": "75 to 80",
                    "male": 135000,
                    "female": 191000
                },
                {
                    "class": "17",
                    "age": "80 and over",
                    "male": 95000,
                    "female": 161000
                }
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
    getUSBoundary() {
        return {
            type: "FeatureCollection",
            features: [
                {
                    type: "Feature",
                    properties: {
                        "name": "Small US Test Area"
                    },
                    geometry: {
                        type: "Polygon",
                        coordinates: [
                            [
                                [
                                    -74.0,
                                    40.0
                                ],
                                [
                                    -74.0,
                                    41.0
                                ],
                                [
                                    -73.0,
                                    41.0
                                ],
                                [
                                    -73.0,
                                    40.0
                                ],
                                [
                                    -74.0,
                                    40.0
                                ]
                            ]
                        ]
                    }
                }
            ]
        };
    }
    sleep(ms) {
        return new Promise((resolve)=>setTimeout(resolve, ms));
    }
}
async function testWorldPopAPI() {
    const client = new WorldPopClient();
    // Very small test area to minimize processing time
    const testGeoJSON = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "properties": {
                    "name": "Test Area"
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [
                        [
                            [
                                -0.05,
                                51.5
                            ],
                            [
                                -0.05,
                                51.52
                            ],
                            [
                                -0.03,
                                51.52
                            ],
                            [
                                -0.03,
                                51.5
                            ],
                            [
                                -0.05,
                                51.5
                            ]
                        ]
                    ]
                }
            }
        ]
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
async function debugWorldPopAPI() {
    const client = new WorldPopClient();
    const testGeoJSON = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [
                        [
                            [
                                -0.1,
                                51.5
                            ],
                            [
                                -0.1,
                                51.6
                            ],
                            [
                                0.0,
                                51.6
                            ],
                            [
                                0.0,
                                51.5
                            ],
                            [
                                -0.1,
                                51.5
                            ]
                        ]
                    ]
                }
            }
        ]
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
        return {
            taskId,
            result
        };
    } catch (error) {
        console.error('❌ Debug failed:', error instanceof Error ? error.message : 'Unknown error');
        return {
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}
}),
"[project]/src/app/page.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "default": ()=>InsightBox
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$worldpop$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/worldpop-client.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
function InsightBox() {
    const [populationData, setPopulationData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [insights, setInsights] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [fetching, setFetching] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const worldPopClient = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$worldpop$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WorldPopClient"]();
    // Fetch WorldPop data for US 2000
    const fetchWorldPopData = async ()=>{
        try {
            setFetching(true);
            console.log('🔄 Fetching WorldPop data for US 2000...');
            console.log('🔧 Using Next.js API route to avoid CORS issues');
            const geojson = worldPopClient.getUSBoundary();
            console.log('📍 GeoJSON boundary:', geojson);
            // Use the API route approach
            const data = await worldPopClient.getPopulationData('wpgpas', 2000, geojson);
            console.log('✅ WorldPop data received:', data);
            // Debug: Check if data has the expected structure
            if (!data) {
                throw new Error('No data received from WorldPop API');
            }
            if (!data.total_population) {
                console.error('❌ Data missing total_population:', data);
                throw new Error('Invalid data structure received from WorldPop API');
            }
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
                    tags: [
                        'api',
                        'error'
                    ],
                    created_at: new Date().toISOString()
                }
            ]);
            return; // Exit early to prevent further processing
        } finally{
            setLoading(false);
            setFetching(false);
        }
    };
    // Generate insights from WorldPop data
    const generateInsightsFromData = (data)=>{
        const totalPopulation = data.total_population;
        // Handle both old format (age_groups) and new format (agesexpyramid)
        let ageGroups = {};
        if (data.age_groups) {
            // Old format
            ageGroups = data.age_groups;
        } else if (data.agesexpyramid) {
            // New format - convert agesexpyramid array to age_groups format
            data.agesexpyramid.forEach((item)=>{
                // Handle both object format and array format
                let ageKey;
                let male;
                let female;
                if (typeof item === 'object' && 'age' in item) {
                    // Object format: { age: "0 to 1", male: 1000, female: 950 }
                    ageKey = item.age.replace(' to ', '-').replace(' and over', '+');
                    male = item.male;
                    female = item.female;
                } else if (Array.isArray(item)) {
                    // Array format: [age_class, male_count, female_count]
                    ageKey = `age-${item[0]}`;
                    male = item[1];
                    female = item[2];
                } else {
                    console.warn('Unknown agesexpyramid item format:', item);
                    return;
                }
                ageGroups[ageKey] = {
                    male,
                    female
                };
            });
        }
        console.log('📊 Processed age groups:', ageGroups);
        // Calculate key demographics
        const youth = Object.entries(ageGroups).filter(([age])=>{
            const ageNum = parseInt(age.split('-')[1] || age.split('-')[0]);
            return ageNum < 25;
        }).reduce((sum, [_, groupData])=>sum + groupData.male + groupData.female, 0);
        const workingAge = Object.entries(ageGroups).filter(([age])=>{
            const ageNum = parseInt(age.split('-')[1] || age.split('-')[0]);
            return ageNum >= 25 && ageNum < 65;
        }).reduce((sum, [_, groupData])=>sum + groupData.male + groupData.female, 0);
        const seniors = Object.entries(ageGroups).filter(([age])=>{
            const ageNum = parseInt(age.split('-')[1] || age.split('-')[0]);
            return ageNum >= 65;
        }).reduce((sum, [_, groupData])=>sum + groupData.male + groupData.female, 0);
        const density = Math.round(totalPopulation / (data.metadata?.area_km2 || 1000));
        return [
            {
                id: 1,
                title: 'Population Overview',
                insight: `Total population in ${data.metadata?.year || 2020}: ${totalPopulation.toLocaleString()} people`,
                severity: 'low',
                tags: [
                    'population',
                    'demographics'
                ],
                created_at: new Date().toISOString()
            },
            {
                id: 2,
                title: 'Age Distribution Analysis',
                insight: `Youth (0-24): ${youth.toLocaleString()} (${Math.round(youth / totalPopulation * 100)}%), Working Age (25-64): ${workingAge.toLocaleString()} (${Math.round(workingAge / totalPopulation * 100)}%), Seniors (65+): ${seniors.toLocaleString()} (${Math.round(seniors / totalPopulation * 100)}%)`,
                severity: 'medium',
                tags: [
                    'age-groups',
                    'demographics'
                ],
                created_at: new Date().toISOString()
            },
            {
                id: 3,
                title: 'Population Density',
                insight: `Population density: ${density} people per km² across ${(data.metadata?.area_km2 || 1000).toLocaleString()} km²`,
                severity: 'low',
                tags: [
                    'density',
                    'geography'
                ],
                created_at: new Date().toISOString()
            },
            {
                id: 4,
                title: 'Gender Distribution',
                insight: `Male: ${Object.values(ageGroups).reduce((sum, group)=>sum + group.male, 0).toLocaleString()}, Female: ${Object.values(ageGroups).reduce((sum, group)=>sum + group.female, 0).toLocaleString()}`,
                severity: 'low',
                tags: [
                    'gender',
                    'demographics'
                ],
                created_at: new Date().toISOString()
            },
            {
                id: 5,
                title: 'Data Source',
                insight: `WorldPop dataset: ${data.metadata?.dataset || 'wpgpas'} for year ${data.metadata?.year || 2020}`,
                severity: 'low',
                tags: [
                    'data-source',
                    'metadata'
                ],
                created_at: new Date().toISOString()
            }
        ];
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        fetchWorldPopData();
    }, []);
    const handleRefresh = ()=>{
        setLoading(true);
        fetchWorldPopData();
    };
    const getSeverityColor = (severity)=>{
        switch(severity){
            case 'critical':
                return 'bg-red-500 text-white';
            case 'high':
                return 'bg-orange-500 text-white';
            case 'medium':
                return 'bg-yellow-500 text-black';
            case 'low':
                return 'bg-green-500 text-white';
            default:
                return 'bg-gray-500 text-white';
        }
    };
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center text-white",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-6xl font-bold mb-4",
                        children: "🍳 InsightBox"
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 210,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xl mb-8",
                        children: fetching ? 'Fetching WorldPop data...' : 'Loading insights...'
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 211,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-center space-x-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "w-2 h-2 bg-white rounded-full animate-bounce"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 215,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "w-2 h-2 bg-white rounded-full animate-bounce",
                                style: {
                                    animationDelay: '0.1s'
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 216,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "w-2 h-2 bg-white rounded-full animate-bounce",
                                style: {
                                    animationDelay: '0.2s'
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 217,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 214,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 209,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 208,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-gray-50",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "bg-white shadow-sm border-b",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-between items-center py-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        className: "text-3xl font-bold text-gray-900",
                                        children: "🍳 InsightBox"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 231,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "ml-3 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full",
                                        children: "MasterDev Edition"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 232,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 230,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center space-x-4",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleRefresh,
                                    disabled: loading,
                                    className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50",
                                    children: loading ? 'Refreshing...' : 'Refresh Data'
                                }, void 0, false, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 237,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 236,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 229,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 228,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 227,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8",
                children: [
                    populationData && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white rounded-lg shadow p-6 mb-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-2xl font-bold text-gray-900 mb-4",
                                children: "US Population Data (2000)"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 254,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-1 md:grid-cols-3 gap-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-3xl font-bold text-blue-600",
                                                children: populationData.total_population.toLocaleString()
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 257,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-sm text-gray-600",
                                                children: "Total Population"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 260,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 256,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-3xl font-bold text-green-600",
                                                children: Math.round(populationData.total_population / (populationData.metadata?.area_km2 || 1000))
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 263,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-sm text-gray-600",
                                                children: "People per km²"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 266,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 262,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-3xl font-bold text-purple-600",
                                                children: (populationData.metadata?.area_km2 || 1000).toLocaleString()
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 269,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-sm text-gray-600",
                                                children: "Area (km²)"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 272,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 268,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 255,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 253,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
                        children: insights.map((insight)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-white rounded-lg shadow hover:shadow-lg transition-shadow",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "p-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-start justify-between mb-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "text-lg font-semibold text-gray-900",
                                                    children: insight.title
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/page.tsx",
                                                    lineNumber: 284,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: `px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(insight.severity)}`,
                                                    children: insight.severity
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/page.tsx",
                                                    lineNumber: 285,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 283,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-gray-600 mb-4",
                                            children: insight.insight
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 289,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-between",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex flex-wrap gap-1",
                                                    children: insight.tags.map((tag, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded",
                                                            children: tag
                                                        }, index, false, {
                                                            fileName: "[project]/src/app/page.tsx",
                                                            lineNumber: 293,
                                                            columnNumber: 23
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/page.tsx",
                                                    lineNumber: 291,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-xs text-gray-400",
                                                    children: new Date(insight.created_at).toLocaleDateString()
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/page.tsx",
                                                    lineNumber: 298,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 290,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 282,
                                    columnNumber: 15
                                }, this)
                            }, insight.id, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 281,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 279,
                        columnNumber: 9
                    }, this),
                    insights.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center py-12",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-6xl mb-4",
                                children: "🍳"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 309,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-xl font-semibold text-gray-900 mb-2",
                                children: "No data available"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 310,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-gray-600 mb-6",
                                children: 'Click "Refresh Data" to fetch WorldPop data'
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 311,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleRefresh,
                                disabled: loading,
                                className: "px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50",
                                children: loading ? 'Fetching...' : 'Fetch WorldPop Data'
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 312,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 308,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 250,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/page.tsx",
        lineNumber: 225,
        columnNumber: 5
    }, this);
}
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { m: module, e: exports } = __turbopack_context__;
{
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    else {
        if ("TURBOPACK compile-time truthy", 1) {
            if ("TURBOPACK compile-time truthy", 1) {
                module.exports = __turbopack_context__.r("[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)");
            } else //TURBOPACK unreachable
            ;
        } else //TURBOPACK unreachable
        ;
    }
} //# sourceMappingURL=module.compiled.js.map
}}),
"[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { m: module, e: exports } = __turbopack_context__;
{
module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].ReactJsxDevRuntime; //# sourceMappingURL=react-jsx-dev-runtime.js.map
}}),
"[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { m: module, e: exports } = __turbopack_context__;
{
module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].React; //# sourceMappingURL=react.js.map
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__99566f63._.js.map