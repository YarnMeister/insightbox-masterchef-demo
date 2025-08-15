const OpenAI = require('openai');
require('dotenv').config({ path: '.env.local' });

async function testOpenAIConnection() {
  console.log('🔍 Testing OpenAI API Connection...\n');
  
  // Check if API key is set
  const apiKey = process.env.OPENAI_API_KEY;
  
  console.log('Environment Variables:');
  console.log(`- API Key: ${apiKey ? '✅ Set' : '❌ Missing'}`);
  
  if (!apiKey) {
    console.log('\n❌ Missing OpenAI API key!');
    console.log('Please update .env.local with your actual OpenAI API key.');
    return;
  }
  
  // Check if using placeholder value
  if (apiKey.includes('your-openai-api-key')) {
    console.log('\n⚠️  Using placeholder value!');
    console.log('Please replace with actual OpenAI API key.');
    return;
  }
  
  try {
    console.log('\n🔄 Creating OpenAI client...');
    const openai = new OpenAI({
      apiKey: apiKey,
    });
    
    console.log('🔄 Testing API connection...');
    
    // Test with a simple completion
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant. Respond with "API test successful" and nothing else.'
        },
        {
          role: 'user',
          content: 'Test the connection'
        }
      ],
      max_tokens: 10,
      temperature: 0,
    });
    
    const response = completion.choices[0]?.message?.content;
    
    if (response && response.includes('API test successful')) {
      console.log('✅ OpenAI API connection successful!');
      console.log('✅ API key is valid and working');
      console.log(`✅ Response: "${response}"`);
    } else {
      console.log('⚠️  API responded but with unexpected content');
      console.log(`Response: "${response}"`);
    }
    
  } catch (error) {
    console.log('❌ OpenAI API connection failed:');
    console.log(`Error: ${error.message}`);
    
    if (error.status === 401) {
      console.log('\n💡 This indicates an invalid API key.');
      console.log('Please check your OpenAI API key in .env.local');
    } else if (error.status === 429) {
      console.log('\n💡 Rate limit exceeded.');
      console.log('This might be due to billing issues or rate limits.');
    } else if (error.code === 'ENOTFOUND') {
      console.log('\n💡 Network connectivity issue.');
      console.log('Please check your internet connection.');
    }
  }
}

testOpenAIConnection(); 