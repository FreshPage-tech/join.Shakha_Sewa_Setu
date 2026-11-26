-- Enable RLS on about_us table
ALTER TABLE public.about_us ENABLE ROW LEVEL SECURITY;
-- Allow read-only access to everyone
CREATE POLICY "allow_read_all" ON public.about_us FOR SELECT USING (true);
