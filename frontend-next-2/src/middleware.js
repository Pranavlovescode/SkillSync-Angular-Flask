import { NextResponse } from 'next/server'

export function middleware(request) {
  console.log(">> Middleware triggered")
  
  const token = request.cookies.get('SkillSyncSession')?.value
  console.log("Session token:", token)
  const isAuthenticated = !!token

  const commonRoutes = ['/auth/login', '/auth/signup', '/']
  const currentPath = request.nextUrl.pathname

  // If NOT authenticated and accessing a protected route
  if (!isAuthenticated && !commonRoutes.includes(currentPath)) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // If authenticated and trying to access login/signup page
  if (isAuthenticated && commonRoutes.includes(currentPath)) {
    return NextResponse.redirect(new URL('/main/create-post', request.url))
  }

  return NextResponse.next()
}

 
// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/', '/auth/login', '/auth/signup', '/home','/main/create-post/:path*','/main'],
}