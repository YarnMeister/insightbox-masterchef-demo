const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function testSupabaseConnection() {
  console.log('🔍 Testing Supabase Connection...\n');
  
  // Check if environment variables are set
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  console.log('Environment Variables:');
  console.log(`- URL: ${supabaseUrl ? '✅ Set' : '❌ Missing'}`);
  console.log(`- Key: ${supabaseKey ? '✅ Set' : '❌ Missing'}`);
  
  if (!supabaseUrl || !supabaseKey) {
    console.log('\n❌ Missing Supabase credentials!');
    console.log('Please update .env.local with your actual Supabase URL and anon key.');
    return;
  }
  
  // Check if using placeholder values
  if (supabaseUrl.includes('your-project-id') || supabaseKey.includes('your-anon-key')) {
    console.log('\n⚠️  Using placeholder values!');
    console.log('Please replace with actual Supabase credentials.');
    return;
  }
  
  try {
    console.log('\n🔄 Creating Supabase client...');
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    console.log('🔄 Testing connection...');
    
    // Test basic connection by trying to fetch from insights table
    const { data, error } = await supabase
      .from('insights')
      .select('count')
      .limit(1);
    
    if (error) {
      console.log('❌ Connection failed:');
      console.log(`Error: ${error.message}`);
      console.log(`Code: ${error.code}`);
      
      if (error.code === 'PGRST116') {
        console.log('\n💡 This might be because:');
        console.log('- The insights table doesn\'t exist yet');
        console.log('- RLS policies are blocking access');
        console.log('- Invalid credentials');
      }
    } else {
      console.log('✅ Supabase connection successful!');
      console.log('✅ Database is accessible');
      
      // Test if insights table exists by trying to get actual data
      const { data: insights, error: insightsError } = await supabase
        .from('insights')
        .select('*')
        .limit(5);
      
      if (insightsError) {
        console.log('⚠️  Insights table might not exist or have RLS issues');
        console.log(`Error: ${insightsError.message}`);
      } else {
        console.log(`✅ Insights table accessible (${insights.length} records found)`);
      }
    }
    
  } catch (error) {
    console.log('❌ Unexpected error:');
    console.log(error.message);
  }
}

testSupabaseConnection(); 