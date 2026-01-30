import { pbkdf2Sync, randomBytes, timingSafeEqual } from 'crypto';

const ITERATIONS = 100_000;
const KEY_LEN = 64;
const DIGEST = 'sha512';

export const hashPassword = (password: string) => {
  const salt = randomBytes(16).toString('hex');
  const hash = pbkdf2Sync(password, salt, ITERATIONS, KEY_LEN, DIGEST).toString('hex');
  return { salt, hash };
};

export const verifyPassword = (password: string, salt: string, hash: string) => {
  const derived = pbkdf2Sync(password, salt, ITERATIONS, KEY_LEN, DIGEST).toString('hex');
  const hashBuf = Buffer.from(hash, 'hex');
  const derivedBuf = Buffer.from(derived, 'hex');
  if (hashBuf.length !== derivedBuf.length) return false;
  return timingSafeEqual(hashBuf, derivedBuf);
};
