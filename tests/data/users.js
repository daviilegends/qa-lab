import { env } from '../support/env.js';

export const users = {
  standard: {
    email: env.STANDARD_USER_EMAIL,
    password: env.STANDARD_USER_PASSWORD,
  },
};
