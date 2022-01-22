import { BookCategory } from '~/types/bookCategory';
import { WithToken } from '~/types/requests';

import { client } from './client';
const url = 'bookGroup';

type GetAllCategoriesBody = {
  bookGroupId: string | number;
} & WithToken;

export const getCategories = ({
  bookGroupId,
  token,
}: GetAllCategoriesBody): Promise<BookCategory[]> => {
  return client(`${url}/${bookGroupId}/bookCategory/all`, { token });
};
