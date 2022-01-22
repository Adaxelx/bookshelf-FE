import { Alert, Badge, Button, FloatingLabel, Form } from 'react-bootstrap';
import { ActionFunction, LoaderFunction, redirect, useActionData, useLoaderData } from 'remix';

import { getBook } from '~/api/book';
import { getCategories } from '~/api/bookCategory';
import { createOpinion, getOpinions } from '~/api/opinions';
import { getSession } from '~/sessions';
import { Book } from '~/types/book';
import { BookCategory } from '~/types/bookCategory';
import { Opinion, OpinionWithUsername } from '~/types/opinion';

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

  const category = data.find(({ id }) => id === parseInt(categoryId));
  if (!category) {
    throw new Response('Not found', {
      status: 404,
    });
  }
  let book: Book | undefined;
  try {
    book = await getBook({ token, bookGroupId, categoryId });
  } catch (err) {}
  let opinions: Opinion[] | undefined;
  if (book) {
    opinions = await getOpinions({ token, bookId: book.id });
  }
  return { category, book, opinions };
};

export const action: ActionFunction = async ({ request, params }) => {
  const { categoryId, bookGroupId } = params;
  if (!categoryId || !bookGroupId) {
    throw new Response('missing Id', { status: 404 });
  }
  const session = await getSession(request.headers.get('Cookie'));
  if (!session.has('token')) {
    return redirect('/login');
  }

  const token = session.data.token;
  const userId = session.data.userId;
  const form = await request.formData();

  const description = form.get('description') as string;
  const bookId = form.get('bookId') as string;
  const rate = form.get('rate') as string;

  try {
    await createOpinion({
      token,
      bookGroupId,
      body: { bookId: parseInt(bookId), userId, description, rate: parseInt(rate) },
    });
    return { message: `Pomyślnie dodano opinie`, variant: 'success' };
  } catch (err) {
    return {
      message: err?.message || 'Nieznany błąd',
      variant: 'danger',
      fields: { description, rate: parseInt(rate) },
    };
  }
};

type ActionResponse = {
  fields?: { description: string; rate: number };
  message: string;
  variant: string;
};

export default function Categories() {
  const {
    category: { name, isActive, wasPicked },
    book,
    opinions,
  } = useLoaderData<{ category: BookCategory; book: Book; opinions: OpinionWithUsername[] }>();

  const actionData = useActionData<ActionResponse | undefined>();

  return (
    <>
      <h4>{`Kategoria ${name}`}</h4>
      <div className="mb-3">
        {isActive && <Badge>Aktywna</Badge>}
        {wasPicked && !isActive && <Badge bg="secondary">Historyczna</Badge>}
      </div>
      <h5>Wybrana ksiązka:</h5>
      {book ? (
        <div>
          <div className="mb-4">
            <p>
              Tytuł: <span>{book.title}</span>
            </p>
            <p>
              Autor: <span>{book.author}</span>
            </p>
            <p>
              Data zaczęcia: <span>{new Date(book.dateStart).toLocaleDateString()}</span>
            </p>
            <p>
              Planowana data zakonczenia: <span>{new Date(book.dateEnd).toLocaleDateString()}</span>
            </p>
          </div>
          <div>
            <h6>Opinie:</h6>
            {opinions.length ? (
              opinions.map(({ rate, description, id, user }) => (
                <div key={id}>
                  <Badge
                    bg={rate < 3 ? 'danger' : rate < 7 ? 'warning' : 'success'}
                  >{`${rate}/10`}</Badge>
                  <p className="mb-0">{description}</p>
                  <p>
                    <i>{`~${user.name}, ${user.email}`}</i>
                  </p>
                </div>
              ))
            ) : (
              <Alert variant="info">Brak opinii</Alert>
            )}
          </div>
          {actionData && <Alert variant={actionData.variant}>{actionData.message}</Alert>}
          <Form method="POST">
            <input name="bookId" type="hidden" value={book.id} />{' '}
            <FloatingLabel className="mb-3" controlId="rate" label="Ocena">
              <Form.Control
                type="number"
                min={0}
                max={10}
                required
                name="rate"
                placeholder="Ocena"
              />
            </FloatingLabel>
            <FloatingLabel className="mb-3" controlId="description" label="Opis">
              <Form.Control
                type="description"
                name="description"
                required
                placeholder="Przykładowa nazwa"
              />
            </FloatingLabel>
            <Button type="submit">Dodaj</Button>
          </Form>
        </div>
      ) : (
        <Alert variant="info">Brak wybranej ksiąki</Alert>
      )}
    </>
  );
}
