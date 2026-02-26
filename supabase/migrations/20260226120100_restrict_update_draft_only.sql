DROP POLICY "Users can update products in their team" ON products;

CREATE POLICY "Users can update products in their team"
ON products FOR UPDATE
USING (
  team_id = (SELECT team_id FROM profiles WHERE id = auth.uid())
);

CREATE OR REPLACE FUNCTION prevent_non_draft_edit()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status != 'Draft' THEN
    IF NEW.title IS DISTINCT FROM OLD.title
       OR NEW.description IS DISTINCT FROM OLD.description
       OR NEW.image_url IS DISTINCT FROM OLD.image_url
    THEN
      RAISE EXCEPTION 'Only products with Draft status can be edited';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_draft_before_update
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION prevent_non_draft_edit();
