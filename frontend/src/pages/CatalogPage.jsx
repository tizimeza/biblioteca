import { useCallback, useEffect, useState } from 'react';
import * as yup from 'yup';
import { Link } from 'react-router-dom';
import { APP_COPY } from '../constants/copy';
import { APP_ROUTES } from '../constants/routes';
import { catalogService } from '../services/catalogService';

const filterSchema = yup.object({
  autorId: yup.number().integer().positive().nullable(),
  generoId: yup.number().integer().positive().nullable(),
  anio: yup.number().integer().positive().max(new Date().getFullYear() + 1).nullable(),
});

const EMPTY_FILTERS = { autorId: '', generoId: '', anio: '' };

export function CatalogPage() {
  const [options, setOptions] = useState({ autores: [], generos: [] });
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadCatalog = useCallback(async (activeFilters = EMPTY_FILTERS) => {
    setIsLoading(true);
    setError('');
    try {
      const [filterOptions, results] = await Promise.all([
        catalogService.getBookFilterOptions(),
        catalogService.getBooks(activeFilters),
      ]);
      setOptions(filterOptions);
      setBooks(results);
    } catch {
      setError(APP_COPY.CATALOG_ERROR);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCatalog();
  }, [loadCatalog]);

  function handleChange(event) {
    setFilters((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const validatedFilters = await filterSchema.validate({
        autorId: filters.autorId || null,
        generoId: filters.generoId || null,
        anio: filters.anio || null,
      });
      const activeFilters = Object.fromEntries(
        Object.entries(validatedFilters).map(([key, value]) => [key, value ?? '']),
      );
      setFilters(activeFilters);
      await loadCatalog(activeFilters);
    } catch {
      setError(APP_COPY.FILTER_INVALID);
    }
  }

  function handleClear() {
    setFilters(EMPTY_FILTERS);
    loadCatalog(EMPTY_FILTERS);
  }

  return (
    <section className="catalog-page">
      <p className="eyebrow">{APP_COPY.NAV_CATALOG.toLocaleUpperCase('es')}</p>
      <div className="catalog-heading">
        <div>
          <h1>{APP_COPY.CATALOG_TITLE}</h1>
          <p className="home-page__lead">{APP_COPY.CATALOG_DESCRIPTION}</p>
        </div>
        {!isLoading && !error && (
          <span className="catalog-count">{books.length} {APP_COPY.CATALOG_COUNT}</span>
        )}
      </div>

      <form className="catalog-filters" onSubmit={handleSubmit}>
        <div className="catalog-filters__field">
          <label htmlFor="filter-author">{APP_COPY.FILTER_AUTHOR}</label>
          <select id="filter-author" name="autorId" onChange={handleChange} value={filters.autorId}>
            <option value="">{APP_COPY.FILTER_AUTHOR_ALL}</option>
            {options.autores.map((author) => (
              <option key={author.id} value={author.id}>{author.nombre}</option>
            ))}
          </select>
        </div>
        <div className="catalog-filters__field">
          <label htmlFor="filter-genre">{APP_COPY.FILTER_GENRE}</label>
          <select id="filter-genre" name="generoId" onChange={handleChange} value={filters.generoId}>
            <option value="">{APP_COPY.FILTER_GENRE_ALL}</option>
            {options.generos.map((genre) => (
              <option key={genre.id} value={genre.id}>{genre.nombre}</option>
            ))}
          </select>
        </div>
        <div className="catalog-filters__field catalog-filters__field--year">
          <label htmlFor="filter-year">{APP_COPY.FILTER_YEAR}</label>
          <input
            id="filter-year"
            max={new Date().getFullYear() + 1}
            min="1"
            name="anio"
            onChange={handleChange}
            placeholder={APP_COPY.FILTER_YEAR_PLACEHOLDER}
            type="number"
            value={filters.anio}
          />
        </div>
        <div className="catalog-filters__actions">
          <button className="button button--primary" disabled={isLoading} type="submit">
            {APP_COPY.FILTER_APPLY}
          </button>
          <button className="button button--quiet" disabled={isLoading} onClick={handleClear} type="button">
            {APP_COPY.FILTER_CLEAR}
          </button>
        </div>
      </form>

      {isLoading && <p className="catalog-feedback" role="status">{APP_COPY.CATALOG_LOADING}</p>}
      {error && (
        <div className="catalog-feedback catalog-feedback--error" role="alert">
          <p>{error}</p>
          <button className="button button--quiet" onClick={() => loadCatalog(filters)} type="button">
            {APP_COPY.CATALOG_RETRY}
          </button>
        </div>
      )}
      {!isLoading && !error && books.length === 0 && (
        <div className="catalog-empty">
          <span aria-hidden="true">▤</span>
          <p>{APP_COPY.CATALOG_EMPTY}</p>
        </div>
      )}
      {!isLoading && !error && books.length > 0 && (
        <div className="catalog-table-wrap">
          <table className="catalog-table">
            <thead>
              <tr>
                <th>{APP_COPY.BOOK_TITLE}</th>
                <th>{APP_COPY.BOOK_AUTHOR}</th>
                <th>{APP_COPY.BOOK_GENRE}</th>
                <th>{APP_COPY.BOOK_YEAR}</th>
                <th>{APP_COPY.BOOK_SAGA}</th>
                <th>{APP_COPY.BOOK_SHELF}</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.id}>
                  <td className="catalog-table__title">
                    <Link className="catalog-book-link" to={APP_ROUTES.BOOK_DETAIL.replace(':id', book.id)}>
                      {book.titulo}
                    </Link>
                  </td>
                  <td>{book.autor?.nombre}</td>
                  <td>{book.genero?.nombre}</td>
                  <td>{book.anioPublicacion}</td>
                  <td>{book.saga?.nombre ?? APP_COPY.BOOK_SAGA_NONE}</td>
                  <td>
                    <span className="shelf-code">{book.estante?.codigo}</span>
                    <span className="shelf-location">{APP_COPY.BOOK_SHELF_LOCATION}: {book.estante?.ubicacion}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
