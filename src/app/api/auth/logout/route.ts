import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    // Create a response object that we can modify
    const res = NextResponse.redirect(new URL('/login', req.url), {
        status: 302,
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return req.cookies.get(name)?.value;
                },
                set(name: string, value: string, options: CookieOptions) {
                    // The `set` method on the response cookies will update the response headers
                    res.cookies.set({ name, value, ...options });
                },
                remove(name: string, options: CookieOptions) {
                    // The `set` method with an empty value and past expiry will remove the cookie
                    res.cookies.set({ name, value: '', ...options });
                },
            },
        }
    );

    // Sign out the user. This will automatically remove the cookies via the methods above.
    await supabase.auth.signOut();

    // Return the response with the cleared cookies
    return res;
}