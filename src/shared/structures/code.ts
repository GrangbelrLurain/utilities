import { z } from 'zod';
import { generateMock } from '@anatine/zod-mock';

const codeSchema = z.object({
  code: z.string(),
  name: z.string(),
});

export type Code<C extends string, N extends string> = {
  code: C;
  name: N;
};

export const createCode = <C extends string, N extends string>(code: {
  code: C;
  name: N;
}): Code<C, N> => {
  const result = codeSchema.safeParse(code);

  if (!result.success) {
    console.error(result.error.message);
    throw new Error('Invalid code object');
  }

  return result.data as Code<C, N>;
};

export const createCodes = <C extends string, N extends string>(
  codes: {
    code: C;
    name: N;
  }[],
): Code<C, N>[] => {
  return codes.map((code) => createCode<C, N>(code));
};

export const createMockCode = (seed?: number) => generateMock(codeSchema, { seed });
