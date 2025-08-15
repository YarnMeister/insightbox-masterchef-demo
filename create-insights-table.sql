-- Create insights table for InsightBox dashboard
-- Run this in your Supabase SQL Editor

-- Create the insights table
CREATE TABLE IF NOT EXISTS insights (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  insight TEXT NOT NULL,
  severity VARCHAR(50) CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  tags JSONB DEFAULT '[]'::jsonb,
  source_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE insights ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (demo purposes)
CREATE POLICY "Public read access" ON insights FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON insights FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON insights FOR UPDATE USING (true);

-- Insert some sample data for testing
INSERT INTO insights (title, insight, severity, tags) VALUES 
('Server Load Alert', 'CPU usage has increased 45% over the past hour, indicating potential performance bottleneck.', 'high', '["performance", "infrastructure"]'),
('User Engagement Drop', 'Daily active users down 12% compared to last week - investigate recent feature changes.', 'medium', '["analytics", "user-experience"]'),
('Security Anomaly', 'Unusual login patterns detected from 3 new geographic locations in the past 24h.', 'critical', '["security", "authentication"]');

-- Create an index on created_at for better performance
CREATE INDEX IF NOT EXISTS idx_insights_created_at ON insights(created_at DESC);

-- Create an index on severity for filtering
CREATE INDEX IF NOT EXISTS idx_insights_severity ON insights(severity); 