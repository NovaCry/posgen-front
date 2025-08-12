import defaultApiInterface from '~/api/default';
import type { RefreshTokenResponse, Session } from '~/types/api/User';

export default function useSession() {
  const manager = useAuth();
  const _session = manager.getCurrentSession();

  return {
    logout() {
      if (!_session.value) return;

      const router = useRouter();

      manager.logout(_session.value?.sessionId);
      router.push('/login');
      return this;
    },
    patch(data: Partial<Session>) {
      if (!_session.value?.sessionId) return;
      manager.patchSession(_session.value.sessionId, data);
      return this;
    },
    async refreshToken() {
      if (!this.data) return;
      const res = await defaultApiInterface
        .post<RefreshTokenResponse>('auth/token', {
          data: {
            grant_type: 'refresh_token',
            refresh_token: _session.value?.refreshToken,
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

      return res;
    },
    isLoggedIn() {
      if (!this.data) return false;
      if (new Date() > new Date(_session.value?.expiresIn || '')) return false;
      return true;
    },
    async requireToLogin() {
      if (!this.data) return true;
      if (new Date() > new Date(_session.value?.expiresIn || '')) {
        const res = await this.refreshToken();

        if (!res) return true;
      }

      return false;
    },
    data: _session.value,
  };
}
