CREATE EXTENSION IF NOT EXISTS pg_cron;

SELECT cron.schedule(
  'cleanup-deleted-products',
  '0 3 * * *',
  $$
    DELETE FROM public.products 
    WHERE status = 'Deleted' 
    AND updated_at <= now() - interval '14 days';
  $$
);