# MasterChef Dev Edition - Complete Prep Guide

## 1. GitHub Repository Setup

### Create New Repository
1. Go to [GitHub.com](https://github.com) → **New Repository**
2. Repository name: `insightbox-masterchef-demo`
3. Description: `MasterChef-style micro-dashboard built with Cursor AI + Supabase`
4. Set to **Public** (for easy demo sharing)
5. Initialize with README ✅
6. Add `.gitignore` template: **Node**
7. License: MIT (optional)

### Connect to Cursor
1. Clone the repo locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/insightbox-masterchef-demo.git
   cd insightbox-masterchef-demo
   ```
2. Open in Cursor: `cursor .` or File → Open Folder
3. Verify Git integration works (bottom status bar should show branch)

---

## 2. Vercel Deployment Setup

### Deploy Empty Landing Page
1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your GitHub repo: `insightbox-masterchef-demo`
3. Framework Preset: **Other** (we'll add React later)
4. Root Directory: `./`
5. Build Command: Leave empty for now
6. Output Directory: Leave empty
7. Click **Deploy**

### Create Placeholder Landing Page
Create these files in your repo:

**`index.html`**
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>InsightBox - Coming Soon</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gradient-to-br from-blue-500 to-purple-600 min-h-screen flex items-center justify-center">
    <div class="text-center text-white">
        <h1 class="text-6xl font-bold mb-4">🍳 InsightBox</h1>
        <p class="text-xl mb-8">MasterChef: Dev Edition - Mystery Box Challenge</p>
        <div class="bg-white/20 backdrop-blur-sm rounded-lg p-6 max-w-md">
            <p class="text-sm opacity-90">Building live in 20 minutes...</p>
            <div class="mt-4 flex justify-center space-x-2">
                <span class="w-2 h-2 bg-white rounded-full animate-bounce"></span>
                <span class="w-2 h-2 bg-white rounded-full animate-bounce" style="animation-delay: 0.1s"></span>
                <span class="w-2 h-2 bg-white rounded-full animate-bounce" style="animation-delay: 0.2s"></span>
            </div>
        </div>
    </div>
</body>
</html>
```

Push to GitHub - Vercel will auto-deploy and give you a public URL like: `https://insightbox-masterchef-demo.vercel.app`

---

## 3. Supabase Setup ✅ COMPLETED

### Create Project ✅
1. Go to [supabase.com](https://supabase.com) → **New Project**
2. Organization: Your personal org
3. Project name: `insightbox-masterchef`
4. Database password: Generate strong password (save it!)
5. Region: Choose closest to your location
6. Pricing plan: Free tier is fine
7. Wait for project creation (~2 minutes)

### Connection Test ✅
- Supabase credentials configured in `.env.local`
- Connection tested and working via `test-supabase.js`
- Database accessible and ready for development

### Create Basic Table ✅

Go to **SQL Editor** in Supabase dashboard and run:

```sql
-- Drop existing table if needed
DROP TABLE IF EXISTS insights;

-- Create basic insights table (minimal structure)
CREATE TABLE insights (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE insights ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Public read access" ON insights FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON insights FOR INSERT WITH CHECK (true);
```

**Note**: This creates a minimal table structure with just row-id and timestamp. Additional columns will be added as the project evolves.
  source VARCHAR(100) NOT NULL,
  data JSONB NOT NULL,
  processed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS) - good practice
ALTER TABLE insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE raw_data_feeds ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (demo purposes)
CREATE POLICY "Public read access" ON insights FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON insights FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read raw data" ON raw_data_feeds FOR SELECT USING (true);
CREATE POLICY "Public insert raw data" ON raw_data_feeds FOR INSERT WITH CHECK (true);

-- Insert sample data for demo
INSERT INTO insights (title, insight, severity, tags) VALUES 
('Server Load Alert', 'CPU usage has increased 45% over the past hour, indicating potential performance bottleneck.', 'high', '["performance", "infrastructure"]'),
('User Engagement Drop', 'Daily active users down 12% compared to last week - investigate recent feature changes.', 'medium', '["analytics", "user-experience"]'),
('Security Anomaly', 'Unusual login patterns detected from 3 new geographic locations in the past 24h.', 'critical', '["security", "authentication"]');
```

### Get API Keys
1. Go to **Settings** → **API** in your Supabase dashboard
2. Copy these values (you'll need them):
   - **Project URL**: `https://your-project-id.supabase.co`
   - **anon/public key**: `eyJ...` (long JWT token)
   - **service_role key**: `eyJ...` (longer JWT token - keep secret!)

### Test Connection
Quick test in the SQL Editor:
```sql
SELECT * FROM insights;
```
Should return your 3 sample insights.

---

## 4. ChatGPT API Configuration

### Get OpenAI API Key
1. Go to [platform.openai.com](https://platform.openai.com) → **API Keys**
2. Create new secret key: `sk-...`
3. Copy and save securely
4. Add billing method if you haven't (you'll need $5+ credit for reliable demo)

### Test API Access
You can test in Cursor or any terminal:

```bash
curl -X POST "https://api.openai.com/v1/chat/completions" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "model": "gpt-3.5-turbo",
    "messages": [{"role": "user", "content": "Generate a test insight about server performance in JSON format with fields: title, insight, severity"}],
    "max_tokens": 150
  }'
```

Expected response format:
```json
{
  "title": "Server Performance Alert",
  "insight": "Memory usage has spiked to 89%, consider scaling resources",
  "severity": "high"
}
```

---

## 5. Environment Variables Setup

Create a `.env.local` file in your project root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...your-anon-key
SUPABASE_SERVICE_ROLE_KEY=eyJ...your-service-key

# OpenAI
OPENAI_API_KEY=sk-...your-openai-key

# External API (placeholder - replace with real API)
EXTERNAL_API_URL=https://jsonplaceholder.typicode.com/posts
EXTERNAL_API_KEY=placeholder

# Zapier Webhook (you'll set this up during demo)
ZAPIER_WEBHOOK_URL=https://hooks.zapier.com/hooks/catch/placeholder
```

**Important**: Add `.env.local` to your `.gitignore` file!

---

## 6. Pre-Demo Verification Checklist

### ✅ GitHub Repository
- [ ] Repo created and cloned locally
- [ ] Connected to Cursor
- [ ] Initial `index.html` pushed
- [ ] `.gitignore` includes `node_modules`, `.env.local`

### ✅ Vercel Deployment  
- [ ] Project deployed and accessible via public URL
- [ ] Landing page shows correctly
- [ ] Auto-deployment from GitHub working

### ✅ Supabase Database
- [x] Project created and running
- [x] Basic `insights` table created (minimal structure)
- [x] Connection tested and working
- [x] API keys configured in `.env.local`
- [x] RLS policies configured
- [ ] Additional columns to be added as needed

### ✅ ChatGPT API
- [ ] API key obtained
- [ ] Billing configured
- [ ] Test API call successful
- [ ] Response format confirmed

### ✅ Development Environment
- [ ] `.env.local` file created with all keys
- [ ] Cursor AI ready and authenticated
- [ ] Git configuration working

---

## 7. Demo Day Quick Commands

### Cursor Prompts Ready to Use:

**Initial Setup:**
```
Create a micro-dashboard web app using React + Tailwind. Call it 'InsightBox'. Use Supabase for backend, and prepare for an external API feed. Set up Next.js with TypeScript.
```

**Data Integration:**
```
Add a background job or API route to fetch data from an external API, process it, and store insights in Supabase using the insights table schema.
```

**ChatGPT Integration:**
```
Create a function that sends data to OpenAI ChatGPT API and asks it to return 3 useful insights in JSON format with fields: title, insight, severity (low/medium/high/critical).
```

**UI Dashboard:**
```
Design a Tailwind dashboard component that reads insights from Supabase and renders a responsive grid with color-coded severity tags and modern card design.
```

### Emergency Backup Plan
If live coding hits issues, you have:
- Working sample data in Supabase
- Deployed landing page as fallback
- Clear talking points about each tool's value
- Option to show pre-built components instead of live coding

**You're all set for your MasterChef Dev Edition! 🍳🚀**
