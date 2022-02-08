import { Button, Card, ListGroup } from 'react-bootstrap';
import { Link, LoaderFunction, redirect, useLoaderData } from 'remix';

import { getBookGroups } from '~/api/bookGroup';
import { getSession } from '~/sessions';
import { BookGroup } from '~/types/bookGroup';

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'));

  if (!session.has('token')) {
    // Redirect to the home page if they are already signed in.
    return redirect('/login');
  }

  const id = session.data.userId;
  const token = session.data.token;
  console.log(id, token);
  try {
    const data = await getBookGroups({ id, token });
    return data;
  } catch (err) {
    // Add Error handling
    throw err;
  }
};

export default function Index() {
  const bookGroups = useLoaderData<BookGroup[] | null>();
  return (
    <Card>
      <Card.Header>
        <h3>Twoje kluby książki</h3>
        <Button variant="secondary" as={Link} to={`/book-group/new`}>
          Dodaj nowy klub!
        </Button>
      </Card.Header>
      <Card.Body>
        <ListGroup>
          {bookGroups?.map(({ name, id }) => (
            <ListGroup.Item key={id} as={Link} to={`/book-group/${id}`}>
              {name}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card.Body>
    </Card>
  );
}
