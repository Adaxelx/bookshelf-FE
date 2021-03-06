import styles from 'bootstrap/dist/css/bootstrap.min.css';
import { MetaFunction } from 'remix';
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from 'remix';
export const meta: MetaFunction = () => {
  return { title: 'New Remix App' };
};
import stylesTailwind from './tailwind.css';

export function links() {
  return [
    { rel: 'stylesheet', href: styles },
    {
      rel: 'stylesheet',
      href: stylesTailwind,
    },
  ];
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />

        {process.env.NODE_ENV === 'development' && <LiveReload />}
      </body>
    </html>
  );
}
