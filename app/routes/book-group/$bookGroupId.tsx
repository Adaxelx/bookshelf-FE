import { Card } from 'react-bootstrap';
import { LoaderFunction, redirect, useLoaderData } from 'remix';

import { getBookGroups } from '~/api/bookGroup';
import { getSession } from '~/sessions';
import { BookGroup } from '~/types/bookGroup';

export const loader: LoaderFunction = async ({ request, params }) => {
  const { bookGroupId } = params;
  const session = await getSession(request.headers.get('Cookie'));

  if (!session.has('token')) {
    // Redirect to the home page if they are already signed in.
    return redirect('/login');
  }

  const id = session.data.userId;
  const token = session.data.token;

  try {
    const data: BookGroup[] = await getBookGroups({ id, token });
    return data.find(bookGroup => bookGroup.id === parseInt(bookGroupId));
  } catch (err) {
    return null;
  }
  return null;
};

export default function BookGroupView() {
  const bookGroup = useLoaderData<BookGroup | null>();
  return (
    <Card>
      <Card.Header>
        <h3>{bookGroup.name}</h3>
      </Card.Header>
      <Card.Body></Card.Body>
    </Card>
  );
}
