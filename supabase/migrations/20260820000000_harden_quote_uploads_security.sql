-- Drop the permissive policy
DROP POLICY IF EXISTS "Anyone can upload quote images" ON storage.objects;

-- Create a restrictive policy that only allows image uploads with specific MIME types
CREATE POLICY "Restrict quote uploads to images only"
ON storage.objects
FOR INSERT
TO anon, authenticated
WITH CHECK (
  bucket_id = 'quote-uploads' 
  AND (
    (lower(right(name, 4)) = '.jpg' AND (metadata->>'mimetype') = 'image/jpeg')
    OR (lower(right(name, 5)) = '.jpeg' AND (metadata->>'mimetype') = 'image/jpeg')
    OR (lower(right(name, 4)) = '.png' AND (metadata->>'mimetype') = 'image/png')
    OR (lower(right(name, 5)) = '.webp' AND (metadata->>'mimetype') = 'image/webp')
    OR (lower(right(name, 4)) = '.svg' AND (metadata->>'mimetype') = 'image/svg+xml')
  )
  AND (metadata->>'size')::bigint <= 5242880 -- Max 5MB
);

-- Ensure no SELECT policy exists for anon on quote-uploads bucket
DROP POLICY IF EXISTS "Allow anon to read quote uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated to read quote uploads" ON storage.objects;

-- Ensure bucket is not public (public = false) and has size/MIME restrictions
-- This handles both existing buckets and ensures proper configuration
DO $$
BEGIN
  -- Update bucket to be private with restrictions
  UPDATE storage.buckets 
  SET 
    public = false,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
  WHERE id = 'quote-uploads';
  
  -- If bucket doesn't exist, create it with proper restrictions
  IF NOT FOUND THEN
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES ('quote-uploads', 'quote-uploads', false, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']);
  END IF;
END $$;
