import { UserCredentials } from '~/types/user';

import { client } from './client';
const url = 'user';

export const login = (data: UserCredentials) => {
  return client(`${url}/login`, { body: data });
};
