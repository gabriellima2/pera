-- Hardening: new rows must be active; deleted auth_users cannot read/update profile via client.

DROP POLICY IF EXISTS "daily_entries_insert_own" ON "public"."daily_entries";

CREATE POLICY "daily_entries_insert_own"
ON "public"."daily_entries"
FOR INSERT
TO "authenticated"
WITH CHECK (
  ((SELECT auth.uid() AS uid) = auth_user_id)
  AND (deleted_at IS NULL)
);

DROP POLICY IF EXISTS "moment_entries_insert_own" ON "public"."moment_entries";

CREATE POLICY "moment_entries_insert_own"
ON "public"."moment_entries"
FOR INSERT
TO "authenticated"
WITH CHECK (
  ((SELECT auth.uid() AS uid) = auth_user_id)
  AND (deleted_at IS NULL)
);

DROP POLICY IF EXISTS "auth_users_select_own" ON "public"."auth_users";

CREATE POLICY "auth_users_select_own"
ON "public"."auth_users"
FOR SELECT
TO "authenticated"
USING (
  ((SELECT auth.uid() AS uid) = id)
  AND (deleted_at IS NULL)
);

DROP POLICY IF EXISTS "auth_users_update_own" ON "public"."auth_users";

CREATE POLICY "auth_users_update_own"
ON "public"."auth_users"
FOR UPDATE
TO "authenticated"
USING (
  ((SELECT auth.uid() AS uid) = id)
  AND (deleted_at IS NULL)
)
WITH CHECK (
  (SELECT auth.uid() AS uid) = id
);