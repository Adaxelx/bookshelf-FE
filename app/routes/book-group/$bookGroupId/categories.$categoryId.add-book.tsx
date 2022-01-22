// id: number;
//     categoryId: number;
//     title: string;
//     author: string;
//     dateStart: Date;
//     dateEnd: Date;

import { Alert, Button, Card, FloatingLabel, Form } from 'react-bootstrap';
import { ActionFunction, LoaderFunction, redirect, useActionData, useLoaderData } from 'remix';

import { createBook, SendBook } from '~/api/book';
import { getCategories } from '~/api/bookCategory';
import { getSession } from '~/sessions';
import { BookCategory } from '~/types/bookCategory';

export const loader: LoaderFunction = async ({ request, params }) => {
  const { bookGroupId, categoryId } = params;
  if (!bookGroupId || !categoryId) {
    throw new Response('Id missing', {
      status: 404,
    });
  }
  const session = await getSession(request.headers.get('Cookie'));

  if (!session.has('token')) {
    return redirect('/login');
  }

  const token = session.data.token;

  const data: BookCategory[] = await getCategories({ bookGroupId, token });
  const category = data.find(category => category.id === parseInt(categoryId));
  if (!category) {
    throw new Response('Id missing', {
      status: 404,
    });
  }
  return { name: category.name };
};

export const action: ActionFunction = async ({ request, params }) => {
  const { bookGroupId, categoryId } = params;
  if (!bookGroupId || !categoryId) {
    throw new Response('Id missing', {
      status: 404,
    });
  }
  const body = await request.formData();
  const title = body.get('title') as string;
  const author = body.get('author') as string;
  const dateStart = body.get('dateStart') as string;
  const dateEnd = body.get('dateEnd') as string;

  const session = await getSession(request.headers.get('Cookie'));
  const bodyData = { title, author, dateStart, dateEnd };
  const token = session.data.token;
  try {
    await createBook({
      body: bodyData,
      bookGroupId,
      categoryId,
      token,
    });
    return redirect(`/book-group/${bookGroupId}/categories`);
  } catch (err) {
    return { message: err?.message || 'Nieznany błąd', body: bodyData };
  }
};

export default function BookForm() {
  const actionData = useActionData<{ message: string; body: SendBook }>();

  const { name } = useLoaderData<Pick<BookCategory, 'name' | 'id'>>();
  return (
    <Card>
      <Card.Header>
        <h3>{`Dodaj ksiązke do kategorii ${name}`}</h3>
      </Card.Header>
      <Card.Body as={Form} method="POST">
        <FloatingLabel className="mb-3" controlId="title" label="Tytuł ksiązki">
          <Form.Control
            type="text"
            name="title"
            required
            placeholder="Przykladowy tytuł"
            defaultValue={actionData?.body.title}
          />
        </FloatingLabel>
        <FloatingLabel className="mb-3" controlId="author" label="Autor">
          <Form.Control
            type="text"
            required
            name="author"
            placeholder="Jan ..."
            defaultValue={actionData?.body.author}
          />
        </FloatingLabel>
        <FloatingLabel className="mb-3" controlId="dateStart" label="Data rozpoczęcia czytania">
          <Form.Control
            required
            type="date"
            name="dateStart"
            defaultValue={actionData?.body.dateStart}
          />
        </FloatingLabel>
        <FloatingLabel className="mb-3" controlId="dateEnd" label="Planowana data zakończenia">
          <Form.Control
            required
            type="date"
            name="dateEnd"
            defaultValue={actionData?.body.dateEnd}
          />
        </FloatingLabel>
        {actionData?.message && <Alert variant="danger">{actionData.message}</Alert>}
        <Button type="submit">Prześlij</Button>
      </Card.Body>
    </Card>
  );
}
