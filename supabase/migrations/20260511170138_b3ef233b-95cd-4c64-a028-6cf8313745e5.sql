-- Explicit deny policies for quote_requests to ensure submitted contact data is never readable or modifiable by clients
CREATE POLICY "Deny all reads on quote_requests"
ON public.quote_requests
FOR SELECT
TO anon, authenticated
USING (false);

CREATE POLICY "Deny all updates on quote_requests"
ON public.quote_requests
FOR UPDATE
TO anon, authenticated
USING (false)
WITH CHECK (false);

CREATE POLICY "Deny all deletes on quote_requests"
ON public.quote_requests
FOR DELETE
TO anon, authenticated
USING (false);