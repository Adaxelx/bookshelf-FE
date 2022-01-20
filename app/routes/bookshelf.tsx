import { Card, ListGroup } from 'react-bootstrap';
import { LinksFunction, LoaderFunction, redirect, useLoaderData } from 'remix';

import { getBookGroups } from '~/api/bookGroup';
import { getSession } from '~/sessions';
import styles from '~/styles/bookshelf.css';
import { BookGroup } from '~/types/bookGroup';
// TEMPLATE: https://getbootstrap.com/docs/5.1/examples/ ->  https://getbootstrap.com/docs/5.1/examples/sign-in/

export const links: LinksFunction = () => {
  return [
    {
      rel: 'stylesheet',
      href: styles,
    },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'));

  if (!session.has('token')) {
    // Redirect to the home page if they are already signed in.
    return redirect('/login');
  }

  const id = session.data.userId;
  const token = session.data.token;
  try {
    const data = await getBookGroups({ id, token });
    return data;
  } catch (err) {
    // Add Error handling
    return null;
  }
};

export default function Bookshelf() {
  const bookGroups = useLoaderData<BookGroup[] | null>();
  return (
    <main className="main__wrapper">
      <header className="bookshelf__header">
        <h1>Bookshelf</h1>
        <h2>Twój zbiór klubów książki!</h2>
      </header>
      <Card>
        <Card.Header>
          <h3>Twoje kluby książki</h3>
        </Card.Header>
        <Card.Body>
          <ListGroup>
            {bookGroups?.map(({ name, id }) => (
              <ListGroup.Item key={id}>{name}</ListGroup.Item>
            ))}
          </ListGroup>
        </Card.Body>
      </Card>
    </main>
  );
}
