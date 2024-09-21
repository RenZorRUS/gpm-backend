export const enum AUTH_ERROR {
  ACCESS_OR_REFRESH_TOKENS_REQUIRED = 'Verification requires either access or refresh tokens.',
  EMAIL_OR_PHONE_REQUIRED = 'Authorization requires either email or phone.',
  ONLY_EMAIL_OR_PHONE = 'Only email or phone should be specified.',
}

export const enum JWT_ERROR {
  AUTH_TOKEN_VERIFICATION_FAILED = 'Authorization token verification failed.',
  AUTH_TOKEN_INVALID_SIGNATURE = 'Authorization token signature is invalid.',
  AUTH_TOKEN_TYPE_MISMATCH = 'Authorization token type mismatch.',
  AUTH_TOKEN_MALFORMED = 'Authorization token is malformed.',
  AUTH_TOKEN_INVALID = 'Authorization token is invalid.',
  AUTH_TOKEN_EXPIRED = 'Authorization token is expired.',
}

export const enum USER_ERROR {
  FAILED_TO_PARSE_USER = 'Failed to parse user data.',
}
