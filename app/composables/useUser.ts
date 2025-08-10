import type User from '~/types/api/User';

const _user = ref<User | null>(null);

export default function useUser() {
  return {
    logout() {
      const router = useRouter();

      this.reset();
      this.save();
      router.push('/login');
      return this;
    },
    patch(data: Partial<User>) {
      _user.value = { ..._user.value, ...(data as User) };
      return this;
    },
    reset() {
      _user.value = null;
      return this;
    },
    load() {
      let user = localStorage.getItem('user');
      if (user) {
        _user.value = JSON.parse(user);
      }
      return this;
    },
    save() {
      localStorage.setItem('user', JSON.stringify(_user.value));
      return this;
    },
    data: ((): (User & { name: string }) | undefined => {
      if (!_user.value) return undefined;
      return {
        ..._user.value,
        name: `${_user.value.firstName} ${_user.value.lastName}`,
      };
    })(),
  };
}
