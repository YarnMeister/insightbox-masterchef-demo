# REST Countries API Configuration Guide

## API Overview
- **Base URL**: `https://restcountries.com/v3.1`
- **Authentication**: None required (public API)
- **Rate Limits**: No documented limits (very generous)
- **Data Format**: JSON
- **CORS**: Fully supported (works directly from browser)

## Key Features
- ✅ **No API key required** - Completely free and open
- ✅ **CORS enabled** - Works directly from frontend
- ✅ **Rich data** - Population, flags, currencies, languages, timezones
- ✅ **Multiple endpoints** - By name, ISO code, region, capital
- ✅ **Field filtering** - Request only needed data
- ✅ **Reliable** - High uptime, well-maintained

## Available Endpoints

### 1. Get All Countries
```http
GET https://restcountries.com/v3.1/all
```
Returns array of all 250+ countries with full details.

### 2. Get Country by ISO Code
```http
GET https://restcountries.com/v3.1/alpha/au
```
Returns array with single country matching ISO code (2 or 3 letters).

### 3. Get Country by Name
```http
GET https://restcountries.com/v3.1/name/australia
```
Returns array of countries matching name (partial matches supported).

### 4. Get Countries by Region
```http
GET https://restcountries.com/v3.1/region/asia
```
Returns array of all countries in specified region.

### 5. Get Country by Capital
```http
GET https://restcountries.com/v3.1/capital/canberra
```
Returns array of countries with matching capital city.

### 6. Filtered Fields (Optimization)
```http
GET https://restcountries.com/v3.1/name/australia?fields=name,flags,population,area
```
Returns only specified fields to reduce payload size.

## Response Data Structure

### Complete Country Object
```typescript
interface CountryData {
  name: {
    common: string;      // "Australia"
    official: string;    // "Commonwealth of Australia"
    nativeName: Record<string, { official: string; common: string }>;
  };
  population: number;    // 25687041
  region: string;        // "Oceania"
  subregion: string;     // "Australia and New Zealand"
  capital: string[];     // ["Canberra"]
  area: number;          // 7692024 (km²)
  currencies: Record<string, {
    name: string;        // "Australian dollar"
    symbol: string;      // "$"
  }>;
  languages: Record<string, string>;  // { "eng": "English" }
  flags: {
    png: string;         // "https://flagcdn.com/w320/au.png"
    svg: string;         // "https://flagcdn.com/au.svg"
    alt: string;         // Flag description
  };
  latlng: [number, number];  // [-27, 133]
  continents: string[];       // ["Oceania"]
  timezones: string[];        // ["UTC+05:00", "UTC+06:30", ...]
  independent: boolean;        // true
  unMember: boolean;          // true
  // ... many more fields
}
```

## Integration with InsightBox

### 1. TypeScript Interfaces
```typescript
// lib/countries-client.ts
export interface CountryData {
  name: {
    common: string;
    official: string;
  };
  population: number;
  region: string;
  subregion: string;
  capital: string[];
  area: number;
  currencies: Record<string, {
    name: string;
    symbol: string;
  }>;
  languages: Record<string, string>;
  flags: {
    png: string;
    svg: string;
    alt: string;
  };
  latlng: [number, number];
  continents: string[];
  timezones: string[];
  independent: boolean;
  unMember: boolean;
}
```

### 2. API Client Implementation
```typescript
export class CountriesClient {
  private baseUrl = 'https://restcountries.com/v3.1';

  // Get country by ISO code (e.g., 'au' for Australia)
  async getCountryByCode(code: string): Promise<CountryData> {
    const response = await fetch(`${this.baseUrl}/alpha/${code.toLowerCase()}`);
    const data = await response.json();
    return data[0];
  }

  // Get all countries with working fields
  async getAllCountries(): Promise<CountryData[]> {
    const fields = [
      'name', 'population', 'region', 'subregion', 'capital', 'area',
      'currencies', 'languages', 'flags', 'latlng'
    ].join(',');
    
    const response = await fetch(`${this.baseUrl}/all?fields=${fields}`);
    return await response.json();
  }

  // Get countries by region
  async getCountriesByRegion(region: string): Promise<CountryData[]> {
    const response = await fetch(`${this.baseUrl}/region/${region}`);
    return await response.json();
  }
}
```

