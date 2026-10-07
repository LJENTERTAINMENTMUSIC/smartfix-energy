import pg from 'pg';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const { Client } = pg;

const client = new Client({
  connectionString: (process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL).replace('?sslmode=require', ''),
  ssl: { rejectUnauthorized: false },
});

async function migrate() {
  await client.connect();
  console.log("Connected to Supabase Postgres.");

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        capacity TEXT NOT NULL,
        fuel TEXT NOT NULL,
        application TEXT NOT NULL,
        availability TEXT NOT NULL,
        price NUMERIC,
        stock INTEGER NOT NULL DEFAULT 0,
        sold INTEGER NOT NULL DEFAULT 0,
        promo BOOLEAN NOT NULL DEFAULT false,
        "promoLabel" TEXT,
        featured BOOLEAN NOT NULL DEFAULT false,
        image TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS leads (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        company TEXT,
        service TEXT NOT NULL,
        location TEXT NOT NULL,
        budget TEXT NOT NULL,
        value NUMERIC NOT NULL DEFAULT 0,
        status TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    console.log("Tables created successfully.");

    // Enable RLS and create policies
    await client.query(`
      ALTER TABLE products ENABLE ROW LEVEL SECURITY;
      ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

      -- Products: Anyone can read
      DO $$ BEGIN
        CREATE POLICY "Products are viewable by everyone" ON products FOR SELECT USING (true);
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;

      -- Products: Only authenticated users can insert/update/delete
      DO $$ BEGIN
        CREATE POLICY "Only authenticated users can modify products" ON products FOR ALL USING (auth.role() = 'authenticated');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;

      -- Leads: Anyone can insert (for public contact forms)
      DO $$ BEGIN
        CREATE POLICY "Anyone can submit a lead" ON leads FOR INSERT WITH CHECK (true);
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;

      -- Leads: Only authenticated users can read/update/delete
      DO $$ BEGIN
        CREATE POLICY "Only authenticated users can view/modify leads" ON leads FOR SELECT USING (auth.role() = 'authenticated');
        CREATE POLICY "Only authenticated users can view/modify leads 2" ON leads FOR UPDATE USING (auth.role() = 'authenticated');
        CREATE POLICY "Only authenticated users can view/modify leads 3" ON leads FOR DELETE USING (auth.role() = 'authenticated');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);
    console.log("RLS policies configured.");

  } catch (err) {
    console.error("Migration error:", err);
  } finally {
    await client.end();
  }
}

migrate();
