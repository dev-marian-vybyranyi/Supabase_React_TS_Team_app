ALTER TABLE profiles ADD COLUMN display_name TEXT;

CREATE OR REPLACE FUNCTION get_my_team_id()
RETURNS UUID AS $$
  SELECT team_id FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

CREATE POLICY "Users can read profiles in their team"
ON profiles FOR SELECT
USING (
  team_id = get_my_team_id()
);
