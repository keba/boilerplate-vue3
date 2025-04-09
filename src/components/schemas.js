export const metaSchema = {
  additionalProperties: false,
  properties: {
    couldBeLoggedIn: {type: 'boolean'},
    icon: {type: 'string'},
    menuUnauthenticated: {
      oneOf: [
        {type: 'boolean'},
        {type: 'integer'}
      ]
    },
    mustBeLoggedIn: {type: 'boolean'},
    publicPage: {type: 'boolean'},
    redirectMessage: {type: 'string'},
    title: {type: 'string'},
  },
  required: [
    'couldBeLoggedIn',
    'icon',
    'menuUnauthenticated',
    'mustBeLoggedIn',
    'publicPage',
    'redirectMessage',
    'title'
  ],
  title: 'router meta schema',
  type: 'object'
};
