export const errors = {
  signUP: {
    emailExists: "email already in exists",
    loginExists: "login already in exists"
  },

  signIn: {
    inCorrect: "login or password is not correct"
  },

  passwordsDontMatch: "Passwords don't match",
  passwordNotSecure: "Password must be at least 8 characters, include an uppercase letter and a special character",

  confirmMail: {
    inValidSecret: "Invalid secret code",
    unexpectedError: "Unexpected error, failed to verify account"
  },

  passwordRecovery: {
    inValidSecret: "Invalid secret code"
  },

  error: "an error occurred"
};