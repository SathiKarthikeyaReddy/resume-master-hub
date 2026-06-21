
-- Add explicit admin-only write policies for ads (denies anon/authenticated writes)
CREATE POLICY "Only service role can insert ads" ON public.ads FOR INSERT TO authenticated WITH CHECK (false);
CREATE POLICY "Only service role can update ads" ON public.ads FOR UPDATE TO authenticated USING (false) WITH CHECK (false);
CREATE POLICY "Only service role can delete ads" ON public.ads FOR DELETE TO authenticated USING (false);
