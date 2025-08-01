import defaultApiInterface from '@/api/default';
import type User from '@/types/api/User';
import type { RefreshTokenResponse } from '@/types/api/User';
import { defineStore } from 'pinia';
import { useSelectedShopStore } from './shop';

// const router = useRouter();

export interface UserStore {
  user?: User;
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: string;
}

export const useUserStore = defineStore('user', {
  state: (): UserStore => ({
    user: undefined,
    accessToken: undefined,
    refreshToken: undefined,
    expiresIn: undefined,
  }),
  actions: {
    save() {
      localStorage.setItem('user', JSON.stringify(this.$state));
    },

    load() {
      const user = localStorage.getItem('user');
      if (user) {
        this.$patch(JSON.parse(user));
      }
    },

    logout() {
      this.flush();
      const selectedShop = useSelectedShopStore();
      selectedShop.flush();
      // router.push('/login');
    },

    flush() {
      this.$reset();
      this.save();
    },

    async requireToLogin() {
      if (
        !this.expiresIn ||
        !this.user ||
        !this.refreshToken ||
        !this.accessToken
      )
        return true;
      if (new Date() > new Date(this.expiresIn)) {
        const res = await defaultApiInterface
          .post<RefreshTokenResponse>('auth/token', {
            data: {
              grant_type: 'refresh_token',
              refresh_token: this.refreshToken,
            },
          })
          .catch((err) => {
            console.error(err);
            return;
          });

        if (!res) return true;

        this.$patch({
          accessToken: res.data.access_token,
          expiresIn: new Date(res.data.expires_in * 1000) + '',
        });

        this.save();
      }

      return false;
    },
  },
});
