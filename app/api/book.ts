import { Book } from '~/types/book';
import { WithToken } from '~/types/requests';

import { client } from './client';
const url = 'bookGroup';

type GetBook = {
  bookGroupId: string | number;
  categoryId: string | number;
} & WithToken;

export type SendBook = {
  body: Omit<Book, 'id' | 'categoryId'>;
} & GetBook;

export const createBook = ({ token, body, bookGroupId, categoryId }: SendBook): Promise<Book> => {
  return client(`${url}/${bookGroupId}/bookCategory/${categoryId}/book`, { token, body });
};

export const getBook = ({ token, bookGroupId, categoryId }: GetBook): Promise<Book> => {
  return client(`${url}/${bookGroupId}/bookCategory/${categoryId}/book`, { token });
};
