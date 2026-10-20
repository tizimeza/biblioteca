const yup = require('yup');
const { MESSAGES } = require('../constants/messages');

const positiveInteger = (label) => yup
  .number()
  .transform((value, originalValue) => originalValue === '' ? undefined : value)
  .typeError(`${label} debe ser un número entero.`)
  .integer(`${label} debe ser un número entero.`)
  .positive(`${label} debe ser mayor que cero.`);

const schemas = {
  autores: yup.object({
    nombre: yup.string().trim().required().max(150),
    nacionalidad: yup.string().trim().max(100).nullable().optional(),
  }).required(),
  generos: yup.object({
    nombre: yup.string().trim().required().max(100),
  }).required(),
  sagas: yup.object({
    nombre: yup.string().trim().required().max(150),
  }).required(),
  estantes: yup.object({
    codigo: yup.string().trim().required().max(50),
    ubicacion: yup.string().trim().required().max(150),
  }).required(),
  libros: yup.object({
    titulo: yup.string().trim().required().max(200),
    anioPublicacion: positiveInteger('El año').max(new Date().getFullYear() + 1),
    nroEnSaga: positiveInteger('El número de saga').nullable().optional(),
    autorId: positiveInteger('El autor').required(),
    generoId: positiveInteger('El género').required(),
    estanteId: positiveInteger('El estante').required(),
    sagaId: positiveInteger('La saga').nullable().optional(),
  }).required(),
};

const bookFiltersSchema = yup.object({
  autorId: positiveInteger('El filtro de autor').optional(),
  generoId: positiveInteger('El filtro de género').optional(),
  anio: positiveInteger('El filtro de año').max(new Date().getFullYear() + 1).optional(),
}).noUnknown().required();

function getSchema(resourceName) {
  const schema = schemas[resourceName];
  if (!schema) {
    throw new Error(`${MESSAGES.RESOURCE_NOT_FOUND} ${resourceName}`);
  }
  return schema;
}

module.exports = { getSchema, bookFiltersSchema };
