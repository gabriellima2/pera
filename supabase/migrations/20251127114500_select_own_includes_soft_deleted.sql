-- PostgREST runs SELECT on updated rows (e.g. RETURNING). SELECT policies that
-- require deleted_at IS NULL block soft delete even when UPDATE WITH CHECK allows it.
-- App queries filter deleted_at in the client; RLS still restricts rows to auth_user_id.

DROP POLICY IF EXISTS "daily_entries_select_own" ON "public"."daily_entries";

CREATE POLICY "daily_entries_select_own"
ON "public"."daily_entries"
FOR SELECT
TO "authenticated"
USING (
  (SELECT auth.uid() AS uid) = auth_user_id
);

DROP POLICY IF EXISTS "moment_entries_select_own" ON "public"."moment_entries";

CREATE POLICY "moment_entries_select_own"
ON "public"."moment_entries"
FOR SELECT
TO "authenticated"
USING (
  (SELECT auth.uid() AS uid) = auth_user_id
);