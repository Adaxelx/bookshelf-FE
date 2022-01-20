import { BookGroup } from '~/types/bookGroup';
import { WithTokenAndId } from '~/types/requests';

import { client } from './client';
const url = 'bookGroup';

export const getBookGroups = ({ token, id }: WithTokenAndId): Promise<BookGroup[]> => {
  return client(`${url}/all/${id}`, { token });
};
