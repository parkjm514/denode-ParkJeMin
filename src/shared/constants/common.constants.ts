export const commonConstants = {
  props: {
    AUTHORIZATION: 'authorization',
    UNIQUE_INDEX_ERROR: 'ER_DUP_ENTRY',
  },
  errorMessages: {
    COMMON_ERROR_MESSAGE_BEARER_TOKEN_NEEDED: {
      errorCode: 'COMMON_ERROR_MESSAGE_BEARER_TOKEN_NEEDED',
    },
    MISSING_AUTHORIZATION_HEADER: {
      errorCode: 'MISSING_AUTHORIZATION_HEADER',
    },
    INVALID_JWT_TOKEN: {
      errorCode: 'INVALID_JWT_TOKEN',
    },
    ACCOUNT_HISTORY_NOT_FOUND: {
      errorCode: 'ACCOUNT_HISTORY_NOT_FOUND',
    },
    EXPIRED_TOKEN: {
      errorCode: 'EXPIRED_TOKEN',
    },
  },
};
