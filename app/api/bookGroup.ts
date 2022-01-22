import { BookGroup } from '~/types/bookGroup';
import { WithToken, WithTokenAndId } from '~/types/requests';

import { client } from './client';
const url = 'bookGroup';

export const getBookGroups = ({ token, id }: WithTokenAndId): Promise<BookGroup[]> => {
  return client(`${url}/all/${id}`, { token });
};

export const createBookGroup = ({ token, body }: WithToken): Promise<BookGroup> => {
  return client(`${url}`, { token, body });
};

export const addUserToGroup = ({ token, body, id }: WithTokenAndId): Promise<BookGroup> => {
  return client(`${url}/${id}/addUser`, { token, body, method: 'PATCH' });
};
