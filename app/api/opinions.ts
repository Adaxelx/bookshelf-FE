import { Opinion } from '~/types/opinion';
import { WithToken } from '~/types/requests';

import { client } from './client';
const url = 'bookGroup';

type GetOpinion = {
  bookId: string | number;
} & WithToken;

export type SendOpinion = {
  body: Omit<Opinion, 'id'>;
} & GetOpinion;

export const createOpinion = ({ token, body, bookGroupId }: SendOpinion): Promise<Opinion> => {
  return client(`${url}/${bookGroupId}/opinion`, { token, body });
};

export const getOpinions = ({ token, bookGroupId, bookId }: GetOpinion): Promise<Opinion[]> => {
  return client(`${url}/${bookGroupId}/opinion/${bookId}`, { token });
};
