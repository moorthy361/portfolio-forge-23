-- Check and create missing policies for profiles
DO $$
BEGIN
  -- Drop old restrictive SELECT policy if it exists
  DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
  
  -- Create public SELECT policy if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'profiles' 
    AND policyname = 'Anyone can view profiles'
  ) THEN
    CREATE POLICY "Anyone can view profiles"
    ON public.profiles
    FOR SELECT
    USING (true);
  END IF;
END $$;

-- Update projects policies
DO $$
BEGIN
  DROP POLICY IF EXISTS "Users can manage their own projects" ON public.projects;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'projects' 
    AND policyname = 'Anyone can view projects'
  ) THEN
    CREATE POLICY "Anyone can view projects"
    ON public.projects
    FOR SELECT
    USING (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'projects' 
    AND policyname = 'Users can create their own projects'
  ) THEN
    CREATE POLICY "Users can create their own projects"
    ON public.projects
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'projects' 
    AND policyname = 'Users can update their own projects'
  ) THEN
    CREATE POLICY "Users can update their own projects"
    ON public.projects
    FOR UPDATE
    USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'projects' 
    AND policyname = 'Users can delete their own projects'
  ) THEN
    CREATE POLICY "Users can delete their own projects"
    ON public.projects
    FOR DELETE
    USING (auth.uid() = user_id);
  END IF;
END $$;

-- Update skills policies
DO $$
BEGIN
  DROP POLICY IF EXISTS "Users can manage their own skills" ON public.skills;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'skills' 
    AND policyname = 'Anyone can view skills'
  ) THEN
    CREATE POLICY "Anyone can view skills"
    ON public.skills
    FOR SELECT
    USING (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'skills' 
    AND policyname = 'Users can create their own skills'
  ) THEN
    CREATE POLICY "Users can create their own skills"
    ON public.skills
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'skills' 
    AND policyname = 'Users can update their own skills'
  ) THEN
    CREATE POLICY "Users can update their own skills"
    ON public.skills
    FOR UPDATE
    USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'skills' 
    AND policyname = 'Users can delete their own skills'
  ) THEN
    CREATE POLICY "Users can delete their own skills"
    ON public.skills
    FOR DELETE
    USING (auth.uid() = user_id);
  END IF;
END $$;

-- Update education policies
DO $$
BEGIN
  DROP POLICY IF EXISTS "Users can manage their own education" ON public.education;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'education' 
    AND policyname = 'Anyone can view education'
  ) THEN
    CREATE POLICY "Anyone can view education"
    ON public.education
    FOR SELECT
    USING (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'education' 
    AND policyname = 'Users can create their own education'
  ) THEN
    CREATE POLICY "Users can create their own education"
    ON public.education
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'education' 
    AND policyname = 'Users can update their own education'
  ) THEN
    CREATE POLICY "Users can update their own education"
    ON public.education
    FOR UPDATE
    USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'education' 
    AND policyname = 'Users can delete their own education'
  ) THEN
    CREATE POLICY "Users can delete their own education"
    ON public.education
    FOR DELETE
    USING (auth.uid() = user_id);
  END IF;
END $$;

-- Update achievements policies
DO $$
BEGIN
  DROP POLICY IF EXISTS "Users can manage their own achievements" ON public.achievements;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'achievements' 
    AND policyname = 'Anyone can view achievements'
  ) THEN
    CREATE POLICY "Anyone can view achievements"
    ON public.achievements
    FOR SELECT
    USING (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'achievements' 
    AND policyname = 'Users can create their own achievements'
  ) THEN
    CREATE POLICY "Users can create their own achievements"
    ON public.achievements
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'achievements' 
    AND policyname = 'Users can update their own achievements'
  ) THEN
    CREATE POLICY "Users can update their own achievements"
    ON public.achievements
    FOR UPDATE
    USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'achievements' 
    AND policyname = 'Users can delete their own achievements'
  ) THEN
    CREATE POLICY "Users can delete their own achievements"
    ON public.achievements
    FOR DELETE
    USING (auth.uid() = user_id);
  END IF;
END $$;