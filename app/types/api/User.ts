import type Shop from './Shop';

export default interface User {
  // Meta
  id: string;

  firstName: string;
  lastName?: string;
  email: string;

  password: string;

  bornDate: string;
  role: Role;

  // Default Meta
  createdAt: string;
  updatedAt: string;
  isSuspended: boolean;

  // Owned
  shops: Shop[];

  // Employee Fields
  workingIn?: Shop;
  workingId?: string;
}

export type Role = 'EMPLOYEE' | 'COURIER' | 'BUSINESS' | 'ADMIN';

export interface RefreshTokenResponse {
  access_token: string;
  token_type: 'Bearer';
  expires_in: number;
}

export interface Session {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}
