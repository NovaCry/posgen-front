import type { RouteLocationAsString, RouteLocationRaw } from 'vue-router';

const router = useRouter();

export default function redirectProperly(
  route: RouteLocationRaw,
  callback?: RouteLocationAsString
) {
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
