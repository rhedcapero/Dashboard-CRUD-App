-- ==============================================================================
-- STUDENT MANAGEMENT SYSTEM - SUPABASE POSTGRESQL SCHEMA
-- Description: Complete SQL script to set up the students table, indexes,
--              Row Level Security (RLS) policies, and optional initial sample data.
-- ==============================================================================

-- 1. Ensure UUID extension is enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Drop existing table if recreating (optional/safe rerun)
-- DROP TABLE IF EXISTS public.students CASCADE;

-- 3. Create the `students` table
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id TEXT NOT NULL UNIQUE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    contact_number TEXT NOT NULL,
    gender TEXT NOT NULL,
    course TEXT NOT NULL,
    year_level TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create Indexes for faster searches and filtering
CREATE INDEX IF NOT EXISTS idx_students_student_id ON public.students (student_id);
CREATE INDEX IF NOT EXISTS idx_students_email ON public.students (email);
CREATE INDEX IF NOT EXISTS idx_students_course ON public.students (course);
CREATE INDEX IF NOT EXISTS idx_students_year_level ON public.students (year_level);
CREATE INDEX IF NOT EXISTS idx_students_status ON public.students (status);
CREATE INDEX IF NOT EXISTS idx_students_created_at ON public.students (created_at DESC);

-- 5. Row Level Security (RLS) Configuration
-- Enabling RLS is a Supabase best security practice
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- Note: When the Express backend connects using the SUPABASE_SERVICE_ROLE_KEY,
-- it bypasses RLS automatically. However, if using the ANON key or direct client access,
-- these policies allow appropriate CRUD access for this administrative dashboard.

-- Allow Select (Read) for all roles
CREATE POLICY "Allow public read access"
ON public.students
FOR SELECT
USING (true);

-- Allow Insert (Create) for all roles
CREATE POLICY "Allow public insert access"
ON public.students
FOR INSERT
WITH CHECK (true);

-- Allow Update for all roles
CREATE POLICY "Allow public update access"
ON public.students
FOR UPDATE
USING (true)
WITH CHECK (true);

-- Allow Delete for all roles
CREATE POLICY "Allow public delete access"
ON public.students
FOR DELETE
USING (true);

-- ==============================================================================
-- 6. Initial Sample Seed Data (Realistic Student Records for Demonstration)
-- ==============================================================================
INSERT INTO public.students (student_id, first_name, last_name, email, contact_number, gender, course, year_level, status, created_at)
VALUES
    ('2024-00108', 'Camille Anne', 'Flores', 'camille.flores@student.edu', '+63 924 890 1234', 'Female', 'BS in Hospitality Management', '2nd Year', 'Active', now() - interval '8 hours'),
    ('2024-00102', 'Maria Clara', 'Reyes', 'maria.reyes@student.edu', '+63 918 234 5678', 'Female', 'BS in Hospitality Management', '3rd Year', 'Active', now() - interval '5 days'),
    ('2024-00104', 'Bea Patricia', 'Mendoza', 'bea.mendoza@student.edu', '+63 920 456 7890', 'Female', 'BS in Criminal Justice Education', '4th Year', 'Active', now() - interval '12 days'),
    ('2024-00105', 'Mark Kenneth', 'Bautista', 'mark.bautista@student.edu', '+63 921 567 8901', 'Male', 'BS in Teacher Education', '2nd Year', 'Inactive', now() - interval '25 days'),
    ('2024-00107', 'Joshua David', 'Villanueva', 'joshua.villanueva@student.edu', '+63 923 789 0123', 'Male', 'BS in Agri Business', '3rd Year', 'Inactive', now() - interval '40 days'),
    ('2024-00101', 'Alexander', 'Santos', 'alexander.santos@student.edu', '+63 917 123 4567', 'Male', 'BS in Information Technology', '2nd Year', 'Active', now() - interval '2 days')
ON CONFLICT (student_id) DO NOTHING;
