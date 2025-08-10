export default defineNuxtRouteMiddleware((to) => {
  // skip middleware on server
  if (import.meta.server) return;

  let isLoggedIn = useSession().load().isLoggedIn();

  if (
    ['/login', '/register'].includes(to.path) &&
    isLoggedIn &&
    to.path != '/dashboard'
  )
    return navigateTo('/dashboard');
  if (!isLoggedIn && to.path != '/login') return navigateTo('/login');
});
