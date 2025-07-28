import axios from 'axios';
import { api } from '../app.conf.json';

const defaultApiInterface = axios.create({
  baseURL: import.meta.env.MODE == 'development' ? api.dev : api.prod,
});

export default defaultApiInterface;
