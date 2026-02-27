ALTER TABLE public.products
ADD COLUMN fts tsvector GENERATED ALWAYS AS (
  to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, ''))
) STORED;

CREATE INDEX products_fts_idx ON public.products USING GIN (fts);
