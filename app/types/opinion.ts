export type Opinion = {
  id: number;
  bookId: number;
  description: string;
  userId: number;
  rate: number;
};

export type OpinionWithUsername = {
  email: string;
} & Opinion;
