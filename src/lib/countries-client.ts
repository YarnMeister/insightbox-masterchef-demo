// REST Countries API Client
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
  // Optional fields that might not be available in all responses
  continents?: string[];
  timezones?: string[];
  independent?: boolean;
  unMember?: boolean;
}

export class CountriesClient {
  private baseUrl = 'https://restcountries.com/v3.1';

  // Get country by ISO code (e.g., 'au' for Australia)
  async getCountryByCode(code: string): Promise<CountryData> {
    try {
      console.log(`🌍 Fetching country data for ISO code: ${code.toUpperCase()}`);

      const response = await fetch(`${this.baseUrl}/alpha/${code.toLowerCase()}`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (!Array.isArray(data) || data.length === 0) {
        throw new Error(`No country found for ISO code: ${code}`);
      }

      const country = data[0];
      console.log('✅ Country data received:', {
        name: country.name.common,
        population: country.population,
        region: country.region,
        capital: country.capital[0]
      });

      return country;
    } catch (error) {
      console.error('❌ Error fetching country data:', error);
      throw error;
    }
  }

  // Get all countries with all available fields
  async getAllCountries(): Promise<CountryData[]> {
    try {
      console.log('🌍 Fetching all countries with complete data...');

      // Use only the fields that work with the API
      const fields = [
        'name', 'population', 'region', 'subregion', 'capital', 'area',
        'currencies', 'languages', 'flags', 'latlng'
      ].join(',');

      const response = await fetch(`${this.baseUrl}/all?fields=${fields}`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`✅ Received complete data for ${data.length} countries`);

      return data;
    } catch (error) {
      console.error('❌ Error fetching all countries:', error);
      throw error;
    }
  }

  // Get countries by region
  async getCountriesByRegion(region: string): Promise<CountryData[]> {
    try {
      console.log(`🌍 Fetching countries in region: ${region}`);

      const response = await fetch(`${this.baseUrl}/region/${region}`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`✅ Received data for ${data.length} countries in ${region}`);

      return data;
    } catch (error) {
      console.error('❌ Error fetching countries by region:', error);
      throw error;
    }
  }

  // Get mock data for demo purposes
  getMockCountryData(): CountryData {
    return {
      name: {
        common: "Australia",
        official: "Commonwealth of Australia"
      },
      population: 25687041,
      region: "Oceania",
      subregion: "Australia and New Zealand",
      capital: ["Canberra"],
      area: 7692024,
      currencies: {
        "AUD": {
          name: "Australian dollar",
          symbol: "$"
        }
      },
      languages: {
        "eng": "English"
      },
      flags: {
        png: "https://flagcdn.com/w320/au.png",
        svg: "https://flagcdn.com/au.svg",
        alt: "The flag of Australia has a dark blue field..."
      },
      latlng: [-27, 133],
      continents: ["Oceania"],
      timezones: ["UTC+05:00", "UTC+06:30", "UTC+07:00", "UTC+08:00", "UTC+09:30", "UTC+10:00", "UTC+10:30", "UTC+11:30"],
      independent: true,
      unMember: true
    };
  }
}

// Test function
export async function testCountriesAPI() {
  const client = new CountriesClient();

  try {
    console.log('🧪 Testing REST Countries API...');
    const australia = await client.getCountryByCode('au');
    console.log('✅ Australia data:', {
      name: australia.name.common,
      population: australia.population.toLocaleString(),
      region: australia.region,
      capital: australia.capital[0],
      area: australia.area.toLocaleString() + ' km²'
    });
    return australia;
  } catch (error) {
    console.error('❌ Countries API test failed:', error);
    return client.getMockCountryData();
  }
} 