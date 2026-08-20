# Legitimate Contact Form Flow Validation

## Testing Plan

To validate that the legitimate contact form flow still works after all security changes, the following tests should be performed:

### 1. Client-Side Form Validation
- [ ] Form submission with valid data should proceed normally
- [ ] Form submission with invalid data should show appropriate errors
- [ ] File upload UI should still allow selecting images
- [ ] Client-side file validation (size/type) should still work as UX enhancement

### 2. Server-Side Upload Functionality
- [ ] Legitimate image uploads should succeed through the new edge function
- [ ] The upload function should properly validate file types and sizes
- [ ] Uploaded files should be stored in the quote-uploads bucket
- [ ] The function should return proper file paths for subsequent processing

### 3. Quote Request Submission
- [ ] Valid quote requests should be accepted by the send-quote-request function
- [ ] The function should properly save data to the quote_requests table
- [ ] The function should generate signed URLs for uploaded images
- [ ] The function should send emails via Resend API
- [ ] The honeypot field should not affect legitimate users (left empty)

### 4. CORS Functionality
- [ ] Requests from https://zapsitestudio.com should succeed
- [ ] Requests from localhost (development) should succeed
- [ ] OPTIONS preflight requests should be handled correctly

### 5. Rate Limiting
- [ ] Legitimate users within rate limits should succeed
- [ ] Rate limit should reset after the time window
- [ ] Rate limit headers should be returned appropriately

### 6. Integration Testing
The complete flow should be tested:
1. User fills out contact form with valid data
2. User uploads images (logo, product images)
3. User submits form
4. Images are uploaded via secure edge function
5. Quote request is submitted with image paths
6. Data is saved to database
7. Email is sent with signed image URLs

## Manual Testing Instructions

### Prerequisites
1. Ensure Supabase migration has been applied
2. Ensure edge functions are deployed
3. Ensure environment variables are properly configured
4. Ensure Resend API is configured

### Test Steps

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Navigate to Contact Form**
   - Open http://localhost:5173
   - Navigate to the contact section

3. **Test Valid Submission**
   - Fill in all required fields with valid data
   - Upload a small test image (under 5MB, valid format)
   - Submit the form
   - Verify success message appears
   - Check email receipt

4. **Test File Upload Validation**
   - Try uploading a file larger than 5MB (should be rejected)
   - Try uploading a non-image file (should be rejected)
   - Try uploading a valid image (should succeed)

5. **Test Rate Limiting**
   - Submit form successfully 3 times
   - 4th submission should be rate-limited
   - Wait 1 hour and try again (should succeed)

6. **Test Honeypot**
   - The honeypot field is hidden from users
   - Normal users won't fill it (form should work)
   - Bots that fill it will be silently rejected

## Expected Results

All legitimate use cases should continue to function normally:
- ✅ Valid form submissions succeed
- ✅ Valid image uploads work
- ✅ Emails are sent successfully
- ✅ User experience is unchanged
- ✅ Security improvements are transparent to legitimate users

## Security Validation

The PoC scripts should demonstrate:
- ❌ Malicious uploads (large files, non-images) are now blocked
- ❌ Cross-origin requests from unauthorized domains are blocked
- ❌ Excessive submissions are rate-limited
- ✅ Legitimate requests from authorized origins work normally

## Notes

- The client-side validation in ProjectQuestionnaire.tsx remains as UX enhancement
- Server-side validation provides the actual security
- CORS restrictions allow for development (localhost) and production (zapsitestudio.com)
- Rate limiting uses in-memory storage (suitable for Deno edge functions)
- The .env file is now properly excluded from version control
