import { APP_COPY } from '../constants/copy';

export function CatalogPage() {
  return (
    <section className="home-page">
      <p className="eyebrow">{APP_COPY.NAV_CATALOG.toLocaleUpperCase('es')}</p>
      <h1>{APP_COPY.CATALOG_PENDING}</h1>
      <p className="home-page__lead">{APP_COPY.CATALOG_DESCRIPTION}</p>
      <div className="catalog-empty">
        <span aria-hidden="true">▤</span>
        <p>{APP_COPY.CATALOG_EMPTY_DESCRIPTION}</p>
      </div>
    </section>
  );
}
