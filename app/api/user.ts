import { UserCredentials, UserData } from '~/types/user';

import { client } from './client';
const url = 'user';

export const login = (data: UserCredentials): Promise<{ token: string }> => {
  return client(`${url}/login`, { body: data });
};

export const register = (data: UserData): Promise<{ token: string }> => {
  return client(`${url}/register`, { body: data });
};
