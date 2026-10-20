import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { BrandMark } from '../components/BrandMark';
import { APP_COPY } from '../constants/copy';
import { APP_ROUTES } from '../constants/routes';
import { useAuth } from '../context/AuthContext';
import { loginSchema } from '../validations/loginSchema';

export function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [values, setValues] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to={APP_ROUTES.HOME} replace />;
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
    setServerError('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setServerError('');

    try {
      const credentials = await loginSchema.validate(values, { abortEarly: false });
      setErrors({});
      setIsSubmitting(true);
      await login(credentials);
      navigate(APP_ROUTES.HOME, { replace: true });
    } catch (error) {
      if (error.name === 'ValidationError') {
        const nextErrors = {};
        error.inner.forEach((validationError) => {
          if (validationError.path && !nextErrors[validationError.path]) {
            nextErrors[validationError.path] = validationError.message;
          }
        });
        setErrors(nextErrors);
      } else {
        setServerError(
          error.response?.status === 401
            ? APP_COPY.INVALID_LOGIN
            : APP_COPY.AUTH_ERROR,
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-story" aria-labelledby="login-heading">
        <BrandMark />
        <div className="login-story__content">
          <p className="eyebrow">{APP_COPY.SYSTEM_LABEL}</p>
          <h1 id="login-heading">{APP_COPY.LOGIN_TITLE}</h1>
          <p className="login-story__description">{APP_COPY.LOGIN_DESCRIPTION}</p>
          <div className="book-illustration" aria-hidden="true">
            <div className="book-illustration__book book-illustration__book--one" />
            <div className="book-illustration__book book-illustration__book--two" />
            <div className="book-illustration__book book-illustration__book--three" />
            <div className="book-illustration__book book-illustration__book--four" />
            <div className="book-illustration__shelf" />
            <div className="book-illustration__plant"><span /><span /><span /></div>
          </div>
        </div>
        <p className="login-story__note">{APP_COPY.FOOTER}</p>
      </section>

      <section className="login-panel" aria-labelledby="form-heading">
        <div className="login-panel__inner">
          <p className="eyebrow">{APP_COPY.LOGIN_WELCOME}</p>
          <h2 id="form-heading">{APP_COPY.LOGIN_SECONDARY_TITLE}</h2>
          <p className="login-panel__intro">{APP_COPY.LOGIN_FORM_DESCRIPTION}</p>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <div className="form-field">
              <label htmlFor="username">{APP_COPY.USERNAME_LABEL}</label>
              <input
                autoComplete="username"
                id="username"
                name="username"
                onChange={handleChange}
                placeholder={APP_COPY.USERNAME_PLACEHOLDER}
                value={values.username}
                aria-invalid={Boolean(errors.username)}
                aria-describedby={errors.username ? 'username-error' : undefined}
              />
              {errors.username && <span className="field-error" id="username-error">{errors.username}</span>}
            </div>

            <div className="form-field">
              <label htmlFor="password">{APP_COPY.PASSWORD_LABEL}</label>
              <input
                autoComplete="current-password"
                id="password"
                name="password"
                onChange={handleChange}
                placeholder={APP_COPY.PASSWORD_PLACEHOLDER}
                type="password"
                value={values.password}
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? 'password-error' : undefined}
              />
              {errors.password && <span className="field-error" id="password-error">{errors.password}</span>}
            </div>

            {serverError && <p className="form-alert" role="alert">{serverError}</p>}

            <button className="button button--primary login-form__submit" disabled={isSubmitting} type="submit">
              {isSubmitting ? APP_COPY.LOGIN_LOADING : APP_COPY.LOGIN_BUTTON}
              {!isSubmitting && <span aria-hidden="true">→</span>}
            </button>
          </form>
          <p className="login-panel__security">
            <span aria-hidden="true">✳</span>
            {APP_COPY.ACCESS_SECURITY}
          </p>
        </div>
      </section>
    </main>
  );
}
