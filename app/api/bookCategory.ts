import { BookCategory } from '~/types/bookCategory';
import { WithToken } from '~/types/requests';

import { client } from './client';
const url = 'bookGroup';

type GetAllCategoriesBody = {
  bookGroupId: string | number;
} & WithToken;

type DeleteBookCategory = GetAllCategoriesBody & {
  bookCategoryId?: string;
};

type SendBookCategory = DeleteBookCategory & {
  body: Partial<BookCategory>;
};

export const getCategories = ({
  bookGroupId,
  token,
}: GetAllCategoriesBody): Promise<BookCategory[]> => {
  return client(`${url}/${bookGroupId}/bookCategory/all`, { token });
};

export const createBookCategory = ({
  bookGroupId,
  token,
  body,
}: SendBookCategory): Promise<BookCategory> => {
  return client(`${url}/${bookGroupId}/bookCategory`, {
    token,
    body,
  });
};

export const updateBookCategory = ({
  bookGroupId,
  token,
  body,
  bookCategoryId,
}: SendBookCategory): Promise<BookCategory> => {
  return client(`${url}/${bookGroupId}/bookCategory/${bookCategoryId}`, {
    token,
    body,
    method: 'PATCH',
  });
};

export const deleteBookCategory = ({
  bookGroupId,
  token,
  bookCategoryId,
}: DeleteBookCategory): Promise<BookCategory> => {
  return client(`${url}/${bookGroupId}/bookCategory/${bookCategoryId}`, {
    token,
    method: 'DELETE',
  });
};
