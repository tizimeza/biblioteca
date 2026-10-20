import { APP_COPY } from '../constants/copy';

export function HomePage() {
  return (
    <section className="home-page">
      <p className="eyebrow">{APP_COPY.ADMIN_PANEL_LABEL}</p>
      <h1>{APP_COPY.DASHBOARD_TITLE}</h1>
      <p className="home-page__lead">{APP_COPY.DASHBOARD_DESCRIPTION}</p>

      <div className="status-grid">
        <article className="status-card status-card--ready">
          <span className="status-card__icon" aria-hidden="true">✓</span>
          <div>
            <h2>{APP_COPY.SESSION_ACTIVE}</h2>
            <p>{APP_COPY.SESSION_DESCRIPTION}</p>
          </div>
          <span className="status-pill">{APP_COPY.SESSION_STATUS}</span>
        </article>
        <article className="status-card">
          <span className="status-card__icon status-card__icon--book" aria-hidden="true">▤</span>
          <div>
            <h2>{APP_COPY.CATALOG_PENDING}</h2>
            <p>{APP_COPY.CATALOG_DESCRIPTION}</p>
          </div>
          <span className="status-pill status-pill--muted">{APP_COPY.CATALOG_STATUS}</span>
        </article>
        <article className="status-card">
          <span className="status-card__icon status-card__icon--logs" aria-hidden="true">≋</span>
          <div>
            <h2>{APP_COPY.LOGS_PENDING}</h2>
            <p>{APP_COPY.LOGS_DESCRIPTION}</p>
          </div>
          <span className="status-pill status-pill--muted">{APP_COPY.LOGS_STATUS}</span>
        </article>
      </div>
      <div className="home-page__quote">
        <span aria-hidden="true">“</span>
        <p>{APP_COPY.HOME_QUOTE}</p>
        <span className="home-page__quote-mark" aria-hidden="true">✳</span>
      </div>
    </section>
  );
}
