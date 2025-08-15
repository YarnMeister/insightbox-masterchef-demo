(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/src/lib/worldpop-client.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// lib/worldpop-client.ts - Updated to use Next.js API route
__turbopack_context__.s({
    "WorldPopClient": ()=>WorldPopClient,
    "debugWorldPopAPI": ()=>debugWorldPopAPI,
    "testWorldPopAPI": ()=>testWorldPopAPI
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_define_property.js [app-client] (ecmascript)");
;
class WorldPopClient {
    // Submit query via your API route (avoids CORS)
    async submitPopulationQuery() {
        let dataset = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 'wpgpas', year = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 2020, geojson = arguments.length > 2 ? arguments[2] : void 0;
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
                throw new Error("API Error: ".concat(errorData.error, " (").concat(response.status, ")"));
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
                throw new Error("Task check failed: ".concat(errorData.error));
            }
            return await response.json();
        } catch (error) {
            console.error('Error checking task status:', error);
            throw error;
        }
    }
    // Poll for results with better error handling
    async pollTaskResult(taskId) {
        let maxAttempts = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 15;
        console.log("Polling task ".concat(taskId, "..."));
        for(let attempt = 1; attempt <= maxAttempts; attempt++){
            try {
                console.log("Attempt ".concat(attempt, "/").concat(maxAttempts));
                const data = await this.checkTaskStatus(taskId);
                console.log("Task status: ".concat(data.status));
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
                console.error("Poll attempt ".concat(attempt, " error:"), error);
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
        throw new Error("Task ".concat(taskId, " timed out after ").concat(maxAttempts, " attempts"));
    }
    // Combined method with fallback strategies
    async getPopulationData() {
        let dataset = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 'wpgpas', year = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 2020, geojson = arguments.length > 2 ? arguments[2] : void 0;
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
    getMockPopulationData(geojson) {
        let year = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 2020;
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
    constructor(){
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "apiUrl", '/api/worldpop'); // Use your Next.js API route
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": ()=>InsightBox
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$worldpop$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/worldpop-client.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function InsightBox() {
    _s();
    const [populationData, setPopulationData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [insights, setInsights] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [fetching, setFetching] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const worldPopClient = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$worldpop$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WorldPopClient"]();
    // Fetch WorldPop data for US 2000
    const fetchWorldPopData = async ()=>{
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
                    insight: "Failed to fetch population data: ".concat(error instanceof Error ? error.message : 'Unknown error', ". The API may be temporarily unavailable."),
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
        const ageGroups = data.age_groups;
        // Calculate key demographics
        const youth = Object.entries(ageGroups).filter((param)=>{
            let [age] = param;
            return parseInt(age) < 25;
        }).reduce((sum, param)=>{
            let [_, data] = param;
            return sum + data.male + data.female;
        }, 0);
        const workingAge = Object.entries(ageGroups).filter((param)=>{
            let [age] = param;
            const ageNum = parseInt(age);
            return ageNum >= 25 && ageNum < 65;
        }).reduce((sum, param)=>{
            let [_, data] = param;
            return sum + data.male + data.female;
        }, 0);
        const seniors = Object.entries(ageGroups).filter((param)=>{
            let [age] = param;
            return parseInt(age) >= 65;
        }).reduce((sum, param)=>{
            let [_, data] = param;
            return sum + data.male + data.female;
        }, 0);
        const density = Math.round(totalPopulation / data.metadata.area_km2);
        return [
            {
                id: 1,
                title: 'US Population Overview',
                insight: "Total US population in ".concat(data.metadata.year, ": ").concat(totalPopulation.toLocaleString(), " people"),
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
                insight: "Youth (0-24): ".concat(youth.toLocaleString(), " (").concat(Math.round(youth / totalPopulation * 100), "%), Working Age (25-64): ").concat(workingAge.toLocaleString(), " (").concat(Math.round(workingAge / totalPopulation * 100), "%), Seniors (65+): ").concat(seniors.toLocaleString(), " (").concat(Math.round(seniors / totalPopulation * 100), "%)"),
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
                insight: "Population density: ".concat(density, " people per km² across ").concat(data.metadata.area_km2.toLocaleString(), " km²"),
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
                insight: "Male: ".concat(Object.values(ageGroups).reduce((sum, group)=>sum + group.male, 0).toLocaleString(), ", Female: ").concat(Object.values(ageGroups).reduce((sum, group)=>sum + group.female, 0).toLocaleString()),
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
                insight: "WorldPop dataset: ".concat(data.metadata.dataset, " for year ").concat(data.metadata.year),
                severity: 'low',
                tags: [
                    'data-source',
                    'metadata'
                ],
                created_at: new Date().toISOString()
            }
        ];
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "InsightBox.useEffect": ()=>{
            fetchWorldPopData();
        }
    }["InsightBox.useEffect"], []);
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
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center text-white",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-6xl font-bold mb-4",
                        children: "🍳 InsightBox"
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 170,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xl mb-8",
                        children: fetching ? 'Fetching WorldPop data...' : 'Loading insights...'
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 171,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-center space-x-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "w-2 h-2 bg-white rounded-full animate-bounce"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 175,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "w-2 h-2 bg-white rounded-full animate-bounce",
                                style: {
                                    animationDelay: '0.1s'
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 176,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "w-2 h-2 bg-white rounded-full animate-bounce",
                                style: {
                                    animationDelay: '0.2s'
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 177,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 174,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 169,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 168,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-gray-50",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "bg-white shadow-sm border-b",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-between items-center py-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        className: "text-3xl font-bold text-gray-900",
                                        children: "🍳 InsightBox"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 191,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "ml-3 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full",
                                        children: "MasterDev Edition"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 192,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 190,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center space-x-4",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleRefresh,
                                    disabled: loading,
                                    className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50",
                                    children: loading ? 'Refreshing...' : 'Refresh Data'
                                }, void 0, false, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 197,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 196,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 189,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 188,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 187,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8",
                children: [
                    populationData && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white rounded-lg shadow p-6 mb-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-2xl font-bold text-gray-900 mb-4",
                                children: "US Population Data (2000)"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 214,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-1 md:grid-cols-3 gap-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-3xl font-bold text-blue-600",
                                                children: populationData.total_population.toLocaleString()
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 217,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-sm text-gray-600",
                                                children: "Total Population"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 220,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 216,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-3xl font-bold text-green-600",
                                                children: Math.round(populationData.total_population / populationData.metadata.area_km2)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 223,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-sm text-gray-600",
                                                children: "People per km²"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 226,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 222,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-3xl font-bold text-purple-600",
                                                children: populationData.metadata.area_km2.toLocaleString()
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 229,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-sm text-gray-600",
                                                children: "Area (km²)"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 232,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 228,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 215,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 213,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
                        children: insights.map((insight)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-white rounded-lg shadow hover:shadow-lg transition-shadow",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "p-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-start justify-between mb-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "text-lg font-semibold text-gray-900",
                                                    children: insight.title
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/page.tsx",
                                                    lineNumber: 244,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "px-2 py-1 rounded-full text-xs font-medium ".concat(getSeverityColor(insight.severity)),
                                                    children: insight.severity
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/page.tsx",
                                                    lineNumber: 245,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 243,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-gray-600 mb-4",
                                            children: insight.insight
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 249,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-between",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex flex-wrap gap-1",
                                                    children: insight.tags.map((tag, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded",
                                                            children: tag
                                                        }, index, false, {
                                                            fileName: "[project]/src/app/page.tsx",
                                                            lineNumber: 253,
                                                            columnNumber: 23
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/page.tsx",
                                                    lineNumber: 251,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-xs text-gray-400",
                                                    children: new Date(insight.created_at).toLocaleDateString()
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/page.tsx",
                                                    lineNumber: 258,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 250,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 242,
                                    columnNumber: 15
                                }, this)
                            }, insight.id, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 241,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 239,
                        columnNumber: 9
                    }, this),
                    insights.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center py-12",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-6xl mb-4",
                                children: "🍳"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 269,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-xl font-semibold text-gray-900 mb-2",
                                children: "No data available"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 270,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-gray-600 mb-6",
                                children: 'Click "Refresh Data" to fetch WorldPop data'
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 271,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleRefresh,
                                disabled: loading,
                                className: "px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50",
                                children: loading ? 'Fetching...' : 'Fetch WorldPop Data'
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 272,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 268,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 210,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/page.tsx",
        lineNumber: 185,
        columnNumber: 5
    }, this);
}
_s(InsightBox, "priHCf74SoWKTI6zRZneO+CSFAc=");
_c = InsightBox;
var _c;
__turbopack_context__.k.register(_c, "InsightBox");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { m: module, e: exports } = __turbopack_context__;
{
/**
 * @license React
 * react-jsx-dev-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
"use strict";
"production" !== ("TURBOPACK compile-time value", "development") && function() {
    function getComponentNameFromType(type) {
        if (null == type) return null;
        if ("function" === typeof type) return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
        if ("string" === typeof type) return type;
        switch(type){
            case REACT_FRAGMENT_TYPE:
                return "Fragment";
            case REACT_PROFILER_TYPE:
                return "Profiler";
            case REACT_STRICT_MODE_TYPE:
                return "StrictMode";
            case REACT_SUSPENSE_TYPE:
                return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
                return "SuspenseList";
            case REACT_ACTIVITY_TYPE:
                return "Activity";
        }
        if ("object" === typeof type) switch("number" === typeof type.tag && console.error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), type.$$typeof){
            case REACT_PORTAL_TYPE:
                return "Portal";
            case REACT_CONTEXT_TYPE:
                return type.displayName || "Context";
            case REACT_CONSUMER_TYPE:
                return (type._context.displayName || "Context") + ".Consumer";
            case REACT_FORWARD_REF_TYPE:
                var innerType = type.render;
                type = type.displayName;
                type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
                return type;
            case REACT_MEMO_TYPE:
                return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE:
                innerType = type._payload;
                type = type._init;
                try {
                    return getComponentNameFromType(type(innerType));
                } catch (x) {}
        }
        return null;
    }
    function testStringCoercion(value) {
        return "" + value;
    }
    function checkKeyStringCoercion(value) {
        try {
            testStringCoercion(value);
            var JSCompiler_inline_result = !1;
        } catch (e) {
            JSCompiler_inline_result = !0;
        }
        if (JSCompiler_inline_result) {
            JSCompiler_inline_result = console;
            var JSCompiler_temp_const = JSCompiler_inline_result.error;
            var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
            JSCompiler_temp_const.call(JSCompiler_inline_result, "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.", JSCompiler_inline_result$jscomp$0);
            return testStringCoercion(value);
        }
    }
    function getTaskName(type) {
        if (type === REACT_FRAGMENT_TYPE) return "<>";
        if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE) return "<...>";
        try {
            var name = getComponentNameFromType(type);
            return name ? "<" + name + ">" : "<...>";
        } catch (x) {
            return "<...>";
        }
    }
    function getOwner() {
        var dispatcher = ReactSharedInternals.A;
        return null === dispatcher ? null : dispatcher.getOwner();
    }
    function UnknownOwner() {
        return Error("react-stack-top-frame");
    }
    function hasValidKey(config) {
        if (hasOwnProperty.call(config, "key")) {
            var getter = Object.getOwnPropertyDescriptor(config, "key").get;
            if (getter && getter.isReactWarning) return !1;
        }
        return void 0 !== config.key;
    }
    function defineKeyPropWarningGetter(props, displayName) {
        function warnAboutAccessingKey() {
            specialPropKeyWarningShown || (specialPropKeyWarningShown = !0, console.error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)", displayName));
        }
        warnAboutAccessingKey.isReactWarning = !0;
        Object.defineProperty(props, "key", {
            get: warnAboutAccessingKey,
            configurable: !0
        });
    }
    function elementRefGetterWithDeprecationWarning() {
        var componentName = getComponentNameFromType(this.type);
        didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = !0, console.error("Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."));
        componentName = this.props.ref;
        return void 0 !== componentName ? componentName : null;
    }
    function ReactElement(type, key, self, source, owner, props, debugStack, debugTask) {
        self = props.ref;
        type = {
            $$typeof: REACT_ELEMENT_TYPE,
            type: type,
            key: key,
            props: props,
            _owner: owner
        };
        null !== (void 0 !== self ? self : null) ? Object.defineProperty(type, "ref", {
            enumerable: !1,
            get: elementRefGetterWithDeprecationWarning
        }) : Object.defineProperty(type, "ref", {
            enumerable: !1,
            value: null
        });
        type._store = {};
        Object.defineProperty(type._store, "validated", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: 0
        });
        Object.defineProperty(type, "_debugInfo", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: null
        });
        Object.defineProperty(type, "_debugStack", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugStack
        });
        Object.defineProperty(type, "_debugTask", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugTask
        });
        Object.freeze && (Object.freeze(type.props), Object.freeze(type));
        return type;
    }
    function jsxDEVImpl(type, config, maybeKey, isStaticChildren, source, self, debugStack, debugTask) {
        var children = config.children;
        if (void 0 !== children) if (isStaticChildren) if (isArrayImpl(children)) {
            for(isStaticChildren = 0; isStaticChildren < children.length; isStaticChildren++)validateChildKeys(children[isStaticChildren]);
            Object.freeze && Object.freeze(children);
        } else console.error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
        else validateChildKeys(children);
        if (hasOwnProperty.call(config, "key")) {
            children = getComponentNameFromType(type);
            var keys = Object.keys(config).filter(function(k) {
                return "key" !== k;
            });
            isStaticChildren = 0 < keys.length ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
            didWarnAboutKeySpread[children + isStaticChildren] || (keys = 0 < keys.length ? "{" + keys.join(": ..., ") + ": ...}" : "{}", console.error('A props object containing a "key" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />', isStaticChildren, children, keys, children), didWarnAboutKeySpread[children + isStaticChildren] = !0);
        }
        children = null;
        void 0 !== maybeKey && (checkKeyStringCoercion(maybeKey), children = "" + maybeKey);
        hasValidKey(config) && (checkKeyStringCoercion(config.key), children = "" + config.key);
        if ("key" in config) {
            maybeKey = {};
            for(var propName in config)"key" !== propName && (maybeKey[propName] = config[propName]);
        } else maybeKey = config;
        children && defineKeyPropWarningGetter(maybeKey, "function" === typeof type ? type.displayName || type.name || "Unknown" : type);
        return ReactElement(type, children, self, source, getOwner(), maybeKey, debugStack, debugTask);
    }
    function validateChildKeys(node) {
        "object" === typeof node && null !== node && node.$$typeof === REACT_ELEMENT_TYPE && node._store && (node._store.validated = 1);
    }
    var React = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"), REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = Symbol.for("react.activity"), REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference"), ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, hasOwnProperty = Object.prototype.hasOwnProperty, isArrayImpl = Array.isArray, createTask = console.createTask ? console.createTask : function() {
        return null;
    };
    React = {
        react_stack_bottom_frame: function(callStackForError) {
            return callStackForError();
        }
    };
    var specialPropKeyWarningShown;
    var didWarnAboutElementRef = {};
    var unknownOwnerDebugStack = React.react_stack_bottom_frame.bind(React, UnknownOwner)();
    var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
    var didWarnAboutKeySpread = {};
    exports.Fragment = REACT_FRAGMENT_TYPE;
    exports.jsxDEV = function(type, config, maybeKey, isStaticChildren, source, self) {
        var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        return jsxDEVImpl(type, config, maybeKey, isStaticChildren, source, self, trackActualOwner ? Error("react-stack-top-frame") : unknownOwnerDebugStack, trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask);
    };
}();
}}),
"[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { m: module, e: exports } = __turbopack_context__;
{
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use strict';
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)");
}
}}),
"[project]/node_modules/@swc/helpers/esm/_define_property.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "_": ()=>_define_property
});
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else obj[key] = value;
    return obj;
}
;
}),
}]);

//# sourceMappingURL=_87d44f3b._.js.map