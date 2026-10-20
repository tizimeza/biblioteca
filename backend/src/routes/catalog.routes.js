const { Router } = require('express');
const { CATALOG_ROUTES } = require('../constants/routes');
const { createCatalogController, filterOptions } = require('../controllers/catalog.controller');
const { validate } = require('../middlewares/validate');
const { getSchema, bookFiltersSchema } = require('../validators/catalog.validator');

function createResourceRoutes(resourceName) {
  const router = Router();
  const controller = createCatalogController(resourceName);
  router.get('/', validate(bookFiltersSchema, 'query'), controller.list);
  if (resourceName === 'libros') {
    router.get('/opciones-filtros', filterOptions);
  }
  router.get('/:id', controller.getById);
  router.post('/', validate(getSchema(resourceName)), controller.create);
  router.put('/:id', validate(getSchema(resourceName)), controller.update);
  router.delete('/:id', controller.remove);
  return router;
}

const librosRoutes = createResourceRoutes('libros');

const catalogRoutes = {
  [CATALOG_ROUTES.LIBROS]: librosRoutes,
  [CATALOG_ROUTES.AUTORES]: createResourceRoutes('autores'),
  [CATALOG_ROUTES.GENEROS]: createResourceRoutes('generos'),
  [CATALOG_ROUTES.SAGAS]: createResourceRoutes('sagas'),
  [CATALOG_ROUTES.ESTANTES]: createResourceRoutes('estantes'),
};

module.exports = { catalogRoutes };
