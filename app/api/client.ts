/* eslint-disable @typescript-eslint/no-explicit-any */
export function client(endpoint: string, { body, token, ...customConfig }: any = {}) {
  const headers: any = { 'content-type': 'application/json' };

  const config = {
    method: body ? 'POST' : 'GET',
    ...customConfig,
    headers: {
      Authorization: `Bearer ${token}`,
      ...headers,
      ...customConfig.headers,
    },
  };
  if (body) {
    config.body = JSON.stringify(body);
  }

  return fetch(`${process.env.REACT_APP_API_URL}/${endpoint}`, config).then(async response => {
    if (response.ok) {
      return await response.json();
    } else {
      const errorMessage = await response.json();
      throw errorMessage;
    }
  });
}
