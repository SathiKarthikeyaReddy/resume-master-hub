
-- Attach the version history trigger to the resumes table
CREATE TRIGGER on_resume_update_save_version
  BEFORE UPDATE ON public.resumes
  FOR EACH ROW
  EXECUTE FUNCTION public.save_resume_version();
