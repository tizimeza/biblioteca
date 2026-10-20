import * as yup from 'yup';
import { APP_COPY } from '../constants/copy';

export const loginSchema = yup.object({
  username: yup
    .string()
    .trim()
    .required(APP_COPY.REQUIRED_FIELD)
    .max(80, APP_COPY.INVALID_LOGIN),
  password: yup
    .string()
    .required(APP_COPY.REQUIRED_FIELD)
    .max(128, APP_COPY.INVALID_LOGIN),
});
