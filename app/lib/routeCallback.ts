const router = useRouter();

export default async function routeCallback() {
  if (router.currentRoute.value.query.cb) {
    const queryWithoutCallback = {
      ...router.currentRoute.value.query,
      cb: undefined,
    };
    return router.push({
      path: router.currentRoute.value.query.cb.toString(),
      query: queryWithoutCallback,
    });
  }
  // fallback
  router.push('/dashboard/user');
}