### 3. Usage in React Components
```typescript
// In your component
import { CountriesClient } from '../lib/countries-client';

const client = new CountriesClient();

// Fetch Australia data
const australia = await client.getCountryByCode('au');

// Generate insights
const insights = [
  {
    title: 'Country Overview',
    insight: `${australia.name.common} - Population: ${australia.population.toLocaleString()} people`
  },
  {
    title: 'Geographic Information',
    insight: `Region: ${australia.region}, Capital: ${australia.capital[0]}, Area: ${australia.area.toLocaleString()} km²`
  },
  {
    title: 'Population Density',
    insight: `Density: ${Math.round(australia.population / australia.area)} people per km²`
  }
];
```

## Example API Calls

### Test with curl
```bash
# Get Australia by ISO code
curl https://restcountries.com/v3.1/alpha/au

# Get all countries in Asia
curl https://restcountries.com/v3.1/region/asia

# Get only population and flags for Australia
curl "https://restcountries.com/v3.1/name/australia?fields=population,flags"
```

### Test with JavaScript
```javascript
// Direct fetch (no CORS issues)
const response = await fetch('https://restcountries.com/v3.1/alpha/au');
const australia = await response.json();
console.log(australia[0].name.common); // "Australia"
```

## Available Regions
- `africa`
- `americas`
- `asia`
- `europe`
- `oceania`

## Common ISO Codes
- `au` - Australia
- `us` - United States
- `gb` - United Kingdom
- `ca` - Canada
- `de` - Germany
- `fr` - France
- `jp` - Japan
- `cn` - China
- `in` - India
- `br` - Brazil

## Data Insights Available

### Demographic Insights
- **Population**: Total population count
- **Density**: Population per km² calculation
- **Area**: Land area in km²

### Geographic Insights
- **Region/Subregion**: Continental and sub-regional classification
- **Capital**: Official capital city
- **Coordinates**: Latitude/longitude for mapping
- **Timezones**: Multiple timezone support

### Cultural Insights
- **Languages**: Official and spoken languages
- **Currencies**: Official currency with symbols
- **Flags**: High-quality flag images (PNG/SVG)
- **Independence**: Independent country status
- **UN Membership**: United Nations membership

### Economic Insights
- **Currency Information**: Name, symbol, and exchange rates
- **Economic Indicators**: Available in some responses

## Error Handling

### Common Error Scenarios
```typescript
try {
  const country = await client.getCountryByCode('invalid');
} catch (error) {
  // Handle 404 for invalid ISO codes
  console.error('Country not found');
}

try {
  const countries = await client.getCountriesByRegion('invalid');
} catch (error) {
  // Handle 404 for invalid regions
  console.error('Region not found');
}
```

### Response Validation
```typescript
const data = await response.json();

if (!Array.isArray(data) || data.length === 0) {
  throw new Error(`No country found for code: ${code}`);
}

return data[0]; // Return first (and usually only) result
```

## Performance Optimization

### Field Filtering
```typescript
// Only fetch needed fields
const response = await fetch(
  'https://restcountries.com/v3.1/alpha/au?fields=name,population,area,flags'
);
```

### Caching Strategy
```typescript
// Cache frequently accessed data
const cache = new Map();

async function getCountryWithCache(code: string) {
  if (cache.has(code)) {
    return cache.get(code);
  }
  
  const country = await client.getCountryByCode(code);
  cache.set(code, country);
  return country;
}
```

## Implementation Notes
- ✅ **No authentication required** - Works immediately
- ✅ **CORS enabled** - Direct browser requests work
- ✅ **Comprehensive data** - Rich country information
- ✅ **Reliable service** - High uptime and availability
- ✅ **Well documented** - Clear API structure
- ✅ **Multiple endpoints** - Flexible data access
- ✅ **Field filtering** - Optimize payload size
- ✅ **Error handling** - Proper HTTP status codes

## Testing Checklist
- [x] ✅ Test basic API connectivity
- [x] ✅ Verify ISO code lookup (Australia)
- [x] ✅ Test region filtering (Asia, Europe)
- [x] ✅ Validate data structure
- [x] ✅ Test error handling (invalid codes)
- [x] ✅ Verify flag image loading
- [x] ✅ Test field filtering optimization
- [x] ✅ Confirm CORS compatibility
- [x] ✅ Test population density calculations
- [x] ✅ Verify insight generation

## Migration from WorldPop API
- **✅ Simpler** - No async task polling required
- **✅ More reliable** - Direct responses, no timeouts
- **✅ Richer data** - More comprehensive country information
- **✅ Better CORS** - Works directly from browser
- **✅ No rate limits** - Generous usage allowances
- **✅ Global coverage** - All countries, not just population data 