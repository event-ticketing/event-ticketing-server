import jwt from 'jsonwebtoken';
import { Request } from 'express';

import { JWTConstant } from '@/constants';

const generateToken = (payload: any, type: JWTConstant.TokenType): string => {
  const { secret, expiresIn } = JWTConstant.TOKEN_MAPPING[type];

  const token = jwt.sign({ ...payload, type }, secret, { expiresIn });

  return token;
};

const verifyToken = (token: string, type: JWTConstant.TokenType): any => {
  const { secret } = JWTConstant.TOKEN_MAPPING[type];

  const payload = jwt.verify(token, secret);

  return payload;
};

const extractToken = (req: Request): string | null => {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith('Bearer ')) return null;

  return authorization.split(' ')[1];
};

export { generateToken, verifyToken, extractToken };
