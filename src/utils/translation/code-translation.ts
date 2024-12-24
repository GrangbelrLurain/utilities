import iconv from 'iconv-lite';
import type { TTranslationCodes } from '@/schemas/translation';

export const decode = (code: string, encoding: TTranslationCodes) => {
  try {
    return iconv.decode(Buffer.from(code), encoding);
  } catch {
    return new Error('Decoding failed');
  }
};

export const encode = (code: string, encoding: TTranslationCodes) => {
  try {
    return iconv.encode(code, encoding);
  } catch {
    return new Error('Encoding failed');
  }
};