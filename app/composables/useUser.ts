import defaultApiInterface from '~/api/default';
import type { RefreshTokenResponse } from '~/types/api/User';

export default function useUser() {
  const userStore = useUserStore();

  return {
    logout() {
      const router = useRouter();

      userStore.$reset();
      userStore.save();
      router.push('/login');
    },
    save() {},
    async refreshToken() {
      if (!this.session) return;
      return await defaultApiInterface
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
    },
    async isLoggedIn() {
      if (!this.data || !this.session) return false;
      if (new Date() > new Date(this.session.expiresIn)) {
        const res = await this.refreshToken();
        if (!res) return false;
        userStore.$patch({
          accessToken: res.data.access_token,
          expiresIn: new Date(res.data.expires_in * 1000) + '',
        });

        userStore.save();
      }
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
    data: (() => {
      if (!userStore.user || !userStore.user.id) return undefined;
      return {
        ...userStore.user,
        name: `${userStore.user.firstName} ${userStore.user.lastName}`,
      };
    })(),
    session: (() => {
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
