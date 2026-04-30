-- 1. Reattach versioning trigger (defensive: drop if exists, recreate)
DROP TRIGGER IF EXISTS resume_version_trigger ON public.resumes;

CREATE TRIGGER resume_version_trigger
BEFORE UPDATE ON public.resumes
FOR EACH ROW
EXECUTE FUNCTION public.save_resume_version();

-- 2. Job applications tracker (Teal-style)
CREATE TABLE IF NOT EXISTS public.job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  location TEXT,
  url TEXT,
  status TEXT NOT NULL DEFAULT 'saved',
  applied_date DATE,
  salary TEXT,
  notes TEXT,
  resume_id UUID REFERENCES public.resumes(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own job applications"
  ON public.job_applications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own job applications"
  ON public.job_applications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own job applications"
  ON public.job_applications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own job applications"
  ON public.job_applications FOR DELETE
  USING (auth.uid() = user_id);

CREATE TRIGGER update_job_applications_updated_at
BEFORE UPDATE ON public.job_applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_job_applications_user_status ON public.job_applications(user_id, status);