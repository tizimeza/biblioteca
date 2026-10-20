import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { APP_COPY } from '../constants/copy';
import { APP_ROUTES } from '../constants/routes';
import { catalogService } from '../services/catalogService';

export function BookDetailPage() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isCurrent = true;
    catalogService.getBook(id)
      .then((result) => {
        if (isCurrent) setBook(result);
      })
      .catch(() => {
        if (isCurrent) setError(APP_COPY.BOOK_NOT_FOUND);
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [id]);

  return (
    <section className="book-detail">
      <Link className="back-link" to={APP_ROUTES.CATALOG}>← {APP_COPY.BOOK_DETAIL_BACK}</Link>
      <p className="eyebrow">{APP_COPY.BOOK_DETAIL_TITLE.toLocaleUpperCase('es')}</p>
      {isLoading && <p className="catalog-feedback" role="status">{APP_COPY.CATALOG_LOADING}</p>}
      {error && <p className="catalog-feedback catalog-feedback--error" role="alert">{error}</p>}
      {!isLoading && !error && book && (
        <>
          <h1>{book.titulo}</h1>
          <p className="book-detail__year">{book.anioPublicacion}</p>
          <dl className="book-detail__list">
            <div><dt>{APP_COPY.BOOK_AUTHOR}</dt><dd>{book.autor.nombre}</dd></div>
            <div><dt>{APP_COPY.BOOK_GENRE}</dt><dd>{book.genero.nombre}</dd></div>
            <div><dt>{APP_COPY.BOOK_SAGA}</dt><dd>{book.saga?.nombre ?? APP_COPY.BOOK_SAGA_NONE}</dd></div>
            {book.saga && book.nroEnSaga && (
              <div><dt>{APP_COPY.BOOK_SAGA_NUMBER}</dt><dd>{book.nroEnSaga}</dd></div>
            )}
            <div>
              <dt>{APP_COPY.BOOK_SHELF}</dt>
              <dd>{book.estante.codigo}<span>{book.estante.ubicacion}</span></dd>
            </div>
          </dl>
        </>
      )}
    </section>
  );
}
