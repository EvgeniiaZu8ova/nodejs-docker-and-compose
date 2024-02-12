import * as bcrypt from 'bcrypt';

export const hashValue = (value: string) => {
  return bcrypt.hash(value, 10);
};

export const verifyHash = (value: string, hash: string) => {
  return bcrypt.compare(value, hash);
};
