-- Safe to run more than once. Existing tables are checked, never dropped.
DO $$
DECLARE
  incompatible_columns text[];
BEGIN
  IF to_regclass('public.tasks') IS NULL THEN
    CREATE TABLE public.tasks (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      title text NOT NULL CHECK (char_length(btrim(title)) BETWEEN 1 AND 120),
      is_done boolean NOT NULL DEFAULT false,
      created_at timestamptz NOT NULL DEFAULT now(),
      user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE
    );
  ELSE
    SELECT array_agg(
      format(
        '%s (expected %s, found %s)',
        required.column_name,
        required.udt_name,
        COALESCE(existing.udt_name, 'missing')
      )
    )
    INTO incompatible_columns
    FROM (
      VALUES
        ('id', 'uuid'),
        ('title', 'text'),
        ('is_done', 'bool'),
        ('created_at', 'timestamptz'),
        ('user_id', 'uuid')
    ) AS required(column_name, udt_name)
    LEFT JOIN information_schema.columns AS existing
      ON existing.table_schema = 'public'
      AND existing.table_name = 'tasks'
      AND existing.column_name = required.column_name
    WHERE existing.column_name IS NULL
      OR existing.udt_name <> required.udt_name;

    IF incompatible_columns IS NOT NULL THEN
      RAISE EXCEPTION
        'public.tasks already exists with incompatible columns: %. Inspect the existing schema before applying changes.',
        array_to_string(incompatible_columns, ', ');
    END IF;
  END IF;
END;
$$;

CREATE INDEX IF NOT EXISTS tasks_user_created_at_idx
  ON public.tasks (user_id, created_at DESC);

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'tasks'
      AND policyname = 'tasks_select_own'
  ) THEN
    CREATE POLICY tasks_select_own
      ON public.tasks
      FOR SELECT
      TO authenticated
      USING ((SELECT auth.uid()) = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'tasks'
      AND policyname = 'tasks_insert_own'
  ) THEN
    CREATE POLICY tasks_insert_own
      ON public.tasks
      FOR INSERT
      TO authenticated
      WITH CHECK ((SELECT auth.uid()) = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'tasks'
      AND policyname = 'tasks_update_own'
  ) THEN
    CREATE POLICY tasks_update_own
      ON public.tasks
      FOR UPDATE
      TO authenticated
      USING ((SELECT auth.uid()) = user_id)
      WITH CHECK ((SELECT auth.uid()) = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'tasks'
      AND policyname = 'tasks_delete_own'
  ) THEN
    CREATE POLICY tasks_delete_own
      ON public.tasks
      FOR DELETE
      TO authenticated
      USING ((SELECT auth.uid()) = user_id);
  END IF;
END;
$$;
