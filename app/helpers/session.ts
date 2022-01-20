import { json, redirect } from 'remix';

import { commitSession, getSession } from '~/sessions';

export const checkIfAuthorized = async (request: Request) => {
  const session = await getSession(request.headers.get('Cookie'));

  if (!session.has('token')) {
    // Redirect to the home page if they are already signed in.
    return redirect('/login');
  }

  const data = { error: session.get('error') };

  return json(data, {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  });
};
