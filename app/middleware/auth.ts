export default defineNuxtRouteMiddleware(() => {
  const user = useUser();

  if (user.requireToLogin()) return navigateTo('/login');
});
