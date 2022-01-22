import { BookCategory } from '~/types/bookCategory';
import { WithToken } from '~/types/requests';

import { client } from './client';
const url = 'bookGroup';

type GetAllCategoriesBody = {
  bookGroupId: string | number;
} & WithToken;

type SendBookCategory = GetAllCategoriesBody & {
  body: Partial<BookCategory>;
  bookCategoryId?: string;
};

export const getCategories = ({
  bookGroupId,
  token,
}: GetAllCategoriesBody): Promise<BookCategory[]> => {
  return client(`${url}/${bookGroupId}/bookCategory/all`, { token });
};

export const updateBookCategory = ({
  bookGroupId,
  token,
  body,
  bookCategoryId,
}: SendBookCategory): Promise<BookCategory> => {
  console.log(body);
  return client(`${url}/${bookGroupId}/bookCategory/${bookCategoryId}`, {
    token,
    body,
    method: 'PATCH',
  });
};
