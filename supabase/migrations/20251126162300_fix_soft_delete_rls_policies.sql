-- Allow soft delete (setting deleted_at) on own rows.
-- Previously WITH CHECK required deleted_at IS NULL on the new row, which blocked soft delete.

DROP POLICY IF EXISTS "daily_entries_update_own" ON "public"."daily_entries";

CREATE POLICY "daily_entries_update_own"
ON "public"."daily_entries"
FOR UPDATE
TO "authenticated"
USING (
  ((SELECT auth.uid() AS uid) = auth_user_id)
  AND (deleted_at IS NULL)
)
WITH CHECK (
  (SELECT auth.uid() AS uid) = auth_user_id
);

DROP POLICY IF EXISTS "moment_entries_update_own" ON "public"."moment_entries";

CREATE POLICY "moment_entries_update_own"
ON "public"."moment_entries"
FOR UPDATE
TO "authenticated"
USING (
  ((SELECT auth.uid() AS uid) = auth_user_id)
  AND (deleted_at IS NULL)
)
WITH CHECK (
  (SELECT auth.uid() AS uid) = auth_user_id
);