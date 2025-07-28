import axios from 'axios';
import { useUserStore } from '@/store/user';
import type { Pinia } from 'pinia';
import { api } from '../app.conf.json';

const createProtectedApiInterface = (pinia?: Pinia) => {
  const user = useUserStore(pinia);
  return axios.create({
    baseURL: import.meta.env.MODE == 'development' ? api.dev : api.prod,
    headers: {
      Authorization: `Bearer ${user.accessToken}`,
    },
  });
};

export default createProtectedApiInterface;
