// OpenAI ChatGPT API Client
export interface ChatGPTResponse {
  content: string;
  role: string;
}

export class OpenAIClient {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || '';
  }

  async generateInsights(comparisonData: any, country1: string, country2: string): Promise<string> {
    try {
      console.log('🤖 Generating ChatGPT insights...');

      const prompt = `Here are the results comparing two countries to see who wins, what can you tell me about the results that are interesting. You can use whatever reference you like to make the answer factual but interesting. Give me the response in this format:

## Key Insights

### Population Analysis
[Your analysis of population differences and what they mean]

### Geographic Comparison
[Your analysis of area and density differences]

### Historical Context
[Interesting historical facts about these countries]

### Economic Implications
[What the population and area differences suggest about economic development]

### Fun Facts
[2-3 interesting facts about these countries]

### Winner Summary
[Overall assessment of which country "wins" and why]

---

Country 1: ${country1}
Country 2: ${country2}

Comparison Data:
${JSON.stringify(comparisonData, null, 2)}

Please provide a factual, interesting analysis based on this data.`;

      const response = await fetch('/api/chatgpt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          comparisonData,
          country1,
          country2
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ ChatGPT insights generated');
      
      return data.content;
    } catch (error) {
      console.error('❌ Error generating ChatGPT insights:', error);
      throw error;
    }
  }
} 