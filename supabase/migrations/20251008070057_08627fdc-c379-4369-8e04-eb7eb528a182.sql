-- Add theme column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN theme TEXT DEFAULT 'classic' CHECK (theme IN ('classic', 'modern', 'minimal', 'dark', 'vibrant'));