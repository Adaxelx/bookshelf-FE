import { Alert, Button, Col, ListGroup } from 'react-bootstrap';
import {
  ActionFunction,
  Link,
  LoaderFunction,
  redirect,
  useActionData,
  useLoaderData,
  useParams,
} from 'remix';

import { deleteBookCategory, getCategories } from '~/api/bookCategory';
import { getSession } from '~/sessions';
import { BookCategory } from '~/types/bookCategory';

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
  return data;
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
  const bookCategories = useLoaderData<BookCategory[]>();
  const message = useActionData<string | undefined>();
  return (
    <>
      <h4>Zarządzanie kategoriami</h4>
      {message && <Alert variant="success">{message}</Alert>}
      <ListGroup>
        {bookCategories.map(({ id, name, isActive, wasPicked }) => (
          <ListGroup.Item
            key={id}
            as={Link}
            variant={!isActive && wasPicked ? 'secondary' : undefined}
            to={`/book-group/${bookGroupId}/categories/${id}`}
            active={isActive}
          >
            <Col className="d-flex justify-content-between align-items-center">
              {name}
              <form method="POST">
                <input type="hidden" name="categoryId" value={id} />
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
