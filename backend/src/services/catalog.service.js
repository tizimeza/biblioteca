const { AppDataSource } = require('../config/data-source');
const { HTTP_STATUS } = require('../constants/http');
const { MESSAGES } = require('../constants/messages');
const { Autor } = require('../entities/Autor');
const { Estante } = require('../entities/Estante');
const { Genero } = require('../entities/Genero');
const { Libro } = require('../entities/Libro');
const { Saga } = require('../entities/Saga');
const { AppError } = require('../utils/AppError');

const RESOURCES = {
  autores: { entity: Autor, relations: ['libros'] },
  generos: { entity: Genero, relations: ['libros'] },
  sagas: { entity: Saga, relations: ['libros'] },
  estantes: { entity: Estante, relations: ['libros'] },
  libros: { entity: Libro, relations: ['autor', 'genero', 'saga', 'estante'] },
};

const RELATED_ENTITIES = {
  autorId: { entity: Autor, relation: 'autor' },
  generoId: { entity: Genero, relation: 'genero' },
  estanteId: { entity: Estante, relation: 'estante' },
  sagaId: { entity: Saga, relation: 'saga', optional: true },
};

function getResource(resourceName) {
  const resource = RESOURCES[resourceName];
  if (!resource) {
    throw new AppError(MESSAGES.RESOURCE_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }
  return resource;
}

function parseId(value) {
  const id = Number(value);
  if (!Number.isSafeInteger(id) || id < 1) {
    throw new AppError(MESSAGES.INVALID_ID, HTTP_STATUS.BAD_REQUEST);
  }
  return id;
}

function normalizeInput(resourceName, body) {
  if (resourceName !== 'libros') {
    return body;
  }

  const input = { ...body };
  for (const [field, configuration] of Object.entries(RELATED_ENTITIES)) {
    const value = input[field];
    delete input[field];
    if (value === undefined || value === null) {
      if (configuration.optional) {
        input[configuration.relation] = null;
      }
      continue;
    }
    input[configuration.relation] = { id: parseId(value) };
  }
  return input;
}

async function assertRelatedEntitiesExist(resourceName, body) {
  if (resourceName !== 'libros') {
    return;
  }

  for (const [field, configuration] of Object.entries(RELATED_ENTITIES)) {
    const id = body[field];
    if (id === undefined || id === null) {
      if (configuration.optional) {
        continue;
      }
      throw new AppError(MESSAGES.RELATED_RESOURCE_NOT_FOUND, HTTP_STATUS.BAD_REQUEST, { field });
    }

    const relatedEntity = await AppDataSource.getRepository(configuration.entity).findOneBy({ id });
    if (!relatedEntity) {
      throw new AppError(MESSAGES.RELATED_RESOURCE_NOT_FOUND, HTTP_STATUS.BAD_REQUEST, { field, id });
    }
  }
}

async function list(resourceName, filters = {}) {
  if (resourceName === 'libros') {
    const query = AppDataSource.getRepository(Libro)
      .createQueryBuilder('libro')
      .leftJoinAndSelect('libro.autor', 'autor')
      .leftJoinAndSelect('libro.genero', 'genero')
      .leftJoinAndSelect('libro.saga', 'saga')
      .leftJoinAndSelect('libro.estante', 'estante')
      .orderBy('libro.titulo', 'ASC');

    if (filters.generoId) query.andWhere('genero.id = :generoId', { generoId: filters.generoId });
    if (filters.autorId) query.andWhere('autor.id = :autorId', { autorId: filters.autorId });
    if (filters.anio) query.andWhere('libro.anioPublicacion = :anio', { anio: filters.anio });
    return query.getMany();
  }

  const resource = getResource(resourceName);
  return AppDataSource.getRepository(resource.entity).find({ order: { id: 'ASC' } });
}

async function getById(resourceName, value) {
  const resource = getResource(resourceName);
  const id = parseId(value);
  const record = await AppDataSource.getRepository(resource.entity).findOne({
    where: { id },
    relations: resourceName === 'libros' ? resource.relations : [],
  });
  if (!record) {
    throw new AppError(MESSAGES.RESOURCE_NOT_FOUND, HTTP_STATUS.NOT_FOUND, { id });
  }
  return record;
}

async function create(resourceName, body) {
  const resource = getResource(resourceName);
  await assertRelatedEntitiesExist(resourceName, body);
  const repository = AppDataSource.getRepository(resource.entity);
  const record = repository.create(normalizeInput(resourceName, body));
  return repository.save(record);
}

async function update(resourceName, value, body) {
  const resource = getResource(resourceName);
  const existing = await getById(resourceName, value);
  await assertRelatedEntitiesExist(resourceName, body);
  const repository = AppDataSource.getRepository(resource.entity);
  const updated = repository.merge(existing, normalizeInput(resourceName, body));
  return repository.save(updated);
}

async function remove(resourceName, value) {
  const resource = getResource(resourceName);
  const record = await getById(resourceName, value);
  await AppDataSource.getRepository(resource.entity).remove(record);
}

async function listBookFilterOptions() {
  const [autores, generos] = await Promise.all([
    AppDataSource.getRepository(Autor).find({ order: { nombre: 'ASC' } }),
    AppDataSource.getRepository(Genero).find({ order: { nombre: 'ASC' } }),
  ]);
  return { autores, generos };
}

module.exports = {
  list,
  getById,
  create,
  update,
  remove,
  listBookFilterOptions,
};
