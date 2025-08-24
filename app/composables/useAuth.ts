import defaultApiInterface from '~/api/default';
import type User from '~/types/api/User';
import type { Session } from '~/types/api/User';

const _users = ref<Record<string, User>>({});
const _user = ref<User | null>(null);
const _sessions = ref<Session[]>([]);
const _session = ref<Session | null>(null);

const ACTIVE_USER_KEY = 'activeUser';
const ACTIVE_SESSION_KEY = 'activeSession';
const SAVED_SESSIONS_KEY = 'sessions';
const SAVED_USERS_KEY = 'users';

export default function useAuth() {
  return {
    async login(email: string, password: string, remember: boolean) {
      const response = await defaultApiInterface<{
        user: User;
        sessionId: string;
        access_token: string;
        expires_in: string;
        refresh_token: string;
      }>({
        url: 'auth/login',
        method: 'POST',
        data: {
          email,
          password,
          remember,
        },
      });

      _sessions.value.push({
        accessToken: response.data.access_token,
        expiresIn: response.data.expires_in,
        refreshToken: response.data.refresh_token,
        active: true,
        userId: response.data.user.id,
        sessionId: response.data.sessionId,
        remember,
      });

      _users.value[response.data.sessionId] = {
        ...response.data.user,
        shops: [],
        name: `${response.data.user.firstName} ${response.data.user.lastName}`,
      };

      this.save();

      return response;
    },
    logout(sessionId: string) {
      const copyArray: Session[] = [];

      for (const session of _sessions.value) {
        if (session.sessionId == sessionId) {
          session.active = false;
          session.accessToken = null;
          // if user selected remember me while logging in. the session will be saved after logout
          // but if user didn't select remember me, the session will be deleted after logout with user data

          // save session from deleting
          if (session.remember) {
            copyArray.push(session);
            continue;
          }
          // delete user data
          if (_users.value[session.userId]) {
            const { [session.userId]: removed, ...remainingUsers } =
              _users.value;
            _users.value = remainingUsers;
          }
          continue;
        }
        copyArray.push(session);
      }
      _sessions.value = copyArray;
      this.save();
      if (_session.value?.sessionId == sessionId) this.resetCurrentSession();
    },
    getCurrentSession() {
      return _session;
    },
    getCurrentUser() {
      return _user;
    },
    getSavedUsers() {
      return _users;
    },
    getSavedSessions() {
      return _sessions;
    },
    setCurrentSession(sessionId: string) {
      _session.value =
        _sessions.value.find((session) => {
          return session.sessionId == sessionId;
        }) || _session.value;
      if (_session.value)
        _user.value = _users.value[_session.value.sessionId] || null;

      this.save();
    },
    resetCurrentSession() {
      _session.value = null;
      _user.value = null;
      this.save();
    },
    patchSession(sessionId: string, data: Partial<Session>) {
      if (sessionId == _session.value?.sessionId)
        _session.value = { ..._session.value, ...(data as Session) };
      _sessions.value.map((session) => {
        if (session.sessionId == sessionId) {
          session = { ...session, ...(data as Session) };
        }
        return session;
      });
      this.save();
    },
    patchUser(userId: string, data: Partial<User>) {
      if (userId == _user.value?.id)
        _user.value = {
          ..._user.value,
          ...(data as User),
        };
      _users.value[userId] = {
        ..._users.value[userId],
        ...(data as User),
      };
      this.save();
    },
    save() {
      if (!import.meta.client) return;
      localStorage.setItem(SAVED_SESSIONS_KEY, JSON.stringify(_sessions.value));
      localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(_session.value));
      localStorage.setItem(SAVED_USERS_KEY, JSON.stringify(_users.value));
      localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(_user.value));
    },
    load() {
      if (!import.meta.client) return;
      let __sessions = localStorage.getItem(SAVED_SESSIONS_KEY);
      let __session = localStorage.getItem(ACTIVE_SESSION_KEY);
      let __users = localStorage.getItem(SAVED_USERS_KEY);
      let __user = localStorage.getItem(ACTIVE_USER_KEY);
      if (__sessions) {
        _sessions.value = JSON.parse(__sessions);
      }
      if (__session) {
        _session.value = JSON.parse(__session);
      }
      if (__users) {
        _users.value = JSON.parse(__users);
      }
      if (__user) {
        _user.value = JSON.parse(__user);
      }
    },
  };
}
