-- First-touch acquisition attribution, stored on the profiles row itself so the
-- "which channel produced an actual account" question stays queryable from SQL
-- with no analytics vendor in the loop (GA4 answers a different question: where
-- a SESSION came from).
--
-- Captured client-side on the visitor's FIRST page view (lib/attribution.ts),
-- kept in localStorage until they sign up, then written by the service role in
-- /api/attribution — write-once, and only for accounts younger than 24h.
--
-- referrer holds origin + pathname only (query string stripped before storage,
-- so no tokens can land here). landing_path is a pathname, never a full URL.
--
-- Deliberately nullable with NO defaults and NO backfill: the 20 accounts that
-- predate this feature have no recoverable source and must read NULL, never a
-- guess. Deliberately NOT named `source` — that name is a lifecycle cohort tag
-- on the sister property and confusing the two has already cost a report cycle.

alter table profiles
  add column if not exists referrer text,
  add column if not exists utm_source text,
  add column if not exists utm_medium text,
  add column if not exists utm_campaign text,
  add column if not exists utm_content text,
  add column if not exists utm_term text,
  add column if not exists landing_path text,
  add column if not exists first_seen_at timestamptz;

-- Cohort queries are "group by channel" over the attributed rows only.
create index if not exists profiles_utm_source_idx on profiles(utm_source) where utm_source is not null;
create index if not exists profiles_referrer_idx on profiles(referrer) where referrer is not null;
