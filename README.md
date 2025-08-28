# InsightBox — MasterChef Dev Edition

🍳 A live demo app built with Cursor to show how fast you can go from zero to a deployed micro-dashboard.
Audience picks the "mystery API," Cursor cooks the app on the fly.

---

## 🔧 Tech Overview

* **Next.js 15.4.6** (App Router)
* **React 19.1.0**
* **TypeScript 5**
* **Tailwind CSS v4 + PostCSS**
* **Geist fonts** for typography
* **Neon DB** for persistence
* **OpenAI API** for insights
* **Turbopack** for fast dev builds

Already in place:

* Next.js project setup with TS + Tailwind
* ESLint config
* Basic layout with Geist fonts
* Dependencies installed (Neon + OpenAI SDKs)

---

## 🎯 Purpose of Demo

* Fetch data from a free external API chosen **live by the audience**
* Display first 20 rows in a responsive grid
* (Optional) Save sample rows to Neon DB
* (Optional) Data enrichment with OpenAI
* Show how fast this can be deployed to Vercel production

---

## 📂 Project Structure

```
app/
  page.tsx             # Data Explorer
  api/inspect/route.ts # Server route to fetch external APIs
  api/sample/route.ts  # Save sample rows to Neon (optional)
  api/summarise/route.ts # OpenAI summary (optional)
lib/
  schema.ts            # Schema inference helpers
  db.ts               # Database utility (IMPORTANT: Use this for all DB operations)
components/
  EndpointPicker.tsx
  DataGrid.tsx
  Toolbar.tsx
```

---

## 🗄️ Database Setup & Common Issues

### ⚠️ **CRITICAL: PostgreSQL Client Reuse Issue**

**Problem**: When using the `pg` library in Next.js API routes, you'll encounter this error:
```
Error: Client has already been connected. You cannot reuse a client.
```

**Root Cause**: Next.js reuses module instances across requests, causing PostgreSQL clients to be reused.

### ✅ **Solution: Use the Database Utility**

**ALWAYS** use the database utility in `src/lib/db.ts` for all database operations:

```typescript
import { withClient } from '@/lib/db';

// ✅ CORRECT: Use the utility
export async function GET() {
  try {
    const rows = await withClient(async (client) => {
      const result = await client.query('SELECT * FROM your_table');
      return result.rows;
    });
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

// ❌ WRONG: Don't create clients directly in API routes
export async function GET() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  // This will cause "Client has already been connected" errors
}
```

### 🚀 **Quick Database Setup**

1. **Create tables** using the database utility:
```bash
node -e "
require('dotenv').config({ path: '.env.local' });
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL
});

async function createTable() {
  try {
    await client.connect();
    console.log('✅ Connected to Neon database');
    
    const createTableQuery = \`
      CREATE TABLE IF NOT EXISTS your_table (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    \`;
    
    await client.query(createTableQuery);
    console.log('✅ Created your_table');
    
    await client.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
    await client.end();
  }
}

createTable();
"
```

2. **Use the database utility** in all API routes (see `src/lib/db.ts`)

3. **Test your API** endpoints to ensure they work correctly

### 📋 **Available Database Functions**

```typescript
// Basic operations
await withClient(async (client) => {
  const result = await client.query('SELECT * FROM table');
  return result.rows;
});

// Utility functions
await query('SELECT * FROM table');                    // Returns array
await queryOne('SELECT * FROM table WHERE id = $1', [1]); // Returns single row or null
```

---

## 🔐 Environment

`.env.local`

```env

# Recommended for most uses
DATABASE_URL=[redacted]
# For uses requiring a connection without pgbouncer
DATABASE_URL_UNPOOLED=[redacted]

# Parameters for constructing your own connection string
PGHOST=[redacted]
PGHOST_UNPOOLED=[redacted]
PGUSER=[redacted]
PGDATABASE=[redacted]
PGPASSWORD=[redacted]

# Parameters for Vercel Postgres Templates
POSTGRES_URL=[redacted]
POSTGRES_URL_NON_POOLING=[redacted]sslmode=require
POSTGRES_USER=[redacted]
POSTGRES_HOST=[redacted]
POSTGRES_PASSWORD=[redacted]
POSTGRES_DATABASE=[redacted]
POSTGRES_URL_NO_SSL=[redacted]
POSTGRES_PRISMA_URL=[redacted]

# Neon Auth environment variables for Next.js
NEXT_PUBLIC_STACK_PROJECT_ID=[redacted]
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=[redacted]
STACK_SECRET_SERVER_KEY=[redacted]

# OpenAI
OPENAI_API_KEY=[redacted]

# Free API Directory (audience chooses endpoints here)
FREE_API_DIRECTORY=https://apipheny.io/free-api/
```


---

## 🚀 Demo Flow

1. Open deployed Vercel URL
2. Audience picks a free API endpoint from [apipheny.io/free-api](https://apipheny.io/free-api)
3. Paste endpoint → Fetch 20 → Show schema + grid
4. (Optional) Save to Neon and check rows in dashboard
5. (Optional) Send some subset of data from the API call with additional instructions to OpenA (ChatGPT) via an AI call and retrieve results, display in the app as enriched data
---


---


# Test deployment
