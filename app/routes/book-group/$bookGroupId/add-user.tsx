import { Alert, Button, Card, FloatingLabel, Form } from 'react-bootstrap';
import { ActionFunction, LoaderFunction, redirect, useActionData } from 'remix';

import { addUserToGroup, getBookGroups } from '~/api/bookGroup';
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
      return redirect(`/book-group/${bookGroupId}`);
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
  const email = body.get('email');

  const session = await getSession(request.headers.get('Cookie'));

  const token = session.data.token;

  try {
    const data: BookGroup = await addUserToGroup({ body: { email }, token, id: bookGroupId });
    return {
      variant: 'success',
      message: `Pomyślnie dodano uzytkownika z mailem ${email} do grupy ${data.name}.`,
    };
  } catch (err) {
    return {
      message: err?.message || 'Niespodziewany błąd serwera. Spróbuj ponownie późninej',
      variant: 'danger',
    };
  }
};

export default function BookGroupForm() {
  const alert = useActionData<{ message: string; variant: string } | undefined>();
  return (
    <Card>
      <Card.Header>
        <h3>Dodaj uzytkownika do grupy</h3>
      </Card.Header>
      <Card.Body as={Form} method="POST">
        <FloatingLabel className="mb-3" controlId="email" label="Email uzytkownika">
          <Form.Control required type="text" name="email" placeholder="example@gmail.com" />
        </FloatingLabel>
        {alert && <Alert variant={alert.variant}>{alert.message}</Alert>}
        <Button type="submit">Dodaj</Button>
      </Card.Body>
    </Card>
  );
}
