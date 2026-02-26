CREATE POLICY "Users can read teams"
ON teams FOR SELECT
TO authenticated
USING (true);
