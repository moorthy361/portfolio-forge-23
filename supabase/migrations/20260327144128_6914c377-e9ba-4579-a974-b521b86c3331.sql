
-- Add username column to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS username text UNIQUE;

-- Create index for fast lookups
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);

-- Drop and recreate the profiles_public view to include username
DROP VIEW IF EXISTS public.profiles_public;
CREATE VIEW public.profiles_public AS
SELECT
    id,
    user_id,
    username,
    full_name,
    profession,
    bio,
    location,
    linkedin_url,
    profile_image_url,
    job_role,
    is_fresher,
    template_type,
    theme,
    technical_skills,
    soft_skills,
    design_variant,
    resume_url,
    title,
    created_at,
    updated_at
FROM profiles;
