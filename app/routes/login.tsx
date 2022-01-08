import { ActionFunction, LinksFunction, redirect } from 'remix';

import { login } from '~/api/user';
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

// type ActionData = {
//   formError?: string;
//   fieldErrors?: {
//     email: string | undefined;
//     password: string | undefined;
//   };
//   fields?: {
//     email: string;
//     password: string;
//   };
// };
export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const email = form.get('email');
  const password = form.get('password');
  try {
    await login({ email, password });
  } catch (err) {
    return err;
  }

  return redirect(`/`);
};
export default function Login() {
  return (
    <div className="login-wrapper">
      <main className="form-signin">
        <form method="post" action="/login">
          <h1 className="h3 mb-3 fw-normal">Login</h1>
          <div className="form-floating">
            <input
              type="email"
              name="email"
              className="form-control"
              id="floatingInput"
              placeholder="email@example.com"
            />
            <label htmlFor="floatingInput">Email address</label>
          </div>
          <div className="form-floating">
            <input
              type="password"
              name="password"
              className="form-control"
              id="floatingPassword"
              placeholder="Password"
            />
            <label htmlFor="floatingPassword">Password</label>
          </div>
          <div className="checkbox mb-3">
            <label>
              <input type="checkbox" value="remember-me" /> Remember me
            </label>
          </div>
          <button className="w-100 btn btn-lg btn-primary" type="submit">
            Sign in
          </button>
          <p className="mt-5 mb-3 text-muted">&copy; 2017–2021</p>
        </form>
      </main>
    </div>
  );
}
