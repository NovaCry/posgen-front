import defaultApiInterface from '~/api/default';
import type User from '~/types/api/User';
import type { RefreshTokenResponse, Session } from '~/types/api/User';

export default function useUser() {
  const userStore = useUserStore();

  return {
    logout() {
      const router = useRouter();

      userStore.$reset();
      userStore.save();
      router.push('/login');
    },
    patch(data: Partial<UserStore>) {
      userStore.$state = { ...data };
    },
    load() {
      userStore.load();
    },
    save() {
      userStore.save();
    },
    async refreshToken() {
      if (!this.session) return;
      const res = await defaultApiInterface
        .post<RefreshTokenResponse>('auth/token', {
          data: {
            grant_type: 'refresh_token',
            refresh_token: this.session.refreshToken,
          },
        })
        .catch((err) => {
          console.error(err);
          return;
        });

      if (!res) return false;
      userStore.$patch({
        accessToken: res.data.access_token,
        expiresIn: new Date(res.data.expires_in * 1000) + '',
      });

      userStore.save();
    },
    isLoggedIn() {
      if (!this.data || !this.session) return false;
      console.log(new Date(this.session.expiresIn));
      if (new Date() > new Date(this.session.expiresIn)) return false;
      return true;
    },
    async requireToLogin() {
      if (!this.data || !this.session) return true;
      if (new Date() > new Date(this.session.expiresIn)) {
        const res = await defaultApiInterface
          .post<RefreshTokenResponse>('auth/token', {
            data: {
              grant_type: 'refresh_token',
              refresh_token: this.session.refreshToken,
            },
          })
          .catch((err) => {
            console.error(err);
            return;
          });

        if (!res) return true;

        userStore.$patch({
          accessToken: res.data.access_token,
          expiresIn: new Date(res.data.expires_in * 1000) + '',
        });

        userStore.save();
      }

      return false;
    },
    data: ((): (User & { name: string }) | undefined => {
      if (!userStore.user || !userStore.user.id) return undefined;
      return {
        ...userStore.user,
        name: `${userStore.user.firstName} ${userStore.user.lastName}`,
      };
    })(),
    session: ((): Session | undefined => {
      if (
        !userStore.expiresIn ||
        !userStore.refreshToken ||
        !userStore.accessToken
      )
        return undefined;
      return {
        expiresIn: userStore.expiresIn,
        refreshToken: userStore.refreshToken,
        accessToken: userStore.accessToken,
      };
    })(),
  };
}
