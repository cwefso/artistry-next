// app/actions/validateImage.ts
import { unstable_cache } from 'next/cache';

export async function validateImage(url: string): Promise<boolean> {
  // Use cached results to avoid re-checking frequently
  const getCachedValidation = unstable_cache(
    async (imageUrl: string) => {
      try {
        const controller = new AbortController();
        // Timeout after 5 seconds
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch(imageUrl, { 
          method: "HEAD",
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        // Check both status and content-type
        if (!response.ok) return false;
        
        const contentType = response.headers.get('content-type');
        return contentType?.startsWith('image/') ?? false;
      } catch {
        return false;
      }
    },
    ['image-validation'],
    {
      revalidate: 86400 // Cache for 24 hours
    }
  );

  return getCachedValidation(url);
}