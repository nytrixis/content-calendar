// import { createServerClient, type CookieOptions } from '@supabase/ssr'
// import { NextResponse, type NextRequest } from 'next/server'

// export async function middleware(request: NextRequest) {
//   let response = NextResponse.next({
//     request: {
//       headers: request.headers,
//     },
//   })

//   const supabase = createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       cookies: {
//         get(name: string) {
//           return request.cookies.get(name)?.value
//         },
//         set(name: string, value: string, options: CookieOptions) {
//           request.cookies.set({
//             name,
//             value,
//             ...options,
//           })
//           response = NextResponse.next({
//             request: {
//               headers: request.headers,
//             },
//           })
//           response.cookies.set({
//             name,
//             value,
//             ...options,
//           })
//         },
//         remove(name: string, options: CookieOptions) {
//           request.cookies.set({
//             name,
//             value: '',
//             ...options,
//           })
//           response = NextResponse.next({
//             request: {
//               headers: request.headers,
//             },
//           })
//           response.cookies.set({
//             name,
//             value: '',
//             ...options,
//           })
//         },
//       },
//     }
//   )

//   const { data: { user } } = await supabase.auth.getUser()

//   // If user is not signed in and trying to access protected routes
//   if (!user && !request.nextUrl.pathname.startsWith('/auth')) {
//     return NextResponse.redirect(new URL('/auth', request.url))
//   }

//   // If user is signed in and trying to access auth page
//   if (user && request.nextUrl.pathname.startsWith('/auth')) {
//     return NextResponse.redirect(new URL('/', request.url))
//   }

//   return response
// }

// export const config = {
//   matcher: [
//     '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
//   ],
// }
