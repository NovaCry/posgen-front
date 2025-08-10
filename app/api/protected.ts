import axios from 'axios';
import { api } from '../app.conf.json';

const createProtectedApiInterface = () => {
  const session = useSession();
  return axios.create({
    baseURL: import.meta.env.MODE == 'development' ? api.dev : api.prod,
    headers: {
      Authorization: `Bearer ${session.data?.accessToken}`,
    },
  });
};

export default createProtectedApiInterface;
