import env from '@/config/env';

const TOKEN_TYPE = {
  ACCESS: 'access',
  REFRESH: 'refresh',
} as const;

const TOKEN_MAPPING = {
  [TOKEN_TYPE.ACCESS]: {
    secret: env.jwt.access.secret,
    expiresIn: env.jwt.access.expiry,
  },
  [TOKEN_TYPE.REFRESH]: {
    secret: env.jwt.refresh.secret,
    expiresIn: env.jwt.refresh.expiry,
  },
};

type TokenType = keyof typeof TOKEN_MAPPING;

export { TOKEN_TYPE, TOKEN_MAPPING, TokenType };
