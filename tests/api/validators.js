// common schemas

const mfaCode = {
  mfaCode: {
    maxLength: 6,
    minLength: 6,
    pattern: '^(\\d){6,6}$',
    type: 'string'
  }
};

const password = {
  password: {
    maxLength: 512,
    minLength: 11,
    pattern: '^\\S(.){9,510}\\S$',
    type: 'string'
  }
};

const username = {
  username: {
    maxLength: 50,
    minLength: 3,
    pattern: '^[a-zA-Z\\d]((?!(\\.|-|_)(\\.|-|_))[\\w\\d\\.-]){1,49}[a-zA-Z\\d]$',
    type: 'string'
  }
};

// route schemas

const postUserLogin = {
  additionalProperties: false,
  properties: {
    ...mfaCode,
    ...password,
    ...username
  },
  required: [
    'username',
    'password'
  ],
  title: 'POST user/login',
  type: 'object'
};

export default {
  postUserLogin
};
