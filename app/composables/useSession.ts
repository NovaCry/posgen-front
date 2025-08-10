import defaultApiInterface from '~/api/default';
import type { RefreshTokenResponse, Session } from '~/types/api/User';

const _session = ref<Session | null>(null);

export default function useSession() {
  return {
    logout() {
      const router = useRouter();

      this.reset();
      this.save();
      router.push('/login');
      return this;
    },
    patch(data: Partial<Session>) {
      _session.value = { ..._session.value, ...(data as Session) };
      return this;
    },
    reset() {
      _session.value = null;
      return this;
    },
    load() {
      let session = localStorage.getItem('session');
      if (session) {
        _session.value = JSON.parse(session);
      }
      return this;
    },
    save() {
      localStorage.setItem('session', JSON.stringify(_session.value));
      return this;
    },
    async refreshToken() {
      if (!this.data) return;
      const res = await defaultApiInterface
        .post<RefreshTokenResponse>('auth/token', {
          data: {
            grant_type: 'refresh_token',
            refresh_token: this.data.refreshToken,
          },
        })
        .catch((err) => {
          console.error(err);
          return;
        });

      if (!res) return undefined;
      this.patch({
        accessToken: res.data.access_token,
        expiresIn: res.data.expires_in,
      });

      this.save();

      return res;
    },
    isLoggedIn() {
      if (!this.data) return false;
      if (new Date() > new Date(this.data.expiresIn)) return false;
      return true;
    },
    async requireToLogin() {
      if (!this.data) return true;
      if (new Date() > new Date(this.data.expiresIn)) {
        const res = await this.refreshToken();

        if (!res) return true;
      }

      return false;
    },
    data: ((): Session | null => {
      return _session.value;
    })(),
  };
}
