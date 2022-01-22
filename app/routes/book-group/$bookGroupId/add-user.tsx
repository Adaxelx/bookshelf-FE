import { Alert, Button, Card, FloatingLabel, Form } from 'react-bootstrap';
import { ActionFunction, useActionData } from 'remix';

import { addUserToGroup } from '~/api/bookGroup';
import { getSession } from '~/sessions';
import { BookGroup } from '~/types/bookGroup';

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

  const data: BookGroup = await addUserToGroup({ body: { email }, token, id: bookGroupId });

  return `Pomyślnie dodano uzytkownika z mailem ${email} do grupy ${data.name}.`;
};

export default function BookGroupForm() {
  const message = useActionData<string | undefined>();
  return (
    <Card>
      <Card.Header>
        <h3>Dodaj uzytkownika do grupy</h3>
      </Card.Header>
      <Card.Body as={Form} method="POST">
        <FloatingLabel className="mb-3" controlId="email" label="Email uzytkownika">
          <Form.Control type="text" name="email" placeholder="example@gmail.com" />
        </FloatingLabel>
        {message && <Alert variant="success">{message}</Alert>}
        <Button type="submit">Dodaj</Button>
      </Card.Body>
    </Card>
  );
}
