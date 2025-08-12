export default defineNuxtRouteMiddleware((to) => {
  // skip middleware on server
  if (import.meta.server) return;

  useAuth().load();

  let isLoggedIn = useSession().isLoggedIn();

  if (
    ['/login', '/register'].includes(to.path) &&
    isLoggedIn &&
    to.path != '/dashboard'
  )
    return navigateTo('/dashboard');
  if (!isLoggedIn && to.path != '/login') return navigateTo('/login');
});
