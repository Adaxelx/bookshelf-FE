import { LoaderFunction } from 'remix';

import { checkIfAuthorized } from '~/helpers/session';

export const loader: LoaderFunction = async ({ request }) => {
  return checkIfAuthorized(request);
};

export default function Bookshelf() {
  return (
    <div>
      <h1>Bookshelf</h1>
      Udało się zalogować!
    </div>
  );
}
