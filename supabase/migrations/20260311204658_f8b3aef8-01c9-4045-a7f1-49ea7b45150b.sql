
-- Create resume_versions table
CREATE TABLE public.resume_versions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  resume_id uuid NOT NULL REFERENCES public.resumes(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  content jsonb NOT NULL,
  version_number integer NOT NULL DEFAULT 1,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.resume_versions ENABLE ROW LEVEL SECURITY;

-- Users can view their own resume versions
CREATE POLICY "Users can view their own resume versions"
  ON public.resume_versions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can insert their own resume versions
CREATE POLICY "Users can insert their own resume versions"
  ON public.resume_versions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own resume versions
CREATE POLICY "Users can delete their own resume versions"
  ON public.resume_versions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create function to auto-save version on resume update
CREATE OR REPLACE FUNCTION public.save_resume_version()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  next_version integer;
BEGIN
  -- Get next version number
  SELECT COALESCE(MAX(version_number), 0) + 1 INTO next_version
  FROM public.resume_versions
  WHERE resume_id = OLD.id;

  -- Only save if content actually changed
  IF OLD.content IS DISTINCT FROM NEW.content THEN
    INSERT INTO public.resume_versions (resume_id, user_id, content, version_number)
    VALUES (OLD.id, OLD.user_id, OLD.content, next_version);
    
    -- Keep only last 20 versions per resume
    DELETE FROM public.resume_versions
    WHERE id IN (
      SELECT id FROM public.resume_versions
      WHERE resume_id = OLD.id
      ORDER BY version_number DESC
      OFFSET 20
    );
  END IF;

  RETURN NEW;
END;
$$;

-- Create trigger on resumes table
CREATE TRIGGER save_version_on_update
  BEFORE UPDATE ON public.resumes
  FOR EACH ROW
  EXECUTE FUNCTION public.save_resume_version();
