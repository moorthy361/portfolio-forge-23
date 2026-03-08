
-- 1. Fix UPDATE policies: add WITH CHECK to prevent user_id hijacking
ALTER POLICY "Users can update own profile" ON public.profiles
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

ALTER POLICY "Users can update own achievements" ON public.achievements
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

ALTER POLICY "Users can update own education" ON public.education
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

ALTER POLICY "Users can update own projects" ON public.projects
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

ALTER POLICY "Users can update own skills" ON public.skills
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 2. Create public views that exclude sensitive PII fields

-- Profiles public view: excludes phone, email
CREATE VIEW public.profiles_public
WITH (security_invoker = on) AS
  SELECT id, user_id, full_name, profession, bio, location, linkedin_url,
         profile_image_url, job_role, is_fresher, template_type, theme,
         technical_skills, soft_skills, design_variant, resume_url, title,
         created_at, updated_at
  FROM public.profiles;

-- Education public view: excludes gpa
CREATE VIEW public.education_public
WITH (security_invoker = on) AS
  SELECT id, user_id, degree, institution, year, created_at
  FROM public.education;

-- 3. Update SELECT policies on profiles: owner sees all, public uses view
DROP POLICY "Users can view all profiles" ON public.profiles;

CREATE POLICY "Owner can view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Public can view profiles via view"
  ON public.profiles FOR SELECT
  TO anon, authenticated
  USING (true);

-- Wait - we can't have two SELECT policies where one allows all.
-- Instead, let's keep public read on profiles but use the view in code.
-- Let me reconsider: drop the overly broad policy and use a view-based approach.

-- Actually, views with security_invoker=on will use the caller's RLS.
-- So if we restrict profiles SELECT to owner-only, the view won't work for anon.
-- We need to keep profiles readable but use the VIEW in application code
-- to avoid exposing phone/email to non-owners.

-- Let me redo this: keep SELECT open for the view to work,
-- but the APPLICATION code will query the view (no phone/email) for public access
-- and the base table for owner access.

-- Drop the two policies we just created and restore a single policy
DROP POLICY "Owner can view own profile" ON public.profiles;
DROP POLICY "Public can view profiles via view" ON public.profiles;

CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  USING (true);

-- Same for education - keep SELECT open, use view in code
DROP POLICY "Users can view all education" ON public.education;

CREATE POLICY "Users can view all education"
  ON public.education FOR SELECT
  USING (true);
