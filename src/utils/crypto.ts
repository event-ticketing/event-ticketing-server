import crypto from 'crypto';

import env from '@/config/env';

const deriveKey = (key: string) => crypto.createHash('sha256').update(key).digest();

const encrypt = (text: string) => {
  const iv = crypto.randomBytes(env.encrypt.ivLength);
  const key = deriveKey(env.encrypt.key);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(text, 'utf-8');
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
};

const decrypt = (encrypted: string) => {
  const [iv, encryptedData] = encrypted.split(':');
  const key = deriveKey(env.encrypt.key);
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, Buffer.from(iv, 'hex'));
  let decrypted = decipher.update(Buffer.from(encryptedData, 'hex'));
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};

export { encrypt, decrypt };
