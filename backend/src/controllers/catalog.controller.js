const { HTTP_STATUS } = require('../constants/http');
const { MESSAGES } = require('../constants/messages');
const catalogService = require('../services/catalog.service');

function asyncHandler(handler) {
  return (request, response, next) => {
    Promise.resolve(handler(request, response, next)).catch(next);
  };
}

function createCatalogController(resourceName) {
  return {
    list: asyncHandler(async (request, response) => {
      const data = await catalogService.list(resourceName, request.validatedQuery);
      response.status(HTTP_STATUS.OK).json({
        success: true,
        data,
        message: MESSAGES.RESOURCE_LISTED,
      });
    }),
    getById: asyncHandler(async (request, response) => {
      const data = await catalogService.getById(resourceName, request.params.id);
      response.status(HTTP_STATUS.OK).json({ success: true, data, message: null });
    }),
    create: asyncHandler(async (request, response) => {
      const data = await catalogService.create(resourceName, request.body);
      response.status(HTTP_STATUS.CREATED).json({
        success: true,
        data,
        message: MESSAGES.RESOURCE_CREATED,
      });
    }),
    update: asyncHandler(async (request, response) => {
      const data = await catalogService.update(resourceName, request.params.id, request.body);
      response.status(HTTP_STATUS.OK).json({
        success: true,
        data,
        message: MESSAGES.RESOURCE_UPDATED,
      });
    }),
    remove: asyncHandler(async (request, response) => {
      await catalogService.remove(resourceName, request.params.id);
      response.status(HTTP_STATUS.OK).json({
        success: true,
        data: null,
        message: MESSAGES.RESOURCE_DELETED,
      });
    }),
  };
}

const filterOptions = asyncHandler(async (_request, response) => {
  const data = await catalogService.listBookFilterOptions();
  response.status(HTTP_STATUS.OK).json({ success: true, data, message: null });
});

module.exports = { createCatalogController, filterOptions };
