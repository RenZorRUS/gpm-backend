export const enum AUTH_ERROR {
  FAILED_TO_VALIDATE_AUTH_TOKENS = 'Failed to validate auth tokens!',
  AUTH_TOKENS_NOT_PROVIDED = 'Auth tokens not provided!',
  AUTH_HEADER_REQUIRED = 'Authorization header is required!',
  BEARER_TOKEN_REQUIRED = 'Authorization Bearer token is required!',
  AUTH_JWT_TOKEN_REQUIRED = 'Authorization JWT token is required!',
}

export const enum USER_ERROR {
  EMAIL_INACTIVE = 'User with such email is inactive!',
  EMAIL_ALREADY_EXISTS = 'User with such email already exists!',
  AWAITING_EMAIL_CONFIRMATION = 'User with such email already exists and awaiting email confirmation!',
  PHONE_INACTIVE = 'User with such phone is inactive!',
  PHONE_ALREADY_EXISTS = 'User with such phone already exists!',
  AWAITING_PHONE_CONFIRMATION = 'User with such phone already exists and awaiting phone confirmation!',
}
