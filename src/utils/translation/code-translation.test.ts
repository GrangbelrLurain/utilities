import { ENCODES } from '@/schemas/translation';
import { decode, encode } from './code-translation';

describe('encode', () => {
  Object.values(ENCODES).forEach((item) => {
    it(`should encode the text with ${item[0].name}`, () => {
      const result = encode('Hello, world!', item[0].code);
      console.log(result);
      expect(result).not.toBeInstanceOf(Error);
    });
  });
});

describe('decode', () => {
  Object.values(ENCODES).forEach((item) => {
    it(`should decode the text with ${item[0].name}`, () => {
      const result = decode('Hello, world!', item[0].code);
      console.log(result);
      expect(result).not.toBeInstanceOf(Error);
    });
  });
});
