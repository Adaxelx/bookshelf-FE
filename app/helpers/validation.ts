export const validateEmail = (email: string) => {
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

export const validatePassword = (password: string) => password.length < 6 && 'Za krótkie hasło';
