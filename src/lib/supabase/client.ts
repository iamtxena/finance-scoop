import { createBrowserClient } from '@supabase/ssr';
import { useAuth } from '@clerk/nextjs';

/**
 * Create a Supabase client for browser use
 *
 * Note: This client is not authenticated with Clerk JWT by default.
 * For RLS-protected operations, use API routes with the server client instead.
 *
 * If you need to use this client directly with RLS, use the `useSupabaseClient` hook below.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

/**
 * React hook to create an authenticated Supabase client with Clerk JWT
 *
 * Usage in a React component:
 * ```tsx
 * const supabase = useSupabaseClient();
 * ```
 *
 * This client will automatically include the Clerk JWT token for RLS authentication.
 */
export function useSupabaseClient() {
  const { getToken } = useAuth();

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        fetch: async (url, options = {}) => {
          // Get Clerk session token with Supabase template for RLS
          const supabaseToken = await getToken({ template: 'supabase' });

          // Add Authorization header if token exists
          const headers = new Headers(options.headers);
          if (supabaseToken) {
            headers.set('Authorization', `Bearer ${supabaseToken}`);
          }

          return fetch(url, {
            ...options,
            headers,
          });
        },
      },
    }
  );
}
