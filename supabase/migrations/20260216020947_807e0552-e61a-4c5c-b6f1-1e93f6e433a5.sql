
-- Add technical_skills and soft_skills columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN technical_skills text[] DEFAULT '{}'::text[];

ALTER TABLE public.profiles 
ADD COLUMN soft_skills text[] DEFAULT '{}'::text[];
