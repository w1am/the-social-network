interface ErrorResponse {
  field: string;
  message: string
}

export const validateUsername = (username: string): ErrorResponse[] => {
  let errors : ErrorResponse[] = []
  const illegals = /^[0-9a-zA-Z]+$/;
  if (username.length <= 2) {
    errors.push({
      field: "username",
      message: "username must be greater than 2 characters"
    })
  }
  if (!illegals.test(username)) {
    errors.push({
      field: "username",
      message: "username contains illegal characters"
    })
  }
  return errors;
};

export const validatePassword = (password: string) : ErrorResponse[] => {
  let errors : ErrorResponse[] = []
  if (password.length <= 4) {
    errors.push({
      field: "password",
      message: "password must be greater than 4 characters"
    })
  }
  return errors
}