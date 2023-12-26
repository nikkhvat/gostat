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

  password: "Password",

  error: "an error occurred",

  authError: "Auth error",

  invalidEmail: "Invalid email",
  maxCharacters: "{{field}} must contain at most 48 characters",
  minCharacters: "{{field}} must contain at least 8 characters",
  specialCharRegex: "{{field}} must contain a special character",
  uppercaseRegex: "{{field}} must contain a uppercase letter",
  digitRegex: "{{field}} must contain a lowercase letter",
  
  responseNotValid: "Not valid response"
};