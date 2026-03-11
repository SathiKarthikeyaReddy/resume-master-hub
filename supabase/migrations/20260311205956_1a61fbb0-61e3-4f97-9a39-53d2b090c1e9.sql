
CREATE TABLE public.shared_resumes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id uuid NOT NULL UNIQUE REFERENCES public.resumes(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  slug text NOT NULL UNIQUE,
  is_active boolean NOT NULL DEFAULT true,
  view_count integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.shared_resumes ENABLE ROW LEVEL SECURITY;

-- Owner can manage their shared links
CREATE POLICY "Users can manage their own shared resumes"
ON public.shared_resumes
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Anyone can read active shared resumes (for public view)
CREATE POLICY "Anyone can view active shared resumes"
ON public.shared_resumes
FOR SELECT
TO anon, authenticated
USING (is_active = true);

-- Allow anonymous users to update view count
CREATE POLICY "Anyone can increment view count"
ON public.shared_resumes
FOR UPDATE
TO anon, authenticated
USING (is_active = true)
WITH CHECK (is_active = true);

-- Allow public to read resumes that are shared
CREATE POLICY "Public can view shared resumes"
ON public.resumes
FOR SELECT
TO anon
USING (
  EXISTS (
    SELECT 1 FROM public.shared_resumes
    WHERE shared_resumes.resume_id = resumes.id
    AND shared_resumes.is_active = true
  )
);
