import type Shop from './Shop';

export default interface User {
  // Meta
  id: string;

  name: string;
  firstName: string;
  lastName?: string;
  email: string;

  role: Role;

  shops: Shop[];

  // Employee Fields
  workingId?: string;
}

export type Role = 'EMPLOYEE' | 'COURIER' | 'BUSINESS' | 'ADMIN';

export interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: 'Bearer';
  expires_in: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    isSuspended: boolean;
  };
}

export interface LoginResponse {
  success: boolean;
  message: string;
  access_token: string;
  refresh_token: string;
  expires_in: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: Role;
  };
  has3FA: boolean;
  hasSecurityPin: boolean;
  requiresPinSetup: boolean;
  requires3FA: boolean;
  sessionId: string;
  threeFactorMethods: string[];
}

interface ActiveSession {
  accessToken: string;
  active: true;
}

interface InactiveSession {
  accessToken: null;
  active: false;
}

type SessionRaw = ActiveSession | InactiveSession;

export type Session = {
  refreshToken: string;
  expiresIn: string;
  userId: string;
  sessionId: string;
  remember: boolean;
} & SessionRaw;
