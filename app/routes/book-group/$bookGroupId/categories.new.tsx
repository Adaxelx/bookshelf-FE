import { Alert, Button, Card, FloatingLabel, Form } from 'react-bootstrap';
import { ActionFunction, LoaderFunction, redirect, useActionData } from 'remix';

import { createBookCategory } from '~/api/bookCategory';
import { getBookGroups } from '~/api/bookGroup';
import { getSession } from '~/sessions';
import { getSession } from '~/sessions';
import { BookGroup } from '~/types/bookGroup';

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
  const id = session.data.userId;

  const bookGroupData: BookGroup[] = await getBookGroups({ id, token });
  const bookGroup = bookGroupData.find(bookGroup => bookGroup.id === parseInt(bookGroupId));

  if (bookGroup && bookGroupId) {
    const { creatorId } = bookGroup;

    if (creatorId !== id) {
      return redirect(`/book-group/${bookGroupId}/drawn`);
    }
  }

  return null;
};

export const action: ActionFunction = async ({ request, params }) => {
  const { bookGroupId } = params;
  if (!bookGroupId) {
    throw new Response('Id missing', {
      status: 404,
    });
  }
  const body = await request.formData();
  const name = body.get('name');

  const session = await getSession(request.headers.get('Cookie'));

  const token = session.data.token;
  try {
    await createBookCategory({ body: { name }, bookGroupId, token });
    return redirect(`/book-group/${bookGroupId}/categories`);
  } catch (err) {
    return err?.message || 'Nieznany błąd';
  }
};

export default function BookGroupForm() {
  const message = useActionData<string | undefined>();
  return (
    <Card>
      <Card.Header>
        <h3>Nowa kategoria</h3>
      </Card.Header>
      <Card.Body as={Form} method="POST">
        <FloatingLabel className="mb-3" controlId="name" label="Nazwa kategorii">
          <Form.Control type="text" name="name" placeholder="Przykładowa nazwa" />
        </FloatingLabel>
        {message && <Alert variant="danger">{message}</Alert>}
        <Button type="submit">Prześlij</Button>
      </Card.Body>
    </Card>
  );
}
