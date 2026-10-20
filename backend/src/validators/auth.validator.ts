import * as yup from 'yup';

export const loginSchema = yup.object({
  username: yup.string().trim().required().max(80),
  password: yup.string().required().max(128),
}).required();
