import {
  ActionFunction,
  json,
  LinksFunction,
  LoaderFunction,
  redirect,
  useActionData,
  useLoaderData,
} from 'remix';

import { login } from '~/api/user';
import { commitSession, getSession } from '~/sessions';
import styles from '~/styles/login.css';
// TEMPLATE: https://getbootstrap.com/docs/5.1/examples/ ->  https://getbootstrap.com/docs/5.1/examples/sign-in/

export const links: LinksFunction = () => {
  return [
    {
      rel: 'stylesheet',
      href: styles,
    },
  ];
};

const validateEmail = (email: string) => {
  if (!email) {
    return 'Email jest wymagany.';
  } else if (
    !String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
  ) {
    return 'Niepoprawny adres email';
  }
};

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'));

  if (session.has('token')) {
    // Redirect to the bookshelf if logged in
    return redirect('/bookshelf');
  }

  const data = { error: session.get('error') };

  return json(data, {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  });
};

const validatePassword = (password: string) => password.length < 6 && 'Za krótkie hasło';

type ActionData = {
  formError?: string;
  fieldErrors?: {
    email: string | undefined;
    password: string | undefined;
  };
  fields?: {
    email: string;
    password: string;
  };
  backendErr: { status: string };
};

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'));

  const form = await request.formData();
  const email = form.get('email') as string;
  const password = form.get('password') as string;
  const fields = { email, password };
  if (typeof email !== 'string' || typeof password !== 'string') {
    return { formError: `Email i hasło są wymagane.` };
  }
  const fieldErrors = {
    email: validateEmail(email),
    password: validatePassword(password),
  };
  if (Object.values(fieldErrors).some(Boolean)) {
    return { fieldErrors, fields };
  }
  try {
    const data = await login({ email, password });
    session.set('token', data.token);
    return redirect('/bookshelf', {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    });
  } catch (err) {
    session.flash('error', err?.status);

    // Redirect back to the login page with errors.
    return redirect('/login', {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    });
  }
};

export default function Login() {
  const actionData = useActionData<ActionData | undefined>();
  const { error } = useLoaderData();

  return (
    <div className="login-wrapper">
      <main className="form-signin">
        <form method="POST">
          <h1 className="h3 mb-3 fw-normal">Login</h1>
          <div className="form-floating">
            <input
              type="email"
              name="email"
              className="form-control"
              id="floatingInput"
              placeholder="email@example.com"
              defaultValue={actionData?.fields?.email}
              aria-invalid={Boolean(actionData?.fieldErrors?.email) || undefined}
              aria-describedby={actionData?.fieldErrors?.email ? 'email-error' : undefined}
            />
            <label htmlFor="floatingInput">Email address</label>
            {actionData?.fieldErrors?.email ? (
              <p className="form-validation-error" role="alert" id="name-error">
                {actionData.fieldErrors.email}
              </p>
            ) : null}
          </div>
          <div className="form-floating">
            <input
              type="password"
              name="password"
              className="form-control"
              id="floatingPassword"
              placeholder="Password"
              defaultValue={actionData?.fields?.password}
              aria-invalid={Boolean(actionData?.fieldErrors?.password) || undefined}
              aria-describedby={actionData?.fieldErrors?.password ? 'password-error' : undefined}
            />
            <label htmlFor="floatingPassword">Password</label>
            {actionData?.fieldErrors?.password ? (
              <p className="form-validation-error" role="alert" id="name-error">
                {actionData.fieldErrors.password}
              </p>
            ) : null}
          </div>
          {actionData?.formError || actionData?.backendErr || error ? (
            <p className="form-validation-error" role="alert" id="name-error">
              {actionData?.formError || actionData?.backendErr?.status || error}
            </p>
          ) : null}
          <button className="w-100 btn btn-lg btn-primary" type="submit">
            Sign in
          </button>
        </form>
      </main>
    </div>
  );
}
