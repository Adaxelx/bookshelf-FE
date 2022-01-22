import { UserData } from '~/types/user';

import { client } from './client';
const url = 'user';

type TokenAndId = { token: string; id: number };

export const login = (data: UserData): Promise<TokenAndId> => {
  return client(`${url}/login`, { body: data });
};

export const register = (data: UserData): Promise<TokenAndId> => {
  return client(`${url}/register`, { body: data });
};

export const getAllUsersForBookGroup = (data: TokenAndId): Promise<TokenAndId> => {
  return client(`${url}/all/${data.id}`, { token: data.token });
};
