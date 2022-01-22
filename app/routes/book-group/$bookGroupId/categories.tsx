import { Alert, Button, ButtonGroup, Col, ListGroup } from 'react-bootstrap';
import { ActionFunction, LoaderFunction, redirect, useActionData, useLoaderData } from 'remix';

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
  const bookCategories = useLoaderData<BookCategory[]>();
  const message = useActionData<string | undefined>();
  return (
    <>
      <h4>Zarządzanie kategoriami</h4>
      {message && <Alert variant="success">{message}</Alert>}
      <ListGroup as="ul">
        {bookCategories.map(({ id, name, isActive, wasPicked }) => (
          <ListGroup.Item key={id} as="li" active={isActive} disabled={!isActive && wasPicked}>
            <Col className="d-flex justify-content-between align-items-center">
              {name}
              <ButtonGroup>
                <Button variant="secondary">Edytuj</Button>
                <form method="POST">
                  <input type="hidden" name="categoryId" value={id} />
                  <Button variant="danger" type="submit">
                    X
                  </Button>
                </form>
              </ButtonGroup>
            </Col>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </>
  );
}
