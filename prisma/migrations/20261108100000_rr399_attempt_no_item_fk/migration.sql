-- RR-399 A1: attempts never saved. IcelandicAttempt.itemId was a required foreign key to IcelandicItem, a table nothing fills
-- (items are served from JSON bundles), so every attempt write failed. Drop that FK; itemId stays a plain, indexed text id.
-- No data changes: no row is deleted or rewritten. IF EXISTS: safe to run on a database where the FK is already gone.
ALTER TABLE IF EXISTS "IcelandicAttempt" DROP CONSTRAINT IF EXISTS "IcelandicAttempt_itemId_fkey";
