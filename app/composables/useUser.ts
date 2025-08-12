import type User from '~/types/api/User';

export default function useUser() {
  const manager = useAuth();
  const _user = manager.getCurrentUser();

  return {
    patch(data: Partial<User>) {
      if (!_user?.id) return;
      manager.patchUser(_user.id, data);
      return this;
    },
    data: manager.getCurrentUser(),
  };
}
