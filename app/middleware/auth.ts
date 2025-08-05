export default defineNuxtRouteMiddleware(() => {
  // skip middleware on server
  if (import.meta.server) return;

  const userStore = useUserStore();
  userStore.load();

  if (!useUser().isLoggedIn()) return navigateTo('/login');
});
