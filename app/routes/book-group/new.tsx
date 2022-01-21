import { Alert, Button, Card, FloatingLabel, Form } from 'react-bootstrap';
import { ActionFunction, redirect, useActionData } from 'remix';

import { createBookGroup } from '~/api/bookGroup';
import { getSession } from '~/sessions';

export const action: ActionFunction = async ({ request }) => {
  const body = await request.formData();
  const name = body.get('name');

  const session = await getSession(request.headers.get('Cookie'));
  const id = session.data.userId;
  const token = session.data.token;
  try {
    await createBookGroup({ body: { name, userId: id }, token });
    return redirect('/book-group');
  } catch (err) {
    return err?.message || 'Nieznany błąd';
  }
};

export default function BookGroupForm() {
  const message = useActionData<string | undefined>();
  return (
    <Card>
      <Card.Header>
        <h3>Nowy klub ksiązki</h3>
      </Card.Header>
      <Card.Body as={Form} method="POST">
        <FloatingLabel className="mb-3" controlId="name" label="Nazwa grupy">
          <Form.Control type="text" name="name" placeholder="Przykładowa nazwa" />
        </FloatingLabel>
        {message && <Alert variant="danger">{message}</Alert>}
        <Button type="submit">Prześlij nową grupę</Button>
      </Card.Body>
    </Card>
  );
}
