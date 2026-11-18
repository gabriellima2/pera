-- Baseline schema (public). Synced from linked Supabase project.

CREATE OR REPLACE FUNCTION "public"."create_daily_entry"("p_emotion" "text", "p_date" "date", "p_notes" "text") RETURNS "uuid"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public'
    AS $$
declare
  v_entry_id uuid;
  v_auth_user_id uuid;
begin
  v_auth_user_id := auth.uid();

  if v_auth_user_id is null then
    raise exception 'UNAUTHENTICATED';
  end if;

  if exists (
    select 1
    from daily_entries de
    where de.auth_user_id = v_auth_user_id
      and de.date = p_date
      and de.deleted_at is null
  ) then
    raise exception 'ALREADY_EXISTS';
  end if;

  insert into daily_entries (
    emotion,
    date,
    notes,
    auth_user_id
  )
  values (
    p_emotion,
    p_date,
    p_notes,
    v_auth_user_id
  )
  returning id into v_entry_id;

  return v_entry_id;
end;
$$;

CREATE OR REPLACE FUNCTION "public"."create_moment_entry"("p_emotion" "text", "p_situation_id" "uuid", "p_situation_description" "text", "p_date" "date", "p_notes" "text") RETURNS "uuid"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public'
    AS $$
declare
  v_entry_id uuid;
  v_auth_user_id uuid;
begin
  v_auth_user_id := auth.uid();

  if v_auth_user_id is null then
    raise exception 'UNAUTHENTICATED';
  end if;

  -- valida situação pré-definida (se veio id)
  if p_situation_id is not null then
    if not exists (
      select 1
      from situations
      where id = p_situation_id
        and active = true
    ) then
      raise exception 'SITUATION_NOT_FOUND';
    end if;
  end if;

  insert into moment_entries (
    emotion,
    situation_id,
    situation_description,
    date,
    notes,
    auth_user_id
  )
  values (
    p_emotion,
    p_situation_id,
    p_situation_description,
    p_date,
    p_notes,
    v_auth_user_id
  )
  returning id into v_entry_id;

  return v_entry_id;
end;
$$;

CREATE OR REPLACE FUNCTION "public"."edit_moment_entry"("p_moment_entry_id" "uuid", "p_emotion" "text", "p_situation_id" "uuid", "p_situation_description" "text", "p_date" "date", "p_notes" "text") RETURNS "uuid"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public'
    AS $$
declare
  v_auth_user_id uuid;
begin
  v_auth_user_id := auth.uid();

  if v_auth_user_id is null then
    raise exception 'UNAUTHENTICATED';
  end if;

  if p_situation_id is not null then
    if not exists (
      select 1
      from situations
      where id = p_situation_id
        and active = true
    ) then
      raise exception 'SITUATION_NOT_FOUND';
    end if;
  end if;

  update moment_entries
  set
    emotion = p_emotion,
    situation_id = p_situation_id,
    situation_description = p_situation_description,
    date = p_date,
    notes = p_notes
  where id = p_moment_entry_id
    and auth_user_id = v_auth_user_id
    and deleted_at is null;

  -- Verifica se algum registro foi de fato alterado
  if not found then
    raise exception 'MOMENT_ENTRY_NOT_FOUND';
  end if;

  return p_moment_entry_id;
end;
$$;

CREATE OR REPLACE FUNCTION "public"."handle_new_auth_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
begin
  insert into public.auth_users (id, name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

CREATE TABLE IF NOT EXISTS "public"."auth_users" (
    "id" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "name" "text" NOT NULL,
    "onboarding_completed" boolean DEFAULT false NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "deleted_at" timestamp with time zone
);

CREATE TABLE IF NOT EXISTS "public"."daily_entries" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "auth_user_id" "uuid" NOT NULL,
    "date" "date" NOT NULL,
    "emotion" "text" NOT NULL,
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "deleted_at" timestamp with time zone,
    CONSTRAINT "daily_entries_emotion_check" CHECK (("emotion" = ANY (ARRAY['calm'::"text", 'happy'::"text", 'neutral'::"text", 'anxious'::"text", 'sad'::"text", 'frustrated'::"text"])))
);

CREATE TABLE IF NOT EXISTS "public"."moment_entries" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "auth_user_id" "uuid" NOT NULL,
    "situation_id" "uuid",
    "situation_description" "text",
    "date" "date",
    "emotion" "text" NOT NULL,
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "deleted_at" timestamp with time zone,
    CONSTRAINT "check_situation" CHECK (((("situation_id" IS NOT NULL) AND ("situation_description" IS NULL)) OR (("situation_id" IS NULL) AND ("situation_description" IS NOT NULL)))),
    CONSTRAINT "moment_entries_emotion_check" CHECK (("emotion" = ANY (ARRAY['calm'::"text", 'happy'::"text", 'neutral'::"text", 'anxious'::"text", 'sad'::"text", 'frustrated'::"text"])))
);

CREATE TABLE IF NOT EXISTS "public"."situations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "label" "text" NOT NULL,
    "code" "text" NOT NULL,
    "order" smallint NOT NULL,
    "active" boolean DEFAULT true NOT NULL
);

