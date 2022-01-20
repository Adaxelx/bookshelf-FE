import { UserCredentials } from '~/types/user';

import { client } from './client';
const url = 'user';

export const login = (data: UserCredentials): Promise<{ token: string }> => {
  return client(`${url}/login`, { body: data });
};
