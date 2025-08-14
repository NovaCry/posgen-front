export default defineNuxtRouteMiddleware((to) => {
  // skip middleware on server
  if (import.meta.server) return;

  useAuth().load();

  let isLoggedIn = useSession().isLoggedIn();

  if (['/login', '/register'].includes(to.path) && isLoggedIn)
    return navigateTo('/dashboard');

  if (!isLoggedIn && !['/login', '/register'].includes(to.path))
    return navigateTo('/login');
});
