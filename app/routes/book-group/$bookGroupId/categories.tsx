import { Alert, Button, ButtonGroup, Col, ListGroup } from 'react-bootstrap';
import {
  ActionFunction,
  Link,
  LoaderFunction,
  redirect,
  useActionData,
  useLoaderData,
  useParams,
} from 'remix';

import { getBook } from '~/api/book';
import { deleteBookCategory, getCategories } from '~/api/bookCategory';
import { getSession } from '~/sessions';
import { BookCategory, BookCategoryWithBook } from '~/types/bookCategory';

export const loader: LoaderFunction = async ({ request, params }) => {
  const { bookGroupId } = params;
  if (!bookGroupId) {
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

  const booksResponse = await Promise.allSettled(
    data.map(({ id }) => getBook({ token, bookGroupId, categoryId: id }))
  );
  const books = booksResponse.filter(data => data?.status === 'fulfilled');

  return data
    .map(({ id, ...rest }) => ({
      id,
      ...rest,
      hasBook: Boolean(books.find(response => response.value.categoryId === id)),
    }))
    .sort((a, b) => (a.isActive === b.isActive ? 0 : a.isActive ? -1 : 1));
};

export const action: ActionFunction = async ({ request, params }) => {
  const session = await getSession(request.headers.get('Cookie'));
  if (!session.has('token')) {
    return redirect('/login');
  }
  const { bookGroupId } = params;
  if (!bookGroupId) {
    throw new Response('Id missing', {
      status: 404,
    });
  }
  const token = session.data.token;

  const form = await request.formData();

  const categoryId = form.get('categoryId') as string;

  const data = await deleteBookCategory({
    bookGroupId,
    token,
    bookCategoryId: categoryId,
  });

  return `Pomyslnie usunięto kategorię ${data.name}.`;
};

export default function Categories() {
  const { bookGroupId } = useParams();
  const bookCategories = useLoaderData<BookCategoryWithBook[]>();

  const message = useActionData<string | undefined>();
  return (
    <>
      <h4>Zarządzanie kategoriami</h4>
      <Button as={Link} className="mb-2" to={`/book-group/${bookGroupId}/categories/new`}>
        Dodaj nową kategorie
      </Button>
      {message && <Alert variant="success">{message}</Alert>}
      <ListGroup>
        {bookCategories.map(({ id, name, isActive, wasPicked, hasBook }) => (
          <ListGroup.Item
            key={id}
            variant={!isActive && wasPicked ? 'secondary' : undefined}
            active={isActive}
          >
            <Col className="d-flex justify-content-between align-items-center">
              {name}
              <form method="POST">
                <input type="hidden" name="categoryId" value={id} />
                <ButtonGroup>
                  {!hasBook && (
                    <Button
                      variant="secondary"
                      as={Link}
                      to={`/book-group/${bookGroupId}/categories/${id}/add-book`}
                    >
                      Dodaj ksiązkę
                    </Button>
                  )}
                  <Button
                    variant="secondary"
                    as={Link}
                    to={`/book-group/${bookGroupId}/categories/${id}`}
                  >
                    Edytuj
                  </Button>
                </ButtonGroup>
                <Button variant="danger" type="submit">
                  X
                </Button>
              </form>
            </Col>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </>
  );
}
