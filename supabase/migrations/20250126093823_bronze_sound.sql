/*
  # Fix User Policies

  1. Changes
    - Add policy existence checks before creation
    - Ensure idempotent policy creation
    - Add insert policy for user signup
*/

-- Add insert policy if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'users' 
        AND policyname = 'Users can insert own data'
    ) THEN
        CREATE POLICY "Users can insert own data"
          ON users
          FOR INSERT
          TO authenticated
          WITH CHECK (auth.uid() = id);
    END IF;
END
$$;