export type BookCategory = {
  id: number;
  bookGroupId: number;
  name: string;
  isActive: boolean;
  wasPicked: boolean;
};

export type BookCategoryWithBook = {
  hasBook: boolean;
} & BookCategory;