ALTER TABLE ONLY "public"."daily_entries"
    ADD CONSTRAINT "daily_entries_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."moment_entries"
    ADD CONSTRAINT "moment_entries_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."situations"
    ADD CONSTRAINT "situations_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."auth_users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

CREATE UNIQUE INDEX "unique_user_day_active" ON "public"."daily_entries" USING "btree" ("auth_user_id", "date") WHERE ("deleted_at" IS NULL);

ALTER TABLE ONLY "public"."auth_users"
    ADD CONSTRAINT "auth_users_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."daily_entries"
    ADD CONSTRAINT "daily_entries_auth_user_id_fkey" FOREIGN KEY ("auth_user_id") REFERENCES "public"."auth_users"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."moment_entries"
    ADD CONSTRAINT "moment_entries_auth_user_id_fkey" FOREIGN KEY ("auth_user_id") REFERENCES "public"."auth_users"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."moment_entries"
    ADD CONSTRAINT "moment_entries_situation_id_fkey" FOREIGN KEY ("situation_id") REFERENCES "public"."situations"("id");

ALTER TABLE "public"."auth_users" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "auth_users_select_own" ON "public"."auth_users" FOR SELECT TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "id"));

CREATE POLICY "auth_users_update_own" ON "public"."auth_users" FOR UPDATE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "id")) WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "id"));

ALTER TABLE "public"."daily_entries" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "daily_entries_insert_own" ON "public"."daily_entries" FOR INSERT TO "authenticated" WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "auth_user_id"));

CREATE POLICY "daily_entries_select_own" ON "public"."daily_entries" FOR SELECT TO "authenticated" USING (((( SELECT "auth"."uid"() AS "uid") = "auth_user_id") AND ("deleted_at" IS NULL)));

CREATE POLICY "daily_entries_update_own" ON "public"."daily_entries" FOR UPDATE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "auth_user_id")) WITH CHECK (((( SELECT "auth"."uid"() AS "uid") = "auth_user_id") AND ("deleted_at" IS NULL)));

ALTER TABLE "public"."moment_entries" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "moment_entries_insert_own" ON "public"."moment_entries" FOR INSERT TO "authenticated" WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "auth_user_id"));

CREATE POLICY "moment_entries_select_own" ON "public"."moment_entries" FOR SELECT TO "authenticated" USING (((( SELECT "auth"."uid"() AS "uid") = "auth_user_id") AND ("deleted_at" IS NULL)));

CREATE POLICY "moment_entries_update_own" ON "public"."moment_entries" FOR UPDATE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "auth_user_id")) WITH CHECK (((( SELECT "auth"."uid"() AS "uid") = "auth_user_id") AND ("deleted_at" IS NULL)));

ALTER TABLE "public"."situations" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "situations_select_authenticated" ON "public"."situations" FOR SELECT TO "authenticated" USING (("active" IS TRUE));

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON FUNCTION "public"."create_daily_entry"("p_emotion" "text", "p_date" "date", "p_notes" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."create_daily_entry"("p_emotion" "text", "p_date" "date", "p_notes" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_daily_entry"("p_emotion" "text", "p_date" "date", "p_notes" "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."create_moment_entry"("p_emotion" "text", "p_situation_id" "uuid", "p_situation_description" "text", "p_date" "date", "p_notes" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."create_moment_entry"("p_emotion" "text", "p_situation_id" "uuid", "p_situation_description" "text", "p_date" "date", "p_notes" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_moment_entry"("p_emotion" "text", "p_situation_id" "uuid", "p_situation_description" "text", "p_date" "date", "p_notes" "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."edit_moment_entry"("p_moment_entry_id" "uuid", "p_emotion" "text", "p_situation_id" "uuid", "p_situation_description" "text", "p_date" "date", "p_notes" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."edit_moment_entry"("p_moment_entry_id" "uuid", "p_emotion" "text", "p_situation_id" "uuid", "p_situation_description" "text", "p_date" "date", "p_notes" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."edit_moment_entry"("p_moment_entry_id" "uuid", "p_emotion" "text", "p_situation_id" "uuid", "p_situation_description" "text", "p_date" "date", "p_notes" "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."handle_new_auth_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_auth_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_auth_user"() TO "service_role";

GRANT ALL ON TABLE "public"."auth_users" TO "anon";
GRANT ALL ON TABLE "public"."auth_users" TO "authenticated";
GRANT ALL ON TABLE "public"."auth_users" TO "service_role";

GRANT ALL ON TABLE "public"."daily_entries" TO "anon";
GRANT ALL ON TABLE "public"."daily_entries" TO "authenticated";
GRANT ALL ON TABLE "public"."daily_entries" TO "service_role";

GRANT ALL ON TABLE "public"."moment_entries" TO "anon";
GRANT ALL ON TABLE "public"."moment_entries" TO "authenticated";
GRANT ALL ON TABLE "public"."moment_entries" TO "service_role";

GRANT ALL ON TABLE "public"."situations" TO "anon";
GRANT ALL ON TABLE "public"."situations" TO "authenticated";
GRANT ALL ON TABLE "public"."situations" TO "service_role";

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_auth_user();

