
-- 1. Recreate views WITHOUT security_invoker so they bypass RLS on base tables
-- This lets public users read safe columns via views while base tables are locked down

DROP VIEW IF EXISTS public.profiles_public;
CREATE VIEW public.profiles_public AS
  SELECT id, user_id, full_name, profession, bio, location, linkedin_url,
         profile_image_url, job_role, is_fresher, template_type, theme,
         technical_skills, soft_skills, design_variant, resume_url, title,
         created_at, updated_at
  FROM public.profiles;

DROP VIEW IF EXISTS public.education_public;
CREATE VIEW public.education_public AS
  SELECT id, user_id, degree, institution, year, created_at
  FROM public.education;

-- Grant access on views to both anon and authenticated
GRANT SELECT ON public.profiles_public TO anon, authenticated;
GRANT SELECT ON public.education_public TO anon, authenticated;

-- 2. Restrict base table SELECT to owner only
DROP POLICY "Users can view all profiles" ON public.profiles;
CREATE POLICY "Owner can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY "Users can view all education" ON public.education;
CREATE POLICY "Owner can view own education"
  ON public.education FOR SELECT
  USING (auth.uid() = user_id);
