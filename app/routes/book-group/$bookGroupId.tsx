import { Card, Nav } from 'react-bootstrap';
import { LoaderFunction, Outlet, redirect, useLoaderData } from 'remix';

import { getBookGroups } from '~/api/bookGroup';
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
    // Redirect to the home page if they are already signed in.
    return redirect('/login');
  }

  const id = session.data.userId;
  const token = session.data.token;

  const data: BookGroup[] = await getBookGroups({ id, token });
  const name = data.find(bookGroup => bookGroup.id === parseInt(bookGroupId))?.name;

  if (name && bookGroupId) {
    return { name, bookGroupId };
  }

  throw new Response('Not Found', {
    status: 404,
  });
};

export default function BookGroupView() {
  const { name, bookGroupId } = useLoaderData<{ name: string; bookGroupId: string }>();
  return (
    <Card>
      <Card.Header>
        <h3>{name}</h3>
        <Nav defaultActiveKey={`/book-group/${bookGroupId}/addUser`}>
          <Nav.Item>
            <Nav.Link href={`/book-group/${bookGroupId}/addUser`}>Dodaj uzytkownika</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href={`/book-group/${bookGroupId}/categories`}>
              Zarzadzaj kategoriami
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href={`/book-group/${bookGroupId}/history`}>Historia losowań</Nav.Link>
          </Nav.Item>
        </Nav>
      </Card.Header>
      <Card.Body>
        <Outlet />
        {/* {bookGroups?.map(({ name, id }) => (
            <ListGroup.Item key={id} as={Link} to={`/book-group/${id}`}>
              {name}
            </ListGroup.Item>
          ))} */}

        {/* 1. Wylosuj kategorie na stronie. X 2. Nawigacja - dodaj uzytkownika, zarzadzaj kategoriami, historia losowań X */}
        {/* 2. Dodaj uzytkownika - poprostu formularz */}
        {/* 3. Zarządzanie kategoriami - takie accordiony rozwijane(lub moze lista i tam przyciski z modalami) na listę dodawanie edycje */}
        {/* 4. Historia losowań - pofiltrowanie po wasActive kategorie*/}
        {/* 5. Blokada po froncie - nie mozna losowac gdy jakakolwiek kategoria jest na wasActive */}
      </Card.Body>
    </Card>
  );
}
