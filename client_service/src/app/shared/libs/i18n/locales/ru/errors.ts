export const errors = {
  signUP: {
    emailExists: "Такой почта уже существует",
    loginExists: "Такой логин уже существует"
  },

  signIn: {
    inCorrect: "Логин или пароль не верный"
  },

  passwordsDontMatch: "Пароли не совпадают",
  passwordNotSecure: "Пароль должен содержать не менее 8 символов, включая заглавную букву и специальный символ",

  confirmMail: {
    inValidSecret: "Не верный секретный код",
    unexpectedError: "Неизвестная ошибка, не удалось верефецировать аккаунт"
  },

  passwordRecovery: {
    inValidSecret: "Не верный секретный код"
  },

  error: "Неизвестная ошибка"
};