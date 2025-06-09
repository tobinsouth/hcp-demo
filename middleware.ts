import { authkitMiddleware } from "@workos-inc/authkit-nextjs";

export default authkitMiddleware({
  middlewareAuth: {
    enabled: true,
    unauthenticatedPaths: ['/'],
  },
  redirectUri:
    process.env.VERCEL_TARGET_ENV === "preview"
      ? `https://${process.env.VERCEL_URL}/callback`
      : process.env.NEXT_PUBLIC_WORKOS_REDIRECT_URI,
});

export const config = {
  matcher: [
    // Protect all pages except:
    // - API routes (/api/*)
    // - the root page (/)
    // - static files, images, favicon, public
    '/((?!_next/static|_next/image|favicon.ico|public/|login|$).*)',
    
  ],
};
