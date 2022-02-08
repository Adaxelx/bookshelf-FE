import { useState } from 'react';
import { Alert, Button, Form, Row } from 'react-bootstrap';
import {
  ActionFunction,
  LoaderFunction,
  redirect,
  useActionData,
  useLoaderData,
  useParams,
} from 'remix';

import { getCategories, updateBookCategory } from '~/api/bookCategory';
import { getBookGroups } from '~/api/bookGroup';
import { getSession } from '~/sessions';
import { BookCategory } from '~/types/bookCategory';
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

  const token = session.data.token;
  const id = session.data.userId;

  const bookGroupData: BookGroup[] = await getBookGroups({ id, token });
  const bookGroup = bookGroupData.find(bookGroup => bookGroup.id === parseInt(bookGroupId));

  const data: BookCategory[] = await getCategories({ bookGroupId, token });
  return {
    list: data.filter(({ wasPicked, isActive }) => !wasPicked || isActive),
    isAdmin: bookGroup?.creatorId === id,
  };
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

  try {
    const data = await updateBookCategory({
      bookGroupId,
      token,
      bookCategoryId: categoryId,
      body: { isActive: true, wasPicked: true },
    });
    return data;
  } catch (err) {
    throw new Error(err?.message);
  }
};

export default function Index() {
  const actionData = useActionData<BookCategory>();
  const { bookGroupId } = useParams();

  const { list: bookCategories, isAdmin } =
    useLoaderData<{ list: BookCategory[]; isAdmin: boolean }>();
  const [index, setIndex] = useState(() => actionData?.id || -1);
  const activeCategory = bookCategories.find(({ isActive }) => isActive);

  const getRandom = () => {
    const randomIndex = Math.floor(Math.random() * bookCategories.length);
    setIndex(randomIndex);
  };

  return (
    <Row>
      {!actionData && activeCategory && (
        <Alert variant="info">
          {`Istnieje aktywna kategoria ${activeCategory?.name}. Przed wylosowaniem kolejnej skończ ją omawiać!`}
        </Alert>
      )}
      {actionData && <Alert variant="success">{`Wylosowano: ${actionData?.name}`}</Alert>}
      {!bookCategories.length && (
        <Alert variant="info">Brak kategorii do losowania. Dodaj nowe kategorie.</Alert>
      )}
      {!isAdmin && <Alert variant="info">Nie mozesz losowac nie będąc administratorem.</Alert>}
      <Form method="POST" action={`/book-group/${bookGroupId}/?index`}>
        <Form.Control type="hidden" name="categoryId" value={bookCategories?.[index]?.id} />
        <Button
          onClick={getRandom}
          type="submit"
          disabled={!isAdmin || Boolean(activeCategory) || !bookCategories.length}
        >
          Wylosuj
        </Button>
      </Form>
    </Row>
  );
}
