import { Alert, Badge } from 'react-bootstrap';
import { ActionFunction, LoaderFunction, redirect, useLoaderData } from 'remix';

import { getBook } from '~/api/book';
import { getCategories, updateBookCategory } from '~/api/bookCategory';
import { getSession } from '~/sessions';
import { Book } from '~/types/book';
import { BookCategory } from '~/types/bookCategory';

export const loader: LoaderFunction = async ({ request, params }) => {
  const { bookGroupId, categoryId } = params;
  if (!bookGroupId || !categoryId) {
    throw new Response('Id missing', {
      status: 404,
    });
  }
  const session = await getSession(request.headers.get('Cookie'));

  if (!session.has('token')) {
    return redirect('/login');
  }

  const token = session.data.token;

  const data: BookCategory[] = await getCategories({ bookGroupId, token });

  const category = data.find(({ id }) => id === parseInt(categoryId));
  if (!category) {
    throw new Response('Not found', {
      status: 404,
    });
  }
  let book: Book | undefined;
  try {
    book = await getBook({ token, bookGroupId, categoryId });
  } catch (err) {}

  return { category, book };
};

export const action: ActionFunction = async ({ request, params }) => {
  const session = await getSession(request.headers.get('Cookie'));
  if (!session.has('token')) {
    return redirect('/login');
  }
  const { bookGroupId, categoryId } = params;
  if (!bookGroupId || !categoryId) {
    throw new Response('Id missing', {
      status: 404,
    });
  }
  const token = session.data.token;

  const form = await request.formData();

  const name = form.get('name') as string;
  const isActive = form.get('isActive');
  const wasPicked = form.get('wasPicked');

  try {
    await updateBookCategory({
      bookGroupId,
      token,
      body: { name, isActive: Boolean(isActive), wasPicked: Boolean(wasPicked) },
      bookCategoryId: categoryId,
    });
    return redirect(`/book-group/${bookGroupId}/categories`);
  } catch (err) {
    throw new Response(err?.message || 'Nieznany błąd', {
      status: 500,
    });
  }
};

export default function Categories() {
  const {
    category: { name, isActive, wasPicked },
    book,
  } = useLoaderData<BookCategory>();
  console.log(wasPicked);
  // const message = useActionData<string | undefined>();

  return (
    <>
      <h4>{`Kategoria ${name}`}</h4>
      <div className="mb-3">
        {isActive && <Badge>Aktywna</Badge>}
        {wasPicked && !isActive && <Badge bg="secondary">Historyczna</Badge>}
      </div>
      <h5>Wybrana ksiązka:</h5>
      {book ? (
        <div>
          <p>
            Tytuł: <span>{book.title}</span>
          </p>
          <p>
            Autor: <span>{book.author}</span>
          </p>
          <p>
            Data zaczęcia: <span>{new Date(book.dateStart).toLocaleDateString()}</span>
          </p>
          <p>
            Planowana data zakonczenia: <span>{new Date(book.dateEnd).toLocaleDateString()}</span>
          </p>
        </div>
      ) : (
        <Alert variant="info">Brak wybranej ksiąki</Alert>
      )}
    </>
  );
}
