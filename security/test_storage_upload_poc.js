/**
 * Proof of Concept: Storage Upload Vulnerability
 * 
 * This script demonstrates the storage upload vulnerability that existed before the security fix.
 * 
 * VULNERABILITY (BEFORE FIX):
 * - The quote-uploads bucket had a permissive INSERT policy allowing any anonymous user to upload arbitrary files
 * - No size/MIME type/count restrictions at the storage policy level
 * - Client-side validation could be bypassed
 * 
 * FIX (AFTER MIGRATION):
 * - Restrictive policy allows only specific MIME types (image/jpeg, image/png, image/webp, image/svg+xml)
 * - Maximum file size enforced (5MB)
 * - Bucket is not public-read
 * - Server-side validation via edge function
 * 
 * Usage: node test_storage_upload_poc.js
 */

const SUPABASE_URL = "https://irrapwycnkullrffoash.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlycmFwd3ljbmt1bGxyZmZvYXNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxOTU5OTEsImV4cCI6MjA5Mjc3MTk5MX0.SHrOtey-Eg-s4NldPjjKkIZh4kJx9a5Gwxu3DcwsuVI";

async function testUploadVulnerability() {
  console.log("=== Storage Upload Vulnerability PoC ===\n");

  // Test 1: Upload oversized file (50MB binary)
  console.log("Test 1: Attempting to upload 50MB binary file...");
  try {
    const largeFile = new Uint8Array(50 * 1024 * 1024); // 50MB
    const fileName = `large_test_${Date.now()}.bin`;
    
    const response = await fetch(`${SUPABASE_URL}/storage/v1/object/quote-uploads/${fileName}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/octet-stream',
      },
      body: largeFile,
    });

    if (response.ok) {
      console.log("❌ VULNERABLE: Large file upload succeeded (should be blocked)");
    } else {
      const error = await response.json();
      console.log("✅ SECURE: Large file upload blocked:", error.message || response.status);
    }
  } catch (error) {
    console.log("⚠️  Upload failed with error:", error.message);
  }

  // Test 2: Upload HTML file (should be rejected as non-image)
  console.log("\nTest 2: Attempting to upload HTML file...");
  try {
    const htmlContent = "<html><body><script>alert('XSS')</script></body></html>";
    const fileName = `malicious_${Date.now()}.html`;
    
    const response = await fetch(`${SUPABASE_URL}/storage/v1/object/quote-uploads/${fileName}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'text/html',
      },
      body: htmlContent,
    });

    if (response.ok) {
      console.log("❌ VULNERABLE: HTML file upload succeeded (should be blocked)");
    } else {
      const error = await response.json();
      console.log("✅ SECURE: HTML file upload blocked:", error.message || response.status);
    }
  } catch (error) {
    console.log("⚠️  Upload failed with error:", error.message);
  }

  // Test 3: Upload valid image (should succeed in both cases)
  console.log("\nTest 3: Attempting to upload valid image (control test)...");
  try {
    // Create a minimal valid PNG (1x1 transparent pixel)
    const pngData = new Uint8Array([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
      0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52, // IHDR chunk start
      0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, // Width: 1, Height: 1
      0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4, // Bit depth: 8, etc.
      0x89, 0x00, 0x00, 0x00, 0x0B, 0x49, 0x44, 0x41, // IDAT chunk start
      0x54, 0x78, 0xDA, 0x63, 0x64, 0x60, 0x00, 0x00, // Compressed data
      0x00, 0x02, 0x00, 0x01, 0x22, 0xBC, 0x35, 0x5A, // CRC
      0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, // IEND chunk
      0xAE, 0x42, 0x60, 0x82                          // IEND CRC
    ]);
    const fileName = `valid_test_${Date.now()}.png`;
    
    const response = await fetch(`${SUPABASE_URL}/storage/v1/object/quote-uploads/${fileName}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'image/png',
      },
      body: pngData,
    });

    if (response.ok) {
      console.log("✅ EXPECTED: Valid image upload succeeded");
    } else {
      const error = await response.json();
      console.log("❌ UNEXPECTED: Valid image upload failed:", error.message || response.status);
    }
  } catch (error) {
    console.log("⚠️  Upload failed with error:", error.message);
  }

  console.log("\n=== PoC Complete ===");
}

// Run the test
testUploadVulnerability().catch(console.error);
