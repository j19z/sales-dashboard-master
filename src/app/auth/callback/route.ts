import { NextResponse } from 'next/server'
// The client you created in Step 1
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  
  // Log the full URL for debugging
  console.log('Auth Callback URL:', request.url)
  console.log('Search Params:', Object.fromEntries(searchParams.entries()))

  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  if (error) {
    console.error('Auth callback error from URL:', error, errorDescription)
    return NextResponse.redirect(`${origin}/login?message=${encodeURIComponent(errorDescription || error)}`)
  }

  if (code) {
    const supabase = await createClient()
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!exchangeError) {
      const forwardedHost = request.headers.get('x-forwarded-host') 
      const isLocalEnv = process.env.NODE_ENV === 'development'
      
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
    
    console.error('Auth exchange error:', exchangeError.message)
    return NextResponse.redirect(`${origin}/login?message=${encodeURIComponent(exchangeError.message)}`)
  }

  // return the user to an error page with instructions
  console.warn('No code or error in callback URL')
  return NextResponse.redirect(`${origin}/login?message=No code provided in callback`)
}

