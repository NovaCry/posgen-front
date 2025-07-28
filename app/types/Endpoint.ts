export interface Endpoint {
  method: Method;
  url: string;
  locked?: boolean;
}

export type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS';
