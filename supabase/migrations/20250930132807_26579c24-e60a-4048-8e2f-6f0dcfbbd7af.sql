-- Remove the unique constraint on user_id to allow multiple portfolios per user
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_user_id_key;

-- Add a title column to help users identify their different portfolios
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS title text DEFAULT 'My Portfolio';

-- Update the handle_new_user function to create an initial portfolio with a default title
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email, title)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''), 
    NEW.email,
    'My First Portfolio'
  );
  RETURN NEW;
END;
$function$;