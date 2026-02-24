CREATE TYPE product_status AS ENUM ('Draft', 'Active', 'Deleted');

CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  invite_code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES profiles(id),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  status product_status DEFAULT 'Draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view products in their team" 
ON products FOR SELECT 
USING (
  team_id = (SELECT team_id FROM profiles WHERE id = auth.uid())
);

CREATE POLICY "Users can insert products in their team" 
ON products FOR INSERT 
WITH CHECK (
  team_id = (SELECT team_id FROM profiles WHERE id = auth.uid())
);

CREATE POLICY "Users can update products in their team" 
ON products FOR UPDATE 
USING (
  team_id = (SELECT team_id FROM profiles WHERE id = auth.uid())
);