import type { RouteLocationAsString, RouteLocationRaw } from 'vue-router';

export default function useRedirect(
  route: RouteLocationRaw,
  callback?: RouteLocationAsString
) {
  const router = useRouter();
  if (typeof route == 'string') {
    router.push({
      path: route,
      query: { cb: callback, ...router.currentRoute.value.query },
    });
  } else {
    router.push({
      query: { cb: callback, ...router.currentRoute.value.query },
      ...route,
    });
  }
}
