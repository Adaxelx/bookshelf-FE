import { LinksFunction, LoaderFunction, Outlet, redirect } from 'remix';

import { getSession } from '~/sessions';
import styles from '~/styles/bookshelf.css';

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

  return null;
};

export default function Bookshelf() {
  return (
    <main className="main__wrapper">
      <header className="bookshelf__header">
        <h1>Bookshelf</h1>
        <h2>Twój zbiór klubów książki!</h2>
      </header>
      <Outlet />
    </main>
  );
}
