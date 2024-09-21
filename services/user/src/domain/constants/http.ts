export const enum HTTP_CODE {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  MULTIPLE_CHOICES = 300,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

export const enum HTTP_METHOD {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

export const enum MIME_TYPE {
  JSON = 'application/json',
}

export const enum HTTP_HEADER {
  CONTENT_TYPE = 'Content-Type',
  AUTHORIZATION = 'Authorization',
  ACCEPT = 'Accept',
}
