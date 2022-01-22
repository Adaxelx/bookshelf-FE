import { useState } from 'react';
import { Button, Row } from 'react-bootstrap';
import { LoaderFunction, redirect, useLoaderData } from 'remix';

import { getCategories } from '~/api/bookCategory';
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
    // Redirect to the home page if they are already signed in.
    return redirect('/login');
  }

  const token = session.data.token;

  const data: BookCategory[] = await getCategories({ bookGroupId, token });
  return data.filter(({ wasPicked }) => !wasPicked);
};

export default function Index() {
  const [index, setIndex] = useState(-1);
  const bookCategories = useLoaderData<BookCategory[]>();

  const getRandom = () => {
    const randomIndex = Math.floor(Math.random() * bookCategories.length);

    setIndex(randomIndex);
  };
  return (
    <Row>
      {index !== -1 && bookCategories[index].name}
      <Button onClick={getRandom}>Wylosuj</Button>
    </Row>
  );
}
