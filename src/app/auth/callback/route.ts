import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const token_hash = searchParams.get('token_hash')
    const type = searchParams.get('type')
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/'

    console.log('Callback params:', {
        token_hash: !!token_hash,
        type,
        code: code ? code.substring(0, 8) + '...' : null,
        next
    })

    // Handle email verification with token_hash (old method)
    if (token_hash && type) {
        const supabase = await createClient()
        const { error } = await supabase.auth.verifyOtp({
            type: type as any,
            token_hash,
        })

        if (!error) {
            console.log('Token hash verification successful')
            return NextResponse.redirect(`${origin}${next}`)
        } else {
            console.error('OTP verification error:', error)
            return NextResponse.redirect(`${origin}/auth/auth-code-error?error=${encodeURIComponent(error.message)}`)
        }
    }

    // Handle PKCE code exchange (new method used by Supabase)
    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error) {
            console.log('Code exchange successful')
            return NextResponse.redirect(`${origin}${next}`)
        } else {
            console.error('Code exchange error:', error)
            return NextResponse.redirect(`${origin}/auth/auth-code-error?error=${encodeURIComponent(error.message)}`)
        }
    }

    // No valid parameters found
    console.error('Callback called without valid parameters')
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
