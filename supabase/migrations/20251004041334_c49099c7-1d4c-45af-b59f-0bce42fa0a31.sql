-- Drop the restrictive SELECT policy on profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

-- Create a permissive SELECT policy to allow everyone to view all profiles
CREATE POLICY "Anyone can view profiles"
ON public.profiles
FOR SELECT
USING (true);

-- Drop the restrictive ALL policy on projects and create separate policies
DROP POLICY IF EXISTS "Users can manage their own projects" ON public.projects;

-- Allow everyone to view projects
CREATE POLICY "Anyone can view projects"
ON public.projects
FOR SELECT
USING (true);

-- Only owners can insert their own projects
CREATE POLICY "Users can create their own projects"
ON public.projects
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Only owners can update their own projects
CREATE POLICY "Users can update their own projects"
ON public.projects
FOR UPDATE
USING (auth.uid() = user_id);

-- Only owners can delete their own projects
CREATE POLICY "Users can delete their own projects"
ON public.projects
FOR DELETE
USING (auth.uid() = user_id);

-- Drop the restrictive ALL policy on skills and create separate policies
DROP POLICY IF EXISTS "Users can manage their own skills" ON public.skills;

-- Allow everyone to view skills
CREATE POLICY "Anyone can view skills"
ON public.skills
FOR SELECT
USING (true);

-- Only owners can insert their own skills
CREATE POLICY "Users can create their own skills"
ON public.skills
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Only owners can update their own skills
CREATE POLICY "Users can update their own skills"
ON public.skills
FOR UPDATE
USING (auth.uid() = user_id);

-- Only owners can delete their own skills
CREATE POLICY "Users can delete their own skills"
ON public.skills
FOR DELETE
USING (auth.uid() = user_id);

-- Drop the restrictive ALL policy on education and create separate policies
DROP POLICY IF EXISTS "Users can manage their own education" ON public.education;

-- Allow everyone to view education
CREATE POLICY "Anyone can view education"
ON public.education
FOR SELECT
USING (true);

-- Only owners can insert their own education
CREATE POLICY "Users can create their own education"
ON public.education
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Only owners can update their own education
CREATE POLICY "Users can update their own education"
ON public.education
FOR UPDATE
USING (auth.uid() = user_id);

-- Only owners can delete their own education
CREATE POLICY "Users can delete their own education"
ON public.education
FOR DELETE
USING (auth.uid() = user_id);

-- Drop the restrictive ALL policy on achievements and create separate policies
DROP POLICY IF EXISTS "Users can manage their own achievements" ON public.achievements;

-- Allow everyone to view achievements
CREATE POLICY "Anyone can view achievements"
ON public.achievements
FOR SELECT
USING (true);

-- Only owners can insert their own achievements
CREATE POLICY "Users can create their own achievements"
ON public.achievements
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Only owners can update their own achievements
CREATE POLICY "Users can update their own achievements"
ON public.achievements
FOR UPDATE
USING (auth.uid() = user_id);

-- Only owners can delete their own achievements
CREATE POLICY "Users can delete their own achievements"
ON public.achievements
FOR DELETE
USING (auth.uid() = user_id);